/**
 * SegmentedControl — sliding thumb indicator
 *
 * Selection uses transform-only translateX (plus a tiny press scale) so the
 * thumb glides without layout jumps or overflow.
 */
import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useState,
  useCallback,
  CSSProperties,
  KeyboardEvent,
} from 'react';
import { cn } from '../utils/cn';
import { useControllable } from '../hooks/use-controllable';
import { useReducedMotion } from '../hooks/use-reduced-motion';

export interface SegmentedControlItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
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

    const selectedIndex = Math.max(
      0,
      items.findIndex((item) => item.value === value)
    );

    const handleSelect = useCallback(
      (itemValue: string, disabled?: boolean) => {
        if (disabled) return;
        setValue(itemValue);
      },
      [setValue]
    );

    const handlePointerDown = () => {
      if (!reducedMotion) setLift(1);
    };

    const handlePointerUp = () => {
      setLift(0);
    };

    const enabledIndexes = items
      .map((item, i) => (!item.disabled ? i : -1))
      .filter((i) => i >= 0);

    const moveSelection = useCallback(
      (delta: number) => {
        if (!enabledIndexes.length) return;
        const pos = enabledIndexes.indexOf(selectedIndex);
        const nextPos =
          (pos + delta + enabledIndexes.length) % enabledIndexes.length;
        setValue(items[enabledIndexes[nextPos]].value);
      },
      [enabledIndexes, items, selectedIndex, setValue]
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          moveSelection(1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          moveSelection(-1);
          break;
        case 'Home':
          e.preventDefault();
          if (enabledIndexes.length) setValue(items[enabledIndexes[0]].value);
          break;
        case 'End':
          e.preventDefault();
          if (enabledIndexes.length)
            setValue(items[enabledIndexes[enabledIndexes.length - 1]].value);
          break;
        default:
          break;
      }
    };

    const containerStyles: CSSProperties = {
      height: config.height,
      borderRadius: config.height / 2,
      overflow: 'hidden',
      ...style,
    };

    const thumbWidth = config.segmentWidth - config.padding * 2;
    const thumbHeight = config.height - config.padding * 2;
    const pressScale = 1 + lift * 0.04;

    const thumbStyles: CSSProperties = {
      position: 'absolute',
      top: config.padding,
      left: config.padding,
      width: thumbWidth,
      height: thumbHeight,
      borderRadius: thumbHeight / 2,
      // Transform-only: glide + subtle press scale (no width/left animation)
      transform: `translateX(${selectedIndex * config.segmentWidth}px) scale(${pressScale})`,
      transformOrigin: 'center center',
      transition: reducedMotion
        ? 'none'
        : 'transform 220ms cubic-bezier(.25,.1,.25,1), box-shadow 140ms',
      background: 'var(--lg-segment-thumb)',
      boxShadow:
        lift > 0 ? '0 4px 12px rgb(0 0 0 / 0.15)' : '0 1px 3px rgb(0 0 0 / 0.1)',
      pointerEvents: 'none',
      willChange: 'transform',
      zIndex: 0,
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        className={cn('lg-glass lg-interactive', 'relative inline-flex', className)}
        style={containerStyles}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: 'var(--lg-segment-track)' }}
          aria-hidden
        />

        {items.length > 0 && (
          <div
            data-testid="segmented-indicator"
            data-index={selectedIndex}
            style={thumbStyles}
            aria-hidden
          />
        )}

        <div className="relative flex z-[1]">
          {items.map((item, index) => {
            const isSelected = item.value === value;
            return (
              <button
                key={item.value}
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                disabled={item.disabled}
                onClick={() => handleSelect(item.value, item.disabled)}
                onKeyDown={handleKeyDown}
                className={cn(
                  'flex items-center justify-center',
                  'border-0 bg-transparent cursor-pointer',
                  'transition-colors lg-focus-ring',
                  item.disabled && 'opacity-35 cursor-default'
                )}
                style={{
                  width: config.segmentWidth,
                  height: config.height,
                  fontSize: config.fontSize,
                  fontWeight: isSelected ? 500 : 400,
                  color: 'var(--lg-segment-label)',
                }}
                data-index={index}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';
