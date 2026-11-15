/**
 * GlassContainer - groups glass elements so they merge when they get close, like
 * UIGlassContainerEffect / `LiquidGlassContainerView` from @callstack/liquid-glass
 * (MIT, https://github.com/callstack/liquid-glass).
 *
 * Children are laid out in a row (or column) with `gap`. Any two neighbours closer than
 * `spacing` px are joined by a glass "neck" that narrows as the gap approaches `spacing`,
 * so the pair reads as one continuous liquid shape. Native glass does this with a metaball
 * shader; this is the closest zero-dependency web approximation.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  HTMLAttributes,
  CSSProperties,
} from 'react';
import { cn } from '../utils/cn';

export interface GlassContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Distance in px at which neighbouring glass starts to merge. Default 20. */
  spacing?: number;
  /** Space between children in px. Merging happens when `gap < spacing`. Default 8. */
  gap?: number;
  direction?: 'row' | 'column';
}

interface Bridge {
  key: string;
  left: number;
  top: number;
  width: number;
  height: number;
  radius: number;
}

export function computeBridges(
  rects: Array<{ left: number; top: number; width: number; height: number }>,
  origin: { left: number; top: number },
  spacing: number,
  direction: 'row' | 'column'
): Bridge[] {
  const bridges: Bridge[] = [];
  for (let i = 0; i < rects.length - 1; i++) {
    const a = rects[i];
    const b = rects[i + 1];
    if (direction === 'row') {
      const gap = b.left - (a.left + a.width);
      if (gap < 0 || gap >= spacing) continue;
      const overlapTop = Math.max(a.top, b.top);
      const overlapBottom = Math.min(a.top + a.height, b.top + b.height);
      const shared = overlapBottom - overlapTop;
      if (shared <= 0) continue;
      const closeness = 1 - gap / spacing; // 1 when touching, 0 at the merge distance
      const height = shared * (0.35 + 0.55 * closeness);
      bridges.push({
        key: `${i}`,
        left: a.left + a.width - 1 - origin.left,
        top: overlapTop + (shared - height) / 2 - origin.top,
        width: gap + 2,
        height,
        radius: Math.min(height / 2, gap + 2),
      });
    } else {
      const gap = b.top - (a.top + a.height);
      if (gap < 0 || gap >= spacing) continue;
      const overlapLeft = Math.max(a.left, b.left);
      const overlapRight = Math.min(a.left + a.width, b.left + b.width);
      const shared = overlapRight - overlapLeft;
      if (shared <= 0) continue;
      const closeness = 1 - gap / spacing;
      const width = shared * (0.35 + 0.55 * closeness);
      bridges.push({
        key: `${i}`,
        left: overlapLeft + (shared - width) / 2 - origin.left,
        top: a.top + a.height - 1 - origin.top,
        width,
        height: gap + 2,
        radius: Math.min(width / 2, gap + 2),
      });
    }
  }
  return bridges;
}

export const GlassContainer = forwardRef<HTMLDivElement, GlassContainerProps>(
  ({ className, style, spacing = 20, gap = 8, direction = 'row', children, ...props }, ref) => {
    const localRef = useRef<HTMLDivElement | null>(null);
    const [bridges, setBridges] = useState<Bridge[]>([]);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    const measure = useCallback(() => {
      const container = localRef.current;
      if (!container) return;
      const origin = container.getBoundingClientRect();
      const rects = Array.from(container.children)
        .filter((child) => !(child as HTMLElement).hasAttribute('data-lg-bridge'))
        .map((child) => child.getBoundingClientRect());
      const next = computeBridges(rects, origin, spacing, direction);
      setBridges((prev) =>
        prev.length === next.length &&
        prev.every((p, i) => p.left === next[i].left && p.width === next[i].width && p.height === next[i].height && p.top === next[i].top)
          ? prev
          : next
      );
    }, [spacing, direction]);

    useLayoutEffect(() => {
      measure();
    });

    useEffect(() => {
      const container = localRef.current;
      if (!container || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(measure);
      observer.observe(container);
      Array.from(container.children).forEach((child) => observer.observe(child));
      return () => observer.disconnect();
    }, [measure, children]);

    const containerStyle: CSSProperties = {
      display: 'inline-flex',
      flexDirection: direction,
      alignItems: 'center',
      gap,
      ...style,
    };

    return (
      <div
        ref={setRefs}
        className={cn('lg-glass-container', className)}
        style={containerStyle}
        data-merging={bridges.length > 0 ? '' : undefined}
        {...props}
      >
        {children}
        {bridges.map((bridge) => (
          <div
            key={bridge.key}
            data-lg-bridge=""
            aria-hidden="true"
            className="lg-glass lg-glass-bridge"
            style={{
              left: bridge.left,
              top: bridge.top,
              width: bridge.width,
              height: bridge.height,
              borderRadius: bridge.radius,
              boxShadow: 'none',
            }}
          />
        ))}
      </div>
    );
  }
);

GlassContainer.displayName = 'GlassContainer';
