import { forwardRef, HTMLAttributes, ReactNode, useState, useRef, useEffect, CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';

export interface MenuItem {
  label: ReactNode;
  icon?: ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  shortcut?: string;
}

export type MenuEntry = MenuItem | 'separator';

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  items: MenuEntry[];
  trigger: ReactNode;
  align?: 'start' | 'end';
}

export const Menu = forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      className,
      items,
      trigger,
      align = 'end',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    const updatePosition = () => {
      if (!triggerRef.current || !menuRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();

      let left = align === 'end' 
        ? triggerRect.right - menuRect.width 
        : triggerRect.left;
      
      if (left < 8) left = 8;
      if (left + menuRect.width > window.innerWidth - 8) {
        left = window.innerWidth - menuRect.width - 8;
      }

      setPosition({
        top: triggerRect.bottom + window.scrollY + 4,
        left: left + window.scrollX,
      });
    };

    useEffect(() => {
      if (isOpen) {
        updatePosition();
        
        const handleClickOutside = (e: MouseEvent) => {
          if (
            !triggerRef.current?.contains(e.target as Node) &&
            !menuRef.current?.contains(e.target as Node)
          ) {
            setIsOpen(false);
          }
        };

        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('keydown', handleEscape);
          window.removeEventListener('scroll', updatePosition, true);
          window.removeEventListener('resize', updatePosition);
        };
      }
    }, [isOpen]);

    const handleItemClick = (item: MenuItem) => {
      if (item.disabled) return;
      item.onSelect?.();
      setIsOpen(false);
    };

    return (
      <div ref={ref} className={cn('relative inline-flex', className)} {...props}>
        <button
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className="lg-glass lg-interactive lg-focus-ring w-10 h-10 flex items-center justify-center rounded-full border-0"
          aria-label={ariaLabel}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {trigger}
        </button>

        {isOpen && typeof document !== 'undefined' && createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={ariaLabel}
            className={cn(
              'lg-glass lg-glass-elevated lg-text',
              'fixed z-50 min-w-[180px] p-1.5',
              !reducedMotion && 'animate-[lg-scale-in_150ms_var(--lg-ease-spring)]'
            )}
            style={{
              top: position.top,
              left: position.left,
              borderRadius: 12,
              transformOrigin: align === 'end' ? 'top right' : 'top left',
            }}
          >
            {items.map((item, index) => {
              if (item === 'separator') {
                return (
                  <div
                    key={`sep-${index}`}
                    className="my-1.5 mx-2 border-t border-[var(--lg-separator)]"
                  />
                );
              }

              return (
                <button
                  key={index}
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg',
                    'border-0 bg-transparent text-left text-sm cursor-pointer',
                    'transition-colors',
                    item.destructive && 'text-[var(--lg-destructive)]',
                    item.disabled && 'opacity-40 cursor-default',
                    !item.disabled && 'hover:bg-[var(--lg-highlight)]'
                  )}
                  style={{ color: item.destructive ? undefined : 'var(--lg-foreground)' }}
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
      </div>
    );
  }
);

Menu.displayName = 'Menu';
