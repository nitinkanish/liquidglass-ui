/**
 * Applies the Liquid Glass backdrop lens to every `.lg-glass` surface in the page, so
 * components that do not run their own refraction hook (menus, popovers, navbars, toasts,
 * drawers...) still refract their backdrop in Chromium. Components that own a lens
 * (`data-lg-lens-owner`) are left alone.
 *
 * Started by <GlassProvider>. Safari/Firefox keep the blur + specular material.
 */

import { attachBackdropLens, detachBackdropLens, supportsBackdropLens } from '../hooks/use-glisse-effect';

const SKIP = '[data-lg-lens-owner], [data-lg-lens], .lg-glass-flat, .lg-glass-bridge, [data-effect="none"], [data-no-lens]';

export interface AutoLensOptions {
  bend?: number;
  dispersion?: number;
}

export function startAutoLens(options: AutoLensOptions = {}): () => void {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined' || !supportsBackdropLens()) {
    return () => {};
  }
  if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-transparency: reduce)').matches) {
    return () => {};
  }

  const attached = new Set<HTMLElement>();
  let frame: number | null = null;

  const scan = () => {
    frame = null;
    attached.forEach((el) => {
      if (!el.isConnected) {
        detachBackdropLens(el);
        attached.delete(el);
      } else if (el.hasAttribute('data-lg-lens-owner')) {
        // A component took over this surface with its own lens; stop managing it.
        attached.delete(el);
      }
    });
    document.querySelectorAll<HTMLElement>('.lg-glass').forEach((el) => {
      if (attached.has(el) || el.matches(SKIP)) return;
      if (attachBackdropLens(el, options)) attached.add(el);
    });
  };

  const schedule = () => {
    if (frame == null) frame = requestAnimationFrame(scan);
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });
  schedule();

  return () => {
    observer.disconnect();
    if (frame != null) cancelAnimationFrame(frame);
    attached.forEach((el) => detachBackdropLens(el));
    attached.clear();
  };
}
