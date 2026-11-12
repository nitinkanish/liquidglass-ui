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
} from './hooks';

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
} from './core';

export type {
  RefractionFilterOptions,
  LensFilterOptions,
  RimLightOptions,
  GlassFilterResult,
} from './core';

// Utils
export { cn, clamp, lerp, mapRange, debounce, throttle, noop, isServer, isBrowser } from './utils';
