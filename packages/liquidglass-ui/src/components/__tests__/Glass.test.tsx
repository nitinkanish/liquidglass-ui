import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Glass } from '../Glass';
import { GlassContainer, computeBridges } from '../GlassContainer';

describe('Glass (Liquid Glass material)', () => {
  it('renders the regular material by default', () => {
    const { container } = render(<Glass>Hi</Glass>);
    expect(container.firstChild).toHaveClass('lg-glass');
    expect(container.firstChild).not.toHaveClass('lg-glass-clear');
  });

  it('supports the clear variant and the effect prop (effect wins)', () => {
    const { container, rerender } = render(<Glass variant="clear">x</Glass>);
    expect(container.firstChild).toHaveClass('lg-glass-clear');
    rerender(<Glass variant="elevated" effect="clear">x</Glass>);
    expect(container.firstChild).toHaveClass('lg-glass-clear');
    expect(container.firstChild).not.toHaveClass('lg-glass-elevated');
  });

  it('effect="none" marks the surface transparent', () => {
    const { container } = render(<Glass effect="none">x</Glass>);
    expect(container.firstChild).toHaveAttribute('data-effect', 'none');
  });

  it('tintColor sets the tint token without replacing the material', () => {
    const { container } = render(<Glass tintColor="#0a84ff">x</Glass>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('data-tinted');
    expect(el.style.getPropertyValue('--lg-tint-color')).toBe('#0a84ff');
    expect(el).toHaveClass('lg-glass');
  });

  it('colorScheme scopes light/dark tokens; system leaves it unset', () => {
    const { container, rerender } = render(<Glass colorScheme="dark">x</Glass>);
    expect(container.firstChild).toHaveAttribute('data-lg-scheme', 'dark');
    rerender(<Glass colorScheme="system">x</Glass>);
    expect(container.firstChild).not.toHaveAttribute('data-lg-scheme');
  });

  it('overLight, dim and elasticity expose data attributes', () => {
    const { container } = render(
      <Glass overLight dim elasticity={0.2}>x</Glass>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('data-over-light');
    expect(el).toHaveAttribute('data-dim');
    expect(el).toHaveAttribute('data-elastic');
  });

  it('animated=false and animationDuration drive the material transition token', () => {
    const { container, rerender } = render(<Glass animated={false}>x</Glass>);
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--lg-material-duration')).toBe('0ms');
    rerender(<Glass animationDuration={640}>x</Glass>);
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--lg-material-duration')).toBe('640ms');
  });

  it('interactive glass swells while pressed', () => {
    const { container } = render(<Glass interactive>x</Glass>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('data-live');
    fireEvent.pointerDown(el);
    expect(el).toHaveAttribute('data-pressed');
    fireEvent.pointerUp(el);
    expect(el).not.toHaveAttribute('data-pressed');
  });

  it('keeps user pointer handlers when interactive', () => {
    let downs = 0;
    const { container } = render(
      <Glass interactive onPointerDown={() => downs++}>x</Glass>
    );
    fireEvent.pointerDown(container.firstChild as HTMLElement);
    expect(downs).toBe(1);
  });
});

describe('GlassContainer merging', () => {
  it('joins neighbours closer than `spacing` with a narrowing neck', () => {
    const rects = [
      { left: 0, top: 0, width: 72, height: 72 },
      { left: 82, top: 0, width: 72, height: 72 },
    ];
    const near = computeBridges(rects, { left: 0, top: 0 }, 24, 'row');
    expect(near).toHaveLength(1);
    expect(near[0].width).toBe(12);

    const far = computeBridges(
      [rects[0], { left: 120, top: 0, width: 72, height: 72 }],
      { left: 0, top: 0 },
      24,
      'row'
    );
    expect(far).toHaveLength(0);
  });

  it('neck gets thicker as the gap closes', () => {
    const base = { left: 0, top: 0, width: 50, height: 50 };
    const [wide] = computeBridges([base, { ...base, left: 60 }], { left: 0, top: 0 }, 30, 'row');
    const [tight] = computeBridges([base, { ...base, left: 54 }], { left: 0, top: 0 }, 30, 'row');
    expect(tight.height).toBeGreaterThan(wide.height);
  });

  it('supports column direction', () => {
    const rects = [
      { left: 0, top: 0, width: 40, height: 40 },
      { left: 0, top: 48, width: 40, height: 40 },
    ];
    expect(computeBridges(rects, { left: 0, top: 0 }, 20, 'column')).toHaveLength(1);
  });

  it('renders children in a flex container with the requested gap', () => {
    render(
      <GlassContainer gap={12} data-testid="c">
        <span>a</span>
        <span>b</span>
      </GlassContainer>
    );
    const el = screen.getByTestId('c');
    expect(el).toHaveClass('lg-glass-container');
    expect(el.style.gap).toBe('12px');
  });
});
