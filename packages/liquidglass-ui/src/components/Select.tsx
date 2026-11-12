import { forwardRef, ButtonHTMLAttributes, ReactNode, CSSProperties, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { useControllable } from '../hooks/use-controllable';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useId } from '../hooks/use-id';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
}

const sizeConfig = {
  sm: { height: 32, padding: '0 10px', fontSize: 13, borderRadius: 16 },
  md: { height: 40, padding: '0 14px', fontSize: 14, borderRadius: 20 },
  lg: { height: 48, padding: '0 18px', fontSize: 16, borderRadius: 24 },
};

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      className,
      style,
      options,
      value: controlledValue,
      defaultValue,
      onValueChange,
      placeholder = 'Select an option',
      size = 'md',
      error = false,
      disabled,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useControllable({
      value: controlledValue,
      defaultValue,
      onChange: onValueChange,
    });

    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const id = useId(providedId);
    const menuId = `${id}-menu`;

    const config = sizeConfig[size];
    const selectedOption = options.find(opt => opt.value === value);

    const updateMenuPosition = useCallback(() => {
      if (!triggerRef.current || !menuRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      menuRef.current.style.top = `${rect.bottom + window.scrollY + 4}px`;
      menuRef.current.style.left = `${rect.left + window.scrollX}px`;
      menuRef.current.style.width = `${rect.width}px`;
    }, []);

    useEffect(() => {
      if (isOpen) {
        updateMenuPosition();
        window.addEventListener('scroll', updateMenuPosition, true);
        window.addEventListener('resize', updateMenuPosition);
      }

      return () => {
        window.removeEventListener('scroll', updateMenuPosition, true);
        window.removeEventListener('resize', updateMenuPosition);
      };
    }, [isOpen, updateMenuPosition]);

    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (
          triggerRef.current?.contains(e.target as Node) ||
          menuRef.current?.contains(e.target as Node)
        ) {
          return;
        }
        setIsOpen(false);
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
      setValue(optionValue);
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            const option = options[focusedIndex];
            if (!option.disabled) handleSelect(option.value);
          } else {
            setIsOpen(true);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setFocusedIndex(prev => {
              let next = prev + 1;
              while (next < options.length && options[next].disabled) next++;
              return next < options.length ? next : prev;
            });
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => {
            let next = prev - 1;
            while (next >= 0 && options[next].disabled) next--;
            return next >= 0 ? next : prev;
          });
          break;
      }
    };

    const triggerStyles: CSSProperties = {
      height: config.height,
      padding: config.padding,
      fontSize: config.fontSize,
      borderRadius: config.borderRadius,
      ...style,
    };

    return (
      <>
        <button
          ref={(node) => {
            (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={isOpen ? menuId : undefined}
          id={id}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            'lg-glass lg-interactive lg-focus-ring lg-text',
            'flex items-center justify-between gap-2 w-full max-w-[360px]',
            'border-0 text-left cursor-pointer',
            error && 'ring-2 ring-[var(--lg-destructive)]',
            disabled && 'opacity-35 cursor-default',
            className
          )}
          style={triggerStyles}
          {...props}
        >
          <span className={selectedOption ? '' : 'text-[var(--lg-muted)]'}>
            {selectedOption?.label ?? placeholder}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={cn(
              'transition-transform',
              isOpen && 'rotate-180'
            )}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {isOpen && typeof document !== 'undefined' && createPortal(
          <div
            ref={menuRef}
            role="listbox"
            id={menuId}
            aria-labelledby={id}
            className={cn(
              'lg-glass lg-glass-elevated lg-text',
              'fixed z-50 py-1.5 overflow-auto max-h-[300px]',
              !reducedMotion && 'animate-[lg-scale-in_150ms_ease-out]'
            )}
            style={{
              borderRadius: 12,
              transformOrigin: 'top center',
            }}
          >
            {options.map((option, index) => (
              <button
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                disabled={option.disabled}
                onClick={() => !option.disabled && handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2',
                  'border-0 bg-transparent text-left cursor-pointer',
                  'transition-colors',
                  option.value === value && 'font-medium',
                  focusedIndex === index && 'bg-[var(--lg-highlight)]',
                  option.disabled && 'opacity-35 cursor-default'
                )}
                style={{ fontSize: config.fontSize }}
              >
                <span className="flex-1">{option.label}</span>
                {option.value === value && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--lg-accent)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>,
          document.body
        )}
      </>
    );
  }
);

Select.displayName = 'Select';
