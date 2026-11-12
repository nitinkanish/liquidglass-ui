import { forwardRef, HTMLAttributes, ReactNode, createContext, useContext, useState, CSSProperties } from 'react';
import { cn } from '../utils/cn';
import { useControllable } from '../hooks/use-controllable';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useId } from '../hooks/use-id';

interface TabsContextValue {
  value: string | undefined;
  onChange: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue,
      onValueChange,
      orientation = 'horizontal',
      children,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useControllable({
      value: controlledValue,
      defaultValue,
      onChange: onValueChange,
    });

    const baseId = useId();

    return (
      <TabsContext.Provider value={{ value, onChange: setValue, baseId }}>
        <div
          ref={ref}
          className={cn(
            orientation === 'vertical' && 'flex',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          'lg-glass inline-flex items-center gap-1 p-1 rounded-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled = false, children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');

    const { value: selectedValue, onChange, baseId } = context;
    const isSelected = selectedValue === value;
    const reducedMotion = useReducedMotion();

    return (
      <button
        ref={ref}
        role="tab"
        id={`${baseId}-trigger-${value}`}
        aria-selected={isSelected}
        aria-controls={`${baseId}-content-${value}`}
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        onClick={() => !disabled && onChange(value)}
        className={cn(
          'px-3 py-1.5 rounded-md text-sm font-medium',
          'border-0 bg-transparent cursor-pointer',
          'transition-colors',
          isSelected 
            ? 'bg-white text-[var(--lg-foreground)] shadow-sm' 
            : 'text-[var(--lg-muted)] hover:text-[var(--lg-foreground)]',
          disabled && 'opacity-50 cursor-default',
          className
        )}
        style={{
          transition: reducedMotion ? 'none' : 'all 150ms var(--lg-ease)',
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');

    const { value: selectedValue, baseId } = context;
    const isSelected = selectedValue === value;
    const reducedMotion = useReducedMotion();

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${baseId}-content-${value}`}
        aria-labelledby={`${baseId}-trigger-${value}`}
        tabIndex={0}
        className={cn(
          'mt-3 outline-none',
          !reducedMotion && 'animate-[lg-fade-in_150ms_ease-out]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';
