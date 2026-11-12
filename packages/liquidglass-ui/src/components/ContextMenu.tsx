import { forwardRef, HTMLAttributes, ReactNode, useState, useRef, useEffect, useCallback, cloneElement, isValidElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useId } from '../hooks/use-id';

export interface ContextMenuItem {
  label: ReactNode;
  icon?: ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  shortcut?: string;
}

export type ContextMenuEntry = ContextMenuItem | 'separator';

export interface ContextMenuProps {
  children: ReactNode;
  items: ContextMenuEntry[];
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ContextMenu({
  children,
  items,
  disabled = false,
  onOpenChange,
}: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const menuId = useId();

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    onOpenChange?.(isOpen);
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [onOpenChange]);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    
    const menuWidth = 200;
    const menuHeight = items.length * 40;
    
    let x = e.clientX;
    let y = e.clientY;
    
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 8;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 8;
    }
    
    setPosition({ x, y });
    handleOpenChange(true);
  };

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    handleOpenChange(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!open) return;

    const selectableItems = items.filter((item): item is ContextMenuItem => item !== 'separator' && !item.disabled);

    switch (e.key) {
      case 'Escape':
        handleOpenChange(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => {
          const next = prev + 1;
          return next >= selectableItems.length ? 0 : next;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => {
          const next = prev - 1;
          return next < 0 ? selectableItems.length - 1 : next;
        });
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          const item = selectableItems[focusedIndex];
          handleItemClick(item);
        }
        break;
    }
  }, [open, items, focusedIndex, handleOpenChange]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      
      const handleClickOutside = (e: MouseEvent) => {
        if (!menuRef.current?.contains(e.target as Node)) {
          handleOpenChange(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      menuRef.current?.focus();

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open, handleKeyDown, handleOpenChange]);

  const child = isValidElement(children) ? children : <span>{children}</span>;

  const triggerElement = cloneElement(child as React.ReactElement<Record<string, unknown>>, {
    ref: triggerRef,
    onContextMenu: handleContextMenu,
  });

  let selectableIndex = -1;

  return (
    <>
      {triggerElement}
      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          tabIndex={-1}
          aria-label="Context menu"
          className={cn(
            'lg-glass lg-glass-elevated lg-text',
            'fixed z-50 min-w-[180px] py-1.5 outline-none',
            !reducedMotion && 'animate-[lg-scale-in_100ms_var(--lg-ease-spring)]'
          )}
          style={{
            top: position.y,
            left: position.x,
            borderRadius: 12,
            transformOrigin: 'top left',
          }}
        >
          {items.map((item, index) => {
            if (item === 'separator') {
              return (
                <div
                  key={`sep-${index}`}
                  role="separator"
                  className="my-1.5 mx-2 border-t border-[var(--lg-separator)]"
                />
              );
            }

            const isSelectable = !item.disabled;
            if (isSelectable) selectableIndex++;
            const isFocused = isSelectable && selectableIndex === focusedIndex;

            return (
              <button
                key={index}
                role="menuitem"
                disabled={item.disabled}
                tabIndex={-1}
                data-selected={isFocused || undefined}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => isSelectable && setFocusedIndex(selectableIndex)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2',
                  'border-0 bg-transparent text-left text-sm cursor-pointer',
                  'transition-colors rounded-lg mx-1.5',
                  'first:mt-0 last:mb-0',
                  item.destructive && 'text-[var(--lg-destructive)]',
                  item.disabled && 'opacity-40 cursor-default',
                  isFocused && 'bg-[var(--lg-highlight)]'
                )}
                style={{ 
                  color: item.destructive ? undefined : 'var(--lg-foreground)',
                  width: 'calc(100% - 12px)',
                }}
              >
                {item.icon && (
                  <span className="flex-shrink-0 w-4 h-4">{item.icon}</span>
                )}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-[var(--lg-muted)]">{item.shortcut}</span>
                )}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}
