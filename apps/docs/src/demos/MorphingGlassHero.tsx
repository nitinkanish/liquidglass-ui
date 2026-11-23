import { useState } from 'react';
import { MorphingGlass, MorphingGlassProps, MORPH_SHAPES, MorphShape } from '@nkanish/liquidglass-ui';

export interface MorphingGlassHeroProps extends MorphingGlassProps {
  fullPage?: boolean;
}

/** Navy poster stage: headline, rules, the morphing body and a live shape index. */
export function MorphingGlassHero({ fullPage, onShapeChange, ...props }: MorphingGlassHeroProps) {
  const [active, setActive] = useState<MorphShape>(props.shape ?? 'sphere');
  const shape = props.shape ?? active;
  return (
    <div
      data-testid="morph-hero"
      className={fullPage ? 'min-h-screen flex flex-col' : 'rounded-2xl overflow-hidden border border-[var(--docs-border)]'}
      style={{ background: '#040b2b', color: '#f1e8d6' }}
    >
      <div className="px-5 sm:px-10 pt-10 sm:pt-14 pb-6 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold leading-[1.05]" style={{ letterSpacing: '-0.03em' }}>
          One body of glass.
          <br />
          <span style={{ color: '#ff6a2b' }}>Six shapes.</span>
        </h2>
      </div>
      <div className="px-5 sm:px-10 flex items-center justify-between text-[11px] tracking-[0.18em] uppercase opacity-70 font-mono">
        <span>No. 01 — liquid body</span>
        <span className="hidden sm:inline">sdf raymarched</span>
      </div>
      <MorphingGlass
        className={fullPage ? 'flex-1 min-h-[420px]' : ''}
        style={fullPage ? { aspectRatio: 'auto' } : { aspectRatio: '16 / 10' }}
        onShapeChange={(s, i) => {
          setActive(s);
          onShapeChange?.(s, i);
        }}
        {...props}
      />
      <div className="px-5 sm:px-10 py-4 flex flex-wrap justify-center sm:justify-end gap-x-2 gap-y-1 text-[11px] tracking-[0.18em] uppercase font-mono" aria-hidden="true">
        {MORPH_SHAPES.map((s, i) => (
          <span key={s} style={{ opacity: s === shape ? 1 : 0.45, color: s === shape ? '#ff6a2b' : undefined }}>
            {s}
            {i < MORPH_SHAPES.length - 1 ? ' ·' : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
