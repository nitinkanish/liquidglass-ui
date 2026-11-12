import { forwardRef, InputHTMLAttributes, ReactNode, CSSProperties, useState } from 'react';
import { cn } from '../utils/cn';
import { useControllable } from '../hooks/use-controllable';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'size'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  icon?: ReactNode;
  rightElement?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const sizeConfig = {
  sm: { height: 32, padding: '0 10px', fontSize: 13, iconSize: 14, borderRadius: 16 },
  md: { height: 40, padding: '0 14px', fontSize: 14, iconSize: 16, borderRadius: 20 },
  lg: { height: 48, padding: '0 18px', fontSize: 16, iconSize: 18, borderRadius: 24 },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      style,
      value: controlledValue,
      defaultValue = '',
      onValueChange,
      icon,
      rightElement,
      size = 'md',
      error = false,
      clearable = false,
      onClear,
      disabled,
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
    const config = sizeConfig[size];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    const handleClear = () => {
      setValue('');
      onClear?.();
    };

    const containerStyles: CSSProperties = {
      height: config.height,
      padding: config.padding,
      paddingLeft: icon ? config.height * 0.35 : undefined,
      paddingRight: (clearable && value) || rightElement ? config.height * 0.35 : undefined,
      fontSize: config.fontSize,
      borderRadius: config.borderRadius,
      ...style,
    };

    return (
      <div
        className={cn(
          'lg-glass lg-text',
          'relative flex items-center gap-2.5 w-full max-w-[360px]',
          'transition-colors',
          isFocused && 'bg-[var(--lg-glass-active)]',
          error && 'ring-2 ring-[var(--lg-destructive)]',
          disabled && 'opacity-35',
          className
        )}
        style={containerStyles}
      >
        {icon && (
          <span
            className="flex-none flex items-center justify-center text-[var(--lg-muted)]"
            style={{ width: config.iconSize, height: config.iconSize }}
          >
            {icon}
          </span>
        )}

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={cn(
            'flex-1 min-w-0 h-full',
            'p-0 border-0 outline-none',
            'bg-transparent text-inherit',
            'placeholder:text-[var(--lg-muted)]'
          )}
          style={{ font: 'inherit' }}
          {...props}
        />

        {clearable && value && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'flex-none flex items-center justify-center',
              'w-8 h-8 -mr-2 p-0 border-0 rounded-full',
              'bg-transparent text-[var(--lg-muted)] cursor-pointer',
              'hover:text-[var(--lg-foreground)]'
            )}
            aria-label="Clear"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </button>
        )}

        {rightElement && (
          <span className="flex-none">{rightElement}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
