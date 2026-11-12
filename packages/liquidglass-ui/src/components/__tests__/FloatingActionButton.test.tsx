import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FloatingActionButton, FAB } from '../FloatingActionButton';

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" data-testid="plus-icon">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

describe('FloatingActionButton', () => {
  it('renders with icon', () => {
    render(<FAB icon={<PlusIcon />} aria-label="Add item" />);
    
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const onClick = vi.fn();
    render(<FAB icon={<PlusIcon />} aria-label="Add item" onClick={onClick} />);
    
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('supports extended variant with label', () => {
    render(<FAB icon={<PlusIcon />} aria-label="Add item" extended label="Add Item" />);
    
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('renders in different sizes', () => {
    const { rerender } = render(<FAB icon={<PlusIcon />} aria-label="Add" size="sm" />);
    expect(screen.getByRole('button')).toHaveStyle({ height: '40px' });

    rerender(<FAB icon={<PlusIcon />} aria-label="Add" size="md" />);
    expect(screen.getByRole('button')).toHaveStyle({ height: '56px' });

    rerender(<FAB icon={<PlusIcon />} aria-label="Add" size="lg" />);
    expect(screen.getByRole('button')).toHaveStyle({ height: '72px' });
  });

  it('renders at different positions', () => {
    const { rerender } = render(
      <FAB icon={<PlusIcon />} aria-label="Add" position="bottom-right" />
    );
    expect(screen.getByRole('button')).toHaveStyle({ bottom: '24px', right: '24px' });

    rerender(<FAB icon={<PlusIcon />} aria-label="Add" position="bottom-left" />);
    expect(screen.getByRole('button')).toHaveStyle({ bottom: '24px', left: '24px' });

    rerender(<FAB icon={<PlusIcon />} aria-label="Add" position="top-right" />);
    expect(screen.getByRole('button')).toHaveStyle({ top: '24px', right: '24px' });
  });

  it('supports different variants', () => {
    const { rerender } = render(
      <FAB icon={<PlusIcon />} aria-label="Add" variant="primary" />
    );
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--lg-accent)]');

    rerender(<FAB icon={<PlusIcon />} aria-label="Add" variant="glass" />);
    expect(screen.getByRole('button')).toHaveClass('lg-glass');
  });

  it('handles disabled state', async () => {
    const onClick = vi.fn();
    render(<FAB icon={<PlusIcon />} aria-label="Add item" disabled onClick={onClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
    
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('exports FAB as alias', () => {
    expect(FAB).toBe(FloatingActionButton);
  });
});
