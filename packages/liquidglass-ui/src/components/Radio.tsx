import { forwardRef, InputHTMLAttributes, createContext, useContext, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useControllable } from '../hooks/use-controllable';

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  size: 'sm' | 'md' | 'lg';
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  children: ReactNode;
  name: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function RadioGroup({
  children,
  name,
  value: controlledValue,
  defaultValue,
  onValueChange,
  disabled,
  size = 'md',
  orientation = 'vertical',
  className,
}: RadioGroupProps) {
  const [value, setValue] = useControllable({
    value: controlledValue,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <RadioGroupContext.Provider
      value={{
        name,
        value,
        onChange: setValue,
        disabled,
        size,
      }}
    >
      <div
        role="radiogroup"
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row gap-4',
          className
        )}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { size: 16, dotSize: 6 },
  md: { size: 20, dotSize: 8 },
  lg: { size: 24, dotSize: 10 },
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      style,
      label,
      size: sizeProp,
      value,
      disabled: disabledProp,
      ...props
    },
    ref
  ) => {
    const group = useContext(RadioGroupContext);
    const size = sizeProp ?? group?.size ?? 'md';
    const disabled = disabledProp ?? group?.disabled;
    const isChecked = group ? group.value === value : false;
    const config = sizeConfig[size];

    const handleChange = () => {
      if (group && value !== undefined) {
        group.onChange(value as string);
      }
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
            'lg-glass relative flex items-center justify-center rounded-full',
            'transition-colors',
            isChecked && 'bg-[var(--lg-accent)]'
          )}
          style={{
            width: config.size,
            height: config.size,
          }}
        >
          <input
            ref={ref}
            type="radio"
            name={group?.name}
            value={value}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0"
            {...props}
          />
          {isChecked && (
            <span
              className="rounded-full bg-white"
              style={{
                width: config.dotSize,
                height: config.dotSize,
              }}
            />
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

Radio.displayName = 'Radio';
