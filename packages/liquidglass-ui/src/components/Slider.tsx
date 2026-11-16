/**
 * Slider — glisse-compatible glass thumb pill on a rail
 *
 * Thumb is 60×40 at scale 0.6 (visual ~36×24), matching glisse.
 */
import {
  forwardRef,
  InputHTMLAttributes,
  CSSProperties,
  useState,
  useRef,
  useCallback,
} from 'react';
import { cn } from '../utils/cn';
import { useControllable } from '../hooks/use-controllable';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useGlisseEffect } from '../hooks/use-glisse-effect';
import { mapRange } from '../utils';

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

const THUMB_SHADOW = `
  0 6px 24px rgba(0,0,0,0.2),
  inset 0 0 0 1.5px rgba(255,255,255,0.5),
  inset 0 2px 1px rgba(255,255,255,0.45),
  inset 2px 7px 24px rgba(0,0,0,0.09),
  inset -2px -7px 24px rgba(255,255,255,0.16)
`;

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      style,
      value: controlledValue,
      defaultValue = 0,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      showValue = false,
      formatValue = (v) => String(Math.round(v)),
      disabled,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useControllable({
      value: controlledValue,
      defaultValue,
      onChange: onValueChange,
    });

    const [lift, setLift] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const reducedMotion = useReducedMotion();
    const thumbRef = useRef<HTMLDivElement>(null);

    const currentValue = value ?? defaultValue;
    const progress = mapRange(currentValue, min, max, 0, 1);
    const thumbScale = 0.6 + lift * 0.4;

    const { filterUrl, rimGradient, isReady } = useGlisseEffect(thumbRef, {
      enabled: true,
      bend: 0.6,
      depth: 2,
      dome: 6,
      splay: 0.4,
      shine: 0.3,
    });

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return;
        setIsDragging(true);
        if (!reducedMotion) setLift(1);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      },
      [disabled, reducedMotion]
    );

    const handlePointerUp = useCallback(() => {
      setIsDragging(false);
      setLift(0);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(parseFloat(e.target.value));
    };

    const thumbStyles: CSSProperties = {
      position: 'absolute',
      top: 0,
      left: `calc((100% - 36px) * ${progress} - 12px)`,
      width: 60,
      height: 40,
      transform: `scale(${thumbScale})`,
      transformOrigin: 'center center',
      transition:
        reducedMotion || isDragging
          ? 'none'
          : 'transform 150ms cubic-bezier(.25,.1,.25,1), left 50ms linear',
      borderRadius: 9999,
      backdropFilter: `blur(${2 * (1 - lift) + 0.5 * lift}px) brightness(${1 + 0.15 * (1 - lift)}) var(--lg-filter, saturate(1.5))`,
      WebkitBackdropFilter: `blur(${2 * (1 - lift) + 0.5 * lift}px) brightness(${1 + 0.15 * (1 - lift)}) var(--lg-filter, saturate(1.5))`,
      boxShadow: THUMB_SHADOW,
      pointerEvents: 'none',
      ...(isReady && filterUrl
        ? { filter: filterUrl, backgroundImage: rimGradient }
        : {}),
    };

    return (
      <div
        className={cn('relative w-full h-10', disabled && 'opacity-35', className)}
        style={style}
      >
        {/* Rail */}
        <div
          className="absolute rounded-[3px] pointer-events-none"
          style={{
            top: 17,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: 'var(--lg-rail)',
          }}
        >
          <span
            className="block h-full rounded-[inherit]"
            style={{
              width: `calc((100% - 36px) * ${progress} + 18px)`,
              backgroundColor: 'var(--lg-fill)',
              transition: isDragging ? 'none' : 'width 50ms linear',
            }}
          />
        </div>

        {/* Glass thumb pill */}
        <div ref={thumbRef} aria-hidden style={thumbStyles}>
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
        </div>

        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleInputChange}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          disabled={disabled}
          className={cn(
            'absolute inset-0 w-full h-full',
            'm-0 opacity-0 cursor-pointer',
            disabled && 'cursor-default'
          )}
          style={{ touchAction: 'none' }}
          {...props}
        />

        {showValue && (
          <div
            className="absolute text-xs font-medium text-center pointer-events-none"
            style={{
              left: `${progress * 100}%`,
              top: -20,
              transform: 'translateX(-50%)',
              color: 'var(--lg-foreground)',
            }}
          >
            {formatValue(currentValue)}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';
