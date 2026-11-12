import { forwardRef } from 'react';
import { Input, InputProps } from './Input';

export type SearchFieldProps = Omit<InputProps, 'type' | 'icon'>;

const SearchIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ placeholder = 'Search', clearable = true, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        icon={<SearchIcon />}
        clearable={clearable}
        {...props}
      />
    );
  }
);

SearchField.displayName = 'SearchField';
