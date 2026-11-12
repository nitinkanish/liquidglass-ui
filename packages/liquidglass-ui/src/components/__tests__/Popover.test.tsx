import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from '../Popover';

describe('Popover', () => {
  it('renders trigger button', () => {
    render(
      <Popover content={<p>Popover content</p>}>
        <button>Open</button>
      </Popover>
    );
    
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
  });

  it('opens on click by default', async () => {
    render(
      <Popover content={<p>Popover content</p>}>
        <button>Open</button>
      </Popover>
    );
    
    await userEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('supports controlled open state', () => {
    render(
      <Popover content={<p>Popover content</p>} open={true} onOpenChange={() => {}}>
        <button>Open</button>
      </Popover>
    );
    
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('closes when clicking outside', async () => {
    const onOpenChange = vi.fn();
    render(
      <div>
        <Popover content={<p>Popover content</p>} open={true} onOpenChange={onOpenChange}>
          <button>Open</button>
        </Popover>
        <button>Outside</button>
      </div>
    );
    
    await userEvent.click(screen.getByText('Outside'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on Escape key', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover content={<p>Popover content</p>} open={true} onOpenChange={onOpenChange}>
        <button>Open</button>
      </Popover>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('has correct ARIA attributes', async () => {
    render(
      <Popover content={<p>Popover content</p>}>
        <button>Open</button>
      </Popover>
    );
    
    const trigger = screen.getByText('Open');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    
    await userEvent.click(screen.getByText('Open'));
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});
