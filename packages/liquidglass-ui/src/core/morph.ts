/**
 * MorphingGlass core: shape list, timeline maths, easing, color parsing and the WebGL
 * signed-distance-field shader. Pure (no DOM access at import time), so it is SSR-safe and testable.
 */

export const MORPH_SHAPES = ['sphere', 'drop', 'pebble', 'plate', 'disc', 'pill'] as const;
export type MorphShape = (typeof MORPH_SHAPES)[number];

export type MorphEasingName = 'linear' | 'ease-in-out' | 'ease-out' | 'spring';
export type MorphEasing = MorphEasingName | ((t: number) => number);

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

export function resolveMorphEasing(easing: MorphEasing = 'ease-in-out'): (t: number) => number {
  if (typeof easing === 'function') return (t) => easing(clamp01(t));
  switch (easing) {
    case 'linear':
      return clamp01;
    case 'ease-out':
      return (t) => 1 - Math.pow(1 - clamp01(t), 3);
    case 'spring':
      // Critically-damped-ish overshoot that settles exactly on 1
      return (t) => {
        const x = clamp01(t);
        return x === 1 ? 1 : 1 - Math.exp(-6 * x) * Math.cos(9 * x);
      };
    case 'ease-in-out':
    default:
      return (t) => {
        const x = clamp01(t);
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      };
  }
}

export interface MorphTimelineOptions {
  /** Number of shapes in the sequence. */
  count: number;
  /** Transition duration per shape, ms. */
  duration: number;
  /** Hold time at each shape before morphing on, ms. */
  hold: number;
  easing?: (t: number) => number;
  /** Stop at the last shape instead of looping back to the first. */
  loop?: boolean;
}

export interface MorphFrame {
  /** Index (into the sequence) of the shape being left. */
  from: number;
  /** Index of the shape being morphed into. */
  to: number;
  /** Eased progress 0-1 from `from` to `to` (may overshoot with `spring`). */
  t: number;
  /** Index of the shape that is visually dominant (for labels and a11y). */
  current: number;
}

/** Where the morph is after `elapsed` ms of playback. */
export function morphFrameAt(elapsed: number, options: MorphTimelineOptions): MorphFrame {
  const { count, duration, hold, easing = resolveMorphEasing('ease-in-out'), loop = true } = options;
  if (count <= 1) return { from: 0, to: 0, t: 0, current: 0 };
  const dur = Math.max(1, duration);
  const segment = Math.max(0, hold) + dur;
  const steps = Math.floor(Math.max(0, elapsed) / segment);
  if (!loop && steps >= count - 1) return { from: count - 1, to: count - 1, t: 0, current: count - 1 };
  const from = steps % count;
  const to = (from + 1) % count;
  const local = Math.max(0, elapsed) - steps * segment;
  const raw = local <= hold ? 0 : (local - hold) / dur;
  const t = raw <= 0 ? 0 : easing(raw);
  return { from, to, t, current: raw < 0.5 ? from : to };
}

/** Parse a CSS hex / rgb() color into 0-1 RGB. Returns null when it cannot be parsed. */
export function parseColor(input: string | undefined | null): [number, number, number] | null {
  if (!input) return null;
  const s = input.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(s);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split('').map((c) => c + c).join('') : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(s);
  if (rgb) return [rgb[1], rgb[2], rgb[3]].map((v) => Math.min(255, parseFloat(v)) / 255) as [number, number, number];
  return null;
}

export function shapeIndex(shape: MorphShape): number {
  return MORPH_SHAPES.indexOf(shape);
}

export const MORPH_VERTEX_SHADER = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/**
 * Raymarched glass body. Each shape is an SDF; morphing linearly blends two SDFs, which keeps the
 * surface continuous. Light is refracted on entry and exit separately for R, G and B (dispersion),
 * with Fresnel reflection, specular highlights and a thin-film rainbow at grazing angles.
 */
export const MORPH_FRAGMENT_SHADER = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform int uA;
uniform int uB;
uniform float uMix;
uniform float uThick;
uniform float uSize;
uniform float uDisp;
uniform float uIor;
uniform vec3 uTint;
uniform float uTintAmt;
uniform float uRotY;
uniform int uBgMode;      // 0 stripes, 1 image, 2 transparent
uniform sampler2D uBg;
uniform vec2 uBgScale;    // cover-fit scale for the image
uniform vec3 uBgA;        // stage colors
uniform vec3 uBgB;
uniform vec3 uBgC;

