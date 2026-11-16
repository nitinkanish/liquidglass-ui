import { forwardRef, HTMLAttributes, CSSProperties, useRef } from 'react';
import { cn } from '../utils/cn';
import { useGlisseEffect } from '../hooks/use-glisse-effect';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  hoverable?: boolean;
  /** Disable glisse refraction effect. Defaults to false (refraction enabled). */
  disableRefraction?: boolean;
}

const paddingMap = {
  none: '0',
  sm: '12px',
  md: '16px',
  lg: '24px',
};

const radiusMap = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
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
      disableRefraction = false,
      children,
      ...props
    },
    ref
  ) => {
    const localRef = useRef<HTMLDivElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || localRef;
    const { filterUrl, rimGradient, isReady } = useGlisseEffect(combinedRef, {
      enabled: !disableRefraction,
    });

    const customStyles: CSSProperties = {
      padding: paddingMap[padding],
      borderRadius: radiusMap[radius],
      ...style,
    };

    if (isReady && filterUrl) {
      customStyles.filter = filterUrl;
      customStyles.backgroundImage = rimGradient;
    }

    const baseClasses = cn(
      'lg-glass',
      variant === 'elevated' && 'lg-glass-elevated',
      variant === 'outlined' && 'border border-[var(--lg-edge-strong)]',
      hoverable && 'transition-transform hover:scale-[1.02] hover:shadow-lg cursor-pointer',
      className
    );

    return (
      <div ref={combinedRef} className={baseClasses} style={customStyles} {...props}>
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
