import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseControllableOptions<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

export function useControllable<T>(
  options: UseControllableOptions<T>
): [T | undefined, (value: T) => void, boolean] {
  const { value: controlledValue, defaultValue, onChange } = options;
  
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(defaultValue);
  
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback((newValue: T) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onChange?.(newValue);
  }, [isControlled, onChange]);

  return [value, setValue, isControlled];
}

export function useControllableBoolean(
  options: {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
): [boolean, (checked: boolean) => void, boolean] {
  const { checked, defaultChecked = false, onCheckedChange } = options;
  
  const isControlled = checked !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultChecked);
  
  const value = isControlled ? checked : uncontrolledValue;

  const setValue = useCallback((newValue: boolean) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onCheckedChange?.(newValue);
  }, [isControlled, onCheckedChange]);

  return [value, setValue, isControlled];
}
