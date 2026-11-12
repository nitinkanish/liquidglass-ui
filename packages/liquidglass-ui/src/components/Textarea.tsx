import { forwardRef, TextareaHTMLAttributes, CSSProperties, useState } from 'react';
import { cn } from '../utils/cn';
import { useControllable } from '../hooks/use-controllable';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  error?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      style,
      value: controlledValue,
      defaultValue = '',
      onValueChange,
      error = false,
      resize = 'vertical',
      disabled,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useControllable({
      value: controlledValue,
      defaultValue,
      onChange: onValueChange,
    });

    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    };

    const containerStyles: CSSProperties = {
      borderRadius: 16,
      ...style,
    };

    return (
      <div
        className={cn(
          'lg-glass lg-text',
          'relative w-full max-w-[400px] p-3',
          'transition-colors',
          isFocused && 'bg-[var(--lg-glass-active)]',
          error && 'ring-2 ring-[var(--lg-destructive)]',
          disabled && 'opacity-35',
          className
        )}
        style={containerStyles}
      >
        <textarea
          ref={ref}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          rows={rows}
          className={cn(
            'w-full min-h-[60px]',
            'p-0 border-0 outline-none',
            'bg-transparent text-inherit',
            'placeholder:text-[var(--lg-muted)]',
            'leading-relaxed'
          )}
          style={{
            font: 'inherit',
            fontSize: 14,
            resize,
          }}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