const float CAM_Z = 6.0;
const float FOCAL = 4.0;
const float PLANE_Z = -1.6;

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / max(k1, 1e-4);
}
float sdRoundCone(vec3 p, float r1, float r2, float h) {
  vec2 q = vec2(length(p.xz), p.y);
  float b = (r1 - r2) / h;
  float a = sqrt(1.0 - b * b);
  float k = dot(q, vec2(-b, a));
  if (k < 0.0) return length(q) - r1;
  if (k > a * h) return length(q - vec2(0.0, h)) - r2;
  return dot(q, vec2(a, b)) - r1;
}
float sdRoundCyl(vec3 p, float ra, float rb, float h) {
  vec2 d = vec2(length(p.xy) - ra + rb, abs(p.z) - h);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - rb;
}
float sdCapsuleX(vec3 p, float h, float r) {
  p.x -= clamp(p.x, -h, h);
  return length(p) - r;
}

float shapeSd(int i, vec3 p) {
  if (i == 0) return length(p) - 0.95;                                   // sphere
  if (i == 1) return sdRoundCone(rotZ(0.6) * (p + vec3(0.0, 0.45, 0.0)), 0.78, 0.16, 1.25); // drop
  if (i == 2) return sdEllipsoid(p, vec3(1.22, 0.72, 0.9));              // pebble
  if (i == 3) return sdRoundCyl(rotX(1.15) * p, 1.3, 0.1, 0.08);         // plate
  if (i == 4) return sdRoundCyl(p, 0.98, 0.26, 0.26);                     // disc
  return sdCapsuleX(p, 0.8, 0.56);                                        // pill
}

float map(vec3 p) {
  vec3 q = rotY(uRotY) * rotX(0.32) * p;
  q /= uSize;
  q.z /= uThick;
  float d = mix(shapeSd(uA, q), shapeSd(uB, q), uMix);
  return d * uSize * min(1.0, uThick) * 0.9;
}

vec3 calcNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  const float e = 0.0015;
  return normalize(k.xyy * map(p + k.xyy * e) + k.yyx * map(p + k.yyx * e) +
                   k.yxy * map(p + k.yxy * e) + k.xxx * map(p + k.xxx * e));
}

vec3 stage(vec2 q) {
  // q is in screen units: y in [-1, 1], x scaled by aspect
  float aspect = uRes.x / uRes.y;
  float zoom = max(1.0, 1.6 / aspect);
  if (uBgMode == 1) {
    vec2 uv = (q / (vec2(aspect, 1.0) * zoom)) * 0.5 / uBgScale + 0.5;
    uv.y = 1.0 - uv.y;
    return texture2D(uBg, clamp(uv, 0.001, 0.999)).rgb;
  }
  float ay = abs(q.y);
  vec3 col = uBgA;
  float band = 1.0 - smoothstep(0.47, 0.475, ay);
  col = mix(col, uBgB, band);
  // fine horizontal rules outside the band
  float rule = (1.0 - smoothstep(0.0, 0.012, abs(fract(q.y * 14.0) - 0.5) - 0.44));
  col = mix(col, uBgB * 1.4 + 0.05, rule * 0.35 * step(0.5, ay) * (1.0 - smoothstep(0.82, 0.9, ay)));
  // subtle stripes inside the band
  col *= 1.0 - band * 0.06 * step(0.5, fract(q.y * 18.0));
  // cream disc on the left and ring on the right
  float sx = min(aspect * zoom * 0.5, 1.05);
  float r = 0.4;
  float d1 = length(q - vec2(-sx, 0.0)) - r;
  float d2 = abs(length(q - vec2(sx, 0.0)) - r * 0.85) - r * 0.17;
  float aa = 2.0 / uRes.y;
  col = mix(col, uBgC, 1.0 - smoothstep(-aa, aa, d1));
  col = mix(col, uBgC, 1.0 - smoothstep(-aa, aa, d2));
  return col;
}

vec3 envLight(vec3 d) {
  vec3 sky = mix(mix(uBgB, vec3(0.55, 0.62, 0.95), 0.5), vec3(0.95, 0.97, 1.0), smoothstep(-0.3, 0.9, d.y));
  float box = smoothstep(0.6, 0.95, d.y) * smoothstep(0.75, 0.2, abs(d.x + 0.25));
  float side = smoothstep(0.55, 0.9, d.x) * smoothstep(0.5, 0.0, abs(d.y - 0.1));
  return sky * 0.75 + vec3(1.0) * box * 1.6 + vec3(1.0, 0.96, 0.9) * side * 1.1;
}

