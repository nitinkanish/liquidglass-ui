import { forwardRef, HTMLAttributes, CSSProperties } from 'react';
import { cn } from '../utils/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      style,
      variant = 'text',
      width,
      height,
      animation = 'pulse',
      ...props
    },
    ref
  ) => {
    const skeletonStyles: CSSProperties = {
      width: width ?? (variant === 'circular' ? height : '100%'),
      height: height ?? (variant === 'text' ? '1em' : undefined),
      ...style,
    };

    const borderRadius = {
      text: '4px',
      circular: '50%',
      rectangular: '0',
      rounded: '8px',
    }[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'bg-[var(--lg-glass)]',
          animation === 'pulse' && 'animate-pulse',
          animation === 'wave' && 'relative overflow-hidden after:absolute after:inset-0 after:translate-x-[-100%] after:animate-[lg-shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent',
          className
        )}
        style={{
          ...skeletonStyles,
          borderRadius,
        }}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
