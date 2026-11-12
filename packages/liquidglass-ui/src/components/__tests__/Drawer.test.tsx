import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Drawer } from '../Drawer';

describe('Drawer', () => {
  it('renders when open', () => {
    render(
      <Drawer open onOpenChange={() => {}} title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>
    );
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Drawer')).toBeInTheDocument();
    expect(screen.getByText('Drawer content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Drawer open={false} onOpenChange={() => {}} title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when close button clicked', async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange} title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>
    );
    
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange when backdrop clicked', async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange} title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>
    );
    
    const backdropOverlay = document.body.querySelector('.fixed.inset-0.z-50');
    if (backdropOverlay) {
      fireEvent.click(backdropOverlay);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    }
  });

  it('calls onOpenChange on Escape key', () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange} title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders from different sides', () => {
    const { rerender } = render(
      <Drawer open onOpenChange={() => {}} side="left">
        <p>Content</p>
      </Drawer>
    );
    
    expect(screen.getByRole('dialog')).toHaveStyle({ left: '0px' });

    rerender(
      <Drawer open onOpenChange={() => {}} side="right">
        <p>Content</p>
      </Drawer>
    );
    
    expect(screen.getByRole('dialog')).toHaveStyle({ right: '0px' });
  });

  it('has proper ARIA attributes', () => {
    render(
      <Drawer open onOpenChange={() => {}} title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
