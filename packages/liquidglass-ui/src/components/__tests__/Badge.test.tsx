import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('supports variants', () => {
    const { rerender, container } = render(<Badge variant="secondary">Sec</Badge>);
    expect(container.firstChild).toBeTruthy();
    rerender(<Badge variant="outline">Out</Badge>);
    expect(screen.getByText('Out')).toBeInTheDocument();
  });
});
