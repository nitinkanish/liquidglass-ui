import { Glass, GlassCard, Button, Switch, Slider, Badge } from '@nkanish/liquidglass-ui';
import { useState } from 'react';

export function ComparisonPage() {
  const [refraction, setRefraction] = useState(true);
  const [refractionDepth, setRefractionDepth] = useState(8);
  const [refractionDome, setRefractionDome] = useState(4);
  const [shine, setShine] = useState(0.3);
  const [lightAngle, setLightAngle] = useState(225);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Glisse-Compatible Refraction</Badge>
          <h1 className="text-4xl font-bold mb-4">
            Glass <span className="gradient-text">Refraction Effect</span>
          </h1>
          <p className="text-[var(--docs-text-muted)] max-w-2xl mx-auto">
            LiquidGlass UI includes glisse-compatible edge refraction with chromatic aberration,
            specular highlights, and rim lighting. Toggle the effect below to see the difference.
          </p>
        </div>

        {/* Controls */}
        <GlassCard className="p-6 mb-8 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Refraction Controls</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Enable Refraction</span>
              <Switch checked={refraction} onCheckedChange={setRefraction} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Depth</span>
                <span className="text-[var(--docs-text-muted)]">{refractionDepth}px</span>
              </div>
              <Slider
                value={refractionDepth}
                onValueChange={setRefractionDepth}
                min={0}
                max={20}
                step={1}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Dome</span>
                <span className="text-[var(--docs-text-muted)]">{refractionDome}px</span>
              </div>
              <Slider
                value={refractionDome}
                onValueChange={setRefractionDome}
                min={0}
                max={10}
                step={1}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Shine</span>
                <span className="text-[var(--docs-text-muted)]">{shine.toFixed(1)}</span>
              </div>
              <Slider
                value={shine}
                onValueChange={setShine}
                min={0}
                max={1}
                step={0.1}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Light Angle</span>
                <span className="text-[var(--docs-text-muted)]">{lightAngle}°</span>
              </div>
              <Slider
                value={lightAngle}
                onValueChange={setLightAngle}
                min={0}
                max={360}
                step={15}
              />
            </div>
          </div>
        </GlassCard>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gradient Background */}
          <div className="relative rounded-2xl overflow-hidden aspect-video">
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f857a6 50%, #ff5858 75%, #f09819 100%)',
            }} />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <Glass
                refraction={refraction}
                refractionDepth={refractionDepth}
                refractionDome={refractionDome}
                shine={shine}
                lightAngle={lightAngle}
                className="w-full max-w-sm p-6 rounded-2xl"
              >
                <h3 className="text-white text-xl font-semibold mb-2">Gradient Background</h3>
                <p className="text-white/80 text-sm">
                  The glass edge refracts the colorful gradient, creating a liquid lens effect.
                </p>
                <Button variant="filled" className="mt-4">Action</Button>
              </Glass>
            </div>
          </div>

          {/* Image Background */}
          <div className="relative rounded-2xl overflow-hidden aspect-video">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <Glass
                refraction={refraction}
                refractionDepth={refractionDepth}
                refractionDome={refractionDome}
                shine={shine}
                lightAngle={lightAngle}
                className="w-full max-w-sm p-6 rounded-2xl"
              >
                <h3 className="text-white text-xl font-semibold mb-2">Image Background</h3>
                <p className="text-white/80 text-sm">
                  Edge lensing distorts the image at glass boundaries with chromatic aberration.
                </p>
                <Button variant="filled" className="mt-4">Action</Button>
              </Glass>
            </div>
          </div>

          {/* Dark Gradient */}
          <div className="relative rounded-2xl overflow-hidden aspect-video">
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #e94560 100%)',
            }} />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <Glass
                refraction={refraction}
                refractionDepth={refractionDepth}
                refractionDome={refractionDome}
                shine={shine}
                lightAngle={lightAngle}
                className="w-full max-w-sm p-6 rounded-2xl"
              >
                <h3 className="text-white text-xl font-semibold mb-2">Dark Theme</h3>
                <p className="text-white/80 text-sm">
                  The rim highlight and specular effect work well on dark backgrounds.
                </p>
                <Button variant="glass" className="mt-4">Ghost Button</Button>
              </Glass>
            </div>
          </div>

          {/* Nature Background */}
          <div className="relative rounded-2xl overflow-hidden aspect-video">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <Glass
                refraction={refraction}
                refractionDepth={refractionDepth}
                refractionDome={refractionDome}
                shine={shine}
                lightAngle={lightAngle}
                className="w-full max-w-sm p-6 rounded-2xl"
              >
                <h3 className="text-white text-xl font-semibold mb-2">Nature Photo</h3>
                <p className="text-white/80 text-sm">
                  Real photographs show off the authentic glass refraction effect beautifully.
                </p>
                <Button variant="outlined" className="mt-4">Outlined</Button>
              </Glass>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <GlassCard className="p-6 mt-12 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Technical Implementation</h2>
          <div className="text-sm text-[var(--docs-text-muted)] space-y-2">
            <p>The refraction effect uses SVG displacement maps generated at runtime:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Edge detection via mathematical distance functions (erf)</li>
              <li>Chromatic aberration with separate R/G/B channel displacement</li>
              <li>Specular highlights computed from light angle and edge orientation</li>
              <li>Rim lighting gradient overlay for depth</li>
              <li>Filter chain cached for performance</li>
            </ul>
            <p className="mt-4">
              Based on <a href="https://www.npmjs.com/package/glisse" target="_blank" rel="noopener noreferrer" className="text-[var(--docs-accent)] hover:underline">glisse</a> (MIT License) by Caleb Brewer.
            </p>
          </div>
        </GlassCard>

        {/* Code Example */}
        <GlassCard className="p-6 mt-6 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Usage</h2>
          <pre className="text-sm bg-black/30 p-4 rounded-lg overflow-x-auto">
            <code className="text-[var(--docs-text)]">{`import { Glass } from '@nkanish/liquidglass-ui';

<Glass
  refraction
  refractionDepth={8}
  refractionDome={4}
  shine={0.3}
  lightAngle={225}
>
  Content with edge refraction effect
</Glass>`}</code>
          </pre>
        </GlassCard>
      </div>
    </div>
  );
}
