import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
}

const variantConfig = {
  default: {
    icon: null,
    borderColor: 'var(--lg-edge)',
  },
  info: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lg-info)" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    borderColor: 'var(--lg-info)',
  },
  success: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lg-success)" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22,4 12,14.01 9,11.01" />
      </svg>
    ),
    borderColor: 'var(--lg-success)',
  },
  warning: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lg-warning)" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    borderColor: 'var(--lg-warning)',
  },
  error: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lg-destructive)" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    borderColor: 'var(--lg-destructive)',
  },
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      style,
      variant = 'default',
      title,
      icon,
      action,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    const config = variantConfig[variant];
    const displayIcon = icon ?? config.icon;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'lg-glass lg-text',
          'relative flex gap-3 p-4',
          className
        )}
        style={{
          borderRadius: 12,
          borderLeft: `3px solid ${config.borderColor}`,
          ...style,
        }}
        {...props}
      >
        {displayIcon && (
          <span className="flex-shrink-0 mt-0.5">{displayIcon}</span>
        )}

        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-medium text-sm mb-1" style={{ color: 'var(--lg-foreground)' }}>
              {title}
            </div>
          )}
          <div className="text-sm" style={{ color: 'var(--lg-foreground-secondary)' }}>
            {children}
          </div>
        </div>

        {action && <div className="flex-shrink-0">{action}</div>}

        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              'absolute top-2 right-2',
              'w-6 h-6 rounded-full',
              'flex items-center justify-center',
              'bg-transparent hover:bg-[var(--lg-glass)]',
              'border-0 cursor-pointer transition-colors',
              'text-[var(--lg-muted)] hover:text-[var(--lg-foreground)]'
            )}
            aria-label="Dismiss"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
