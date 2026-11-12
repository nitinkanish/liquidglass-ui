/**
 * Glisse-compatible glass refraction effect hook
 * 
 * Based on glisse (MIT License)
 * https://github.com/0kzh/glisse
 * Copyright (c) 2024 Kelvin Zhang
 */

import { useEffect, useRef, useState, useCallback, RefObject } from 'react';

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
}

interface EncodedMaps {
  across: string;
  down: string;
  light: string;
}

const DEFAULT_LIGHT: LightOptions = {
  angle: 225,
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
  const r = (half * half + sag * sag) / (2 * sag);
  let sum = 0;
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * half;
    const s = x / Math.sqrt(r * r - x * x);
    sum += i === 0 || i === 200 ? s / 2 : s;
  }
  const mean = sum / 200;
  return { radius: r, scale: mean > 0 ? 0.5 / mean : 1 };
}

function slopeAt(x: number, curve: { radius: number; scale: number }): number {
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

      if (edge >= 0) {
        grey(pullAcross, i, 128);
        grey(pullDown, i, 128);
        grey(caught, i, 128, 0);
        continue;
      }

      const ax = Math.abs(x);
      const ay = Math.abs(y);
      let dx = across ? Math.sign(x) * slopeAt(ax, across) : clamp(x / halfWidth, -1, 1);
      let dy = down ? Math.sign(y) * slopeAt(ay, down) : clamp(y / halfHeight, -1, 1);

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
      grey(pullAcross, i, Math.round((0.5 - 0.5 * dx * falloff) * 255));
      grey(pullDown, i, Math.round((0.5 - 0.5 * dy * falloff) * 255));

      const facing = Math.abs(clamp(x / halfWidth, -1, 1) * cos + clamp(y / halfHeight, -1, 1) * sin);
      const glow =
        glowRange > 0.001
          ? light.glow * Math.pow(clamp((facing - glowStart) / glowRange, 0, 1), light.glowPower) * falloff
          : 0;
      const rim = light.edge * Math.max(0, 1 + edge / light.edgeWidth) * Math.pow(facing, light.edgePower);
      const amount = Math.min(1, glow + rim);
      const bends = Math.min(1, falloff * 20, -edge);
      grey(caught, i, Math.round(127 * amount + 128), Math.round(255 * bends));
    }
  }

  return { columns, rows, across: pullAcross, down: pullDown, light: caught };
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

function isWebKit(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /AppleWebKit\//.test(navigator.userAgent) && !/Chrom(?:e|ium)\//.test(navigator.userAgent);
}

/** True when feDisplacementMap can be constructed (Chromium/Safari/Firefox modern). */
function supportsDisplacementMap(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const el = document.createElementNS(SVG_NS, 'feDisplacementMap');
    return !!el && el.namespaceURI === SVG_NS && 'scale' in el;
  } catch {
    return false;
  }
}

interface LensConfig {
  maps: EncodedMaps;
  shine: number;
}

function buildFilter(lenses: LensConfig[], box: boolean): SVGFilterElement {
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

  lenses.forEach(({ maps, shine }, k) => {
    const merged = (name: string) => (single ? name : `${name}-${k}`);
    const image = (href: string, result: string) =>
      svg('feImage', { href, preserveAspectRatio: 'none', result });

    filter.append(
      image(maps.across, `across-${k}`),
      image(maps.down, `down-${k}`),
      image(maps.light, merged('raw')),
      svg('feFlood', { 'flood-color': 'rgb(128, 128, 128)', result: `neutral-${k}` })
    );

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
      filter.append(
        svg('feDisplacementMap', {
          in: 'SourceGraphic',
          in2: `across-pull-${k}`,
          xChannelSelector: 'R',
          yChannelSelector: 'A',
          result: `across-${k}-${i}`,
        }),
        svg('feDisplacementMap', {
          in: `across-${k}-${i}`,
          in2: `down-pull-${k}`,
          xChannelSelector: 'A',
          yChannelSelector: 'R',
          result: `ray-${k}-${i}`,
        })
      );
    });

    CHANNELS.forEach((channel, i) => {
      filter.append(
        svg('feColorMatrix', {
          in: `ray-${k}-${i}`,
          type: 'matrix',
          values: `${channel}  0 0 0 0.3333 0`,
          result: `light-${k}-${i}`,
        })
      );
    });

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

    const bent = `bent-${k}`;
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
  });

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

  return filter;
}

let filterIdCounter = 0;
let filterContainer: HTMLElement | null = null;

