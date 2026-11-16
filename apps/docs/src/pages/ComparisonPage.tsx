import { useState } from 'react';
import {
  GlassCard as OurGlassCard,
  Button as OurButton,
  Switch as OurSwitch,
  Slider as OurSlider,
  TabBar as OurTabBar,
  SegmentedControl as OurSegmentedControl,
  Badge,
} from '@nkanish/liquidglass-ui';
import {
  Glass as GlisseGlass,
  Button as GlisseButton,
  Switch as GlisseSwitch,
  Slider as GlisseSlider,
  TabBar as GlisseTabBar,
  SegmentedControl as GlisseSegmentedControl,
} from 'glisse';
import 'glisse/styles.css';

/** Local photographic backgrounds — detail textures show edge lensing clearly */
const DETAIL_BG = `${import.meta.env.BASE_URL}images/newspaper.jpg`;
const STRIPES_BG = `${import.meta.env.BASE_URL}images/stripes.jpg`;

interface ComparisonProps {
  title: string;
  glisseComponent: React.ReactNode;
  ourComponent: React.ReactNode;
  background: string;
}

function Comparison({ title, glisseComponent, ourComponent, background }: ComparisonProps) {
  return (
    <div className="mb-10 sm:mb-12">
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2 min-w-0">
          <div className="text-sm text-center text-[var(--docs-text-muted)]">glisse (reference)</div>
          <div
            className="rounded-2xl overflow-hidden p-6 sm:p-8 flex items-center justify-center min-h-[160px] sm:min-h-[200px]"
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {glisseComponent}
          </div>
        </div>

        <div className="space-y-2 min-w-0">
          <div className="text-sm text-center text-[var(--docs-text-muted)]">liquidglass-ui</div>
          <div
            className="rounded-2xl overflow-hidden p-6 sm:p-8 flex items-center justify-center min-h-[160px] sm:min-h-[200px]"
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {ourComponent}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ComparisonPage() {
  const [switchChecked, setSwitchChecked] = useState(true);
  const [sliderValue, setSliderValue] = useState(50);
  const [selectedTab, setSelectedTab] = useState('home');
  const [selectedSegment, setSelectedSegment] = useState('all');

  const tabItems = [
    { value: 'home', label: 'Home', icon: <span>🏠</span> },
    { value: 'search', label: 'Search', icon: <span>🔍</span> },
    { value: 'profile', label: 'Profile', icon: <span>👤</span> },
  ];

  const segmentItems = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'done', label: 'Done' },
  ];

  return (
    <div className="min-h-screen py-10 sm:py-12 px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-10 sm:mb-12">
          <Badge variant="secondary" className="mb-4">
            Side-by-Side Comparison
          </Badge>
          <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-bold mb-4 leading-tight">
            glisse vs <span className="gradient-text">liquidglass-ui</span>
          </h1>
          <p className="text-[var(--docs-text-muted)] max-w-2xl mx-auto text-sm sm:text-base">
            Visual comparison of the real glisse package (left) with our implementation (right).
            Both rendered at identical sizes over photographic backgrounds to show edge lensing.
          </p>
        </div>

        <Comparison
          title="Glass Panel / Card"
          background={DETAIL_BG}
          glisseComponent={
            <GlisseGlass className="w-[300px] p-6 rounded-2xl">
              <h3 className="text-white text-xl font-semibold mb-2">Glass Panel</h3>
              <p className="text-white/80 text-sm">
                This is glisse&apos;s Glass component with edge refraction and specular highlights.
              </p>
            </GlisseGlass>
          }
          ourComponent={
            <OurGlassCard className="w-[300px] p-6 rounded-2xl" padding="lg">
              <h3 className="text-white text-xl font-semibold mb-2">Glass Panel</h3>
              <p className="text-white/80 text-sm">
                This is our GlassCard component with glisse-compatible refraction.
              </p>
            </OurGlassCard>
          }
        />

        <Comparison
          title="Glass Button / Pill"
          background={STRIPES_BG}
          glisseComponent={
            <div className="flex flex-col gap-4 items-center">
              <GlisseButton>Glass Button</GlisseButton>
              <GlisseButton variant="filled">Filled Button</GlisseButton>
            </div>
          }
          ourComponent={
            <div className="flex flex-col gap-4 items-center">
              <OurButton variant="glass">Glass Button</OurButton>
              <OurButton variant="filled">Filled Button</OurButton>
            </div>
          }
        />

        <Comparison
          title="Switch / Toggle"
          background={DETAIL_BG}
          glisseComponent={
            <GlisseSwitch checked={switchChecked} onCheckedChange={setSwitchChecked} />
          }
          ourComponent={
            <OurSwitch checked={switchChecked} onCheckedChange={setSwitchChecked} />
          }
        />

        <Comparison
          title="Slider"
          background={STRIPES_BG}
          glisseComponent={
            <div className="w-[250px]">
              <GlisseSlider value={sliderValue} onValueChange={setSliderValue} min={0} max={100} />
            </div>
          }
          ourComponent={
            <div className="w-[250px]">
              <OurSlider value={sliderValue} onValueChange={setSliderValue} min={0} max={100} />
            </div>
          }
        />

        <Comparison
          title="Tab Bar"
          background={DETAIL_BG}
          glisseComponent={
            <GlisseTabBar items={tabItems} value={selectedTab} onValueChange={setSelectedTab} />
          }
          ourComponent={
            <OurTabBar items={tabItems} value={selectedTab} onValueChange={setSelectedTab} />
          }
        />

        <Comparison
          title="Segmented Control"
          background={STRIPES_BG}
          glisseComponent={
            <GlisseSegmentedControl
              items={segmentItems}
              value={selectedSegment}
              onValueChange={setSelectedSegment}
            />
          }
          ourComponent={
            <OurSegmentedControl
              items={segmentItems}
              value={selectedSegment}
              onValueChange={setSelectedSegment}
            />
          }
        />

        <OurGlassCard className="p-6 mt-12 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Implementation Notes</h2>
          <div className="text-sm text-[var(--docs-text-muted)] space-y-2">
            <p>Both implementations use SVG displacement map filters for edge refraction:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Mathematical edge detection using error function (erf)</li>
              <li>Chromatic aberration via separate R/G/B channel displacement</li>
              <li>Specular highlights computed from light angle</li>
              <li>Rim lighting gradient overlay</li>
              <li>ResizeObserver for dynamic size changes</li>
            </ul>
            <p className="mt-4">
              Our implementation is based on{' '}
              <a
                href="https://www.npmjs.com/package/glisse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--docs-accent)] hover:underline"
              >
                glisse
              </a>{' '}
              (MIT License) by Kelvin Zhang.
            </p>
          </div>
        </OurGlassCard>
      </div>
    </div>
  );
}
