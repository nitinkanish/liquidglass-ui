import { forwardRef, HTMLAttributes, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useId } from '../hooks/use-id';

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'value' | 'defaultValue' | 'onChange'> {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  formatDate?: (date: Date) => string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && 
         a.getMonth() === b.getMonth() && 
         a.getDate() === b.getDate();
}

function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  return false;
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      className,
      style,
      value: controlledValue,
      defaultValue,
      onValueChange,
      placeholder = 'Select date',
      disabled = false,
      minDate,
      maxDate,
      locale = 'en-US',
      formatDate = (date) => date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }),
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<Date | null>(defaultValue || null);
    const value = controlledValue !== undefined ? controlledValue : internalValue;
    
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => value || new Date());
    const [focusedDate, setFocusedDate] = useState<Date | null>(null);
    
    const triggerRef = useRef<HTMLButtonElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const inputId = useId();
    const calendarId = useId();

    const setValue = useCallback((date: Date | null) => {
      if (controlledValue === undefined) {
        setInternalValue(date);
      }
      onValueChange?.(date);
    }, [controlledValue, onValueChange]);

    const handleDateSelect = (date: Date) => {
      if (isDateDisabled(date, minDate, maxDate)) return;
      setValue(date);
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    const handlePrevMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
          return;
        }

        if (!focusedDate) return;

        const newDate = new Date(focusedDate);

        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            newDate.setDate(newDate.getDate() - 1);
            setFocusedDate(newDate);
            if (newDate.getMonth() !== viewDate.getMonth()) {
              setViewDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
            }
            break;
          case 'ArrowRight':
            e.preventDefault();
            newDate.setDate(newDate.getDate() + 1);
            setFocusedDate(newDate);
            if (newDate.getMonth() !== viewDate.getMonth()) {
              setViewDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            newDate.setDate(newDate.getDate() - 7);
            setFocusedDate(newDate);
            if (newDate.getMonth() !== viewDate.getMonth()) {
              setViewDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
            }
            break;
          case 'ArrowDown':
            e.preventDefault();
            newDate.setDate(newDate.getDate() + 7);
            setFocusedDate(newDate);
            if (newDate.getMonth() !== viewDate.getMonth()) {
              setViewDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
            }
            break;
        }
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (
          !triggerRef.current?.contains(e.target as Node) &&
          !calendarRef.current?.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      setFocusedDate(value || new Date());
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, value]);

    useEffect(() => {
      if (isOpen && triggerRef.current && calendarRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        calendarRef.current.style.top = `${rect.bottom + window.scrollY + 8}px`;
        calendarRef.current.style.left = `${rect.left + window.scrollX}px`;
      }
    }, [isOpen]);

    const days = useMemo(() => {
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const firstDay = getFirstDayOfMonth(year, month);
      
      const days: (Date | null)[] = [];
      
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }
      
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }
      
      return days;
    }, [viewDate]);

    const today = new Date();

    return (
      <div ref={ref} className={cn('relative inline-block', className)} style={style} {...props}>
        <button
          ref={triggerRef}
          type="button"
          id={inputId}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-controls={isOpen ? calendarId : undefined}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'lg-glass lg-interactive lg-focus-ring lg-text',
            'flex items-center gap-2 h-10 px-4 w-full max-w-[280px]',
            'border-0 text-left cursor-pointer',
            disabled && 'opacity-35 cursor-default'
          )}
          style={{ borderRadius: 20 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--lg-muted)" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className={value ? '' : 'text-[var(--lg-muted)]'}>
            {value ? formatDate(value) : placeholder}
          </span>
        </button>

        {isOpen && typeof document !== 'undefined' && createPortal(
          <div
            ref={calendarRef}
            id={calendarId}
            role="dialog"
            aria-modal="true"
            aria-label="Choose date"
            className={cn(
              'lg-glass lg-glass-elevated lg-text',
              'fixed z-50 p-4',
              !reducedMotion && 'animate-[lg-scale-in_150ms_var(--lg-ease-spring)]'
            )}
            style={{
              borderRadius: 16,
              width: 300,
              transformOrigin: 'top left',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  'border-0 bg-transparent cursor-pointer',
                  'hover:bg-[var(--lg-glass)] transition-colors'
                )}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span className="font-medium">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                onClick={handleNextMonth}
                aria-label="Next month"
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  'border-0 bg-transparent cursor-pointer',
                  'hover:bg-[var(--lg-glass)] transition-colors'
                )}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-[var(--lg-muted)] py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1" role="grid">
              {days.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} />;
                }

                const isSelected = isSameDay(date, value);
                const isFocused = isSameDay(date, focusedDate);
                const isToday = isSameDay(date, today);
                const isDisabled = isDateDisabled(date, minDate, maxDate);

                return (
                  <button
                    key={date.toISOString()}
                    role="gridcell"
                    aria-selected={isSelected}
                    aria-current={isToday ? 'date' : undefined}
                    tabIndex={isFocused ? 0 : -1}
                    disabled={isDisabled}
                    onClick={() => handleDateSelect(date)}
                    onFocus={() => setFocusedDate(date)}
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center',
                      'border-0 text-sm cursor-pointer transition-colors',
                      isSelected && 'bg-[var(--lg-accent)] text-white',
                      !isSelected && isToday && 'ring-1 ring-[var(--lg-accent)]',
                      !isSelected && !isDisabled && 'hover:bg-[var(--lg-glass)]',
                      isFocused && !isSelected && 'bg-[var(--lg-highlight)]',
                      isDisabled && 'opacity-30 cursor-default'
                    )}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Today button */}
            <button
              onClick={() => {
                const now = new Date();
                setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
                handleDateSelect(now);
              }}
              className={cn(
                'w-full mt-4 py-2 rounded-lg',
                'border-0 text-sm font-medium cursor-pointer',
                'bg-[var(--lg-glass)] hover:bg-[var(--lg-glass-active)]',
                'transition-colors'
              )}
            >
              Today
            </button>
          </div>,
          document.body
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
