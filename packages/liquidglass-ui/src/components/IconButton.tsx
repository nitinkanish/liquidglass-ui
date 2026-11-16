import { forwardRef, useRef, ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react';
import { cn } from '../utils/cn';
import { usePressedState } from '../hooks/use-pressed-state';
import { useGlisseEffect } from '../hooks/use-glisse-effect';
import { useElasticity } from '../hooks/use-elasticity';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'glass' | 'filled' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  destructive?: boolean;
  tint?: string;
  loading?: boolean;
  'aria-label': string;
  /** Glass material for the `glass` variant. */
  effect?: 'regular' | 'clear';
  /** Elastic lean toward the pointer, 0 = off. */
  elasticity?: number;
  /** Disable the lens refraction (blur + rim only). */
  disableRefraction?: boolean;
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
      effect = 'regular',
      elasticity = 0,
      disableRefraction = false,
      ...props
    },
    forwardedRef
  ) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLButtonElement>) || localRef;
    useElasticity(ref, { amount: elasticity });
    const { filterUrl, rimGradient, isReady } = useGlisseEffect(ref, {
      enabled: variant === 'glass' && !disableRefraction,
      depth: 6,
      dome: 3,
      shine: 0.25,
    });
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

    if (variant === 'glass' && isReady && filterUrl) {
      customStyles.filter = filterUrl;
      customStyles.backgroundImage = rimGradient;
    }

    const baseClasses = cn(
      'lg-glass lg-interactive lg-focus-ring',
      variant === 'glass' && effect === 'clear' && 'lg-glass-clear',
      variant === 'ghost' && 'lg-glass-flat',
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
        data-elastic={elasticity > 0 ? '' : undefined}
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
