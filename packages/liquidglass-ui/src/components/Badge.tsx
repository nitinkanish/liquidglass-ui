import { forwardRef, HTMLAttributes, ReactNode, CSSProperties } from 'react';
import { cn } from '../utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  icon?: ReactNode;
}

const variantStyles = {
  default: {
    background: 'var(--lg-accent)',
    color: 'white',
  },
  secondary: {
    background: 'var(--lg-glass)',
    color: 'var(--lg-foreground)',
    backdropFilter: 'blur(8px)',
  },
  success: {
    background: 'var(--lg-success)',
    color: 'white',
  },
  warning: {
    background: 'var(--lg-warning)',
    color: 'black',
  },
  destructive: {
    background: 'var(--lg-destructive)',
    color: 'white',
  },
  outline: {
    background: 'transparent',
    color: 'var(--lg-foreground)',
    border: '1px solid var(--lg-edge-strong)',
  },
};

const sizeConfig = {
  sm: { height: 18, padding: '0 6px', fontSize: 10, dotSize: 6 },
  md: { height: 22, padding: '0 8px', fontSize: 11, dotSize: 8 },
  lg: { height: 26, padding: '0 10px', fontSize: 12, dotSize: 10 },
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      style,
      variant = 'default',
      size = 'md',
      dot = false,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size];
    const variantStyle = variantStyles[variant];

    if (dot) {
      return (
        <span
          ref={ref}
          className={cn('inline-block rounded-full', className)}
          style={{
            width: config.dotSize,
            height: config.dotSize,
            ...variantStyle,
            ...style,
          }}
          {...props}
        />
      );
    }

    const badgeStyles: CSSProperties = {
      height: config.height,
      padding: config.padding,
      fontSize: config.fontSize,
      borderRadius: config.height / 2,
      ...variantStyle,
      ...style,
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1',
          'font-medium whitespace-nowrap',
          className
        )}
        style={badgeStyles}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
