/**
 * Capability report, the web analogue of `isLiquidGlassSupported` from
 * @callstack/liquid-glass (MIT): tells apps which tier of the material the
 * current browser can render so they can pick their own fallback UI.
 *
 * - `lens`: true Liquid Glass refraction of the backdrop (Chromium only).
 * - `material`: frosted translucent glass with specular rim, no refraction (Safari, Firefox).
 * - `solid`: no backdrop-filter, an opaque surface is used.
 */

import { supportsBackdropFilter } from './svg-filters';
import { supportsBackdropLens } from '../hooks/use-glisse-effect';

export type GlassSupportLevel = 'lens' | 'material' | 'solid';

export interface GlassSupport {
  level: GlassSupportLevel;
  backdropFilter: boolean;
  backdropLens: boolean;
}

export function getGlassSupport(): GlassSupport {
  const backdropFilter = supportsBackdropFilter();
  const backdropLens = backdropFilter && supportsBackdropLens();
  return {
    level: backdropLens ? 'lens' : backdropFilter ? 'material' : 'solid',
    backdropFilter,
    backdropLens,
  };
}
