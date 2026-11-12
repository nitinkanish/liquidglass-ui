import { forwardRef, HTMLAttributes, ReactNode, createContext, useContext, useState, useCallback } from 'react';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';

interface SidebarContextValue {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export interface SidebarProviderProps {
  children: ReactNode;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({ children, defaultCollapsed = false }: SidebarProviderProps) {
  const [isCollapsed, setCollapsed] = useState(defaultCollapsed);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  width?: number;
  collapsedWidth?: number;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      className,
      style,
      children,
      width = 260,
      collapsedWidth = 72,
      ...props
    },
    ref
  ) => {
    const { isCollapsed } = useSidebar();
    const reducedMotion = useReducedMotion();

    return (
      <aside
        ref={ref}
        className={cn(
          'lg-glass lg-text',
          'h-full flex flex-col',
          'border-r border-[var(--lg-separator)]',
          className
        )}
        style={{
          width: isCollapsed ? collapsedWidth : width,
          transition: reducedMotion ? 'none' : 'width 200ms var(--lg-ease)',
          ...style,
        }}
        {...props}
      >
        {children}
      </aside>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center h-16 px-4',
          'border-b border-[var(--lg-separator)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SidebarHeader.displayName = 'SidebarHeader';

export interface SidebarContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1 overflow-auto p-3', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SidebarContent.displayName = 'SidebarContent';

export interface SidebarItemProps {
  icon?: ReactNode;
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ className, icon, label, active = false, href, onClick, ...props }, ref) => {
    const { isCollapsed } = useSidebar();

    const sharedProps = {
      className: cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
        'border-0 text-left text-sm font-medium',
        'transition-colors cursor-pointer no-underline',
        active
          ? 'bg-[var(--lg-accent-light)] text-[var(--lg-accent)]'
          : 'bg-transparent text-[var(--lg-foreground-secondary)] hover:bg-[var(--lg-glass)] hover:text-[var(--lg-foreground)]',
        isCollapsed && 'justify-center px-0',
        className
      ),
      title: isCollapsed ? label : undefined,
    };

    const content = (
      <>
        {icon && (
          <span className="flex-shrink-0 w-5 h-5">{icon}</span>
        )}
        {!isCollapsed && <span className="truncate">{label}</span>}
      </>
    );

    if (href) {
      return (
        <a href={href} onClick={onClick} {...sharedProps} {...props}>
          {content}
        </a>
      );
    }

    return (
      <button ref={ref} onClick={onClick} {...sharedProps} {...props}>
        {content}
      </button>
    );
  }
);

SidebarItem.displayName = 'SidebarItem';

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
}

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, title, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar();

    return (
      <div ref={ref} className={cn('mb-4', className)} {...props}>
        {title && !isCollapsed && (
          <div className="px-3 py-2 text-xs font-semibold text-[var(--lg-muted)] uppercase tracking-wider">
            {title}
          </div>
        )}
        <div className="space-y-1">{children}</div>
      </div>
    );
  }
);

SidebarGroup.displayName = 'SidebarGroup';
