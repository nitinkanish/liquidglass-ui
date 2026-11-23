import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Slider, Switch, MORPH_SHAPES, MorphShape } from '@nkanish/liquidglass-ui';
import { getComponentBySlug } from '../data/components';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { MorphingGlassHero } from '../demos/MorphingGlassHero';

const usage = `import { MorphingGlass } from '@nkanish/liquidglass-ui';

// Morph through every shape over the built-in striped stage
<MorphingGlass />

// A fixed shape (changes animate), thicker and more dispersive
<MorphingGlass shape="pebble" thickness={1.4} dispersion={0.9} />

// Custom sequence and timing, refracting your own image
<MorphingGlass
  shapes={['sphere', 'drop', 'pill']}
  duration={1200}
  hold={400}
  easing="spring"
  background="/hero.jpg"
/>`;

export function MorphingGlassDocsPage() {
  const component = getComponentBySlug('morphing-glass')!;
  const [fixed, setFixed] = useState<MorphShape | 'auto'>('auto');
  const [playing, setPlaying] = useState(true);
  const [thickness, setThickness] = useState(100);
  const [dispersion, setDispersion] = useState(60);
  const [size, setSize] = useState(100);

  return (
    <div className="prose max-w-none min-w-0">
      <div className="flex items-center gap-2 text-sm text-[var(--docs-text-muted)] mb-6">
        <Link to="/docs" className="hover:text-[var(--docs-text)]">Docs</Link>
        <span>/</span>
        <Link to="/components" className="hover:text-[var(--docs-text)]">Components</Link>
        <span>/</span>
        <span className="text-[var(--docs-text)]">MorphingGlass</span>
      </div>
      <h1 id="overview" className="text-4xl font-bold mb-4">MorphingGlass</h1>
      <p className="text-lg text-[var(--docs-text-muted)] mb-8">{component.description}</p>

      <h2 id="demo" className="text-2xl font-bold mt-12 mb-4">Live demo</h2>
      <MorphingGlassHero
        shape={fixed === 'auto' ? undefined : fixed}
        paused={!playing}
        thickness={thickness / 100}
        dispersion={dispersion / 100}
        size={size / 100}
      />
      <div className="grid gap-4 mt-5" data-testid="morph-controls">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-[var(--docs-text-muted)] mr-1">Shape</span>
          {(['auto', ...MORPH_SHAPES] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={fixed === s}
              onClick={() => setFixed(s)}
              className={`px-3 min-h-[36px] rounded-full text-sm border transition-colors ${
                fixed === s
                  ? 'bg-[var(--docs-accent)] text-white border-transparent'
                  : 'border-[var(--docs-border)] text-[var(--docs-text)] hover:bg-[var(--docs-bg-elevated)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={playing} onCheckedChange={setPlaying} aria-label="Play" /> Play
        </label>
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="text-sm grid gap-2">Thickness<Slider value={thickness} min={40} max={200} onValueChange={setThickness} aria-label="Thickness" /></label>
          <label className="text-sm grid gap-2">Dispersion<Slider value={dispersion} min={0} max={100} onValueChange={setDispersion} aria-label="Dispersion" /></label>
          <label className="text-sm grid gap-2">Size<Slider value={size} min={50} max={140} onValueChange={setSize} aria-label="Size" /></label>
        </div>
      </div>
      <p className="text-sm text-[var(--docs-text-muted)] mt-4">
        Open the <Link to="/demos/morphing-glass" className="text-[var(--docs-accent)]">full-screen hero</Link>.
      </p>

      <h2 id="usage" className="text-2xl font-bold mt-12 mb-4">Usage</h2>
      <CodeBlock code={usage} />
      <h3 className="text-lg font-semibold mt-6 mb-3">How it renders</h3>
      <ul className="list-disc pl-5 space-y-1 text-[var(--docs-text-muted)]">
        <li>WebGL raymarches a signed distance field; two shape SDFs are blended so the surface never cuts or pops.</li>
        <li>Each colour channel is refracted with its own index on entry and exit, which gives the rainbow edges; Fresnel reflection and two specular lights add the highlights.</li>
        <li>The render loop stops when the element is offscreen, the tab is hidden, or nothing is animating.</li>
        <li>Reduced motion shows a still shape. Without WebGL it falls back to the library&apos;s CSS glass, morphing its outline.</li>
      </ul>

      <h2 id="props" className="text-2xl font-bold mt-12 mb-4">Props</h2>
      <div className="max-w-full md:rounded-xl md:border md:border-[var(--docs-border)] md:overflow-x-auto">
        <PropsTable props={component.props} />
      </div>
    </div>
  );
}
