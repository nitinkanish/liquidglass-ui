import { forwardRef, ButtonHTMLAttributes, CSSProperties, useRef, useState } from 'react';
import { cn } from '../utils/cn';
import { useControllableBoolean } from '../hooks/use-controllable';
import { usePressedState } from '../hooks/use-pressed-state';
import { useReducedMotion } from '../hooks/use-reduced-motion';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { width: 44, height: 24, thumbSize: 20, travel: 20 },
  md: { width: 51, height: 31, thumbSize: 27, travel: 20 },
  lg: { width: 60, height: 36, thumbSize: 32, travel: 24 },
};

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
    ref
  ) => {
    const [checked, setChecked] = useControllableBoolean({
      checked: controlledChecked,
      defaultChecked,
      onCheckedChange,
    });

    const [lift, setLift] = useState(0);
    const reducedMotion = useReducedMotion();
    const config = sizeConfig[size];

    const { isPressed, pressHandlers } = usePressedState({
      disabled,
      onPressStart: () => !reducedMotion && setLift(1),
      onPressEnd: () => setLift(0),
    });

    const handleClick = () => {
      if (!disabled) {
        setChecked(!checked);
      }
    };

    const customStyles: CSSProperties = {
      width: config.width,
      height: config.height,
      ...style,
    };

    const thumbStyles: CSSProperties = {
      '--lg-lift': lift,
      width: config.thumbSize + lift * 8,
      height: config.thumbSize + lift * 4,
      transform: `translateX(${checked ? config.travel : 0}px) scale(${1 - lift * 0.05})`,
      transition: reducedMotion ? 'none' : 'transform 200ms var(--lg-ease-spring), width 150ms var(--lg-ease), height 150ms var(--lg-ease)',
    } as CSSProperties;

    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        className={cn(
          'lg-interactive lg-focus-ring',
          'relative inline-flex items-center',
          'p-0 border-0 rounded-full cursor-pointer',
          disabled && 'opacity-35 cursor-default',
          className
        )}
        style={customStyles}
        disabled={disabled}
        onClick={handleClick}
        {...pressHandlers}
        {...props}
      >
        {/* Track */}
        <span
          className="absolute inset-0 rounded-full transition-colors"
          style={{
            backgroundColor: checked ? 'var(--lg-on)' : 'var(--lg-track)',
            transition: reducedMotion ? 'none' : 'background-color 200ms var(--lg-ease)',
          }}
        />

        {/* Thumb */}
        <span
          className="absolute rounded-full"
          style={{
            ...thumbStyles,
            left: 2,
            top: '50%',
            marginTop: -(config.thumbSize + lift * 4) / 2,
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
            style={{
              opacity: 1 - lift * 0.3,
            }}
          />
        </span>
      </button>
    );
  }
);

Switch.displayName = 'Switch';
