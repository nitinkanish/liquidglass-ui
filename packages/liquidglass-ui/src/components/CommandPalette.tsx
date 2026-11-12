import { forwardRef, HTMLAttributes, ReactNode, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useId } from '../hooks/use-id';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  shortcut?: string;
  onSelect: () => void;
  keywords?: string[];
  group?: string;
  disabled?: boolean;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
  groups?: Record<string, string>;
}

export function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = 'Type a command or search...',
  emptyMessage = 'No results found.',
  groups = {},
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const dialogId = useId();
  const listboxId = useId();

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items.filter(item => !item.disabled);
    
    const lowerQuery = query.toLowerCase();
    return items.filter(item => {
      if (item.disabled) return false;
      
      const matchLabel = item.label.toLowerCase().includes(lowerQuery);
      const matchDesc = item.description?.toLowerCase().includes(lowerQuery);
      const matchKeywords = item.keywords?.some(k => k.toLowerCase().includes(lowerQuery));
      
      return matchLabel || matchDesc || matchKeywords;
    });
  }, [items, query]);

  const groupedItems = useMemo(() => {
    const grouped: Record<string, CommandItem[]> = {};
    
    filteredItems.forEach(item => {
      const group = item.group || '_default';
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(item);
    });
    
    return grouped;
  }, [filteredItems]);

  const flattenedItems = useMemo(() => {
    return Object.values(groupedItems).flat();
  }, [groupedItems]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setQuery('');
    setSelectedIndex(0);
  }, [onOpenChange]);

  const handleSelect = useCallback((item: CommandItem) => {
    item.onSelect();
    handleClose();
  }, [handleClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < flattenedItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : flattenedItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (flattenedItems[selectedIndex]) {
          handleSelect(flattenedItems[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
    }
  }, [flattenedItems, selectedIndex, handleSelect, handleClose]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      
      document.addEventListener('keydown', handleGlobalKeyDown);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleGlobalKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [open, handleClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const selectedElement = listRef.current?.querySelector('[data-selected="true"]');
    selectedElement?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!open) return null;

  const content = (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-start justify-center pt-[15vh]',
        'bg-black/40 backdrop-blur-sm',
        !reducedMotion && 'animate-[lg-fade-in_150ms_ease-out]'
      )}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogId}
        className={cn(
          'lg-glass lg-glass-elevated lg-text',
          'w-full max-w-[540px] overflow-hidden',
          !reducedMotion && 'animate-[lg-scale-in_150ms_var(--lg-ease-spring)]'
        )}
        style={{ borderRadius: 16 }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--lg-separator)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lg-muted)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={flattenedItems[selectedIndex]?.id}
            className={cn(
              'flex-1 bg-transparent border-0 outline-none',
              'text-base placeholder:text-[var(--lg-muted)]'
            )}
            style={{ color: 'var(--lg-foreground)' }}
          />
          <kbd className="px-2 py-0.5 text-xs rounded bg-[var(--lg-glass)] text-[var(--lg-muted)]">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div
          ref={listRef}
          role="listbox"
          id={listboxId}
          className="max-h-[300px] overflow-auto p-2"
        >
          {flattenedItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[var(--lg-muted)]">
              {emptyMessage}
            </div>
          ) : (
            Object.entries(groupedItems).map(([group, groupItems]) => (
              <div key={group}>
                {group !== '_default' && groups[group] && (
                  <div className="px-3 py-2 text-xs font-medium text-[var(--lg-muted)] uppercase tracking-wider">
                    {groups[group]}
                  </div>
                )}
                {groupItems.map((item) => {
                  const isSelected = flattenedItems[selectedIndex]?.id === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      id={item.id}
                      role="option"
                      aria-selected={isSelected}
                      data-selected={isSelected}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(flattenedItems.indexOf(item))}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                        'border-0 bg-transparent text-left cursor-pointer',
                        'transition-colors',
                        isSelected && 'bg-[var(--lg-highlight)]'
                      )}
                    >
                      {item.icon && (
                        <span className="flex-shrink-0 w-5 h-5 text-[var(--lg-muted)]">
                          {item.icon}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ color: 'var(--lg-foreground)' }}>
                          {item.label}
                        </div>
                        {item.description && (
                          <div className="text-xs text-[var(--lg-muted)] truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                      {item.shortcut && (
                        <kbd className="px-2 py-0.5 text-xs rounded bg-[var(--lg-glass)] text-[var(--lg-muted)]">
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
