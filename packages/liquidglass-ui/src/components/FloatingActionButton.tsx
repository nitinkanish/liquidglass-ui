import { forwardRef, ButtonHTMLAttributes, ReactNode, CSSProperties, useState } from 'react';
import { cn } from '../utils/cn';
import { usePressedState } from '../hooks/use-pressed-state';
import { useReducedMotion } from '../hooks/use-reduced-motion';

export interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'glass';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left';
  extended?: boolean;
  label?: string;
  'aria-label': string;
}

const sizeConfig = {
  sm: { size: 40, iconSize: 20 },
  md: { size: 56, iconSize: 24 },
  lg: { size: 72, iconSize: 32 },
};

const positionStyles: Record<string, { bottom?: number; top?: number; left?: number | string; right?: number; transform?: string }> = {
  'bottom-right': { bottom: 24, right: 24 },
  'bottom-left': { bottom: 24, left: 24 },
  'bottom-center': { bottom: 24, left: '50%', transform: 'translateX(-50%)' },
  'top-right': { top: 24, right: 24 },
  'top-left': { top: 24, left: 24 },
};

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  (
    {
      className,
      style,
      icon,
      size = 'md',
      variant = 'primary',
      position = 'bottom-right',
      extended = false,
      label,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const { isPressed, pressHandlers } = usePressedState({ disabled });
    const reducedMotion = useReducedMotion();
    const config = sizeConfig[size];

    const fabStyles: CSSProperties = {
      position: 'fixed',
      zIndex: 40,
      height: config.size,
      minWidth: config.size,
      borderRadius: extended && label ? config.size / 2 : '50%',
      padding: extended && label ? `0 ${config.size / 2}px` : 0,
      ...positionStyles[position],
      ...style,
    };

    const variantClasses = {
      primary: 'bg-[var(--lg-accent)] text-white hover:bg-[var(--lg-accent-hover)]',
      secondary: 'bg-[var(--lg-foreground)] text-[var(--lg-background)]',
      glass: 'lg-glass lg-glass-elevated',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'lg-interactive lg-focus-ring',
          'inline-flex items-center justify-center gap-2',
          'border-0 font-medium cursor-pointer',
          'transition-all shadow-lg',
          variantClasses[variant],
          isPressed && 'scale-95',
          disabled && 'opacity-50 cursor-default',
          className
        )}
        style={{
          ...fabStyles,
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
          transition: reducedMotion ? 'none' : 'all 200ms var(--lg-ease-spring)',
          transform: `${positionStyles[position].transform || ''} ${isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.05)' : 'scale(1)'}`.trim(),
        }}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...pressHandlers}
        {...props}
      >
        <span
          className="flex items-center justify-center"
          style={{ width: config.iconSize, height: config.iconSize }}
        >
          {icon}
        </span>
        {extended && label && (
          <span className="text-sm font-medium">{label}</span>
        )}
      </button>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';

export { FloatingActionButton as FAB };
