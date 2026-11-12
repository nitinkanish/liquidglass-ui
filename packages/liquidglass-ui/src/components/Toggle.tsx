import { forwardRef, ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react';
import { cn } from '../utils/cn';
import { useControllableBoolean } from '../hooks/use-controllable';
import { usePressedState } from '../hooks/use-pressed-state';

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  icon?: ReactNode;
}

const sizeConfig = {
  sm: { size: 32, padding: '0 8px', fontSize: 12, iconSize: 16 },
  md: { size: 40, padding: '0 12px', fontSize: 14, iconSize: 20 },
  lg: { size: 48, padding: '0 16px', fontSize: 16, iconSize: 24 },
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      style,
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      size = 'md',
      variant = 'default',
      icon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const [pressed, setPressed] = useControllableBoolean({
      checked: controlledPressed,
      defaultChecked: defaultPressed,
      onCheckedChange: onPressedChange,
    });

    const { isPressed: isPointerPressed, pressHandlers } = usePressedState({ disabled });
    const config = sizeConfig[size];

    const handleClick = () => {
      if (!disabled) {
        setPressed(!pressed);
      }
    };

    const toggleStyles: CSSProperties = {
      height: config.size,
      padding: icon && !children ? '0' : config.padding,
      width: icon && !children ? config.size : undefined,
      fontSize: config.fontSize,
      borderRadius: config.size / 2,
      ...style,
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={pressed}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          'lg-interactive lg-focus-ring',
          'inline-flex items-center justify-center gap-2',
          'border-0 font-medium cursor-pointer',
          'transition-colors',
          variant === 'default' && 'lg-glass',
          variant === 'outline' && 'bg-transparent border border-[var(--lg-edge-strong)]',
          pressed && 'bg-[var(--lg-accent-light)] text-[var(--lg-accent)]',
          pressed && variant === 'outline' && 'border-[var(--lg-accent)]',
          disabled && 'opacity-35 cursor-default',
          className
        )}
        style={toggleStyles}
        data-pressed={isPointerPressed ? '' : undefined}
        data-state={pressed ? 'on' : 'off'}
        {...pressHandlers}
        {...props}
      >
        {icon && (
          <span
            className="flex items-center justify-center"
            style={{ width: config.iconSize, height: config.iconSize }}
          >
            {icon}
          </span>
        )}
        {children}
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';
