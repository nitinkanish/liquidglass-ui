import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Switch, GlassHeaderVariant, GlassHeaderTint } from '@nkanish/liquidglass-ui';
import { getComponentBySlug } from '../data/components';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { GlassHeaderScene } from '../demos/GlassHeaderScene';

const usage = `import { GlassHeader, Button } from '@nkanish/liquidglass-ui';

<GlassHeader
  variant="floating"          // or "bar"
  tint="warm"                 // neutral | warm | cool | clear | any CSS color
  logo={<Logo />}
  links={[
    { label: 'Product', href: '/product', active: true },
    { label: 'Research', href: '/research' },
    { label: 'Pricing', href: '/pricing' },
  ]}
  actions={<Button size="sm" variant="filled">Get started</Button>}
  hideOnScroll
/>`;

const routerUsage = `// React Router / Next.js links
<GlassHeader
  links={links}
  renderLink={(link, props) => <Link to={link.href} {...props}>{link.label}</Link>}
/>`;

function Choice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">{label}</legend>
      <span className="text-sm text-[var(--docs-text-muted)] mr-1">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={`px-3 min-h-[36px] rounded-full text-sm border transition-colors ${
            value === o
              ? 'bg-[var(--docs-accent)] text-white border-transparent'
              : 'border-[var(--docs-border)] text-[var(--docs-text)] hover:bg-[var(--docs-bg-elevated)]'
          }`}
        >
          {o}
        </button>
      ))}
    </fieldset>
  );
}

export function GlassHeaderDocsPage() {
  const component = getComponentBySlug('glass-header')!;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<GlassHeaderVariant>('floating');
  const [tint, setTint] = useState<GlassHeaderTint>('warm');
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const [hide, setHide] = useState(false);
  const [outside, setOutside] = useState(true);
  const [transparentTop, setTransparentTop] = useState(false);

  return (
    <div className="prose max-w-none min-w-0">
      <div className="flex items-center gap-2 text-sm text-[var(--docs-text-muted)] mb-6">
        <Link to="/docs" className="hover:text-[var(--docs-text)]">Docs</Link>
        <span>/</span>
        <Link to="/components" className="hover:text-[var(--docs-text)]">Components</Link>
        <span>/</span>
        <span className="text-[var(--docs-text)]">GlassHeader</span>
      </div>
      <h1 id="overview" className="text-4xl font-bold mb-4">GlassHeader</h1>
      <p className="text-lg text-[var(--docs-text-muted)] mb-8">{component.description}</p>

      <h2 id="demo" className="text-2xl font-bold mt-12 mb-4">Live demo</h2>
      <p className="text-[var(--docs-text-muted)] mb-4">
        Scroll inside the frame. Resize below 768px (or open the{' '}
        <Link to="/demos/glass-header" className="text-[var(--docs-accent)]">full-page demo</Link>) to see the mobile menu.
      </p>
      <div className="flex flex-col gap-3 mb-4" data-testid="glass-header-controls">
        <Choice label="Variant" value={variant} options={['floating', 'bar']} onChange={setVariant} />
        <Choice label="Tint" value={tint as string} options={['warm', 'neutral', 'cool', 'clear', '#ff6a2b']} onChange={setTint} />
        <Choice label="Theme" value={scheme} options={['light', 'dark']} onChange={setScheme} />
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <label className="flex items-center gap-2 text-sm"><Switch checked={hide} onCheckedChange={setHide} aria-label="Hide on scroll" /> Hide on scroll</label>
          <label className="flex items-center gap-2 text-sm"><Switch checked={outside} onCheckedChange={setOutside} aria-label="CTA outside pill" /> CTA beside pill</label>
          <label className="flex items-center gap-2 text-sm"><Switch checked={transparentTop} onCheckedChange={setTransparentTop} aria-label="Transparent at top" /> Transparent at top (bar)</label>
        </div>
      </div>
      <GlassHeaderScene
        scrollRef={scrollRef}
        variant={variant}
        tint={tint}
        colorScheme={scheme}
        hideOnScroll={hide}
        actionsPlacement={outside ? 'outside' : 'inside'}
        transparentAtTop={transparentTop}
      />

      <h2 id="usage" className="text-2xl font-bold mt-12 mb-4">Usage</h2>
      <CodeBlock code={usage} />
      <h3 className="text-lg font-semibold mt-6 mb-3">Router links</h3>
      <CodeBlock code={routerUsage} />
      <h3 className="text-lg font-semibold mt-6 mb-3">Behaviour</h3>
      <ul className="list-disc pl-5 space-y-1 text-[var(--docs-text-muted)]">
        <li>Scrolled state (<code>data-scrolled</code>): denser material, a tighter pill and a deeper shadow. Tune with <code>scrollThreshold</code>.</li>
        <li>Below <code>mobileBreakpoint</code> the links, extra content and actions move into a glass menu. Escape or a link tap closes it.</li>
        <li>SSR: renders the desktop markup with a CSS fallback that already collapses on narrow screens before hydration.</li>
        <li>Reduced motion: no slide, pill or menu animations. Reduced transparency: an opaque surface, as for every glass component.</li>
      </ul>

      <h2 id="props" className="text-2xl font-bold mt-12 mb-4">Props</h2>
      <div className="max-w-full md:rounded-xl md:border md:border-[var(--docs-border)] md:overflow-x-auto">
        <PropsTable props={component.props} />
      </div>
    </div>
  );
}
