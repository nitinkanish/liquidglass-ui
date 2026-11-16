/**
 * Moves the glass light source so specular rims respond to the user, the way Apple's
 * glass highlights respond to device motion and pointer position.
 *
 * Writes `--lg-light-angle` (a CSS angle) on the root element; the shared `.lg-glass`
 * rim reads it. One passive listener for the whole page, rAF-throttled and quantised
 * so style recalculation stays cheap.
 */

import { useEffect } from 'react';

export type LightSourceMode = 'static' | 'pointer' | 'motion';

export const DEFAULT_LIGHT_ANGLE = 315;

/** CSS angle (0deg = up, clockwise) pointing from the origin toward (dx, dy), y down. */
export function lightAngleFromVector(dx: number, dy: number): number {
  if (Math.abs(dx) < 1e-3 && Math.abs(dy) < 1e-3) return DEFAULT_LIGHT_ANGLE;
  const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return (deg + 360) % 360;
}

export function useLightSource(mode: LightSourceMode = 'pointer', enabled = true): void {
  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return;
    const root = document.documentElement;
    const setAngle = (angle: number) => {
      const quantised = Math.round(angle / 3) * 3;
      root.style.setProperty('--lg-light-angle', `${quantised}deg`);
    };

    if (mode === 'static') {
      root.style.removeProperty('--lg-light-angle');
      return;
    }

    let frame: number | null = null;
    let next = DEFAULT_LIGHT_ANGLE;
    const schedule = (angle: number) => {
      next = angle;
      if (frame == null) {
        frame = requestAnimationFrame(() => {
          frame = null;
          setAngle(next);
        });
      }
    };

    if (mode === 'pointer') {
      const onMove = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        const dx = event.clientX - window.innerWidth / 2;
        const dy = event.clientY - window.innerHeight / 2;
        schedule(lightAngleFromVector(dx, dy));
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      return () => {
        window.removeEventListener('pointermove', onMove);
        if (frame != null) cancelAnimationFrame(frame);
        root.style.removeProperty('--lg-light-angle');
      };
    }

    // motion: tilt the device, the light stays put in the world
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma == null || event.beta == null) return;
      const dx = Math.max(-1, Math.min(1, event.gamma / 30));
      const dy = Math.max(-1, Math.min(1, (event.beta - 45) / 30));
      // Tilting right moves the highlight left, so the light appears fixed
      schedule(lightAngleFromVector(-dx - 0.35, -dy - 0.35));
    };
    window.addEventListener('deviceorientation', onOrientation, { passive: true });
    return () => {
      window.removeEventListener('deviceorientation', onOrientation);
      if (frame != null) cancelAnimationFrame(frame);
      root.style.removeProperty('--lg-light-angle');
    };
  }, [mode, enabled]);
}
