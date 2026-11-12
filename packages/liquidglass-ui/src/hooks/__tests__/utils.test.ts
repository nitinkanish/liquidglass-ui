import { describe, it, expect, vi } from 'vitest';
import {
  clamp,
  lerp,
  mapRange,
  debounce,
  throttle,
  isServer,
  isBrowser,
} from '../../utils';
import { supportsSVGFilters, supportsBackdropFilter } from '../../core';

describe('utils', () => {
  it('clamp confines values', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });

  it('lerp interpolates', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });

  it('mapRange remaps ranges', () => {
    expect(mapRange(50, 0, 100, 0, 1)).toBe(0.5);
  });

  it('debounce delays calls', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d();
    d();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('throttle limits call rate', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t();
    t();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    t();
    expect(fn).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('isBrowser is true in jsdom', () => {
    expect(isBrowser()).toBe(true);
    expect(isServer()).toBe(false);
  });
});

describe('feature detection', () => {
  it('supportsSVGFilters runs without throwing', () => {
    expect(() => supportsSVGFilters()).not.toThrow();
  });

  it('supportsBackdropFilter runs without throwing', () => {
    expect(() => supportsBackdropFilter()).not.toThrow();
  });
});
