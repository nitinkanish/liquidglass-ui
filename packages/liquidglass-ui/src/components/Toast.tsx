import { forwardRef, HTMLAttributes, ReactNode, CSSProperties, useState, useEffect, createContext, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  duration?: number;
  onClose?: () => void;
}

const variantIcons = {
  default: null,
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lg-success)" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22,4 12,14.01 9,11.01" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lg-warning)" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lg-destructive)" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lg-info)" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      style,
      variant = 'default',
      title,
      description,
      icon,
      action,
      duration = 5000,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotion();
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsLeaving(true);
          setTimeout(() => onClose?.(), reducedMotion ? 0 : 200);
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onClose, reducedMotion]);

    const handleClose = () => {
      setIsLeaving(true);
      setTimeout(() => onClose?.(), reducedMotion ? 0 : 200);
    };

    const displayIcon = icon ?? variantIcons[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'lg-glass lg-glass-elevated lg-text',
          'flex items-start gap-3 p-4 min-w-[300px] max-w-[420px]',
          !reducedMotion && (isLeaving ? 'animate-[lg-slide-down_200ms_ease-in_forwards]' : 'animate-[lg-slide-up_200ms_ease-out]'),
          className
        )}
        style={{
          borderRadius: 16,
          ...style,
        }}
        {...props}
      >
        {displayIcon && (
          <span className="flex-shrink-0 mt-0.5">{displayIcon}</span>
        )}

        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-medium text-sm" style={{ color: 'var(--lg-foreground)' }}>
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm mt-0.5" style={{ color: 'var(--lg-muted)' }}>
              {description}
            </div>
          )}
          {children}
        </div>

        {action && <div className="flex-shrink-0">{action}</div>}

        <button
          onClick={handleClose}
          className={cn(
            'flex-shrink-0 w-6 h-6 rounded-full',
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
      </div>
    );
  }
);

Toast.displayName = 'Toast';

interface ToastData extends Omit<ToastProps, 'onClose'> {
  id: string;
}

interface ToastContextValue {
  toasts: ToastData[];
  toast: (props: Omit<ToastData, 'id'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((props: Omit<ToastData, 'id'>) => {
    const id = `toast-${++toastId}`;
    setToasts(prev => [...prev, { ...props, id }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map(t => (
            <Toast key={t.id} {...t} onClose={() => dismiss(t.id)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): Omit<ToastContextValue, 'toasts'> {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  const { toast, dismiss, dismissAll } = context;
  return { toast, dismiss, dismissAll };
}
