import { forwardRef, ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react';
import { cn } from '../utils/cn';
import { usePressedState } from '../hooks/use-pressed-state';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'glass' | 'filled' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  destructive?: boolean;
  tint?: string;
  loading?: boolean;
  'aria-label': string;
}

const sizeStyles = {
  sm: { size: '32px', iconSize: '16px' },
  md: { size: '40px', iconSize: '20px' },
  lg: { size: '48px', iconSize: '24px' },
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      style,
      icon,
      variant = 'glass',
      size = 'md',
      destructive = false,
      tint,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const { isPressed, pressHandlers } = usePressedState({ disabled: disabled || loading });
    const sizeConfig = sizeStyles[size];

    const customStyles: CSSProperties = {
      width: sizeConfig.size,
      height: sizeConfig.size,
      borderRadius: '50%',
      ...style,
    };

    if (tint && !destructive) {
      customStyles.color = tint;
    }

    const baseClasses = cn(
      'lg-glass lg-interactive lg-focus-ring',
      'inline-flex items-center justify-center',
      'border-0 p-0',
      variant === 'filled' && 'text-white',
      variant === 'ghost' && 'bg-transparent backdrop-blur-none',
      destructive && 'text-[var(--lg-destructive)]',
      (disabled || loading) && 'opacity-35 cursor-default',
      className
    );

    const variantStyles: CSSProperties = {};
    if (variant === 'filled') {
      variantStyles.backgroundColor = destructive ? 'var(--lg-destructive)' : (tint || 'var(--lg-fill)');
      variantStyles.color = 'white';
    }

    return (
      <button
        ref={ref}
        className={baseClasses}
        style={{ ...customStyles, ...variantStyles }}
        disabled={disabled || loading}
        data-pressed={isPressed ? '' : undefined}
        {...pressHandlers}
        {...props}
      >
        {loading ? (
          <span
            className="animate-spin"
            style={{
              width: sizeConfig.iconSize,
              height: sizeConfig.iconSize,
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
            }}
          />
        ) : (
          <span
            className="flex items-center justify-center"
            style={{ width: sizeConfig.iconSize, height: sizeConfig.iconSize }}
          >
            {icon}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
