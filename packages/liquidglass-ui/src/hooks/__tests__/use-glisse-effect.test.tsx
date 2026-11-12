import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRef, useEffect } from 'react';
import { useGlisseEffect, clearGlisseCache } from '../use-glisse-effect';

function useWithElement(enabled = true) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = document.createElement('div');
    el.style.width = '200px';
    el.style.height = '100px';
    el.style.borderRadius = '16px';
    document.body.appendChild(el);
    // jsdom getBoundingClientRect returns zeros — stub it
    el.getBoundingClientRect = () =>
      ({
        width: 200,
        height: 100,
        top: 0,
        left: 0,
        bottom: 100,
        right: 200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    ref.current = el;
    return () => el.remove();
  }, []);
  return useGlisseEffect(ref, { enabled, depth: 4, dome: 2 });
}

describe('useGlisseEffect', () => {
  beforeEach(() => {
    clearGlisseCache();
  });

  afterEach(() => {
    document.getElementById('lg-glisse-filters')?.remove();
    clearGlisseCache();
  });

  it('returns rimGradient even when disabled', async () => {
    const { result } = renderHook(() => useWithElement(false));
    await waitFor(() => {
      expect(result.current.rimGradient).toContain('linear-gradient');
    });
    expect(result.current.filterUrl).toBeNull();
  });

  it('is SSR-safe when document APIs are missing', () => {
    const ref = { current: null };
    const { result } = renderHook(() => useGlisseEffect(ref, { enabled: true }));
    expect(result.current.filterUrl).toBeNull();
    expect(result.current.rimGradient).toContain('linear-gradient');
  });

  it('exposes clearGlisseCache', () => {
    expect(() => clearGlisseCache()).not.toThrow();
  });
});
