/**
 * Elastic glass: the surface leans toward, and stretches along, the pointer when it
 * comes near, like touching a liquid. Idea from liquid-glass-react (MIT,
 * https://github.com/rdev/liquid-glass-react), reimplemented here with CSS custom
 * properties so React never re-renders on pointer move.
 */

import { useEffect, RefObject } from 'react';

export interface UseElasticityOptions {
  /** 0 disables. 0.15 is a good default. */
  amount?: number;
  enabled?: boolean;
  /** Distance from the glass edge, in px, within which it reacts. Default 200. */
  activationZone?: number;
}

export function computeElasticity(
  rect: { left: number; top: number; width: number; height: number },
  pointer: { x: number; y: number },
  amount: number,
  activationZone = 200
): { tx: number; ty: number; sx: number; sy: number } {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = pointer.x - cx;
  const dy = pointer.y - cy;
  const edgeX = Math.max(0, Math.abs(dx) - rect.width / 2);
  const edgeY = Math.max(0, Math.abs(dy) - rect.height / 2);
  const edge = Math.hypot(edgeX, edgeY);
  if (edge > activationZone) return { tx: 0, ty: 0, sx: 1, sy: 1 };

  const fade = 1 - edge / activationZone;
  const centerDistance = Math.hypot(dx, dy);
  if (centerDistance === 0) return { tx: 0, ty: 0, sx: 1, sy: 1 };

  const nx = dx / centerDistance;
  const ny = dy / centerDistance;
  const stretch = Math.min(centerDistance / 300, 1) * amount * fade;
  const sx = 1 + Math.abs(nx) * stretch * 0.3 - Math.abs(ny) * stretch * 0.15;
  const sy = 1 + Math.abs(ny) * stretch * 0.3 - Math.abs(nx) * stretch * 0.15;
  return {
    tx: dx * amount * 0.1 * fade,
    ty: dy * amount * 0.1 * fade,
    sx: Math.max(0.8, sx),
    sy: Math.max(0.8, sy),
  };
}

export function useElasticity(
  ref: RefObject<HTMLElement | null>,
  { amount = 0, enabled = true, activationZone = 200 }: UseElasticityOptions = {}
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || amount <= 0 || typeof window === 'undefined') return;

    let frame: number | null = null;
    let last = { x: 0, y: 0 };

    const apply = (tx: number, ty: number, sx: number, sy: number) => {
      el.style.setProperty('--lg-et-x', `${tx.toFixed(2)}px`);
      el.style.setProperty('--lg-et-y', `${ty.toFixed(2)}px`);
      el.style.setProperty('--lg-es-x', sx.toFixed(4));
      el.style.setProperty('--lg-es-y', sy.toFixed(4));
    };

    const flush = () => {
      frame = null;
      const rect = el.getBoundingClientRect();
      const r = computeElasticity(rect, last, amount, activationZone);
      apply(r.tx, r.ty, r.sx, r.sy);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      last = { x: event.clientX, y: event.clientY };
      if (frame == null) frame = requestAnimationFrame(flush);
    };

    const reset = () => apply(0, 0, 1, 1);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', reset);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', reset);
      if (frame != null) cancelAnimationFrame(frame);
      el.style.removeProperty('--lg-et-x');
      el.style.removeProperty('--lg-et-y');
      el.style.removeProperty('--lg-es-x');
      el.style.removeProperty('--lg-es-y');
    };
  }, [ref, enabled, amount, activationZone]);
}
