import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from '../SegmentedControl';

const items = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

describe('SegmentedControl', () => {
  it('renders radios', () => {
    render(<SegmentedControl items={items} aria-label="Range" />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('selects first item by default', () => {
    render(<SegmentedControl items={items} aria-label="Range" />);
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onValueChange on click', async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl items={items} aria-label="Range" onValueChange={onValueChange} />
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Week' }));
    expect(onValueChange).toHaveBeenCalledWith('week');
  });

  it('supports controlled value', () => {
    const { rerender } = render(
      <SegmentedControl items={items} aria-label="Range" value="day" onValueChange={() => {}} />
    );
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
    rerender(
      <SegmentedControl items={items} aria-label="Range" value="month" onValueChange={() => {}} />
    );
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('aria-checked', 'true');
  });

  it('supports uncontrolled defaultValue', async () => {
    render(<SegmentedControl items={items} aria-label="Range2" defaultValue="week" />);
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('radio', { name: 'Month' }));
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('aria-checked', 'true');
  });

  it('moves with arrow keys and skips disabled', async () => {
    const onValueChange = vi.fn();
    const mixed = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
      { value: 'c', label: 'C' },
    ];
    render(
      <SegmentedControl
        items={mixed}
        aria-label="Mixed"
        value="a"
        onValueChange={onValueChange}
      />
    );
    screen.getByRole('radio', { name: 'A' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalledWith('c');
  });

  it('keeps indicator data-index in sync', async () => {
    render(<SegmentedControl items={items} aria-label="Range" defaultValue="day" />);
    expect(screen.getByTestId('segmented-indicator')).toHaveAttribute('data-index', '0');
    await userEvent.click(screen.getByRole('radio', { name: 'Month' }));
    expect(screen.getByTestId('segmented-indicator')).toHaveAttribute('data-index', '2');
  });
});
