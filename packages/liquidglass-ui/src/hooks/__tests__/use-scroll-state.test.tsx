import { describe, it, expect } from 'vitest';
import { act, render } from '@testing-library/react';
import { useRef } from 'react';
import { nextScrollState, useScrollState, ScrollState } from '../use-scroll-state';

const top: ScrollState = { y: 0, scrolled: false, direction: 'none' };

describe('nextScrollState', () => {
  it('flags scrolled past the threshold and tracks direction', () => {
    const a = nextScrollState(top, 40, 8, 4);
    expect(a).toEqual({ y: 40, scrolled: true, direction: 'down' });
    const b = nextScrollState(a, 20, 8, 4);
    expect(b.direction).toBe('up');
    expect(b.scrolled).toBe(true);
  });

  it('ignores movement below tolerance and returns the same object', () => {
    const a = nextScrollState(top, 40, 8, 4);
    expect(nextScrollState(a, 42, 8, 4)).toBe(a);
  });

  it('resets direction at the top', () => {
    const a = nextScrollState(top, 100, 8, 4);
    expect(nextScrollState(a, 0, 8, 4)).toEqual(top);
  });
});

function Probe({ container }: { container?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const s = useScrollState({ threshold: 10, target: container ? ref : undefined });
  return (
    <div ref={ref} data-testid="box" data-scrolled={String(s.scrolled)} data-dir={s.direction}>
      {s.y}
    </div>
  );
}

describe('useScrollState', () => {
  it('reads window scroll', async () => {
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('box').dataset.scrolled).toBe('false');
    await act(async () => {
      Object.defineProperty(window, 'scrollY', { value: 120, configurable: true });
      window.dispatchEvent(new Event('scroll'));
      await new Promise((r) => setTimeout(r, 30));
    });
    expect(getByTestId('box').dataset.scrolled).toBe('true');
    expect(getByTestId('box').dataset.dir).toBe('down');
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('reads a scroll container through a ref', async () => {
    const { getByTestId } = render(<Probe container />);
    const box = getByTestId('box');
    await act(async () => {
      box.scrollTop = 50;
      box.dispatchEvent(new Event('scroll'));
      await new Promise((r) => setTimeout(r, 30));
    });
    expect(box.dataset.scrolled).toBe('true');
  });
});
