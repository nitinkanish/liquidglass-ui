/**
 * MorphingGlass - one thick glass body that flows continuously between shapes
 * (sphere, drop, pebble, plate, disc, pill), refracting the stage behind it with
 * per-channel dispersion and specular highlights. Rendered with WebGL SDF raymarching;
 * falls back to the library's CSS glass material when WebGL is unavailable.
 */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { Glass } from './Glass';
import {
  MORPH_FRAGMENT_SHADER,
  MORPH_SHAPES,
  MORPH_VERTEX_SHADER,
  MorphEasing,
  MorphShape,
  morphFrameAt,
  parseColor,
  resolveMorphEasing,
  shapeIndex,
} from '../core/morph';

export type MorphingGlassBackground = 'stripes' | 'transparent' | (string & {});

export interface MorphingGlassColors {
  /** Deep base of the stage. */
  base?: string;
  /** The central band. */
  band?: string;
  /** Circles / accents. */
  accent?: string;
}

export interface MorphingGlassProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Shapes to morph through, in order. Default: all six. */
  shapes?: MorphShape[];
  /** Show one fixed shape instead of morphing (changes still animate). */
  shape?: MorphShape;
  /** Morph duration between two shapes, ms. Default 1600. */
  duration?: number;
  /** Hold time on each shape, ms. Default 700. */
  hold?: number;
  /** Easing name or `(t) => number`. Default `ease-in-out`. */
  easing?: MorphEasing;
  /** Start playing on mount. Default true. */
  autoplay?: boolean;
  /** Controlled pause. When set, overrides `autoplay`. */
  paused?: boolean;
  /** Loop the sequence. Default true. */
  loop?: boolean;
  /** Slowly turn the body so its depth reads. Default true. */
  rotate?: boolean;
  /** Depth of the body along the view axis, 0.4-2. Default 1. */
  thickness?: number;
  /** Body scale relative to the stage, 0.4-1.6. Default 1. */
  size?: number;
  /** Chromatic dispersion (rainbow edges), 0-1. Default 0.6. */
  dispersion?: number;
  /** Index of refraction. Default 1.48. */
  ior?: number;
  /** Glass body color (absorbed with thickness). Any hex/rgb() color. Default a faint cool white. */
  tint?: string;
  /** Tint strength 0-1. Default 0.35. */
  tintStrength?: number;
  /** What is refracted: the built-in `stripes` stage, `transparent`, or an image URL. Default `stripes`. */
  background?: MorphingGlassBackground;
  /** Colors of the built-in stage. */
  colors?: MorphingGlassColors;
  /** Max device pixel ratio for the canvas. Default 1.75. */
  maxPixelRatio?: number;
  /** Force a renderer. `auto` uses WebGL when available. Default `auto`. */
  renderer?: 'auto' | 'webgl' | 'css';
  /** Called when the visually dominant shape changes. */
  onShapeChange?: (shape: MorphShape, index: number) => void;
  /** Accessible label. Default "Glass shape morphing between …". */
  label?: string;
  /** Content rendered instead of the CSS fallback when WebGL is unavailable. */
  fallback?: ReactNode;
}

export interface MorphingGlassHandle {
  play(): void;
  pause(): void;
  /** Jump to a shape. */
  goTo(shape: MorphShape): void;
  readonly element: HTMLDivElement | null;
}

const DEFAULT_COLORS = { base: '#040b2b', band: '#1534c4', accent: '#f1e8d6' };

type GL = WebGLRenderingContext;

interface GLState {
  gl: GL;
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
  texture: WebGLTexture | null;
  imageSize: [number, number];
}

