import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GlassProvider, CommandPalette, ToastProvider } from '@nkanish/liquidglass-ui';
import { Navbar } from './components/Navbar';
import { DocsSidebar } from './components/DocsSidebar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { DocsPage } from './pages/DocsPage';
import { ComponentDocsPage } from './pages/ComponentDocsPage';
import { ComponentsPage } from './pages/ComponentsPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { ShowcasePage } from './pages/ShowcasePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { components } from './data/components';
import './styles/globals.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12 overflow-x-hidden">
      <div className="flex gap-6 lg:gap-8">
        <DocsSidebar />
        <main className="flex-1 min-w-0 max-w-full">{children}</main>
      </div>
    </div>
  );
}

function AppContent() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commandItems = components.map((component) => ({
    id: component.slug,
    label: component.name,
    description: component.description,
    onSelect: () => {
      window.location.href = `${import.meta.env.BASE_URL}docs/components/${component.slug}`;
      setSearchOpen(false);
    },
  }));

  return (
    <>
      <ScrollToTop />
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/refraction" element={<ComparisonPage />} />
        <Route
          path="/docs"
          element={
            <DocsLayout>
              <DocsPage />
            </DocsLayout>
          }
        />
        <Route
          path="/docs/installation"
          element={
            <DocsLayout>
              <InstallationPage />
            </DocsLayout>
          }
        />
        <Route
          path="/docs/theming"
          element={
            <DocsLayout>
              <ThemingPage />
            </DocsLayout>
          }
        />
        <Route
          path="/docs/components/:slug"
          element={
            <DocsLayout>
              <ComponentDocsPage />
            </DocsLayout>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />

      <CommandPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        items={commandItems}
        placeholder="Search components..."
      />
    </>
  );
}

function InstallationPage() {
  return (
    <div className="prose max-w-none">
      <h1 className="text-4xl font-bold mb-4">Installation</h1>
      <p className="text-lg text-[var(--docs-text-muted)] mb-8">
        Get started with LiquidGlass UI in your React project.
      </p>
      
      <h2 className="text-2xl font-bold mt-12 mb-4">npm</h2>
      <pre className="bg-[var(--docs-bg-elevated)] p-4 rounded-lg overflow-x-auto">
        <code>npm install @nkanish/liquidglass-ui</code>
      </pre>

      <h2 className="text-2xl font-bold mt-12 mb-4">pnpm</h2>
      <pre className="bg-[var(--docs-bg-elevated)] p-4 rounded-lg overflow-x-auto">
        <code>pnpm add @nkanish/liquidglass-ui</code>
      </pre>

      <h2 className="text-2xl font-bold mt-12 mb-4">yarn</h2>
      <pre className="bg-[var(--docs-bg-elevated)] p-4 rounded-lg overflow-x-auto">
        <code>yarn add @nkanish/liquidglass-ui</code>
      </pre>

      <h2 className="text-2xl font-bold mt-12 mb-4">Setup</h2>
      <p>Wrap your app with <code>GlassProvider</code> and import the styles:</p>
      <pre className="bg-[var(--docs-bg-elevated)] p-4 rounded-lg overflow-x-auto text-sm">
        <code>{`import { GlassProvider } from '@nkanish/liquidglass-ui';
import '@nkanish/liquidglass-ui/styles.css';

function App() {
  return (
    <GlassProvider>
      {/* Your app */}
    </GlassProvider>
  );
}`}</code>
      </pre>

      <h2 className="text-2xl font-bold mt-12 mb-4">Requirements</h2>
      <ul className="space-y-2">
        <li>React 18 or higher</li>
        <li>React DOM 18 or higher</li>
        <li>A modern browser with CSS backdrop-filter support</li>
      </ul>
    </div>
  );
}

function ThemingPage() {
  return (
    <div className="prose max-w-none">
      <h1 className="text-4xl font-bold mb-4">Theming</h1>
      <p className="text-lg text-[var(--docs-text-muted)] mb-8">
        Customize the look and feel of LiquidGlass UI components.
      </p>
      
      <h2 className="text-2xl font-bold mt-12 mb-4">Theme Modes</h2>
      <p>LiquidGlass UI supports light, dark, and system theme modes:</p>
      <pre className="bg-[var(--docs-bg-elevated)] p-4 rounded-lg overflow-x-auto text-sm">
        <code>{`<GlassProvider theme="dark">
  {/* Dark mode */}
</GlassProvider>

<GlassProvider theme="light">
  {/* Light mode */}
</GlassProvider>

<GlassProvider theme="system">
  {/* Follows system preference */}
</GlassProvider>`}</code>
      </pre>

      <h2 className="text-2xl font-bold mt-12 mb-4">CSS Custom Properties</h2>
      <p>Customize colors, blur, and other values using CSS custom properties:</p>
      <pre className="bg-[var(--docs-bg-elevated)] p-4 rounded-lg overflow-x-auto text-sm">
        <code>{`:root {
  --lg-accent: #7c3aed;
  --lg-blur: 3px;
  --lg-saturation: 1.5;
  --lg-glass: rgb(255 255 255 / 0.6);
  --lg-edge: rgb(0 0 0 / 0.08);
}`}</code>
      </pre>

      <h2 className="text-2xl font-bold mt-12 mb-4">Programmatic Theming</h2>
      <p>Use the <code>useTheme</code> hook to control the theme programmatically:</p>
      <pre className="bg-[var(--docs-bg-elevated)] p-4 rounded-lg overflow-x-auto text-sm">
        <code>{`import { useTheme } from '@nkanish/liquidglass-ui';

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  );
}`}</code>
      </pre>

      <h2 className="text-2xl font-bold mt-12 mb-4">Reduced Motion</h2>
      <p>
        LiquidGlass UI automatically respects the <code>prefers-reduced-motion</code> media 
        query. Animations are disabled for users who prefer reduced motion.
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <GlassProvider defaultTheme="dark">
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </GlassProvider>
    </BrowserRouter>
  );
}

export default App;
