import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text content', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="glass">Glass</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'glass');

    rerender(<Button variant="filled">Filled</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'filled');
  });

  it('renders with icon', () => {
    render(
      <Button icon={<span data-testid="icon">Icon</span>}>With Icon</Button>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('data-icon', 'with-text');
  });

  it('renders icon-only button', () => {
    render(
      <Button icon={<span data-testid="icon">Icon</span>} aria-label="Icon button" />
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-icon', 'only');
  });

  it('shows loading spinner when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('has destructive styling when destructive prop is true', () => {
    render(<Button destructive>Delete</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-destructive', '');
  });
});
