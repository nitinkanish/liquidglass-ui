import { Link } from 'react-router-dom';
import { GlassCard, SearchField } from '@nkanish/liquidglass-ui';
import { useState, useMemo } from 'react';
import { categories, components, getComponentsByCategory } from '../data/components';

export function ComponentsPage() {
  const [search, setSearch] = useState('');

  const filteredComponents = useMemo(() => {
    if (!search.trim()) return null;
    const query = search.toLowerCase();
    return components.filter(
      c => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Components</span>
        </h1>
        <p className="text-[var(--docs-text-muted)] mb-8">
          Browse all 57 components in the library
        </p>
        <div className="max-w-md mx-auto">
          <SearchField 
            placeholder="Search components..." 
            value={search}
            onValueChange={setSearch}
          />
        </div>
      </div>

      {filteredComponents ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {filteredComponents.length} result{filteredComponents.length !== 1 ? 's' : ''} for "{search}"
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredComponents.map((component) => {
              const category = categories.find(c => c.id === component.category);
              return (
                <Link key={component.slug} to={`/docs/components/${component.slug}`}>
                  <GlassCard className="p-4 h-full transition-transform hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      {category && <span>{category.icon}</span>}
                      <span className="font-semibold">{component.name}</span>
                    </div>
                    <p className="text-sm text-[var(--docs-text-muted)] line-clamp-2">
                      {component.description}
                    </p>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryComponents = getComponentsByCategory(category.id);
            if (categoryComponents.length === 0) return null;

            return (
              <section key={category.id}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {categoryComponents.map((component) => (
                    <Link key={component.slug} to={`/docs/components/${component.slug}`}>
                      <GlassCard className="p-4 h-full transition-transform hover:scale-105">
                        <h3 className="font-semibold mb-1">{component.name}</h3>
                        <p className="text-sm text-[var(--docs-text-muted)] line-clamp-2">
                          {component.description}
                        </p>
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
