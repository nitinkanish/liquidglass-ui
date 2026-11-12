import { forwardRef, HTMLAttributes, ReactNode, useRef, useState, useCallback, CSSProperties } from 'react';
import { cn } from '../utils/cn';
import { useControllable } from '../hooks/use-controllable';
import { useReducedMotion } from '../hooks/use-reduced-motion';

export interface SegmentedControlItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  items: SegmentedControlItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { height: 28, padding: 2, fontSize: 12, segmentWidth: 72 },
  md: { height: 32, padding: 2, fontSize: 13, segmentWidth: 84 },
  lg: { height: 40, padding: 3, fontSize: 14, segmentWidth: 100 },
};

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      className,
      style,
      items,
      value: controlledValue,
      defaultValue,
      onValueChange,
      size = 'md',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useControllable<string | null>({
      value: controlledValue,
      defaultValue: defaultValue ?? items[0]?.value ?? null,
      onChange: onValueChange as ((value: string | null) => void) | undefined,
    });

    const [lift, setLift] = useState(0);
    const reducedMotion = useReducedMotion();
    const config = sizeConfig[size];

    const selectedIndex = items.findIndex(item => item.value === value);

    const handleSelect = (itemValue: string, disabled?: boolean) => {
      if (disabled) return;
      setValue(itemValue);
    };

    const handlePointerDown = () => {
      if (!reducedMotion) setLift(1);
    };

    const handlePointerUp = () => {
      setLift(0);
    };

    const containerStyles: CSSProperties = {
      height: config.height,
      borderRadius: config.height / 2,
      ...style,
    };

    const thumbStyles: CSSProperties = {
      '--lg-lift': lift,
      position: 'absolute',
      top: config.padding,
      left: config.padding,
      width: config.segmentWidth - config.padding * 2,
      height: config.height - config.padding * 2,
      borderRadius: (config.height - config.padding * 2) / 2,
      transform: `translateX(${selectedIndex * config.segmentWidth}px) scale(${1 + lift * 0.1}, ${1 + lift * 0.05})`,
      transition: reducedMotion ? 'none' : 'transform 200ms var(--lg-ease-spring), opacity 150ms var(--lg-ease)',
      background: 'var(--lg-segment-thumb)',
      boxShadow: lift > 0 ? '0 4px 12px rgb(0 0 0 / 0.15)' : '0 1px 3px rgb(0 0 0 / 0.1)',
    } as CSSProperties;

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        className={cn(
          'lg-glass lg-interactive',
          'relative inline-flex',
          className
        )}
        style={containerStyles}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        {...props}
      >
        {/* Background */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'var(--lg-segment-track)',
          }}
        />

        {/* Thumb */}
        {selectedIndex >= 0 && (
          <div style={thumbStyles} />
        )}

        {/* Segments */}
        <div className="relative flex z-10">
          {items.map((item, index) => (
            <button
              key={item.value}
              role="radio"
              aria-checked={item.value === value}
              disabled={item.disabled}
              onClick={() => handleSelect(item.value, item.disabled)}
              className={cn(
                'flex items-center justify-center',
                'border-0 bg-transparent cursor-pointer',
                'transition-colors',
                item.disabled && 'opacity-35 cursor-default'
              )}
              style={{
                width: config.segmentWidth,
                height: config.height,
                fontSize: config.fontSize,
                fontWeight: item.value === value ? 500 : 400,
                color: 'var(--lg-segment-label)',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';
