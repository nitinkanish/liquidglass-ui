import { describe, it, expect } from 'vitest';
import { computeElasticity } from '../use-elasticity';
import { lightAngleFromVector, DEFAULT_LIGHT_ANGLE } from '../use-light-source';
import { getGlassSupport } from '../../core/support';
import { startAutoLens } from '../../core/auto-lens';

describe('lightAngleFromVector', () => {
  it('falls back to the top-left light at the origin', () => {
    expect(lightAngleFromVector(0, 0)).toBe(DEFAULT_LIGHT_ANGLE);
  });

  it('points toward the pointer (CSS angles: 0 = up, 90 = right)', () => {
    expect(Math.round(lightAngleFromVector(0, -10))).toBe(0);
    expect(Math.round(lightAngleFromVector(10, 0))).toBe(90);
    expect(Math.round(lightAngleFromVector(0, 10))).toBe(180);
    expect(Math.round(lightAngleFromVector(-10, 0))).toBe(270);
    expect(Math.round(lightAngleFromVector(-10, -10))).toBe(315);
  });
});

describe('computeElasticity', () => {
  const rect = { left: 100, top: 100, width: 100, height: 40 };

  it('is neutral outside the activation zone', () => {
    expect(computeElasticity(rect, { x: 900, y: 900 }, 0.2)).toEqual({ tx: 0, ty: 0, sx: 1, sy: 1 });
  });

  it('leans toward the pointer and stretches along it', () => {
    const r = computeElasticity(rect, { x: 330, y: 120 }, 0.3);
    expect(r.tx).toBeGreaterThan(0);
    expect(r.sx).toBeGreaterThan(1);
    expect(r.sy).toBeLessThan(1);
  });

  it('never squashes below 0.8', () => {
    const r = computeElasticity(rect, { x: 160, y: 110 }, 5);
    expect(r.sx).toBeGreaterThanOrEqual(0.8);
    expect(r.sy).toBeGreaterThanOrEqual(0.8);
  });
});

describe('capability tiers', () => {
  it('reports a solid/material tier in jsdom without throwing', () => {
    const support = getGlassSupport();
    expect(['lens', 'material', 'solid']).toContain(support.level);
    expect(support.backdropLens).toBe(false);
  });

  it('auto lens is a safe no-op when the browser cannot lens', () => {
    const stop = startAutoLens();
    expect(typeof stop).toBe('function');
    stop();
  });
});
