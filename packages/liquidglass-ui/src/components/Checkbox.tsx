import { forwardRef, InputHTMLAttributes, CSSProperties } from 'react';
import { cn } from '../utils/cn';
import { useControllableBoolean } from '../hooks/use-controllable';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'defaultChecked' | 'onChange' | 'size'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
}

const sizeConfig = {
  sm: { size: 16, iconSize: 10, borderRadius: 4 },
  md: { size: 20, iconSize: 12, borderRadius: 5 },
  lg: { size: 24, iconSize: 14, borderRadius: 6 },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      style,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      label,
      size = 'md',
      indeterminate = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [checked, setChecked] = useControllableBoolean({
      checked: controlledChecked,
      defaultChecked,
      onCheckedChange,
    });

    const config = sizeConfig[size];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked);
    };

    const boxStyles: CSSProperties = {
      width: config.size,
      height: config.size,
      borderRadius: config.borderRadius,
    };

    return (
      <label
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer',
          disabled && 'opacity-35 cursor-default',
          className
        )}
        style={style}
      >
        <span
          className={cn(
            'lg-glass relative flex items-center justify-center',
            'transition-colors',
            (checked || indeterminate) && 'bg-[var(--lg-accent)]'
          )}
          style={boxStyles}
        >
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            id={id}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0"
            {...props}
          />
          {(checked || indeterminate) && (
            <svg
              width={config.iconSize}
              height={config.iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {indeterminate ? (
                <line x1="5" y1="12" x2="19" y2="12" />
              ) : (
                <polyline points="20 6 9 17 4 12" />
              )}
            </svg>
          )}
        </span>
        {label && (
          <span className="text-sm" style={{ color: 'var(--lg-foreground)' }}>
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
