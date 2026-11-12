import { forwardRef, InputHTMLAttributes, CSSProperties, useState, useRef, useCallback } from 'react';
import { cn } from '../utils/cn';
import { useControllable } from '../hooks/use-controllable';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { clamp, mapRange } from '../utils';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

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
    const trackRef = useRef<HTMLDivElement>(null);

    const currentValue = value ?? defaultValue;
    const progress = mapRange(currentValue, min, max, 0, 1);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
      if (disabled) return;
      setIsDragging(true);
      if (!reducedMotion) setLift(1);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, [disabled, reducedMotion]);

    const handlePointerUp = useCallback(() => {
      setIsDragging(false);
      setLift(0);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(parseFloat(e.target.value));
    };

    const thumbStyles: CSSProperties = {
      '--lg-lift': lift,
      '--lg-progress': progress,
      left: `calc(${progress * 100}% - 18px)`,
      width: 36 + lift * 24,
      height: 36 + lift * 4,
      transform: `scale(${0.6 + lift * 0.15})`,
      transition: reducedMotion || isDragging ? 'none' : 'transform 150ms var(--lg-ease), width 150ms var(--lg-ease), height 150ms var(--lg-ease)',
    } as CSSProperties;

    return (
      <div
        ref={trackRef}
        className={cn(
          'relative w-full h-10',
          disabled && 'opacity-35',
          className
        )}
        style={style}
      >
        {/* Track background */}
        <div
          className="absolute rounded-full"
          style={{
            top: 17,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: 'var(--lg-rail)',
          }}
        />

        {/* Fill */}
        <div
          className="absolute rounded-full"
          style={{
            top: 17,
            left: 0,
            width: `calc(${progress * 100}%)`,
            height: 6,
            backgroundColor: 'var(--lg-fill)',
            transition: isDragging ? 'none' : 'width 50ms linear',
          }}
        />

        {/* Thumb */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            ...thumbStyles,
            top: 2,
            backdropFilter: `blur(${2 * (1 - lift) + 0.5 * lift}px) brightness(${1 + 0.15 * (1 - lift)}) saturate(1.5)`,
            boxShadow: `
              0 6px 24px rgb(0 0 0 / 0.2),
              inset 0 0 0 1.5px rgb(255 255 255 / 0.5),
              inset 0 2px 1px rgb(255 255 255 / 0.45)
            `,
          }}
        >
          <span
            className="absolute inset-0 rounded-full bg-white"
            style={{ opacity: 1 - lift * 0.3 }}
          />
        </div>

        {/* Native input for accessibility */}
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

        {/* Value display */}
        {showValue && (
          <div
            className="absolute text-xs font-medium text-center"
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
