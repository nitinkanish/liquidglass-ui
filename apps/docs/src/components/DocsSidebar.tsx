import { Link, useLocation } from 'react-router-dom';
import { categories, getComponentsByCategory } from '../data/components';

export function DocsSidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pb-8 pr-4">
        {/* Getting Started */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--docs-text-muted)] mb-3">
            Getting Started
          </h3>
          <ul className="space-y-1">
            <li>
              <Link
                to="/docs"
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive('/docs')
                    ? 'bg-[var(--docs-accent)]/10 text-[var(--docs-accent)]'
                    : 'text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] hover:bg-[var(--docs-bg-elevated)]'
                }`}
              >
                Introduction
              </Link>
            </li>
            <li>
              <Link
                to="/docs/installation"
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive('/docs/installation')
                    ? 'bg-[var(--docs-accent)]/10 text-[var(--docs-accent)]'
                    : 'text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] hover:bg-[var(--docs-bg-elevated)]'
                }`}
              >
                Installation
              </Link>
            </li>
            <li>
              <Link
                to="/docs/theming"
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive('/docs/theming')
                    ? 'bg-[var(--docs-accent)]/10 text-[var(--docs-accent)]'
                    : 'text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] hover:bg-[var(--docs-bg-elevated)]'
                }`}
              >
                Theming
              </Link>
            </li>
          </ul>
        </div>

        {/* Component Categories */}
        {categories.map((category) => {
          const categoryComponents = getComponentsByCategory(category.id);
          if (categoryComponents.length === 0) return null;

          return (
            <div key={category.id} className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--docs-text-muted)] mb-3 flex items-center gap-2">
                <span>{category.icon}</span>
                {category.name}
              </h3>
              <ul className="space-y-1">
                {categoryComponents.map((component) => (
                  <li key={component.slug}>
                    <Link
                      to={`/docs/components/${component.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive(`/docs/components/${component.slug}`)
                          ? 'bg-[var(--docs-accent)]/10 text-[var(--docs-accent)]'
                          : 'text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] hover:bg-[var(--docs-bg-elevated)]'
                      }`}
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
    </aside>
  );
}
