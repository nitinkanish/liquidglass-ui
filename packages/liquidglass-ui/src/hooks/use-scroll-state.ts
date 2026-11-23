import { useEffect, useRef, useState } from 'react';

export type ScrollDirection = 'up' | 'down' | 'none';

/** A scroll container: an element, a ref to one, or `null`/`undefined` for the window. */
export type ScrollTarget =
  | HTMLElement
  | null
  | undefined
  | { readonly current: HTMLElement | null };

export interface UseScrollStateOptions {
  /** Pixels scrolled before `scrolled` becomes true. Default 8. */
  threshold?: number;
  /** Element whose scroll position is tracked. Defaults to the window. */
  target?: ScrollTarget;
  /** Turn tracking off (state stays at the top). Default true. */
  enabled?: boolean;
  /** Ignore direction changes smaller than this many pixels. Default 4. */
  tolerance?: number;
}

export interface ScrollState {
  /** Scroll offset in pixels. */
  y: number;
  /** True once `y` is past `threshold`. */
  scrolled: boolean;
  /** Direction of the last scroll movement larger than `tolerance`. */
  direction: ScrollDirection;
}

const TOP: ScrollState = { y: 0, scrolled: false, direction: 'none' };

function resolveTarget(target: ScrollTarget): HTMLElement | null {
  if (!target) return null;
  if (typeof HTMLElement !== 'undefined' && target instanceof HTMLElement) return target;
  return (target as { current: HTMLElement | null }).current ?? null;
}

/** Pure reducer behind `useScrollState`, exported for tests. */
export function nextScrollState(
  prev: ScrollState,
  y: number,
  threshold: number,
  tolerance: number
): ScrollState {
  const delta = y - prev.y;
  let direction = prev.direction;
  if (Math.abs(delta) >= tolerance) direction = delta > 0 ? 'down' : 'up';
  if (y <= 0) direction = 'none';
  const scrolled = y > threshold;
  // Keep the last anchor while movement is below tolerance so slow scrolls still register
  const anchor = Math.abs(delta) >= tolerance || y <= 0 ? y : prev.y;
  if (anchor === prev.y && scrolled === prev.scrolled && direction === prev.direction) return prev;
  return { y: anchor, scrolled, direction };
}

/**
 * Tracks whether the page (or a scroll container) has scrolled past a threshold, and which way
 * it is moving. SSR-safe: returns the top-of-page state until mounted. Updates are batched per frame.
 */
export function useScrollState(options: UseScrollStateOptions = {}): ScrollState {
  const { threshold = 8, target, enabled = true, tolerance = 4 } = options;
  const [state, setState] = useState<ScrollState>(TOP);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setState(TOP);
      return;
    }
    const el = resolveTarget(target);
    const source: HTMLElement | Window = el ?? window;
    const read = () => (el ? el.scrollTop : window.scrollY || document.documentElement.scrollTop || 0);
    let raf: number | null = null;

    const update = () => {
      raf = null;
      const next = nextScrollState(stateRef.current, read(), threshold, tolerance);
      if (next !== stateRef.current) {
        stateRef.current = next;
        setState(next);
      }
    };
    const onScroll = () => {
      if (raf != null) return;
      raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame(update) : null;
      if (raf == null) update();
    };

    update();
    source.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      source.removeEventListener('scroll', onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [enabled, target, threshold, tolerance]);

  return state;
}
