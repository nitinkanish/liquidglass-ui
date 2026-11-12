import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input aria-label="Text input" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const onValueChange = vi.fn();
    render(<Input aria-label="Text input" onValueChange={onValueChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    expect(onValueChange).toHaveBeenCalledWith('Hello');
  });

  it('is controlled when value prop is provided', () => {
    const { rerender } = render(<Input aria-label="Text input" value="Initial" />);
    expect(screen.getByRole('textbox')).toHaveValue('Initial');
    
    rerender(<Input aria-label="Text input" value="Updated" />);
    expect(screen.getByRole('textbox')).toHaveValue('Updated');
  });

  it('shows clear button when clearable and has value', () => {
    render(<Input aria-label="Text input" clearable defaultValue="Some text" />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('clears value when clear button is clicked', () => {
    const onValueChange = vi.fn();
    render(<Input aria-label="Text input" clearable defaultValue="Some text" onValueChange={onValueChange} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('renders with icon', () => {
    render(
      <Input 
        aria-label="Text input" 
        icon={<span data-testid="icon">Icon</span>} 
      />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input aria-label="Text input" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
