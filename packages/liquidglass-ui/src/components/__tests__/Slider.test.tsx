import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Slider } from '../Slider';

describe('Slider', () => {
  it('renders a range input', () => {
    render(<Slider aria-label="Volume" defaultValue={40} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('respects defaultValue', () => {
    render(<Slider aria-label="Volume" defaultValue={40} />);
    expect(screen.getByRole('slider')).toHaveValue('40');
  });

  it('calls onValueChange when changed', () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Volume" defaultValue={0} onValueChange={onValueChange} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '55' } });
    expect(onValueChange).toHaveBeenCalledWith(55);
  });

  it('is controlled by value prop', () => {
    const { rerender } = render(<Slider aria-label="Volume" value={10} onValueChange={() => {}} />);
    expect(screen.getByRole('slider')).toHaveValue('10');
    rerender(<Slider aria-label="Volume" value={80} onValueChange={() => {}} />);
    expect(screen.getByRole('slider')).toHaveValue('80');
  });

  it('does not change when disabled', () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Volume" defaultValue={20} disabled onValueChange={onValueChange} />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });

  it('shows formatted value when showValue is true', () => {
    render(
      <Slider
        aria-label="Volume"
        defaultValue={25}
        showValue
        formatValue={(v) => `${v}%`}
      />
    );
    expect(screen.getByText('25%')).toBeInTheDocument();
  });
});
