import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders with correct role', () => {
    render(<Switch aria-label="Toggle" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<Switch aria-label="Toggle" />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('respects defaultChecked prop', () => {
    render(<Switch aria-label="Toggle" defaultChecked />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles when clicked', () => {
    render(<Switch aria-label="Toggle" />);
    const switchEl = screen.getByRole('switch');
    
    expect(switchEl).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(switchEl);
    expect(switchEl).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(switchEl);
    expect(switchEl).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onCheckedChange when toggled', () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Toggle" onCheckedChange={onCheckedChange} />);
    
    fireEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('is controlled when checked prop is provided', () => {
    const { rerender } = render(<Switch aria-label="Toggle" checked={false} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    
    rerender(<Switch aria-label="Toggle" checked={true} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('does not toggle when disabled', () => {
    render(<Switch aria-label="Toggle" disabled />);
    const switchEl = screen.getByRole('switch');
    
    expect(switchEl).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(switchEl);
    expect(switchEl).toHaveAttribute('aria-checked', 'false');
  });
});
