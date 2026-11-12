/**
 * Glisse-compatible Glass Refraction System
 * 
 * This implementation is based on glisse (MIT License)
 * https://www.npmjs.com/package/glisse
 * Copyright (c) 2024 Caleb Brewer
 * 
 * Ported and adapted for liquidglass-ui
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

interface Shape {
  width: number;
  height: number;
  radius: number;
}

interface LensOptions {
  depth: number;
  dome: number;
  splay: number;
  relative: boolean;
}

interface LightOptions {
  angle: number;
  glow: number;
  spread: number;
  glowPower: number;
  edge: number;
  edgeWidth: number;
  edgePower: number;
}

interface LensMap {
  columns: number;
  rows: number;
  across: Uint8ClampedArray;
  down: Uint8ClampedArray;
  light: Uint8ClampedArray;
  shape: Uint8ClampedArray;
}

interface EncodedMaps {
  across: string;
  down: string;
  light: string;
  shape: string;
}

const DEFAULT_LIGHT: LightOptions = {
  angle: 30,
  glow: 0.4,
  spread: 0.5,
  glowPower: 2,
  edge: 0.5,
  edgeWidth: 1.5,
  edgePower: 1,
};

const DEFAULT_LENS: LensOptions = {
  depth: 8,
  dome: 4,
  splay: 0.85,
  relative: false,
};

const clamp = (value: number, min: number, max: number): number => 
  Math.min(max, Math.max(min, value));

const erf = (x: number): number => Math.tanh(1.7724538509 * x);

function distance(
  x: number, 
  y: number, 
  halfWidth: number, 
  halfHeight: number, 
  radius: number
): number {
  const qx = Math.abs(x) - halfWidth + radius;
  const qy = Math.abs(y) - halfHeight + radius;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
}

function arc(sag: number, half: number): { radius: number; scale: number } {
  const radius = (half * half + sag * sag) / (2 * sag);
  let sum = 0;
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * half;
    const slope = x / Math.sqrt(radius * radius - x * x);
    sum += i === 0 || i === 200 ? slope / 2 : slope;
  }
  const mean = sum / 200;
  return {
    radius,
    scale: mean > 0 ? 0.5 / mean : 1,
  };
}

function slope(x: number, curve: { radius: number; scale: number }): number {
  const inside = Math.min(x, 0.999 * curve.radius);
  return (inside / Math.sqrt(curve.radius * curve.radius - inside * inside)) * curve.scale;
}

function grey(data: Uint8ClampedArray, i: number, value: number, alpha = 255): void {
  data[i] = data[i + 1] = data[i + 2] = value;
  data[i + 3] = alpha;
}

function lensMap(
  shape: Shape, 
  options: LensOptions, 
  light: LightOptions, 
  density: number
): LensMap {
  const { width, height } = shape;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const radius = clamp(shape.radius, 0, Math.min(halfWidth, halfHeight));
  const columns = Math.max(1, Math.round(width * density));
  const rows = Math.max(1, Math.round(height * density));
  
  const pullAcross = new Uint8ClampedArray(columns * rows * 4);
  const pullDown = new Uint8ClampedArray(columns * rows * 4);
  const caught = new Uint8ClampedArray(columns * rows * 4);
  const shapeMask = new Uint8ClampedArray(columns * rows * 4);
  
  const share = options.relative ? Math.min(width, height) : 1;
  const depth = options.depth * share;
  const dome = options.dome * share;
  const { splay } = options;
  
  const innerWidth = Math.max(0, halfWidth - depth);
  const innerHeight = Math.max(0, halfHeight - depth);
  const innerRadius = clamp(radius, 0, Math.min(innerWidth, innerHeight));
  const ramp = depth > 0 ? 1 / (depth * Math.SQRT2) : 1e6;
  
  const sag = Math.max(0.01, Math.min(dome, Math.min(halfWidth, halfHeight) - 1));
  const across = dome > 0 ? arc(sag, halfWidth) : null;
  const down = dome > 0 ? arc(sag, halfHeight) : null;
  const reach = 0.5 * Math.min(halfWidth, halfHeight);
  
  const cos = Math.cos((light.angle * Math.PI) / 180);
  const sin = Math.sin((light.angle * Math.PI) / 180);
  const glowStart = (1 - light.spread) * Math.SQRT2;
  const glowRange = light.spread * Math.SQRT2;
  
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const i = (row * columns + column) * 4;
      const x = ((column + 0.5) / columns) * width - halfWidth;
      const y = ((row + 0.5) / rows) * height - halfHeight;
      const edge = distance(x, y, halfWidth, halfHeight, radius);
      const inside = Math.round(255 * clamp(-edge, 0, 1));
      
      grey(shapeMask, i, 0, inside);
      
      if (edge >= 0) {
        grey(pullAcross, i, 128);
        grey(pullDown, i, 128);
        grey(caught, i, 128, 0);
        continue;
      }
      
      const ax = Math.abs(x);
      const ay = Math.abs(y);
      let dx = across ? Math.sign(x) * slope(ax, across) : clamp(x / halfWidth, -1, 1);
      let dy = down ? Math.sign(y) * slope(ay, down) : clamp(y / halfHeight, -1, 1);
      
      if (splay < 1 && reach > 0) {
        const keepX = Math.max(0, 1 - (halfHeight - ay) / reach) * (1 - splay);
        const keepY = Math.max(0, 1 - (halfWidth - ax) / reach) * (1 - splay);
        if (keepX > 0.001 || keepY > 0.001) {
          const before = Math.hypot(dx, dy);
          dx *= 1 - keepX;
          dy *= 1 - keepY;
          const after = Math.hypot(dx, dy);
          if (after > 0.001) {
            dx *= before / after;
            dy *= before / after;
          }
        }
      }
      
      const falloff = 0.5 * (1 + erf(distance(x, y, innerWidth, innerHeight, innerRadius) * ramp));
      grey(shapeMask, i, Math.round(255 * falloff), inside);
      grey(pullAcross, i, Math.round((0.5 - 0.5 * dx * falloff) * 255));
      grey(pullDown, i, Math.round((0.5 - 0.5 * dy * falloff) * 255));
      
      const facing = Math.abs(
        clamp(x / halfWidth, -1, 1) * cos + clamp(y / halfHeight, -1, 1) * sin
      );
      const glow =
        glowRange > 0.001
          ? light.glow *
            Math.pow(clamp((facing - glowStart) / glowRange, 0, 1), light.glowPower) *
            falloff
          : 0;
      const rim = light.edge * Math.max(0, 1 + edge / light.edgeWidth) * Math.pow(facing, light.edgePower);
      const amount = Math.min(1, glow + rim);
      const bends = Math.min(1, falloff * 20, -edge);
      grey(caught, i, Math.round(127 * amount + 128), Math.round(255 * bends));
    }
  }
  
  return { columns, rows, across: pullAcross, down: pullDown, light: caught, shape: shapeMask };
}

const encodedCache = new Map<string, EncodedMaps>();

function encode(key: string, draw: () => LensMap): EncodedMaps | null {
  const cached = encodedCache.get(key);
  if (cached) return cached;
  
  const map = draw();
  const canvas = document.createElement('canvas');
  canvas.width = map.columns;
  canvas.height = map.rows;
  const context = canvas.getContext('2d');
  if (!context) return null;
  
  const image = context.createImageData(map.columns, map.rows);
  const png = (data: Uint8ClampedArray): string => {
    image.data.set(data);
    context.putImageData(image, 0, 0);
    return canvas.toDataURL();
  };
  
  const result: EncodedMaps = {
    across: png(map.across),
    down: png(map.down),
    light: png(map.light),
    shape: png(map.shape),
  };
  
  encodedCache.set(key, result);
  return result;
}

function svg<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {}
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, String(value));
  }
  return el;
}

const CHANNELS = [
  '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0',
  '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0',
  '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0',
];

function boxUnits(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /AppleWebKit\//.test(navigator.userAgent) && !/Chrom(?:e|ium)\//.test(navigator.userAgent);
}

interface LensConfig {
  maps: EncodedMaps;
  shine: number;
  blur: number;
  ink: string | null;
}

function createGlisseFilter(
  lenses: LensConfig[],
  box: boolean,
  standIn: boolean
): { filter: SVGFilterElement; boxed: SVGElement[][] } {
  const unit = box ? 'objectBoundingBox' : 'userSpaceOnUse';
  const filter = svg('filter', {
    filterUnits: unit,
    primitiveUnits: unit,
    'color-interpolation-filters': 'sRGB',
  });
  
  if (box) {
    filter.setAttribute('x', '0');
    filter.setAttribute('y', '0');
    filter.setAttribute('width', '1');
    filter.setAttribute('height', '1');
  }
  
  const single = lenses.length === 1;
  const allBoxed: SVGElement[][] = [];
  
  lenses.forEach(({ maps, shine, blur }, k) => {
    const merged = (name: string) => (single ? name : `${name}-${k}`);
    
    const image = (href: string, result: string) =>
      svg('feImage', { href, preserveAspectRatio: 'none', result });
    
    const boxed: SVGElement[] = [
      image(maps.across, `across-${k}`),
      image(maps.down, `down-${k}`),
      image(maps.light, merged('raw')),
      svg('feFlood', { 'flood-color': 'rgb(128, 128, 128)', result: `neutral-${k}` }),
    ];
    
    if (standIn) boxed.push(image(maps.shape, merged('shape')));
    filter.append(...boxed);
    
    for (const pull of ['across', 'down']) {
      const half = svg('feComponentTransfer', {
        in: `${pull}-grey-${k}`,
        result: `${pull}-pull-${k}`,
      });
      half.append(svg('feFuncA', { type: 'linear', slope: 0, intercept: 0.5 }));
      
      filter.append(
        svg('feComposite', {
          in: `${pull}-${k}`,
          in2: `neutral-${k}`,
          operator: 'over',
          result: `${pull}-grey-${k}`,
        }),
        half
      );
    }
    
    CHANNELS.forEach((_, i) => {
      const across = svg('feDisplacementMap', {
        in: 'SourceGraphic',
        in2: `across-pull-${k}`,
        xChannelSelector: 'R',
        yChannelSelector: 'A',
        result: `across-${k}-${i}`,
      });
      
      const down = svg('feDisplacementMap', {
        in: `across-${k}-${i}`,
        in2: `down-pull-${k}`,
        xChannelSelector: 'A',
        yChannelSelector: 'R',
        result: `ray-${k}-${i}`,
      });
      
      boxed.push(across);
      filter.append(across, down);
    });
    
    // Spread the rays into the bent result
    const spreadSteps = CHANNELS.map((channel, i) => 
      svg('feColorMatrix', {
        in: `ray-${k}-${i}`,
        type: 'matrix',
        values: `${channel}  0 0 0 0.3333 0`,
        result: `light-${k}-${i}`,
      })
    );
    
    filter.append(...spreadSteps);
    
    filter.append(
      svg('feComposite', {
        in: `light-${k}-0`,
        in2: `light-${k}-1`,
        operator: 'arithmetic',
        k2: 1,
        k3: 1,
        result: `light-${k}-01`,
      }),
      svg('feComposite', {
        in: `light-${k}-01`,
        in2: `light-${k}-2`,
        operator: 'arithmetic',
        k2: 1,
        k3: 1,
        result: `spread-${k}`,
      }),
      svg('feColorMatrix', {
        in: `spread-${k}`,
        type: 'matrix',
        values: '3 0 0 0 0  0 3 0 0 0  0 0 3 0 0  0 0 0 1 0',
        result: `bent-${k}`,
      })
    );
    
    let soften: SVGElement | undefined;
    if (blur) {
      soften = svg('feGaussianBlur', {
        in: `bent-${k}`,
        result: `soft-${k}`,
      });
      const weight = image(maps.shape, `weight-${k}`);
      boxed.push(weight);
      
      filter.append(
        weight,
        svg('feColorMatrix', {
          in: `weight-${k}`,
          type: 'matrix',
          values: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0',
          result: `bends-${k}`,
        }),
        soften,
        svg('feComposite', {
          in: `soft-${k}`,
          in2: `bends-${k}`,
          operator: 'in',
          result: `soft-in-${k}`,
        }),
        svg('feComposite', {
          in: `bent-${k}`,
          in2: `bends-${k}`,
          operator: 'out',
          result: `sharp-${k}`,
        }),
        svg('feComposite', {
          in: `soft-in-${k}`,
          in2: `sharp-${k}`,
          operator: 'arithmetic',
          k2: 1,
          k3: 1,
          result: `softened-${k}`,
        })
      );
    }
    
    const bent = blur ? `softened-${k}` : `bent-${k}`;
    let lit = bent;
    
    if (shine > 0) {
      const white = `0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 1 0 ${-128 / 255}`;
      filter.append(
        svg('feColorMatrix', {
          in: merged('raw'),
          type: 'matrix',
          values: white,
          result: `glint-${k}`,
        }),
        svg('feComposite', {
          in: `glint-${k}`,
          in2: bent,
          operator: 'arithmetic',
          k2: shine,
          k3: 1,
          result: `lit-${k}`,
        })
      );
      lit = `lit-${k}`;
    } else if (shine < 0) {
      const row = `0 0 ${shine} 0 ${1 - (128 * shine) / 255}`;
      filter.append(
        svg('feColorMatrix', {
          in: merged('raw'),
          type: 'matrix',
          values: `${row}  ${row}  ${row}  0 0 0 0 1`,
          result: `shade-${k}`,
        }),
        svg('feComposite', {
          in: `shade-${k}`,
          in2: bent,
          operator: 'arithmetic',
          k1: 1,
          result: `lit-${k}`,
        })
      );
      lit = `lit-${k}`;
    }
    
    filter.append(
      svg('feComposite', {
        in: lit,
        in2: merged('raw'),
        operator: 'in',
        result: merged('inside'),
      })
    );
    
    allBoxed.push(boxed);
  });
  
  if (!single) {
    for (const name of ['raw', 'inside', ...(standIn ? ['shape'] : [])]) {
      const merge = svg('feMerge', { result: name });
      lenses.forEach((_, k) => merge.append(svg('feMergeNode', { in: `${name}-${k}` })));
      filter.append(merge);
    }
  }
  
  filter.append(
    svg('feComposite', {
      in: 'SourceGraphic',
      in2: 'raw',
      operator: 'out',
      result: 'outside',
    }),
    svg('feComposite', {
      in: 'inside',
      in2: 'outside',
      operator: 'arithmetic',
      k2: 1,
      k3: 1,
      result: 'seen',
    })
  );
  
  if (standIn) {
    filter.append(
      svg('feComposite', {
        in: 'seen',
        in2: 'shape',
        operator: 'in',
      })
    );
  }
  
  return { filter, boxed: allBoxed };
}

export interface GlisseGlassOptions {
  width: number;
  height: number;
  radius?: number;
  depth?: number;
  dome?: number;
  splay?: number;
  shine?: number;
  blur?: number;
  density?: number;
  lightAngle?: number;
}

let filterIdCounter = 0;

export function createGlisseGlass(options: GlisseGlassOptions): {
  filterId: string;
  filterUrl: string;
  rimGradient: string;
  cleanup: () => void;
} | null {
  const {
    width,
    height,
    radius = 20,
    depth = DEFAULT_LENS.depth,
    dome = DEFAULT_LENS.dome,
    splay = DEFAULT_LENS.splay,
    shine = 0.3,
    blur = 0.5,
    density = 0.5,
    lightAngle = DEFAULT_LIGHT.angle,
  } = options;
  
  const shape: Shape = { width, height, radius };
  const lensOpts: LensOptions = { depth, dome, splay, relative: false };
  const lightOpts: LightOptions = { ...DEFAULT_LIGHT, angle: lightAngle };
  
  const cacheKey = `${width}:${height}:${radius}:${depth}:${dome}:${splay}:${lightAngle}:${density}`;
  const maps = encode(cacheKey, () => lensMap(shape, lensOpts, lightOpts, density));
  
  if (!maps) return null;
  
  const lensConfig: LensConfig = {
    maps,
    shine,
    blur,
    ink: null,
  };
  
  const isWebKit = boxUnits();
  const { filter } = createGlisseFilter([lensConfig], isWebKit, false);
  
  const filterId = `lg-glisse-${++filterIdCounter}`;
  filter.id = filterId;
  
  // Inject filter into DOM
  let container = document.getElementById('lg-glisse-filters');
  if (!container) {
    container = document.createElement('div');
    container.id = 'lg-glisse-filters';
    container.innerHTML = '<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none"><defs></defs></svg>';
    document.body.appendChild(container);
  }
  
  const defs = container.querySelector('defs')!;
  defs.appendChild(filter);
  
  // Create rim gradient for edge highlight
  const angle = lightAngle;
  const rimGradient = `linear-gradient(${angle + 90}deg, 
    rgba(255,255,255,0.15) 0%, 
    rgba(255,255,255,0.08) 30%, 
    transparent 50%, 
    rgba(0,0,0,0.05) 100%)`;
  
  return {
    filterId,
    filterUrl: `url(#${filterId})`,
    rimGradient,
    cleanup: () => filter.remove(),
  };
}

export function clearGlisseCache(): void {
  encodedCache.clear();
}
