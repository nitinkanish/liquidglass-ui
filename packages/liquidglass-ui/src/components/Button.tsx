import { forwardRef, ButtonHTMLAttributes, ReactNode, CSSProperties, useRef } from 'react';
import { cn } from '../utils/cn';
import { usePressedState } from '../hooks/use-pressed-state';
import { useGlisseEffect } from '../hooks/use-glisse-effect';
import { useReducedMotion } from '../hooks/use-reduced-motion';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'glass' | 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  destructive?: boolean;
  tint?: string;
  loading?: boolean;
  fullWidth?: boolean;
  /** Disable glisse refraction effect. Defaults to false (refraction enabled for glass variant). */
  disableRefraction?: boolean;
}

const sizeStyles = {
  sm: {
    height: '32px',
    padding: '0 12px',
    fontSize: '13px',
    borderRadius: '16px',
    iconSize: '16px',
    gap: '6px',
  },
  md: {
    height: '40px',
    padding: '0 16px',
    fontSize: '14px',
    borderRadius: '20px',
    iconSize: '20px',
    gap: '8px',
  },
  lg: {
    height: '48px',
    padding: '0 24px',
    fontSize: '16px',
    borderRadius: '24px',
    iconSize: '24px',
    gap: '10px',
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      style,
      variant = 'glass',
      size = 'md',
      icon,
      iconPosition = 'start',
      destructive = false,
      tint,
      loading = false,
      fullWidth = false,
      disabled,
      disableRefraction = false,
      children,
      ...props
    },
    ref
  ) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLButtonElement>) || localRef;
    const { isPressed, pressHandlers } = usePressedState({ disabled: disabled || loading });
    const reducedMotion = useReducedMotion();
    const sizeConfig = sizeStyles[size];
    
    // Refraction for glass variant buttons
    const shouldRefract = variant === 'glass' && !disableRefraction && !reducedMotion;
    const { filterUrl, rimGradient, isReady } = useGlisseEffect(combinedRef, {
      enabled: shouldRefract,
      depth: 6,
      dome: 3,
      shine: 0.25,
    });

    const customStyles: CSSProperties & Record<string, string | number | undefined> = {
      height: sizeConfig.height,
      padding: icon && !children ? '0' : sizeConfig.padding,
      fontSize: sizeConfig.fontSize,
      borderRadius: sizeConfig.borderRadius,
      gap: sizeConfig.gap,
      width: icon && !children ? sizeConfig.height : fullWidth ? '100%' : undefined,
      ...style,
    };

    if (tint && !destructive) {
      customStyles['--lg-tint'] = tint;
    }

    // Apply refraction effect
    if (shouldRefract && isReady && filterUrl) {
      customStyles.filter = filterUrl;
      customStyles.backgroundImage = rimGradient;
    }

    const baseClasses = cn(
      'lg-glass lg-interactive lg-focus-ring',
      'inline-flex items-center justify-center',
      'font-medium transition-colors',
      'border-0 cursor-pointer',
      variant === 'filled' && 'text-white',
      variant === 'outlined' && 'bg-transparent border border-[var(--lg-edge-strong)]',
      variant === 'ghost' && 'bg-transparent backdrop-blur-none',
      destructive && 'text-[var(--lg-destructive)]',
      (disabled || loading) && 'opacity-35 cursor-default',
      fullWidth && 'w-full',
      className
    );

    const variantStyles: CSSProperties = {};
    
    if (variant === 'filled') {
      const fillColor = destructive ? 'var(--lg-destructive)' : (tint || 'var(--lg-fill)');
      variantStyles.backgroundColor = fillColor;
      variantStyles.color = 'white';
    }

    if ((tint || destructive) && variant !== 'filled') {
      variantStyles.color = destructive ? 'var(--lg-destructive)' : tint;
    }

    return (
      <button
        ref={combinedRef}
        className={baseClasses}
        style={{ ...customStyles, ...variantStyles }}
        disabled={disabled || loading}
        data-pressed={isPressed ? '' : undefined}
        data-variant={variant}
        data-destructive={destructive ? '' : undefined}
        data-icon={icon ? (children ? 'with-text' : 'only') : undefined}
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
          <>
            {icon && iconPosition === 'start' && (
              <span
                className="flex items-center justify-center"
                style={{ width: sizeConfig.iconSize, height: sizeConfig.iconSize }}
              >
                {icon}
              </span>
            )}
            {children}
            {icon && iconPosition === 'end' && (
              <span
                className="flex items-center justify-center"
                style={{ width: sizeConfig.iconSize, height: sizeConfig.iconSize }}
              >
                {icon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