vec3 behind(vec3 pos, vec3 dir) {
  if (dir.z > -0.05) return envLight(dir);
  float t = (PLANE_Z - pos.z) / dir.z;
  vec3 hit = pos + dir * t;
  vec2 q = hit.xy * FOCAL / (CAM_Z - PLANE_Z);
  return stage(q);
}

vec3 hue(float h) {
  return clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
}

float traceInside(vec3 ro, vec3 rd, out vec3 pos) {
  float t = 0.02;
  for (int i = 0; i < 48; i++) {
    vec3 p = ro + rd * t;
    float d = -map(p);
    if (d < 0.001) break;
    t += max(d, 0.01);
    if (t > 6.0) break;
  }
  pos = ro + rd * t;
  return t;
}

float channel(vec3 p, vec3 n, vec3 rd, float ior, int c, out float travel) {
  vec3 rin = refract(rd, n, 1.0 / ior);
  vec3 pe;
  travel = traceInside(p - n * 0.003, rin, pe);
  vec3 ne = -calcNormal(pe);
  vec3 rout = refract(rin, ne, ior);
  if (dot(rout, rout) < 1e-4) rout = reflect(rin, ne);
  vec3 col = behind(pe, rout);
  return c == 0 ? col.r : c == 1 ? col.g : col.b;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y * 2.0;
  // keep the body inside narrow (portrait) stages
  uv *= max(1.0, 1.6 / (uRes.x / uRes.y));
  vec3 ro = vec3(0.0, 0.0, CAM_Z);
  vec3 rd = normalize(vec3(uv, -FOCAL));
  vec3 bg = uBgMode == 2 ? vec3(0.0) : stage(uv);
  float bgAlpha = uBgMode == 2 ? 0.0 : 1.0;

  // bounding sphere
  float bound = 1.75 * uSize * max(1.0, uThick);
  float b = dot(ro, rd);
  float h = b * b - dot(ro, ro) + bound * bound;
  if (h < 0.0) { gl_FragColor = vec4(bg * bgAlpha, bgAlpha); return; }

  float t = -b - sqrt(h);
  float tMax = -b + sqrt(h);
  float hitT = -1.0;
  for (int i = 0; i < 96; i++) {
    float d = map(ro + rd * t);
    if (d < 0.0008) { hitT = t; break; }
    t += d;
    if (t > tMax) break;
  }
  if (hitT < 0.0) { gl_FragColor = vec4(bg * bgAlpha, bgAlpha); return; }

  vec3 p = ro + rd * hitT;
  vec3 n = calcNormal(p);
  float cosi = clamp(dot(-rd, n), 0.0, 1.0);

  float spread = 0.075 * uDisp;
  float tr;
  float r = channel(p, n, rd, uIor - spread, 0, tr);
  float g = channel(p, n, rd, uIor, 1, tr);
  float bl = channel(p, n, rd, uIor + spread, 2, tr);
  vec3 refr = vec3(r, g, bl);

  // absorption tint grows with the path length through the body
  float absorb = clamp(tr * 0.55, 0.0, 1.0) * uTintAmt;
  refr *= mix(vec3(1.0), uTint, absorb);

  float fres = 0.04 + 0.96 * pow(1.0 - cosi, 5.0);
  vec3 refl = envLight(reflect(rd, n));
  vec3 col = mix(refr, refl, fres);

  // thin-film rainbow along the rim
  float rim = pow(1.0 - cosi, 2.0);
  col += hue(cosi * 2.2 + p.y * 0.3 + p.x * 0.15 + uTime * 0.05) * rim * (0.2 + 0.9 * uDisp) * 0.75;

  // specular highlights
  vec3 l1 = normalize(vec3(-0.55, 0.75, 0.6));
  vec3 l2 = normalize(vec3(0.8, -0.2, 0.55));
  vec3 v = -rd;
  col += vec3(1.0) * pow(max(dot(n, normalize(l1 + v)), 0.0), 90.0) * 1.6;
  col += vec3(1.0, 0.95, 0.9) * pow(max(dot(n, normalize(l2 + v)), 0.0), 40.0) * 0.35;

  gl_FragColor = vec4(col, 1.0);
}
`;