function compile(gl: GL, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

const UNIFORMS = [
  'uRes', 'uTime', 'uA', 'uB', 'uMix', 'uThick', 'uSize', 'uDisp', 'uIor', 'uTint', 'uTintAmt',
  'uRotY', 'uBgMode', 'uBg', 'uBgScale', 'uBgA', 'uBgB', 'uBgC',
];

// One GL program per canvas: React StrictMode re-runs effects, and a context cannot be recreated
// once lost, so the state is reused instead of torn down between effect runs.
const glCache = new WeakMap<HTMLCanvasElement, GLState>();

function initGL(canvas: HTMLCanvasElement, transparent: boolean): GLState | null {
  const cached = glCache.get(canvas);
  if (cached && !cached.gl.isContextLost()) return cached;
  let gl: GL | null = null;
  try {
    gl = (canvas.getContext('webgl', {
      alpha: transparent,
      premultipliedAlpha: true,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    }) || canvas.getContext('experimental-webgl')) as GL | null;
  } catch {
    gl = null;
  }
  if (!gl) return null;
  const vs = compile(gl, gl.VERTEX_SHADER, MORPH_VERTEX_SHADER);
  const fs = compile(gl, gl.FRAGMENT_SHADER, MORPH_FRAGMENT_SHADER);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uniforms: GLState['uniforms'] = {};
  for (const name of UNIFORMS) uniforms[name] = gl.getUniformLocation(program, name);
  const state: GLState = { gl, program, uniforms, texture: null, imageSize: [1, 1] };
  glCache.set(canvas, state);
  return state;
}

/** True when this browser can create a WebGL context. SSR-safe (false on the server). */
export function supportsWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

function clampNum(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

export const MorphingGlass = forwardRef<MorphingGlassHandle, MorphingGlassProps>(
  (
    {
      className,
      style,
      shapes: shapesProp,
      shape,
      duration = 1600,
      hold = 700,
      easing = 'ease-in-out',
      autoplay = true,
      paused,
      loop = true,
      rotate = true,
      thickness = 1,
      size = 1,
      dispersion = 0.6,
      ior = 1.48,
      tint = '#dfe8ff',
      tintStrength = 0.35,
      background = 'stripes',
      colors,
      maxPixelRatio = 1.75,
      renderer = 'auto',
      onShapeChange,
      label,
      fallback,
      ...props
    },
    ref
  ) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reducedMotion = useReducedMotion();

    const sequence = useMemo<MorphShape[]>(() => {
      const list = (shapesProp && shapesProp.length ? shapesProp : [...MORPH_SHAPES]).filter((s) =>
        (MORPH_SHAPES as readonly string[]).includes(s)
      );
      return list.length ? list : [...MORPH_SHAPES];
    }, [shapesProp]);

    const [mode, setMode] = useState<'pending' | 'webgl' | 'fallback'>('pending');
    const [current, setCurrent] = useState<MorphShape>(shape ?? sequence[0]);
    const [internalPlaying, setInternalPlaying] = useState(autoplay);
    const [visible, setVisible] = useState(true);
    const playing = (paused !== undefined ? !paused : internalPlaying) && !reducedMotion && !shape;

    // Everything the render loop reads lives in a ref so prop changes never restart WebGL
    const live = useRef({
      elapsed: 0,
      sequence,
      shape,
      duration,
      hold,
      ease: resolveMorphEasing(easing),
      loop,
      rotate,
      thickness,
      size,
      dispersion,
      ior,
      tint,
      tintStrength,
      colors,
      playing,
      reducedMotion,
      // fixed-shape transitions
      fixedFrom: shapeIndex(shape ?? sequence[0]),
      fixedTo: shapeIndex(shape ?? sequence[0]),
      fixedStart: 0,
      rotY: 0.5,
      current: shape ?? sequence[0],
      onShapeChange,
      dirty: true,
    });

    // Sync props into the live ref
    const L = live.current;
    L.sequence = sequence;
    L.duration = duration;
    L.hold = hold;
    L.ease = useMemo(() => resolveMorphEasing(easing), [easing]);
    L.loop = loop;
    L.rotate = rotate;
    L.thickness = clampNum(thickness, 0.3, 2.5);
    L.size = clampNum(size, 0.3, 1.8);
    L.dispersion = clampNum(dispersion, 0, 1);
    L.ior = clampNum(ior, 1.05, 2.4);
    L.tint = tint;
    L.tintStrength = clampNum(tintStrength, 0, 1);
    L.colors = colors;
    L.playing = playing;
    L.reducedMotion = reducedMotion;
    L.onShapeChange = onShapeChange;
    L.dirty = true;

    // A fixed `shape` animates from wherever the body is now
    useEffect(() => {
      const l = live.current;
      if (!shape) return;
      const target = shapeIndex(shape);
      if (target === l.fixedTo && l.shape === shape) return;
      l.fixedFrom = shapeIndex(l.current);
      l.fixedTo = target;
      l.fixedStart = typeof performance !== 'undefined' ? performance.now() : 0;
      l.shape = shape;
      l.dirty = true;
    }, [shape]);
    useEffect(() => {
      if (!shape) live.current.shape = undefined;
    }, [shape]);

    useImperativeHandle(
      ref,
      () => ({
        play: () => setInternalPlaying(true),
        pause: () => setInternalPlaying(false),
        goTo: (s: MorphShape) => {
          const l = live.current;
          const i = l.sequence.indexOf(s);
          if (i < 0) return;
          l.elapsed = i * (Math.max(0, l.hold) + Math.max(1, l.duration));
          l.dirty = true;
        },
        get element() {
          return rootRef.current;
        },
      }),
      []
    );

    // Pause while offscreen or when the tab is hidden
    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      let io: IntersectionObserver | null = null;
      if (typeof IntersectionObserver !== 'undefined') {
        io = new IntersectionObserver((entries) => {
          for (const e of entries) setVisible(e.isIntersecting);
        }, { rootMargin: '64px' });
        io.observe(el);
      }
      const onVis = () => setVisible(document.visibilityState !== 'hidden');
      document.addEventListener('visibilitychange', onVis);
      return () => {
        io?.disconnect();
        document.removeEventListener('visibilitychange', onVis);
      };
    }, []);

    const transparent = background === 'transparent';

    // WebGL setup + render loop
    useEffect(() => {
      if (renderer === 'css') {
        setMode('fallback');
        return;
      }
      const canvas = canvasRef.current;
      const root = rootRef.current;
      if (!canvas || !root) return;
      const state = initGL(canvas, transparent);
      if (!state) {
        setMode('fallback');
        return;
      }
      setMode('webgl');
      const { gl, uniforms: u } = state;
      let raf: number | null = null;
      let last = performance.now();
      let disposed = false;

      // Background image
      let bgMode = transparent ? 2 : 0;
      if (!transparent && background !== 'stripes') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          if (disposed) return;
          const tex = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          try {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            state.texture = tex;
            state.imageSize = [img.naturalWidth || 1, img.naturalHeight || 1];
            bgMode = 1;
          } catch {
            bgMode = 0; // tainted canvas: keep the built-in stage
          }
          live.current.dirty = true;
        };
        img.src = background;
      }

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
        const w = Math.max(1, Math.round(root.clientWidth * dpr));
        const h = Math.max(1, Math.round(root.clientHeight * dpr));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0, 0, w, h);
          live.current.dirty = true;
        }
      };
      resize();
      const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
      ro?.observe(root);

      const setColor = (loc: WebGLUniformLocation | null, c: string | undefined, def: string) => {
        const rgb = parseColor(c) ?? parseColor(def)!;
        gl.uniform3f(loc, rgb[0], rgb[1], rgb[2]);
      };

      const draw = (now: number) => {
        const l = live.current;
        const dt = Math.min(64, now - last);
        last = now;
        if (l.playing) {
          l.elapsed += dt;
          l.dirty = true;
        }
        if (l.rotate && !l.reducedMotion) {
          l.rotY += dt * 0.00035;
          l.dirty = true;
        }
        let a: number;
        let b: number;
        let mix: number;
        let cur: MorphShape;
        if (l.shape) {
          const p = l.reducedMotion ? 1 : Math.min(1, (now - l.fixedStart) / Math.max(1, l.duration));
          const e = l.ease(p);
          a = l.fixedFrom;
          b = l.fixedTo;
          mix = e;
          cur = MORPH_SHAPES[p < 0.5 ? a : b];
          if (p < 1) l.dirty = true;
        } else {
          const f = morphFrameAt(l.elapsed, {
            count: l.sequence.length,
            duration: l.duration,
            hold: l.hold,
            easing: l.ease,
            loop: l.loop,
          });
          a = shapeIndex(l.sequence[f.from]);
          b = shapeIndex(l.sequence[f.to]);
          mix = f.t;
          cur = l.sequence[f.current];
        }
        if (cur !== l.current) {
          l.current = cur;
          setCurrent(cur);
          l.onShapeChange?.(cur, l.sequence.indexOf(cur));
        }
        if (l.dirty) {
          l.dirty = false;
          const c = l.colors ?? {};
          gl.uniform2f(u.uRes, canvas.width, canvas.height);
          gl.uniform1f(u.uTime, now / 1000);
          gl.uniform1i(u.uA, a);
          gl.uniform1i(u.uB, b);
          gl.uniform1f(u.uMix, mix);
          gl.uniform1f(u.uThick, l.thickness);
          gl.uniform1f(u.uSize, l.size);
          gl.uniform1f(u.uDisp, l.dispersion);
          gl.uniform1f(u.uIor, l.ior);
          setColor(u.uTint, l.tint, '#dfe8ff');
          gl.uniform1f(u.uTintAmt, l.tintStrength);
          gl.uniform1f(u.uRotY, l.rotY);
          gl.uniform1i(u.uBgMode, bgMode);
          setColor(u.uBgA, c.base, DEFAULT_COLORS.base);
          setColor(u.uBgB, c.band, DEFAULT_COLORS.band);
          setColor(u.uBgC, c.accent, DEFAULT_COLORS.accent);
          if (bgMode === 1 && state.texture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, state.texture);
            gl.uniform1i(u.uBg, 0);
            const ca = canvas.width / canvas.height;
            const ia = state.imageSize[0] / state.imageSize[1];
            gl.uniform2f(u.uBgScale, ca > ia ? 1 : ia / ca, ca > ia ? ca / ia : 1);
          } else {
            gl.uniform2f(u.uBgScale, 1, 1);
          }
          if (transparent) {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
          }
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        raf = requestAnimationFrame(draw);
      };

      const start = () => {
        if (raf == null && !disposed) {
          last = performance.now();
          raf = requestAnimationFrame(draw);
        }
      };
      const stop = () => {
        if (raf != null) cancelAnimationFrame(raf);
        raf = null;
      };
      (root as HTMLDivElement & { __lgMorph?: { start(): void; stop(): void } }).__lgMorph = { start, stop };
      start();

      const onLost = (e: Event) => {
        e.preventDefault();
        stop();
        setMode('fallback');
      };
      canvas.addEventListener('webglcontextlost', onLost);

      return () => {
        disposed = true;
        stop();
        ro?.disconnect();
        canvas.removeEventListener('webglcontextlost', onLost);
        delete (root as HTMLDivElement & { __lgMorph?: unknown }).__lgMorph;
        if (state.texture) {
          gl.deleteTexture(state.texture);
          state.texture = null;
        }
      };
    }, [renderer, transparent, background, maxPixelRatio]);

    // Run the loop only when there is something to animate and it is on screen
    useEffect(() => {
      const root = rootRef.current as (HTMLDivElement & { __lgMorph?: { start(): void; stop(): void } }) | null;
      const ctl = root?.__lgMorph;
      if (!ctl || mode !== 'webgl') return;
      if (visible) {
        live.current.dirty = true;
        ctl.start();
      } else {
        ctl.stop();
      }
    }, [visible, mode]);

    // CSS fallback timeline: step the shape attribute and let CSS transitions do the morph
    useEffect(() => {
      if (mode !== 'fallback') return;
      if (shape) {
        setCurrent(shape);
        return;
      }
      if (!playing || !visible) return;
      const segment = Math.max(0, hold) + Math.max(1, duration);
      let i = Math.max(0, sequence.indexOf(live.current.current));
      const id = window.setInterval(() => {
        if (!loop && i >= sequence.length - 1) return;
        i = (i + 1) % sequence.length;
        const next = sequence[i];
        live.current.current = next;
        setCurrent(next);
        onShapeChange?.(next, i);
      }, segment);
      return () => window.clearInterval(id);
    }, [mode, shape, playing, visible, hold, duration, loop, sequence, onShapeChange]);

    const isPlaying = playing && visible;
    const accessible =
      label ?? `Glass shape morphing between ${sequence.join(', ')}. Showing ${current}.`;

    const rootStyle: CSSProperties & Record<string, string | number> = { ...style };
    rootStyle['--lg-morph-size'] = clampNum(size, 0.3, 1.8);
    rootStyle['--lg-morph-duration'] = `${reducedMotion ? 0 : duration}ms`;
    if (typeof easing === 'string') {
      rootStyle['--lg-morph-ease'] =
        easing === 'linear'
          ? 'linear'
          : easing === 'ease-out'
            ? 'cubic-bezier(0.22, 1, 0.36, 1)'
            : easing === 'spring'
              ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
              : 'cubic-bezier(0.65, 0, 0.35, 1)';
    }
    if (mode === 'fallback' && background !== 'stripes' && !transparent) {
      rootStyle.backgroundImage = `url("${background}")`;
      rootStyle.backgroundSize = 'cover';
      rootStyle.backgroundPosition = 'center';
    }

    return (
      <div
        ref={rootRef}
        role="img"
        aria-label={accessible}
        className={cn('lg-morph', className)}
        style={rootStyle}
        data-shape={current}
        data-renderer={mode}
        data-playing={isPlaying ? '' : undefined}
        data-background={transparent ? 'transparent' : background === 'stripes' ? 'stripes' : 'image'}
        {...props}
      >
        {mode !== 'fallback' && <canvas key={transparent ? 'alpha' : 'opaque'} ref={canvasRef} className="lg-morph-canvas" aria-hidden="true" />}
        {mode === 'fallback' &&
          (fallback ?? (
            <Glass
              className="lg-morph-fallback"
              data-shape={current}
              aberration={dispersion}
              tintColor={tint}
              aria-hidden="true"
            />
          ))}
      </div>
    );
  }
);

MorphingGlass.displayName = 'MorphingGlass';
