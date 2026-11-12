import { useParams, Navigate, Link } from 'react-router-dom';
import { getComponentBySlug, categories } from '../data/components';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { TableOfContents } from '../components/TableOfContents';
import { ComponentDemo } from '../components/ComponentDemo';

const tocItems = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'demo', title: 'Demo', level: 2 },
  { id: 'usage', title: 'Usage', level: 2 },
  { id: 'props', title: 'Props', level: 2 },
];

export function ComponentDocsPage() {
  const { slug } = useParams<{ slug: string }>();
  const component = slug ? getComponentBySlug(slug) : undefined;

  if (!component) {
    return <Navigate to="/docs" replace />;
  }

  const category = categories.find(c => c.id === component.category);

  const importCode = `import { ${component.name} } from 'liquidglass-ui';`;

  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0">
        <div className="prose max-w-none">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[var(--docs-text-muted)] mb-6">
            <Link to="/docs" className="hover:text-[var(--docs-text)]">Docs</Link>
            <span>/</span>
            <Link to="/components" className="hover:text-[var(--docs-text)]">Components</Link>
            <span>/</span>
            <span className="text-[var(--docs-text)]">{component.name}</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            {category && <span className="text-2xl">{category.icon}</span>}
            <span className="text-xs px-2 py-1 rounded-full bg-[var(--docs-accent)]/20 text-[var(--docs-accent)] font-medium">
              {category?.name}
            </span>
          </div>

          <h1 id="overview" className="text-4xl font-bold mb-4">
            {component.name}
          </h1>
          <p className="text-lg text-[var(--docs-text-muted)] mb-8">
            {component.description}
          </p>

          {/* Demo */}
          <h2 id="demo" className="text-2xl font-bold mt-12 mb-4">
            Demo
          </h2>
          <ComponentDemo componentName={component.name} slug={component.slug} />

          {/* Usage */}
          <h2 id="usage" className="text-2xl font-bold mt-12 mb-4">
            Usage
          </h2>
          <h3 className="text-lg font-semibold mt-6 mb-3">Import</h3>
          <CodeBlock code={importCode} />

          {/* Props */}
          <h2 id="props" className="text-2xl font-bold mt-12 mb-4">
            Props
          </h2>
          <div className="rounded-xl border border-[var(--docs-border)] overflow-hidden">
            <PropsTable props={component.props} />
          </div>
        </div>
      </div>
      
      <TableOfContents items={tocItems} />
    </div>
  );
}
