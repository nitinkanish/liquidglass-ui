import { ReactNode, RefObject } from 'react';
import { GlassHeader, GlassHeaderProps, Button } from '@nkanish/liquidglass-ui';

const base = import.meta.env.BASE_URL;

export const HEADER_LINKS = [
  { label: 'Product', href: '#product', active: true },
  { label: 'Research', href: '#research' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Careers', href: '#careers' },
];

export function HalcyonLogo() {
  return (
    <a href="#top" className="flex items-center gap-2 no-underline" style={{ color: 'inherit' }} aria-label="Halcyon home">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M6 13.5c2.2-3.4 9.8-3.4 12 0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>halcyon</span>
    </a>
  );
}

function Section({ id, title, children, tone }: { id: string; title: string; children: ReactNode; tone?: 'image' }) {
  return (
    <section
      id={id}
      className="px-5 sm:px-10 py-16 sm:py-24"
      style={tone === 'image' ? { backgroundImage: `url(${base}images/gradient-mesh.jpg)`, backgroundSize: 'cover', color: '#fff' } : undefined}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

export interface GlassHeaderSceneProps extends Partial<GlassHeaderProps> {
  scrollRef?: RefObject<HTMLDivElement>;
  /** Fill the viewport (standalone demo) instead of a framed scroll box. */
  fullPage?: boolean;
}

/** Warm paper stage with a dot grid, type and imagery, so the header has something to refract. */
export function GlassHeaderScene({ scrollRef, fullPage, ...headerProps }: GlassHeaderSceneProps) {
  const paper = {
    backgroundColor: '#f3ecdf',
    backgroundImage: 'radial-gradient(rgb(60 48 30 / 0.28) 1.2px, transparent 1.6px)',
    backgroundSize: '28px 28px',
    color: '#1d1a16',
  } as const;

  return (
    <div
      ref={scrollRef}
      data-testid="glass-header-scene"
      data-theme="light"
      className={fullPage ? '' : 'relative h-[560px] overflow-y-auto rounded-2xl border border-[var(--docs-border)]'}
      style={paper}
    >
      <GlassHeader
        logo={<HalcyonLogo />}
        links={HEADER_LINKS}
        actions={<Button size="sm" variant="filled">Get started</Button>}
        scrollContainer={fullPage ? undefined : scrollRef}
        tint="warm"
        colorScheme="light"
        {...headerProps}
      />
      <div id="top" className={`px-5 sm:px-10 ${fullPage ? 'pt-32 sm:pt-40' : 'pt-16 sm:pt-24'} pb-12`}>
        <div className="max-w-4xl mx-auto grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <p className="text-sm sm:text-base mb-3 opacity-70">a calmer interface kit</p>
            <h1 className="text-4xl sm:text-6xl font-bold leading-[1.02]" style={{ letterSpacing: '-0.035em' }}>
              glass that stays out of the way.
            </h1>
            <p className="mt-5 text-base sm:text-lg opacity-75 max-w-md">
              Scroll this page: the header thickens, tightens and keeps refracting whatever slides underneath it.
            </p>
          </div>
          <div
            className="aspect-square rounded-[32px] shadow-xl"
            style={{ backgroundImage: `url(${base}images/stripes.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            aria-hidden="true"
          />
        </div>
      </div>
      <Section id="product" title="Product">
        <div className="grid sm:grid-cols-3 gap-4">
          {['Lens', 'Rim light', 'Motion'].map((t, i) => (
            <div key={t} className="rounded-2xl p-5" style={{ background: ['#1d1a16', '#e4572e', '#2f5d50'][i], color: '#fff' }}>
              <div className="text-lg font-semibold">{t}</div>
              <p className="text-sm opacity-80 mt-2">High-contrast blocks to watch the edge refraction as they pass under the bar.</p>
            </div>
          ))}
        </div>
      </Section>
      <Section id="research" title="Research" tone="image">
        <p className="text-lg max-w-2xl opacity-90">
          Colourful imagery under the glass shows the backdrop lens and chromatic edge on Chromium; Safari and Firefox get the frosted material.
        </p>
      </Section>
      <Section id="pricing" title="Pricing">
        <div
          className="rounded-3xl h-64"
          style={{ backgroundImage: `url(${base}images/newspaper.jpg)`, backgroundSize: 'cover' }}
          aria-hidden="true"
        />
      </Section>
      <Section id="careers" title="Careers">
        {Array.from({ length: 6 }).map((_, i) => (
          <p key={i} className="text-lg leading-relaxed opacity-80 mb-4">
            Dense body copy scrolling beneath the header makes the scrolled state easy to judge. Each line bends a little at the glass edge,
            the way type does under a real lens.
          </p>
        ))}
      </Section>
    </div>
  );
}
