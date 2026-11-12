import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePicker } from '../DatePicker';

describe('DatePicker', () => {
  it('renders with placeholder', () => {
    render(<DatePicker placeholder="Pick a date" />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('opens calendar on click', () => {
    render(<DatePicker />);
    
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays formatted date when value set', () => {
    const date = new Date(2026, 5, 15);
    render(<DatePicker value={date} />);
    
    expect(screen.getByText(/june 15, 2026/i)).toBeInTheDocument();
  });

  it('closes on date selection', () => {
    render(<DatePicker />);
    
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('gridcell', { name: '15' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape key', () => {
    render(<DatePicker />);
    
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<DatePicker disabled />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
  });

  it('supports custom date formatter', () => {
    const date = new Date(2026, 5, 15);
    const formatDate = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    
    render(<DatePicker value={date} formatDate={formatDate} />);
    
    expect(screen.getByText('15/6/2026')).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(<DatePicker />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Choose date');
  });

  it('calls onValueChange when date selected', () => {
    const onValueChange = vi.fn();
    render(<DatePicker onValueChange={onValueChange} />);
    
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('gridcell', { name: '15' }));
    
    expect(onValueChange).toHaveBeenCalled();
    const selectedDate = onValueChange.mock.calls[0][0];
    expect(selectedDate.getDate()).toBe(15);
  });
});