function getFilterContainer(): HTMLElement {
  if (filterContainer && filterContainer.isConnected) {
    return filterContainer;
  }
  
  let container = document.getElementById('lg-glisse-filters');
  if (!container) {
    container = document.createElement('div');
    container.id = 'lg-glisse-filters';
    container.innerHTML =
      '<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none"><defs></defs></svg>';
    document.body.appendChild(container);
  }
  filterContainer = container;
  return container;
}

export interface UseGlisseEffectOptions {
  enabled?: boolean;
  depth?: number;
  dome?: number;
  splay?: number;
  shine?: number;
  density?: number;
  lightAngle?: number;
}

export interface GlisseEffectResult {
  filterUrl: string | null;
  rimGradient: string;
  isReady: boolean;
}

export function useGlisseEffect(
  ref: RefObject<HTMLElement | null>,
  options: UseGlisseEffectOptions = {}
): GlisseEffectResult {
  const {
    enabled = true,
    depth = DEFAULT_LENS.depth,
    dome = DEFAULT_LENS.dome,
    splay = DEFAULT_LENS.splay,
    shine = 0.3,
    density = 0.5,
    lightAngle = DEFAULT_LIGHT.angle,
  } = options;

  const [filterUrl, setFilterUrl] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const filterRef = useRef<SVGFilterElement | null>(null);
  const currentFilterId = useRef<string | null>(null);
  const lastDimensions = useRef<{ width: number; height: number; radius: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const supportsRef = useRef<boolean | null>(null);

  const cleanup = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (filterRef.current) {
      filterRef.current.remove();
      filterRef.current = null;
    }
    currentFilterId.current = null;
    setFilterUrl(null);
    setIsReady(false);
  }, []);

  const updateFilter = useCallback((el: HTMLElement) => {
    if (!enabled || typeof document === 'undefined') {
      cleanup();
      return;
    }

    // Safari/Firefox/legacy fallback: skip SVG displacement when unsupported.
    // Callers still get rimGradient for a glass look via backdrop-filter.
    if (supportsRef.current === null) {
      supportsRef.current = supportsDisplacementMap();
    }
    if (!supportsRef.current) {
      setFilterUrl(null);
      setIsReady(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const computedStyle = getComputedStyle(el);
    const radius = parseFloat(computedStyle.borderRadius) || 0;

    // Skip if dimensions haven't changed significantly
    if (lastDimensions.current) {
      const { width: lw, height: lh, radius: lr } = lastDimensions.current;
      if (Math.abs(width - lw) < 2 && Math.abs(height - lh) < 2 && Math.abs(radius - lr) < 1) {
        return;
      }
    }
    lastDimensions.current = { width, height, radius };

    const shape: Shape = { width, height, radius };
    const lensOpts: LensOptions = { depth, dome, splay, relative: false };
    const lightOpts: LightOptions = { ...DEFAULT_LIGHT, angle: lightAngle };

    const cacheKey = `${width}:${height}:${radius}:${depth}:${dome}:${splay}:${lightAngle}:${density}`;
    const maps = encode(cacheKey, () => lensMap(shape, lensOpts, lightOpts, density));

    if (!maps) {
      cleanup();
      return;
    }

    const lensConfig: LensConfig = { maps, shine };
    const webKit = isWebKit();
    const filter = buildFilter([lensConfig], webKit);

    const filterId = `lg-glisse-${++filterIdCounter}`;
    filter.id = filterId;

    const container = getFilterContainer();
    const defs = container.querySelector('defs')!;

    // Clean up previous filter
    if (filterRef.current) {
      filterRef.current.remove();
    }

    defs.appendChild(filter);
    filterRef.current = filter;
    currentFilterId.current = filterId;

    setFilterUrl(`url(#${filterId})`);
    setIsReady(true);
  }, [enabled, depth, dome, splay, shine, density, lightAngle, cleanup]);

  useEffect(() => {
    if (!enabled || typeof document === 'undefined' || typeof ResizeObserver === 'undefined') {
      cleanup();
      return;
    }

    const el = ref.current;
    if (!el) return;

    // Initial setup
    updateFilter(el);

    // Throttle ResizeObserver via rAF to avoid filter rebuild storms while dragging
    const observer = new ResizeObserver(() => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (ref.current) updateFilter(ref.current);
      });
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      cleanup();
    };
  }, [ref, enabled, updateFilter, cleanup]);

  const rimGradient = `linear-gradient(${lightAngle + 90}deg, 
    rgba(255,255,255,0.12) 0%, 
    rgba(255,255,255,0.06) 30%, 
    transparent 50%, 
    rgba(0,0,0,0.04) 100%)`;

  return { filterUrl, rimGradient, isReady };
}

export function clearGlisseCache(): void {
  encodedCache.clear();
}
