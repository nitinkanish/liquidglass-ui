import { Link } from 'react-router-dom';
import { Button, GlassCard } from '@nkanish/liquidglass-ui';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 pt-24 pb-12">
      <GlassCard className="max-w-lg w-full p-8 sm:p-10 text-center">
        <p className="text-sm font-medium text-[var(--docs-accent)] mb-2">404</p>
        <h1 className="text-[clamp(1.75rem,5vw,2.25rem)] font-bold mb-3">Page not found</h1>
        <p className="text-[var(--docs-text-muted)] mb-8">
          That route doesn&apos;t exist. Head back to the docs or browse components.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/">
            <Button variant="filled" className="min-h-[44px]">
              Home
            </Button>
          </Link>
          <Link to="/docs">
            <Button variant="glass" className="min-h-[44px]">
              Docs
            </Button>
          </Link>
          <Link to="/components">
            <Button variant="glass" className="min-h-[44px]">
              Components
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
