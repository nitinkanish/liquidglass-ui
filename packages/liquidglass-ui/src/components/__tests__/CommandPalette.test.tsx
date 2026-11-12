import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette, CommandItem } from '../CommandPalette';

const mockItems: CommandItem[] = [
  { id: '1', label: 'Create File', description: 'Create a new file', onSelect: vi.fn(), group: 'files' },
  { id: '2', label: 'Open Settings', description: 'Open preferences', onSelect: vi.fn(), shortcut: '⌘,' },
  { id: '3', label: 'Delete File', description: 'Delete selected file', onSelect: vi.fn(), keywords: ['remove', 'trash'] },
];

describe('CommandPalette', () => {
  it('renders when open', () => {
    render(
      <CommandPalette open={true} onOpenChange={() => {}} items={mockItems} />
    );
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <CommandPalette open={false} onOpenChange={() => {}} items={mockItems} />
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows all items initially', () => {
    render(
      <CommandPalette open={true} onOpenChange={() => {}} items={mockItems} />
    );
    
    expect(screen.getByRole('option', { name: /create file/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /open settings/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /delete file/i })).toBeInTheDocument();
  });

  it('filters items by search query', async () => {
    render(
      <CommandPalette open={true} onOpenChange={() => {}} items={mockItems} />
    );
    
    await userEvent.type(screen.getByRole('combobox'), 'settings');
    
    expect(screen.queryByRole('option', { name: /create file/i })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: /open settings/i })).toBeInTheDocument();
  });

  it('searches by keywords', async () => {
    render(
      <CommandPalette open={true} onOpenChange={() => {}} items={mockItems} />
    );
    
    await userEvent.type(screen.getByRole('combobox'), 'trash');
    
    expect(screen.getByRole('option', { name: /delete file/i })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /create file/i })).not.toBeInTheDocument();
  });

  it('calls onSelect when item clicked', async () => {
    const onOpenChange = vi.fn();
    render(
      <CommandPalette open={true} onOpenChange={onOpenChange} items={mockItems} />
    );
    
    await userEvent.click(screen.getByRole('option', { name: /create file/i }));
    
    expect(mockItems[0].onSelect).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('supports keyboard navigation', () => {
    render(
      <CommandPalette open={true} onOpenChange={() => {}} items={mockItems} />
    );
    
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    expect(screen.getByRole('option', { name: /open settings/i })).toHaveAttribute('aria-selected', 'true');
    
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowUp' });
    expect(screen.getByRole('option', { name: /create file/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('selects item on Enter', () => {
    const onOpenChange = vi.fn();
    render(
      <CommandPalette open={true} onOpenChange={onOpenChange} items={mockItems} />
    );
    
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    
    expect(mockItems[0].onSelect).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on Escape', () => {
    const onOpenChange = vi.fn();
    render(
      <CommandPalette open={true} onOpenChange={onOpenChange} items={mockItems} />
    );
    
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows empty message when no results', async () => {
    render(
      <CommandPalette 
        open={true} 
        onOpenChange={() => {}} 
        items={mockItems}
        emptyMessage="Nothing found"
      />
    );
    
    await userEvent.type(screen.getByRole('combobox'), 'xyz123');
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });

  it('shows keyboard shortcut', () => {
    render(
      <CommandPalette open={true} onOpenChange={() => {}} items={mockItems} />
    );
    
    expect(screen.getByText('⌘,')).toBeInTheDocument();
  });
});
