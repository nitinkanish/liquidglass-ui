import { forwardRef, HTMLAttributes, ReactNode, CSSProperties } from 'react';
import { cn } from '../utils/cn';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'filled' | 'outlined' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  icon?: ReactNode;
  onRemove?: () => void;
  removable?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const sizeConfig = {
  sm: { height: 24, padding: '0 8px', fontSize: 11, iconSize: 14 },
  md: { height: 32, padding: '0 12px', fontSize: 13, iconSize: 16 },
  lg: { height: 40, padding: '0 16px', fontSize: 14, iconSize: 18 },
};

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      className,
      style,
      variant = 'glass',
      size = 'md',
      color,
      icon,
      onRemove,
      removable = false,
      selected = false,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size];
    const isClickable = !!onClick;

    const chipStyles: CSSProperties = {
      height: config.height,
      padding: config.padding,
      fontSize: config.fontSize,
      borderRadius: config.height / 2,
      ...style,
    };

    if (color && variant === 'filled') {
      chipStyles.backgroundColor = color;
      chipStyles.color = 'white';
    } else if (color && variant === 'outlined') {
      chipStyles.borderColor = color;
      chipStyles.color = color;
    }

    return (
      <span
        ref={ref}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick?.();
          }
        }}
        className={cn(
          'inline-flex items-center gap-1.5',
          'font-medium whitespace-nowrap',
          variant === 'glass' && 'lg-glass',
          variant === 'filled' && 'bg-[var(--lg-accent)] text-white',
          variant === 'outlined' && 'bg-transparent border border-[var(--lg-edge-strong)]',
          selected && variant === 'glass' && 'bg-[var(--lg-accent-light)] ring-1 ring-[var(--lg-accent)]',
          isClickable && 'cursor-pointer hover:opacity-80 transition-opacity',
          className
        )}
        style={chipStyles}
        {...props}
      >
        {icon && (
          <span
            className="flex-shrink-0 flex items-center justify-center"
            style={{ width: config.iconSize, height: config.iconSize }}
          >
            {icon}
          </span>
        )}
        {children}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className={cn(
              'flex-shrink-0 flex items-center justify-center',
              'w-4 h-4 -mr-1 p-0 border-0 rounded-full',
              'bg-transparent cursor-pointer',
              'hover:bg-black/10 transition-colors'
            )}
            aria-label="Remove"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Chip.displayName = 'Chip';
