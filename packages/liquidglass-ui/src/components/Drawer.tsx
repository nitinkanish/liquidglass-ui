import { forwardRef, HTMLAttributes, ReactNode, useEffect, useCallback, useRef, CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useId } from '../hooks/use-id';

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  side?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const sizeConfig = {
  sm: 280,
  md: 320,
  lg: 400,
  xl: 500,
};

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      className,
      style,
      open,
      onOpenChange,
      children,
      side = 'right',
      size = 'md',
      title,
      description,
      showCloseButton = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotion();
    const drawerRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const descId = useId();
    const width = sizeConfig[size];

    const handleClose = useCallback(() => {
      onOpenChange(false);
    }, [onOpenChange]);

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        handleClose();
      }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        handleClose();
      }
    }, [closeOnEscape, handleClose]);

    useEffect(() => {
      if (open) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        drawerRef.current?.focus();
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [open, handleKeyDown]);

    if (!open) return null;

    const drawerStyles: CSSProperties = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      width,
      maxWidth: '90vw',
      ...(side === 'left' ? { left: 0 } : { right: 0 }),
      ...style,
    };

    const animationClass = reducedMotion ? '' : 
      side === 'left' 
        ? 'animate-[lg-slide-from-left_300ms_var(--lg-ease-spring)]' 
        : 'animate-[lg-slide-from-right_300ms_var(--lg-ease-spring)]';

    const drawerContent = (
      <div
        className={cn(
          'fixed inset-0 z-50',
          'bg-black/40 backdrop-blur-sm',
          !reducedMotion && 'animate-[lg-fade-in_200ms_ease-out]'
        )}
        onClick={handleOverlayClick}
      >
        <div
          ref={ref || drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descId : undefined}
          tabIndex={-1}
          className={cn(
            'lg-glass lg-glass-elevated lg-text',
            'h-full flex flex-col outline-none overflow-hidden',
            animationClass,
            className
          )}
          style={drawerStyles}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-4 border-b border-[var(--lg-separator)]">
              <div>
                {title && (
                  <h2
                    id={titleId}
                    className="text-lg font-semibold m-0"
                    style={{ color: 'var(--lg-foreground)' }}
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id={descId}
                    className="text-sm mt-1 m-0"
                    style={{ color: 'var(--lg-muted)' }}
                  >
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    'bg-[var(--lg-glass)] hover:bg-[var(--lg-glass-active)]',
                    'border-0 cursor-pointer transition-colors',
                    'text-[var(--lg-muted)] hover:text-[var(--lg-foreground)]'
                  )}
                  aria-label="Close drawer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            {children}
          </div>
        </div>
      </div>
    );

    return createPortal(drawerContent, document.body);
  }
);

Drawer.displayName = 'Drawer';
