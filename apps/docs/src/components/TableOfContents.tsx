import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0% -80% 0%' }
    );

    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="w-48 shrink-0 hidden xl:block">
      <div className="sticky top-20">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--docs-text-muted)] mb-3">
          On This Page
        </h4>
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block py-1 transition-colors ${
                  item.level > 2 ? 'pl-3' : ''
                } ${
                  activeId === item.id
                    ? 'text-[var(--docs-accent)]'
                    : 'text-[var(--docs-text-muted)] hover:text-[var(--docs-text)]'
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
