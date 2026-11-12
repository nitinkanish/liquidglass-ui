import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  sticky?: boolean;
  bordered?: boolean;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      style,
      logo,
      children,
      actions,
      sticky = false,
      bordered = true,
      ...props
    },
    ref
  ) => {
    return (
      <header
        ref={ref}
        className={cn(
          'lg-glass lg-text',
          'flex items-center justify-between gap-4',
          'px-4 h-16',
          sticky && 'sticky top-0 z-40',
          bordered && 'border-b border-[var(--lg-separator)]',
          className
        )}
        style={style}
        {...props}
      >
        {logo && (
          <div className="flex-shrink-0">
            {logo}
          </div>
        )}

        {children && (
          <nav className="flex-1 flex items-center gap-1">
            {children}
          </nav>
        )}

        {actions && (
          <div className="flex-shrink-0 flex items-center gap-2">
            {actions}
          </div>
        )}
      </header>
    );
  }
);

Navbar.displayName = 'Navbar';

export interface NavbarLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  active?: boolean;
  children: ReactNode;
}

export const NavbarLink = forwardRef<HTMLAnchorElement, NavbarLinkProps>(
  ({ className, href, active = false, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'px-3 py-2 rounded-lg text-sm font-medium',
          'transition-colors no-underline',
          active
            ? 'bg-[var(--lg-accent-light)] text-[var(--lg-accent)]'
            : 'text-[var(--lg-foreground-secondary)] hover:bg-[var(--lg-glass)] hover:text-[var(--lg-foreground)]',
          className
        )}
        aria-current={active ? 'page' : undefined}
        {...props}
      >
        {children}
      </a>
    );
  }
);

NavbarLink.displayName = 'NavbarLink';
