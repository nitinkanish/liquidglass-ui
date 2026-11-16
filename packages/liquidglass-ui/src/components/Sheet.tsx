import { forwardRef, HTMLAttributes, ReactNode, useEffect, useCallback, useRef, CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useGlisseEffect } from '../hooks/use-glisse-effect';

export interface SheetProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  side?: 'bottom' | 'top' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'full';
  showHandle?: boolean;
  /** Disable glisse refraction effect. Defaults to false (refraction enabled). */
  disableRefraction?: boolean;
}

const sizeConfig = {
  sm: { width: 320, height: 300 },
  md: { width: 400, height: 400 },
  lg: { width: 500, height: 500 },
  full: { width: '100%', height: '85vh' },
};

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      className,
      style,
      open,
      onOpenChange,
      children,
      side = 'bottom',
      size = 'md',
      showHandle = true,
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
      if (e.target === e.currentTarget) {
        handleClose();
      }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    }, [handleClose]);

    useEffect(() => {
      if (open) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [open, handleKeyDown]);

    if (!open) return null;

    const sheetStyles: CSSProperties = {
      position: 'fixed',
      zIndex: 50,
      ...(side === 'bottom' && {
        bottom: 0,
        left: 0,
        right: 0,
        height: typeof config.height === 'number' ? config.height : config.height,
        maxHeight: '90vh',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }),
      ...(side === 'top' && {
        top: 0,
        left: 0,
        right: 0,
        height: typeof config.height === 'number' ? config.height : config.height,
        maxHeight: '90vh',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }),
      ...(side === 'left' && {
        top: 0,
        left: 0,
        bottom: 0,
        width: typeof config.width === 'number' ? config.width : config.width,
        maxWidth: '90vw',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
      }),
      ...(side === 'right' && {
        top: 0,
        right: 0,
        bottom: 0,
        width: typeof config.width === 'number' ? config.width : config.width,
        maxWidth: '90vw',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
      }),
      ...style,
    };

    if (isReady && filterUrl) {
      sheetStyles.filter = filterUrl;
      sheetStyles.backgroundImage = rimGradient;
    }

    const animationClass = reducedMotion ? '' : {
      bottom: 'animate-[lg-slide-up_300ms_var(--lg-ease-spring)]',
      top: 'animate-[lg-slide-down_300ms_var(--lg-ease-spring)]',
      left: 'animate-[lg-slide-right_300ms_var(--lg-ease-spring)]',
      right: 'animate-[lg-slide-left_300ms_var(--lg-ease-spring)]',
    }[side];

    const sheetContent = (
      <div
        className={cn(
          'fixed inset-0 z-50',
          'bg-black/40 backdrop-blur-sm',
          !reducedMotion && 'animate-[lg-fade-in_200ms_ease-out]'
        )}
        onClick={handleOverlayClick}
        aria-modal="true"
        role="dialog"
      >
        <div
          ref={combinedRef}
          className={cn(
            'lg-glass lg-glass-elevated lg-text',
            'overflow-auto',
            animationClass,
            className
          )}
          style={sheetStyles}
          {...props}
        >
          {showHandle && (side === 'bottom' || side === 'top') && (
            <div className="flex justify-center py-3">
              <div
                className="w-10 h-1 rounded-full bg-[var(--lg-muted)] opacity-50"
              />
            </div>
          )}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    );

    return createPortal(sheetContent, document.body);
  }
);

Sheet.displayName = 'Sheet';
