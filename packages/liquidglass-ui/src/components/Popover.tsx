import { forwardRef, HTMLAttributes, ReactNode, useState, useRef, useEffect, useCallback, cloneElement, isValidElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useId } from '../hooks/use-id';

export interface PopoverProps {
  children: ReactNode;
  content: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  trigger?: 'click' | 'hover';
}

export function Popover({
  children,
  content,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  closeOnClickOutside = true,
  closeOnEscape = true,
  trigger = 'click',
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOpen !== undefined ? onOpenChange! : setInternalOpen;

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const popoverId = useId();

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (side) {
      case 'top':
        top = triggerRect.top - popoverRect.height - sideOffset;
        break;
      case 'bottom':
        top = triggerRect.bottom + sideOffset;
        break;
      case 'left':
        left = triggerRect.left - popoverRect.width - sideOffset;
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        break;
      case 'right':
        left = triggerRect.right + sideOffset;
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        break;
    }

    if (side === 'top' || side === 'bottom') {
      switch (align) {
        case 'start':
          left = triggerRect.left;
          break;
        case 'center':
          left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
          break;
        case 'end':
          left = triggerRect.right - popoverRect.width;
          break;
      }
    }

    left = Math.max(8, Math.min(left, window.innerWidth - popoverRect.width - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - popoverRect.height - 8));

    setPosition({ top: top + window.scrollY, left: left + window.scrollX });
  }, [side, align, sideOffset]);

  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        closeOnClickOutside &&
        !triggerRef.current?.contains(e.target as Node) &&
        !popoverRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, closeOnClickOutside, closeOnEscape, setOpen]);

  const handleTriggerClick = () => {
    if (trigger === 'click') {
      setOpen(!open);
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (trigger === 'click' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setOpen(!open);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setOpen(false);
    }
  };

  const child = isValidElement(children) ? children : <span>{children}</span>;

  const triggerElement = cloneElement(child as React.ReactElement<Record<string, unknown>>, {
    ref: triggerRef,
    onClick: handleTriggerClick,
    onKeyDown: handleTriggerKeyDown,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    'aria-expanded': open,
    'aria-haspopup': 'dialog',
    'aria-controls': open ? popoverId : undefined,
  });

  return (
    <>
      {triggerElement}
      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={popoverRef}
          id={popoverId}
          role="dialog"
          aria-modal="false"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            'lg-glass lg-glass-elevated lg-text',
            'fixed z-50 p-4 min-w-[200px]',
            !reducedMotion && 'animate-[lg-scale-in_150ms_var(--lg-ease-spring)]'
          )}
          style={{
            top: position.top,
            left: position.left,
            borderRadius: 12,
            transformOrigin: `${align === 'start' ? 'left' : align === 'end' ? 'right' : 'center'} ${side === 'bottom' ? 'top' : 'bottom'}`,
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}
