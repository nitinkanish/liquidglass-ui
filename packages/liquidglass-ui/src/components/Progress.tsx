import { forwardRef, HTMLAttributes, CSSProperties } from 'react';
import { cn } from '../utils/cn';
import { clamp } from '../utils';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showValue?: boolean;
  indeterminate?: boolean;
}

const linearSizeConfig = {
  sm: { height: 4, borderRadius: 2 },
  md: { height: 6, borderRadius: 3 },
  lg: { height: 8, borderRadius: 4 },
};

const circularSizeConfig = {
  sm: { size: 24, strokeWidth: 3 },
  md: { size: 40, strokeWidth: 4 },
  lg: { size: 56, strokeWidth: 5 },
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      style,
      value = 0,
      max = 100,
      variant = 'linear',
      size = 'md',
      color,
      showValue = false,
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const percentage = clamp((value / max) * 100, 0, 100);
    const fillColor = color || 'var(--lg-fill)';

    if (variant === 'circular') {
      const config = circularSizeConfig[size];
      const radius = (config.size - config.strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      const strokeDashoffset = circumference - (percentage / 100) * circumference;

      return (
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn('relative inline-flex items-center justify-center', className)}
          style={{ width: config.size, height: config.size, ...style }}
          {...props}
        >
          <svg
            width={config.size}
            height={config.size}
            className={indeterminate ? 'animate-spin' : undefined}
          >
            {/* Background circle */}
            <circle
              cx={config.size / 2}
              cy={config.size / 2}
              r={radius}
              fill="none"
              stroke="var(--lg-rail)"
              strokeWidth={config.strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={config.size / 2}
              cy={config.size / 2}
              r={radius}
              fill="none"
              stroke={fillColor}
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={indeterminate ? circumference * 0.75 : strokeDashoffset}
              transform={`rotate(-90 ${config.size / 2} ${config.size / 2})`}
              style={{
                transition: indeterminate ? 'none' : 'stroke-dashoffset 300ms var(--lg-ease)',
              }}
            />
          </svg>
          {showValue && !indeterminate && (
            <span
              className="absolute text-xs font-medium"
              style={{ color: 'var(--lg-foreground)' }}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      );
    }

    const config = linearSizeConfig[size];

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn('w-full', className)}
        style={style}
        {...props}
      >
        <div
          className="w-full overflow-hidden"
          style={{
            height: config.height,
            borderRadius: config.borderRadius,
            backgroundColor: 'var(--lg-rail)',
          }}
        >
          <div
            className={indeterminate ? 'animate-pulse' : undefined}
            style={{
              width: indeterminate ? '50%' : `${percentage}%`,
              height: '100%',
              borderRadius: config.borderRadius,
              backgroundColor: fillColor,
              transition: indeterminate ? 'none' : 'width 300ms var(--lg-ease)',
              ...(indeterminate && {
                animation: 'lg-progress-indeterminate 1.5s ease-in-out infinite',
              }),
            }}
          />
        </div>
        {showValue && !indeterminate && (
          <span
            className="block mt-1 text-xs font-medium text-right"
            style={{ color: 'var(--lg-muted)' }}
          >
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';
