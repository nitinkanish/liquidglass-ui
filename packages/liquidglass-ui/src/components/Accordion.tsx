import { forwardRef, HTMLAttributes, ReactNode, createContext, useContext, useState, useCallback } from 'react';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useId } from '../hooks/use-id';

interface AccordionContextValue {
  expandedItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  collapsible?: boolean;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      type = 'single',
      defaultValue,
      collapsible = true,
      children,
      ...props
    },
    ref
  ) => {
    const [expandedItems, setExpandedItems] = useState<string[]>(() => {
      if (defaultValue) {
        return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      }
      return [];
    });

    const toggleItem = useCallback((value: string) => {
      setExpandedItems(prev => {
        const isExpanded = prev.includes(value);
        
        if (type === 'single') {
          if (isExpanded && collapsible) return [];
          if (isExpanded && !collapsible) return prev;
          return [value];
        }

        if (isExpanded) {
          return prev.filter(v => v !== value);
        }
        return [...prev, value];
      });
    }, [type, collapsible]);

    return (
      <AccordionContext.Provider value={{ expandedItems, toggleItem, type }}>
        <div
          ref={ref}
          className={cn('divide-y divide-[var(--lg-separator)]', className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = 'Accordion';

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

interface AccordionItemContextValue {
  value: string;
  isExpanded: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled = false, children, ...props }, ref) => {
    const context = useContext(AccordionContext);
    if (!context) throw new Error('AccordionItem must be used within Accordion');

    const isExpanded = context.expandedItems.includes(value);
    const id = useId();
    const triggerId = `${id}-trigger`;
    const contentId = `${id}-content`;

    return (
      <AccordionItemContext.Provider
        value={{ value, isExpanded, disabled, triggerId, contentId }}
      >
        <div
          ref={ref}
          className={cn(disabled && 'opacity-50', className)}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const accordionContext = useContext(AccordionContext);
    const itemContext = useContext(AccordionItemContext);
    const reducedMotion = useReducedMotion();

    if (!accordionContext || !itemContext) {
      throw new Error('AccordionTrigger must be used within AccordionItem');
    }

    const { toggleItem } = accordionContext;
    const { value, isExpanded, disabled, triggerId, contentId } = itemContext;

    return (
      <button
        ref={ref}
        id={triggerId}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        disabled={disabled}
        onClick={() => !disabled && toggleItem(value)}
        className={cn(
          'flex w-full items-center justify-between py-4 px-1',
          'text-left font-medium text-sm',
          'border-0 bg-transparent cursor-pointer',
          'hover:bg-[var(--lg-glass)] transition-colors rounded-lg -mx-1',
          disabled && 'cursor-default',
          className
        )}
        style={{ color: 'var(--lg-foreground)' }}
        {...props}
      >
        {children}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={cn(
            !reducedMotion && 'transition-transform duration-200'
          )}
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    );
  }
);

AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const itemContext = useContext(AccordionItemContext);
    const reducedMotion = useReducedMotion();

    if (!itemContext) {
      throw new Error('AccordionContent must be used within AccordionItem');
    }

    const { isExpanded, triggerId, contentId } = itemContext;

    if (!isExpanded) return null;

    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        className={cn(
          'pb-4 text-sm',
          !reducedMotion && 'animate-[lg-slide-up_200ms_ease-out]',
          className
        )}
        style={{ color: 'var(--lg-foreground-secondary)' }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AccordionContent.displayName = 'AccordionContent';
