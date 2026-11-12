import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextMenu, ContextMenuEntry, ContextMenuItem } from '../ContextMenu';

const createMockItems = () => [
  { label: 'Copy', onSelect: vi.fn() },
  { label: 'Paste', onSelect: vi.fn() },
  'separator' as const,
  { label: 'Delete', onSelect: vi.fn(), destructive: true },
] as ContextMenuEntry[];

describe('ContextMenu', () => {
  it('shows menu on right click', async () => {
    const mockItems = createMockItems();
    render(
      <ContextMenu items={mockItems}>
        <div>Right click me</div>
      </ContextMenu>
    );
    
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    
    fireEvent.contextMenu(screen.getByText('Right click me'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders all menu items', () => {
    const mockItems = createMockItems();
    render(
      <ContextMenu items={mockItems}>
        <div>Right click me</div>
      </ContextMenu>
    );
    
    fireEvent.contextMenu(screen.getByText('Right click me'));
    
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Paste' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
  });

  it('calls onSelect when item clicked', async () => {
    const mockItems = createMockItems();
    render(
      <ContextMenu items={mockItems}>
        <div>Right click me</div>
      </ContextMenu>
    );
    
    fireEvent.contextMenu(screen.getByText('Right click me'));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Copy' }));
    
    expect((mockItems[0] as ContextMenuItem).onSelect).toHaveBeenCalled();
  });

  it('closes menu on Escape', () => {
    const mockItems = createMockItems();
    render(
      <ContextMenu items={mockItems}>
        <div>Right click me</div>
      </ContextMenu>
    );
    
    fireEvent.contextMenu(screen.getByText('Right click me'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation', () => {
    const mockItems = createMockItems();
    render(
      <ContextMenu items={mockItems}>
        <div>Right click me</div>
      </ContextMenu>
    );
    
    fireEvent.contextMenu(screen.getByText('Right click me'));
    
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveAttribute('data-selected', 'true');
    
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Paste' })).toHaveAttribute('data-selected', 'true');
    
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveAttribute('data-selected', 'true');
  });

  it('handles disabled items', async () => {
    const disabledItem: ContextMenuItem = { label: 'Disabled', onSelect: vi.fn(), disabled: true };
    render(
      <ContextMenu items={[disabledItem]}>
        <div>Right click me</div>
      </ContextMenu>
    );
    
    fireEvent.contextMenu(screen.getByText('Right click me'));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Disabled' }));
    
    expect(disabledItem.onSelect).not.toHaveBeenCalled();
  });
});
