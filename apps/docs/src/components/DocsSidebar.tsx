import { Link, useLocation } from 'react-router-dom';
import { categories, getComponentsByCategory } from '../data/components';

interface DocsSidebarProps {
  className?: string;
  /** `drawer` hides the desktop-only wrapper styles for use inside the mobile Drawer */
  variant?: 'desktop' | 'drawer';
}

export function DocsSidebar({ className, variant = 'desktop' }: DocsSidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center min-h-[44px] px-3 rounded-lg text-sm transition-colors no-underline ${
      isActive(path)
        ? 'bg-[var(--docs-accent)]/10 text-[var(--docs-accent)]'
        : 'text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] hover:bg-[var(--docs-bg-elevated)]'
    }`;

  const content = (
    <div
      className={
        variant === 'desktop'
          ? 'lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] overflow-y-auto pb-8 lg:pr-4'
          : 'overflow-y-auto'
      }
    >
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--docs-text-muted)] mb-3">
          Getting Started
        </h3>
        <ul className="space-y-1">
          <li>
            <Link to="/docs" className={linkClass('/docs')}>
              Introduction
            </Link>
          </li>
          <li>
            <Link to="/docs/installation" className={linkClass('/docs/installation')}>
              Installation
            </Link>
          </li>
          <li>
            <Link to="/docs/theming" className={linkClass('/docs/theming')}>
              Theming
            </Link>
          </li>
        </ul>
      </div>

      {categories.map((category) => {
        const categoryComponents = getComponentsByCategory(category.id);
        if (categoryComponents.length === 0) return null;

        return (
          <div key={category.id} className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--docs-text-muted)] mb-3 flex items-center gap-2">
              <span aria-hidden>{category.icon}</span>
              {category.name}
            </h3>
            <ul className="space-y-1">
              {categoryComponents.map((component) => (
                <li key={component.slug}>
                  <Link
                    to={`/docs/components/${component.slug}`}
                    className={linkClass(`/docs/components/${component.slug}`)}
                  >
                    {component.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );

  if (variant === 'drawer') {
    return <div className={className}>{content}</div>;
  }

  return (
    <aside className={className || 'w-64 shrink-0 hidden lg:block'}>{content}</aside>
  );
}
