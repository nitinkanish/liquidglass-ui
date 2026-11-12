import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = 'horizontal',
      decorative = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          'bg-[var(--lg-separator)]',
          orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';
