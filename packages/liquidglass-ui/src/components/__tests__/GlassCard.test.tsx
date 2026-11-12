import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassCard } from '../GlassCard';

describe('GlassCard', () => {
  it('renders children', () => {
    render(<GlassCard>Card body</GlassCard>);
    expect(screen.getByText('Card body')).toBeInTheDocument();
  });

  it('applies glass class', () => {
    const { container } = render(<GlassCard>Glass</GlassCard>);
    expect(container.firstChild).toHaveClass('lg-glass');
  });

  it('supports elevated variant', () => {
    const { container } = render(<GlassCard variant="elevated">Elevated</GlassCard>);
    expect(container.firstChild).toHaveClass('lg-glass-elevated');
  });

  it('forwards className', () => {
    const { container } = render(<GlassCard className="custom-card">X</GlassCard>);
    expect(container.firstChild).toHaveClass('custom-card');
  });
});
