import { forwardRef, HTMLAttributes, CSSProperties } from 'react';
import { cn } from '../utils/cn';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | number;
  color?: string;
  thickness?: number;
  label?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
};

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      style,
      size = 'md',
      color = 'currentColor',
      thickness = 2,
      label = 'Loading',
      ...props
    },
    ref
  ) => {
    const sizeValue = typeof size === 'number' ? size : sizeMap[size];

    const spinnerStyles: CSSProperties = {
      width: sizeValue,
      height: sizeValue,
      ...style,
    };

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn('inline-flex items-center justify-center', className)}
        style={spinnerStyles}
        {...props}
      >
        <svg
          width={sizeValue}
          height={sizeValue}
          viewBox="0 0 24 24"
          fill="none"
          className="animate-spin"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke={color}
            strokeWidth={thickness}
            strokeOpacity={0.25}
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
        </svg>
        <span className="lg-sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
