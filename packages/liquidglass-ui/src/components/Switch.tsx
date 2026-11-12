/**
 * Switch — glisse-compatible glass pill track with large white thumb
 *
 * Dimensions and structure mirror glisse (MIT, Kelvin Zhang):
 * button 160×67 × scale, bed inset -6/-12, track inset 6/12,
 * thumb 146×92 × scale at 0.65, travel 57.9 × scale.
 */
import {
  forwardRef,
  ButtonHTMLAttributes,
  CSSProperties,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import { cn } from '../utils/cn';
import { useControllableBoolean } from '../hooks/use-controllable';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useGlisseEffect } from '../hooks/use-glisse-effect';

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Visual scale. `md` matches glisse exactly. */
  size?: 'sm' | 'md' | 'lg';
}

const SCALE_BY_SIZE = {
  sm: 0.3,
  md: 0.375,
  lg: 0.5,
} as const;

const THUMB_SHADOW = `
  0 6px 24px rgba(0,0,0,0.2),
  inset 0 0 0 1.5px rgba(255,255,255,0.5),
  inset 0 2px 1px rgba(255,255,255,0.45),
  inset 2px 7px 24px rgba(0,0,0,0.09),
  inset -2px -7px 24px rgba(255,255,255,0.16)
`;

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      style,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      size = 'md',
      disabled,
      ...props
    },
    forwardedRef
  ) => {
    const [checked, setChecked] = useControllableBoolean({
      checked: controlledChecked,
      defaultChecked,
      onCheckedChange,
    });

    const [lift, setLift] = useState(0);
    const reducedMotion = useReducedMotion();
    const rootRef = useRef<HTMLButtonElement>(null);
    const thumbRef = useRef<HTMLSpanElement>(null);
    const gestureRef = useRef<{ id: number; x: number; from: number } | null>(null);

    useImperativeHandle(forwardedRef, () => rootRef.current as HTMLButtonElement);

    const scale = SCALE_BY_SIZE[size];
    const travel = 57.9 * scale;
    const width = 160 * scale;
    const height = 67 * scale;
    const thumbWidth = 146 * scale;
    const thumbHeight = 92 * scale;
    const thumbScale = 0.65 + lift * 0.25;
    const thumbX = checked ? travel : 0;

    // Thumb lens — glisse uses depth:2, dome:6 on the switch thumb
    const { filterUrl, rimGradient, isReady } = useGlisseEffect(thumbRef, {
      enabled: !reducedMotion,
      depth: 2,
      dome: 6,
      splay: 0.4,
      shine: 0.3,
    });

    const handleClick = () => {
      if (!disabled && !gestureRef.current) {
        setChecked(!checked);
      }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
      if (disabled || e.button !== 0) return;
      e.preventDefault();
      gestureRef.current = {
        id: e.pointerId,
        x: e.clientX,
        from: checked ? 1 : 0,
      };
      rootRef.current?.setPointerCapture(e.pointerId);
      if (!reducedMotion) setLift(1);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (gestureRef.current?.id !== e.pointerId) return;
      const gesture = gestureRef.current;
      gestureRef.current = null;
      setLift(0);

      const dx = e.clientX - gesture.x;
      if (Math.abs(dx) > 4) {
        const value = gesture.from + dx / travel;
        setChecked(value > 0.5);
      } else {
        setChecked(!checked);
      }
    };

    const handlePointerCancel = () => {
      gestureRef.current = null;
      setLift(0);
    };

    const rootStyles: CSSProperties = {
      width,
      height,
      ...style,
    };

    const thumbStyles: CSSProperties = {
      position: 'absolute',
      top: '50%',
      left: -21.95 * scale,
      width: thumbWidth,
      height: thumbHeight,
      transform: `translate(${thumbX}px, -50%) scale(${thumbScale})`,
      transition: reducedMotion ? 'none' : 'transform 200ms cubic-bezier(.25,.1,.25,1)',
      borderRadius: 9999,
      backdropFilter: `blur(${2 * (1 - lift) + 0.5 * lift}px) brightness(${1 + 0.15 * (1 - lift)}) saturate(1.5)`,
      WebkitBackdropFilter: `blur(${2 * (1 - lift) + 0.5 * lift}px) brightness(${1 + 0.15 * (1 - lift)}) saturate(1.5)`,
      boxShadow: THUMB_SHADOW,
      pointerEvents: 'none',
      ...(isReady && filterUrl
        ? { filter: filterUrl, backgroundImage: rimGradient }
        : {}),
    };

    return (
      <button
        ref={rootRef}
        type="button"
        role="switch"
        aria-checked={checked}
        className={cn(
          'lg-focus-ring relative inline-flex items-center shrink-0',
          'p-0 border-0 rounded-full cursor-pointer touch-pan-y',
          'bg-transparent',
          disabled && 'opacity-35 cursor-default',
          className
        )}
        style={rootStyles}
        disabled={disabled}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        {...props}
      >
        {/* Expanded bed — makes the green glass pill match glisse's visual size */}
        <span
          aria-hidden
          style={{ position: 'absolute', inset: '-6px -12px', pointerEvents: 'none' }}
        >
          <span
            style={{
              position: 'absolute',
              inset: '6px 12px',
              borderRadius: 9999,
              backgroundColor: 'var(--lg-track)',
            }}
          >
            <span
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 9999,
                backgroundColor: 'var(--lg-on)',
                opacity: checked ? 1 : 0,
                transition: reducedMotion ? 'none' : 'opacity 200ms cubic-bezier(.25,.1,.25,1)',
              }}
            />
          </span>
        </span>

        {/* Large white glass thumb */}
        <span ref={thumbRef} aria-hidden style={thumbStyles}>
          <span
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              backgroundColor: '#fff',
              opacity: 1 - lift * 0.85,
            }}
          />
        </span>
      </button>
    );
  }
);

Switch.displayName = 'Switch';
