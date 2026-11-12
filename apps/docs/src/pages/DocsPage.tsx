import { GlassCard, Button } from '@nkanish/liquidglass-ui';
import { Link } from 'react-router-dom';
import { CodeBlock } from '../components/CodeBlock';
import { TableOfContents } from '../components/TableOfContents';

const tocItems = [
  { id: 'introduction', title: 'Introduction', level: 2 },
  { id: 'features', title: 'Features', level: 2 },
  { id: 'quick-start', title: 'Quick Start', level: 2 },
  { id: 'next-steps', title: 'Next Steps', level: 2 },
];

const installCode = `npm install @nkanish/liquidglass-ui`;

const basicUsageCode = `import { GlassProvider, Button, GlassCard } from '@nkanish/liquidglass-ui';
import '@nkanish/liquidglass-ui/styles.css';

function App() {
  return (
    <GlassProvider>
      <GlassCard>
        <h1>Hello, Glass!</h1>
        <Button variant="filled">Click me</Button>
      </GlassCard>
    </GlassProvider>
  );
}`;

export function DocsPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0">
        <div className="prose max-w-none">
          <h1 id="introduction" className="text-4xl font-bold mb-4">
            Introduction
          </h1>
          <p className="text-lg text-[var(--docs-text-muted)] mb-8">
            LiquidGlass UI is an advanced Apple-style glassmorphism component library for React. 
            It brings the beautiful Liquid Glass design language from iOS 26 and macOS Tahoe to the web.
          </p>

          <GlassCard className="p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">✨</div>
              <div>
                <h3 className="font-semibold mb-1">What makes it special?</h3>
                <p className="text-sm text-[var(--docs-text-muted)]">
                  Unlike basic glassmorphism libraries, LiquidGlass UI includes SVG-based refraction 
                  effects that create authentic lens-like distortion when you interact with components.
                </p>
              </div>
            </div>
          </GlassCard>

          <h2 id="features" className="text-2xl font-bold mt-12 mb-4">
            Features
          </h2>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <span className="text-[var(--docs-accent)]">✓</span>
              <span><strong>57 Components</strong> - Complete UI toolkit for any application</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--docs-accent)]">✓</span>
              <span><strong>Authentic Glass Effect</strong> - Backdrop blur with SVG displacement filters</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--docs-accent)]">✓</span>
              <span><strong>Dark Mode</strong> - Automatic light/dark theme switching</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--docs-accent)]">✓</span>
              <span><strong>Accessible</strong> - Full ARIA support and keyboard navigation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--docs-accent)]">✓</span>
              <span><strong>TypeScript</strong> - Complete type definitions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--docs-accent)]">✓</span>
              <span><strong>Zero Dependencies</strong> - Only React as peer dependency</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--docs-accent)]">✓</span>
              <span><strong>Motion Preferences</strong> - Respects prefers-reduced-motion</span>
            </li>
          </ul>

          <h2 id="quick-start" className="text-2xl font-bold mt-12 mb-4">
            Quick Start
          </h2>

          <h3 className="text-lg font-semibold mt-6 mb-3">1. Install the package</h3>
          <CodeBlock code={installCode} />

          <h3 className="text-lg font-semibold mt-6 mb-3">2. Import and use components</h3>
          <CodeBlock 
            code={basicUsageCode} 
            preview={
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-3">Hello, Glass!</h3>
                <Button variant="filled">Click me</Button>
              </GlassCard>
            }
          />

          <h2 id="next-steps" className="text-2xl font-bold mt-12 mb-4">
            Next Steps
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/docs/installation">
              <GlassCard className="p-4 h-full hover:border-[var(--docs-accent)] transition-colors cursor-pointer">
                <h3 className="font-semibold mb-1">Installation Guide</h3>
                <p className="text-sm text-[var(--docs-text-muted)]">
                  Detailed setup instructions for various frameworks
                </p>
              </GlassCard>
            </Link>
            <Link to="/docs/theming">
              <GlassCard className="p-4 h-full hover:border-[var(--docs-accent)] transition-colors cursor-pointer">
                <h3 className="font-semibold mb-1">Theming</h3>
                <p className="text-sm text-[var(--docs-text-muted)]">
                  Customize colors, blur intensity, and more
                </p>
              </GlassCard>
            </Link>
            <Link to="/docs/components/button">
              <GlassCard className="p-4 h-full hover:border-[var(--docs-accent)] transition-colors cursor-pointer">
                <h3 className="font-semibold mb-1">Button Component</h3>
                <p className="text-sm text-[var(--docs-text-muted)]">
                  Start with the most common component
                </p>
              </GlassCard>
            </Link>
            <Link to="/components">
              <GlassCard className="p-4 h-full hover:border-[var(--docs-accent)] transition-colors cursor-pointer">
                <h3 className="font-semibold mb-1">All Components</h3>
                <p className="text-sm text-[var(--docs-text-muted)]">
                  Browse the complete component library
                </p>
              </GlassCard>
            </Link>
          </div>
        </div>
      </div>
      
      <TableOfContents items={tocItems} />
    </div>
  );
}
