/**
 * SVG Filter System for Liquid Glass Refraction Effects
 * Creates dynamic SVG filters for lens/refraction effects
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

let filterContainer: SVGSVGElement | null = null;
let filterCounter = 0;

function getFilterContainer(): SVGSVGElement {
  if (filterContainer && document.body.contains(filterContainer)) {
    return filterContainer;
  }

  filterContainer = document.createElementNS(SVG_NS, 'svg');
  filterContainer.setAttribute('aria-hidden', 'true');
  filterContainer.style.cssText = `
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    pointer-events: none;
  `;

  const defs = document.createElementNS(SVG_NS, 'defs');
  filterContainer.appendChild(defs);
  document.body.appendChild(filterContainer);

  return filterContainer;
}

function getDefs(): SVGDefsElement {
  const container = getFilterContainer();
  return container.querySelector('defs')!;
}

function createSVGElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {}
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, String(value));
  }
  return el;
}

export interface RefractionFilterOptions {
  bendStrength?: number;
  dispersion?: number;
  blur?: number;
  brightness?: number;
  saturation?: number;
  rimShine?: number;
}

export interface GlassFilterResult {
  id: string;
  remove: () => void;
  update: (options: Partial<RefractionFilterOptions>) => void;
}

export function createRefractionFilter(
  options: RefractionFilterOptions = {}
): GlassFilterResult {
  const {
    bendStrength = 0.3,
    dispersion = 0.15,
    blur = 2,
    brightness = 1.05,
    saturation = 1.5,
    rimShine = 0.2,
  } = options;

  const id = `lg-refraction-${++filterCounter}`;
  const defs = getDefs();

  const filter = createSVGElement('filter', {
    id,
    filterUnits: 'objectBoundingBox',
    primitiveUnits: 'objectBoundingBox',
    'color-interpolation-filters': 'sRGB',
    x: '-20%',
    y: '-20%',
    width: '140%',
    height: '140%',
  });

  const turbulence = createSVGElement('feTurbulence', {
    type: 'fractalNoise',
    baseFrequency: 0.01,
    numOctaves: 2,
    seed: Math.floor(Math.random() * 100),
    result: 'noise',
  });

  const displacementX = createSVGElement('feDisplacementMap', {
    in: 'SourceGraphic',
    in2: 'noise',
    scale: bendStrength * 30,
    xChannelSelector: 'R',
    yChannelSelector: 'G',
    result: 'displaced',
  });

  const colorMatrix = createSVGElement('feColorMatrix', {
    in: 'displaced',
    type: 'matrix',
    values: `
      ${saturation} 0 0 0 0
      0 ${saturation} 0 0 0
      0 0 ${saturation} 0 0
      0 0 0 1 0
    `.trim(),
    result: 'saturated',
  });

  const brightnessMatrix = createSVGElement('feColorMatrix', {
    in: 'saturated',
    type: 'matrix',
    values: `
      ${brightness} 0 0 0 0
      0 ${brightness} 0 0 0
      0 0 ${brightness} 0 0
      0 0 0 1 0
    `.trim(),
    result: 'brightened',
  });

  const gaussianBlur = createSVGElement('feGaussianBlur', {
    in: 'brightened',
    stdDeviation: blur * 0.01,
    result: 'blurred',
  });

  filter.appendChild(turbulence);
  filter.appendChild(displacementX);
  filter.appendChild(colorMatrix);
  filter.appendChild(brightnessMatrix);
  filter.appendChild(gaussianBlur);
  defs.appendChild(filter);

  return {
    id,
    remove: () => filter.remove(),
    update: (newOptions) => {
      if (newOptions.bendStrength !== undefined) {
        displacementX.setAttribute('scale', String(newOptions.bendStrength * 30));
      }
      if (newOptions.saturation !== undefined) {
        colorMatrix.setAttribute('values', `
          ${newOptions.saturation} 0 0 0 0
          0 ${newOptions.saturation} 0 0 0
          0 0 ${newOptions.saturation} 0 0
          0 0 0 1 0
        `.trim());
      }
      if (newOptions.brightness !== undefined) {
        brightnessMatrix.setAttribute('values', `
          ${newOptions.brightness} 0 0 0 0
          0 ${newOptions.brightness} 0 0 0
          0 0 ${newOptions.brightness} 0 0
          0 0 0 1 0
        `.trim());
      }
      if (newOptions.blur !== undefined) {
        gaussianBlur.setAttribute('stdDeviation', String(newOptions.blur * 0.01));
      }
    },
  };
}

export interface LensFilterOptions {
  bendX?: number;
  bendY?: number;
  dispersion?: number;
  chromatic?: boolean;
}

export function createLensFilter(options: LensFilterOptions = {}): GlassFilterResult {
  const {
    bendX = 0.4,
    bendY = 0.3,
    dispersion = 0.2,
    chromatic = true,
  } = options;

  const id = `lg-lens-${++filterCounter}`;
  const defs = getDefs();

  const filter = createSVGElement('filter', {
    id,
    filterUnits: 'objectBoundingBox',
    primitiveUnits: 'objectBoundingBox',
    'color-interpolation-filters': 'sRGB',
    x: '-50%',
    y: '-50%',
    width: '200%',
    height: '200%',
  });

  const blurForMap = createSVGElement('feGaussianBlur', {
    in: 'SourceAlpha',
    stdDeviation: 0.1,
    result: 'blurredAlpha',
  });

  const displacementMapX = createSVGElement('feDisplacementMap', {
    in: 'SourceGraphic',
    in2: 'blurredAlpha',
    scale: bendX * 50,
    xChannelSelector: 'A',
    yChannelSelector: 'A',
    result: 'displacedX',
  });

  const displacementMapY = createSVGElement('feDisplacementMap', {
    in: 'displacedX',
    in2: 'blurredAlpha',
    scale: bendY * 50,
    xChannelSelector: 'A',
    yChannelSelector: 'A',
    result: 'displaced',
  });

  filter.appendChild(blurForMap);
  filter.appendChild(displacementMapX);
  filter.appendChild(displacementMapY);

  if (chromatic && dispersion > 0) {
    const offsetR = createSVGElement('feOffset', {
      in: 'displaced',
      dx: dispersion * 0.02,
      dy: 0,
      result: 'redOffset',
    });

    const offsetB = createSVGElement('feOffset', {
      in: 'displaced',
      dx: -dispersion * 0.02,
      dy: 0,
      result: 'blueOffset',
    });

    const extractR = createSVGElement('feColorMatrix', {
      in: 'redOffset',
      type: 'matrix',
      values: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
      result: 'redChannel',
    });

    const extractG = createSVGElement('feColorMatrix', {
      in: 'displaced',
      type: 'matrix',
      values: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
      result: 'greenChannel',
    });

    const extractB = createSVGElement('feColorMatrix', {
      in: 'blueOffset',
      type: 'matrix',
      values: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0',
      result: 'blueChannel',
    });

    const mergeRG = createSVGElement('feComposite', {
      in: 'redChannel',
      in2: 'greenChannel',
      operator: 'arithmetic',
      k1: 0,
      k2: 1,
      k3: 1,
      k4: 0,
      result: 'rgMerge',
    });

    const mergeRGB = createSVGElement('feComposite', {
      in: 'rgMerge',
      in2: 'blueChannel',
      operator: 'arithmetic',
      k1: 0,
      k2: 1,
      k3: 1,
      k4: 0,
    });

    filter.appendChild(offsetR);
    filter.appendChild(offsetB);
    filter.appendChild(extractR);
    filter.appendChild(extractG);
    filter.appendChild(extractB);
    filter.appendChild(mergeRG);
    filter.appendChild(mergeRGB);
  }

  defs.appendChild(filter);

  return {
    id,
    remove: () => filter.remove(),
    update: (newOptions: Partial<LensFilterOptions>) => {
      if (newOptions.bendX !== undefined) {
        displacementMapX.setAttribute('scale', String(newOptions.bendX * 50));
      }
      if (newOptions.bendY !== undefined) {
        displacementMapY.setAttribute('scale', String(newOptions.bendY * 50));
      }
    },
  };
}

export interface RimLightOptions {
  intensity?: number;
  angle?: number;
  spread?: number;
}

export function createRimLightGradient(
  options: RimLightOptions = {}
): string {
  const {
    intensity = 0.3,
    angle = 135,
    spread = 0.5,
  } = options;

  const radians = (angle * Math.PI) / 180;
  const x1 = 50 - Math.cos(radians) * 50;
  const y1 = 50 - Math.sin(radians) * 50;
  const x2 = 50 + Math.cos(radians) * 50;
  const y2 = 50 + Math.sin(radians) * 50;

  return `linear-gradient(
    ${angle}deg,
    rgba(255, 255, 255, ${intensity}) 0%,
    rgba(255, 255, 255, ${intensity * spread}) ${30}%,
    transparent ${60}%,
    rgba(0, 0, 0, ${intensity * 0.3}) 100%
  )`;
}

export function createSpecularHighlight(
  x: number,
  y: number,
  radius: number = 200,
  intensity: number = 0.08
): string {
  return `radial-gradient(
    circle ${radius}px at ${x}% ${y}%,
    rgba(255, 255, 255, ${intensity}),
    rgba(255, 255, 255, ${intensity * 0.5}) 50%,
    transparent
  )`;
}

export function cleanupFilters(): void {
  if (filterContainer) {
    filterContainer.remove();
    filterContainer = null;
  }
  filterCounter = 0;
}

export function supportsBackdropFilter(): boolean {
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
    return false;
  }
  return (
    CSS.supports('backdrop-filter', 'blur(1px)') ||
    CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
  );
}

export function supportsSVGFilters(): boolean {
  if (typeof document === 'undefined') return false;
  const svg = document.createElementNS(SVG_NS, 'svg');
  return 'getComputedStyle' in window && svg instanceof SVGElement;
}
