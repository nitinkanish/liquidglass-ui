import { useState, useEffect, useCallback, RefObject } from 'react';

export interface PointerPosition {
  x: number;
  y: number;
  percentX: number;
  percentY: number;
  isInside: boolean;
}

const defaultPosition: PointerPosition = {
  x: 0,
  y: 0,
  percentX: 50,
  percentY: 50,
  isInside: false,
};

export function usePointerPosition(
  ref: RefObject<HTMLElement | null>,
  options: { enabled?: boolean } = {}
): PointerPosition {
  const { enabled = true } = options;
  const [position, setPosition] = useState<PointerPosition>(defaultPosition);

  const updatePosition = useCallback((event: PointerEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setPosition({
      x,
      y,
      percentX,
      percentY,
      isInside: true,
    });
  }, [ref]);

  const handleLeave = useCallback(() => {
    setPosition(prev => ({ ...prev, isInside: false }));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const element = ref.current;
    if (!element) return;

    element.addEventListener('pointermove', updatePosition);
    element.addEventListener('pointerleave', handleLeave);

    return () => {
      element.removeEventListener('pointermove', updatePosition);
      element.removeEventListener('pointerleave', handleLeave);
    };
  }, [ref, enabled, updatePosition, handleLeave]);

  return enabled ? position : defaultPosition;
}
