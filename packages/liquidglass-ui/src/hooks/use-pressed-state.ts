import { useState, useCallback, useRef, useEffect } from 'react';

export interface UsePressedStateOptions {
  disabled?: boolean;
  onPressStart?: () => void;
  onPressEnd?: () => void;
}

export interface PressedState {
  isPressed: boolean;
  pressHandlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
    onPointerLeave: (e: React.PointerEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onKeyUp: (e: React.KeyboardEvent) => void;
  };
}

export function usePressedState(options: UsePressedStateOptions = {}): PressedState {
  const { disabled = false, onPressStart, onPressEnd } = options;
  const [isPressed, setIsPressed] = useState(false);
  const pointerIdRef = useRef<number | null>(null);

  const handlePressStart = useCallback(() => {
    if (disabled) return;
    setIsPressed(true);
    onPressStart?.();
  }, [disabled, onPressStart]);

  const handlePressEnd = useCallback(() => {
    setIsPressed(false);
    onPressEnd?.();
  }, [onPressEnd]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled || pointerIdRef.current !== null) return;
    pointerIdRef.current = e.pointerId;
    handlePressStart();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [disabled, handlePressStart]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (pointerIdRef.current !== e.pointerId) return;
    pointerIdRef.current = null;
    handlePressEnd();
  }, [handlePressEnd]);

  const onPointerCancel = useCallback((e: React.PointerEvent) => {
    if (pointerIdRef.current !== e.pointerId) return;
    pointerIdRef.current = null;
    handlePressEnd();
  }, [handlePressEnd]);

  const onPointerLeave = useCallback((e: React.PointerEvent) => {
    if (pointerIdRef.current !== e.pointerId) return;
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handlePressStart();
    }
  }, [disabled, handlePressStart]);

  const onKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      handlePressEnd();
    }
  }, [handlePressEnd]);

  useEffect(() => {
    return () => {
      pointerIdRef.current = null;
    };
  }, []);

  return {
    isPressed,
    pressHandlers: {
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onPointerLeave,
      onKeyDown,
      onKeyUp,
    },
  };
}
