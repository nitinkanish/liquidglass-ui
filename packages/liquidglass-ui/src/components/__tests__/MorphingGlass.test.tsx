import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { createRef } from 'react';
import { MorphingGlass, MorphingGlassHandle } from '../MorphingGlass';
import { MORPH_SHAPES, morphFrameAt, parseColor, resolveMorphEasing } from '../../core/morph';

describe('morph timeline', () => {
  const opts = { count: 6, duration: 1000, hold: 500 };

  it('holds, then eases into the next shape', () => {
    expect(morphFrameAt(0, opts)).toEqual({ from: 0, to: 1, t: 0, current: 0 });
    expect(morphFrameAt(400, opts).t).toBe(0);
    const mid = morphFrameAt(1000, opts);
    expect(mid.from).toBe(0);
    expect(mid.to).toBe(1);
    expect(mid.t).toBeCloseTo(0.5, 5);
    expect(morphFrameAt(1400, opts).current).toBe(1);
  });

  it('loops back to the first shape, or stops on the last without loop', () => {
    const lastSegment = 5 * 1500 + 1000;
    expect(morphFrameAt(lastSegment, opts)).toMatchObject({ from: 5, to: 0 });
    expect(morphFrameAt(6 * 1500 + 10, opts).from).toBe(0);
    expect(morphFrameAt(99999, { ...opts, loop: false })).toEqual({ from: 5, to: 5, t: 0, current: 5 });
  });

  it('handles a single shape and negative time', () => {
    expect(morphFrameAt(5000, { ...opts, count: 1 })).toEqual({ from: 0, to: 0, t: 0, current: 0 });
    expect(morphFrameAt(-50, opts).t).toBe(0);
  });

  it('easings start at 0 and end at 1', () => {
    for (const name of ['linear', 'ease-in-out', 'ease-out', 'spring'] as const) {
      const e = resolveMorphEasing(name);
      expect(e(0)).toBeCloseTo(0, 5);
      expect(e(1)).toBeCloseTo(1, 5);
    }
    expect(resolveMorphEasing('linear')(2)).toBe(1);
    const custom = resolveMorphEasing((t) => t * t);
    expect(custom(0.5)).toBe(0.25);
    expect(custom(3)).toBe(1);
  });

  it('parses hex and rgb colors', () => {
    expect(parseColor('#fff')).toEqual([1, 1, 1]);
    expect(parseColor('#ff0000')).toEqual([1, 0, 0]);
    expect(parseColor('rgb(0, 255, 0)')).toEqual([0, 1, 0]);
    expect(parseColor('rgba(0 0 255 / 0.5)')).toEqual([0, 0, 1]);
    expect(parseColor('tomato')).toBeNull();
    expect(parseColor(undefined)).toBeNull();
  });

  it('exposes the six shapes in reel order', () => {
    expect(MORPH_SHAPES).toEqual(['sphere', 'drop', 'pebble', 'plate', 'disc', 'pill']);
  });
});

describe('MorphingGlass', () => {
  let getContext: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    // jsdom has no WebGL: the component must fall back to CSS glass
    getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  });
  afterEach(() => {
    getContext.mockRestore();
    vi.useRealTimers();
  });

  it('falls back to the CSS glass material without WebGL', () => {
    render(<MorphingGlass />);
    const root = screen.getByRole('img');
    expect(root).toHaveAttribute('data-renderer', 'fallback');
    expect(root).toHaveAttribute('data-shape', 'sphere');
    expect(root.querySelector('.lg-morph-fallback')).toHaveClass('lg-glass');
    expect(root.querySelector('canvas')).toBeNull();
    expect(root.getAttribute('aria-label')).toContain('sphere, drop, pebble, plate, disc, pill');
  });

  it('renders a custom fallback', () => {
    render(<MorphingGlass fallback={<p>no webgl</p>} />);
    expect(screen.getByText('no webgl')).toBeInTheDocument();
  });

  it('steps through the sequence in the fallback and reports shape changes', () => {
    vi.useFakeTimers();
    const onShapeChange = vi.fn();
    render(<MorphingGlass shapes={['pill', 'disc']} duration={100} hold={50} onShapeChange={onShapeChange} />);
    const root = screen.getByRole('img');
    expect(root).toHaveAttribute('data-shape', 'pill');
    expect(root).toHaveAttribute('data-playing');
    act(() => {
      vi.advanceTimersByTime(160);
    });
    expect(root).toHaveAttribute('data-shape', 'disc');
    expect(onShapeChange).toHaveBeenCalledWith('disc', 1);
  });

  it('shows a fixed shape and does not play', () => {
    render(<MorphingGlass shape="plate" />);
    const root = screen.getByRole('img');
    expect(root).toHaveAttribute('data-shape', 'plate');
    expect(root).not.toHaveAttribute('data-playing');
  });

  it('honours paused and autoplay={false}', () => {
    const { unmount } = render(<MorphingGlass paused />);
    expect(screen.getByRole('img')).not.toHaveAttribute('data-playing');
    unmount();
    render(<MorphingGlass autoplay={false} />);
    expect(screen.getByRole('img')).not.toHaveAttribute('data-playing');
  });

  it('respects prefers-reduced-motion', () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    }));
    render(<MorphingGlass />);
    const root = screen.getByRole('img');
    expect(root).not.toHaveAttribute('data-playing');
    expect(root.style.getPropertyValue('--lg-morph-duration')).toBe('0ms');
    window.matchMedia = original;
  });

  it('pauses when scrolled offscreen', () => {
    let callback: IntersectionObserverCallback = () => {};
    const observe = vi.fn();
    const OriginalIO = window.IntersectionObserver;
    window.IntersectionObserver = vi.fn().mockImplementation((cb: IntersectionObserverCallback) => {
      callback = cb;
      return { observe, disconnect: vi.fn(), unobserve: vi.fn(), takeRecords: () => [] };
    }) as unknown as typeof IntersectionObserver;
    render(<MorphingGlass />);
    const root = screen.getByRole('img');
    expect(observe).toHaveBeenCalledWith(root);
    expect(root).toHaveAttribute('data-playing');
    act(() => callback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(root).not.toHaveAttribute('data-playing');
    window.IntersectionObserver = OriginalIO;
  });

  it('exposes play / pause through the ref', () => {
    const ref = createRef<MorphingGlassHandle>();
    render(<MorphingGlass ref={ref} />);
    const root = screen.getByRole('img');
    act(() => ref.current!.pause());
    expect(root).not.toHaveAttribute('data-playing');
    act(() => ref.current!.play());
    expect(root).toHaveAttribute('data-playing');
    expect(ref.current!.element).toBe(root);
  });

  it('forces the CSS renderer and passes size / duration tokens', () => {
    render(<MorphingGlass renderer="css" size={1.2} duration={900} />);
    const root = screen.getByRole('img');
    expect(root).toHaveAttribute('data-renderer', 'fallback');
    expect(root.style.getPropertyValue('--lg-morph-size')).toBe('1.2');
    expect(root.style.getPropertyValue('--lg-morph-duration')).toBe('900ms');
    expect(getContext).not.toHaveBeenCalled();
  });

  it('renders on the server', () => {
    const html = renderToString(<MorphingGlass shape="drop" />);
    expect(html).toContain('lg-morph');
    expect(html).toContain('data-shape="drop"');
    expect(html).toContain('data-renderer="pending"');
  });
});
