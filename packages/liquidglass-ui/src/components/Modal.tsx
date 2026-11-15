import { forwardRef, HTMLAttributes, ReactNode, CSSProperties, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useGlisseEffect } from '../hooks/use-glisse-effect';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  /** Disable glisse refraction effect. Defaults to false (refraction enabled). */
  disableRefraction?: boolean;
}

const sizeConfig = {
  sm: { maxWidth: 400 },
  md: { maxWidth: 500 },
  lg: { maxWidth: 640 },
  xl: { maxWidth: 800 },
  full: { maxWidth: '90vw' },
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      style,
      open,
      onOpenChange,
      children,
      title,
      description,
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      disableRefraction = false,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotion();
    const localRef = useRef<HTMLDivElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || localRef;
    const config = sizeConfig[size];

    const { filterUrl, rimGradient, isReady } = useGlisseEffect(combinedRef, {
      enabled: open && !disableRefraction,
    });

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
        combinedRef.current?.focus();
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [open, handleKeyDown, combinedRef]);

    if (!open) return null;

    const modalStyles: CSSProperties = {
      maxWidth: config.maxWidth,
      borderRadius: 24,
      ...style,
    };

    if (isReady && filterUrl) {
      modalStyles.filter = filterUrl;
      modalStyles.backgroundImage = rimGradient;
    }

    const modalContent = (
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          'bg-black/40 backdrop-blur-sm',
          !reducedMotion && 'animate-[lg-fade-in_200ms_ease-out]'
        )}
        onClick={handleOverlayClick}
        aria-modal="true"
        role="dialog"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        <div
          ref={combinedRef}
          tabIndex={-1}
          className={cn(
            'lg-glass lg-glass-elevated lg-text',
            'relative w-full outline-none',
            !reducedMotion && 'animate-[lg-scale-in_200ms_var(--lg-ease-spring)]',
            className
          )}
          style={modalStyles}
          {...props}
        >
          {/* Close button */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className={cn(
                'absolute top-4 right-4',
                'w-8 h-8 rounded-full',
                'flex items-center justify-center',
                'bg-[var(--lg-glass)] hover:bg-[var(--lg-glass-active)]',
                'border-0 cursor-pointer transition-colors',
                'text-[var(--lg-muted)] hover:text-[var(--lg-foreground)]'
              )}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Header */}
          {(title || description) && (
            <div className="px-6 pt-6 pb-2">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold m-0"
                  style={{ color: 'var(--lg-foreground)' }}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="text-sm mt-1 m-0"
                  style={{ color: 'var(--lg-muted)' }}
                >
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = 'Modal';

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end gap-3',
        'pt-4 border-t border-[var(--lg-separator)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

ModalFooter.displayName = 'ModalFooter';
