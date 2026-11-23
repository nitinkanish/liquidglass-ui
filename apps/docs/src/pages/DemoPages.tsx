import { GlassHeaderScene } from '../demos/GlassHeaderScene';
import { MORPH_SHAPES, MorphShape } from '@nkanish/liquidglass-ui';
import { MorphingGlassHero } from '../demos/MorphingGlassHero';

/** Standalone, chrome-free demos (used for screenshots and the "full page" links). */
export function GlassHeaderDemoPage() {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const variant = params.get('variant') === 'bar' ? 'bar' : 'floating';
  return <GlassHeaderScene fullPage fixed variant={variant} actionsPlacement={params.get('cta') === 'inside' ? 'inside' : 'outside'} />;
}

export function MorphingGlassDemoPage() {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const renderer = params.get('renderer') === 'css' ? 'css' : 'auto';
  const shapeParam = params.get('shape') as MorphShape | null;
  const shape = shapeParam && (MORPH_SHAPES as readonly string[]).includes(shapeParam) ? shapeParam : undefined;
  return <MorphingGlassHero fullPage renderer={renderer} shape={shape} />;
}
