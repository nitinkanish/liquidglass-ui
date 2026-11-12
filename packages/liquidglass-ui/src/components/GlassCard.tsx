import { forwardRef, HTMLAttributes, CSSProperties } from 'react';
import { cn } from '../utils/cn';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  hoverable?: boolean;
}

const paddingMap = {
  none: '0',
  sm: '12px',
  md: '16px',
  lg: '24px',
};

const radiusMap = {
  sm: 'var(--lg-radius-sm)',
  md: 'var(--lg-radius)',
  lg: 'var(--lg-radius-lg)',
  xl: 'var(--lg-radius-xl)',
  full: 'var(--lg-radius-full)',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      style,
      variant = 'default',
      padding = 'md',
      radius = 'lg',
      hoverable = false,
      children,
      ...props
    },
    ref
  ) => {
    const customStyles: CSSProperties = {
      padding: paddingMap[padding],
      borderRadius: radiusMap[radius],
      ...style,
    };

    const baseClasses = cn(
      'lg-glass',
      variant === 'elevated' && 'lg-glass-elevated',
      variant === 'outlined' && 'border border-[var(--lg-edge-strong)]',
      hoverable && 'transition-transform hover:scale-[1.02] hover:shadow-lg cursor-pointer',
      className
    );

    return (
      <div ref={ref} className={baseClasses} style={customStyles} {...props}>
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
