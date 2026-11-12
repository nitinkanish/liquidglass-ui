import { Link } from 'react-router-dom';
import { Button, GlassCard, Badge } from 'liquidglass-ui';
import { categories, getComponentsByCategory } from '../data/components';

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Glow blobs */}
        <div className="glow-blob glow-purple w-[600px] h-[600px] -top-40 -left-40 animate-[pulse-glow_8s_ease-in-out_infinite]" />
        <div className="glow-blob glow-cyan w-[500px] h-[500px] top-20 right-0 animate-[pulse-glow_10s_ease-in-out_infinite_2s]" />
        <div className="glow-blob glow-pink w-[400px] h-[400px] bottom-0 left-1/3 animate-[pulse-glow_12s_ease-in-out_infinite_4s]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-6">
            ✨ 57 Components • React 18+ • TypeScript
          </Badge>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Beautiful{' '}
            <span className="gradient-text">Liquid Glass</span>
            <br />
            UI for React
          </h1>
          
          <p className="text-xl text-[var(--docs-text-muted)] max-w-2xl mx-auto mb-10">
            Advanced Apple-style glassmorphism components with backdrop blur, 
            SVG refraction effects, and smooth animations. Build stunning interfaces 
            that feel native to iOS 26 and macOS Tahoe.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/docs">
              <Button variant="filled" size="lg" className="gap-2">
                Get Started
                <ArrowRightIcon />
              </Button>
            </Link>
            <a href="https://github.com/nitinkanish/liquidglass-ui" target="_blank" rel="noopener noreferrer">
              <Button variant="glass" size="lg" className="gap-2">
                <GithubIcon />
                GitHub
              </Button>
            </a>
          </div>

          {/* Install command */}
          <div className="mt-12 inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--docs-bg-elevated)] border border-[var(--docs-border)]">
            <code className="text-sm font-mono text-[var(--docs-text-muted)]">
              npm install <span className="text-[var(--docs-accent)]">liquidglass-ui</span>
            </code>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why <span className="gradient-text">LiquidGlass UI</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-lg font-semibold mb-2">Apple-Inspired Design</h3>
              <p className="text-[var(--docs-text-muted)] text-sm">
                Authentic Liquid Glass aesthetics with backdrop blur, 
                refraction effects, and specular highlights.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="text-3xl mb-4">♿</div>
              <h3 className="text-lg font-semibold mb-2">Fully Accessible</h3>
              <p className="text-[var(--docs-text-muted)] text-sm">
                Complete ARIA support, keyboard navigation, 
                and screen reader compatibility built-in.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">High Performance</h3>
              <p className="text-[var(--docs-text-muted)] text-sm">
                GPU-accelerated animations, respects prefers-reduced-motion, 
                zero runtime dependencies.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="text-3xl mb-4">🌙</div>
              <h3 className="text-lg font-semibold mb-2">Dark Mode Ready</h3>
              <p className="text-[var(--docs-text-muted)] text-sm">
                Automatic light/dark theme switching with CSS custom properties 
                for easy customization.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="text-3xl mb-4">📦</div>
              <h3 className="text-lg font-semibold mb-2">Tree-Shakeable</h3>
              <p className="text-[var(--docs-text-muted)] text-sm">
                ESM + CJS builds with proper exports. Only ship what you use.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="text-3xl mb-4">🔷</div>
              <h3 className="text-lg font-semibold mb-2">TypeScript First</h3>
              <p className="text-[var(--docs-text-muted)] text-sm">
                Complete type definitions with excellent IntelliSense support.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Components Grid */}
      <section className="py-20 px-4 bg-[var(--docs-bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="gradient-text">57 Components</span> Ready to Use
            </h2>
            <p className="text-[var(--docs-text-muted)]">
              Everything you need to build beautiful glass interfaces
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const components = getComponentsByCategory(category.id);
              return (
                <Link
                  key={category.id}
                  to={`/docs/components/${components[0]?.slug || ''}`}
                  className="group"
                >
                  <GlassCard className="p-4 h-full transition-transform group-hover:scale-105">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-[var(--docs-text-muted)]">
                      {components.length} component{components.length !== 1 ? 's' : ''}
                    </p>
                  </GlassCard>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link to="/components">
              <Button variant="glass" className="gap-2">
                View All Components
                <ArrowRightIcon />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Something{' '}
            <span className="gradient-text">Beautiful</span>?
          </h2>
          <p className="text-[var(--docs-text-muted)] mb-8">
            Get started with LiquidGlass UI in minutes. Full documentation, 
            examples, and TypeScript support included.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/docs">
              <Button variant="filled" size="lg">
                Read the Docs
              </Button>
            </Link>
            <a href="https://github.com/nitinkanish/liquidglass-ui" target="_blank" rel="noopener noreferrer">
              <Button variant="outlined" size="lg">
                Star on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
