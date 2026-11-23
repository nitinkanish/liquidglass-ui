/**
 * LiquidGlass UI - Advanced Apple Liquid Glass Component Library
 * Copyright 2026 Nitin Kanish, Debugged Pro
 * MIT License
 */

// Components
export * from './components';

// Hooks
export {
  useReducedMotion,
  useReducedTransparency,
  usePointerPosition,
  useMounted,
  useControllable,
  usePressedState,
  useId,
  useGlisseEffect,
  clearGlisseCache,
  useElasticity,
  computeElasticity,
  useLightSource,
  lightAngleFromVector,
  DEFAULT_LIGHT_ANGLE,
  useScrollState,
  nextScrollState,
} from './hooks';

export type { UseScrollStateOptions, ScrollState, ScrollDirection, ScrollTarget } from './hooks';

export type { UseElasticityOptions, LightSourceMode } from './hooks';

export type { UseGlisseEffectOptions, GlisseEffectResult } from './hooks';

// Core utilities
export {
  createRefractionFilter,
  createLensFilter,
  createRimLightGradient,
  createSpecularHighlight,
  cleanupFilters,
  supportsBackdropFilter,
  supportsSVGFilters,
  getGlassSupport,
  MORPH_SHAPES,
  morphFrameAt,
  resolveMorphEasing,
  parseColor,
} from './core';
export type { GlassSupport, GlassSupportLevel } from './core';
export type { MorphShape, MorphEasing, MorphEasingName, MorphFrame, MorphTimelineOptions } from './core';

export type {
  RefractionFilterOptions,
  LensFilterOptions,
  RimLightOptions,
  GlassFilterResult,
} from './core';

// Utils
export { cn, clamp, lerp, mapRange, debounce, throttle, noop, isServer, isBrowser } from './utils';
