import { useState } from 'react';
import {
  Glass,
  GlassCard,
  Button,
  IconButton,
  Switch,
  Slider,
  TabBar,
  SegmentedControl,
  Dock,
  Chip,
  Badge,
  Input,
  Alert,
  GlassContainer,
} from '@nkanish/liquidglass-ui';

const BACKDROPS = [
  { id: 'mesh', label: 'Gradient', src: `${import.meta.env.BASE_URL}images/gradient-mesh.jpg` },
  { id: 'stripes', label: 'Stripes', src: `${import.meta.env.BASE_URL}images/stripes.jpg` },
  { id: 'text', label: 'Text', src: `${import.meta.env.BASE_URL}images/newspaper.jpg` },
];

const dot = (c: string) => (
  <span style={{ width: 22, height: 22, borderRadius: 11, background: c, display: 'block' }} />
);

const tabItems = [
  { value: 'home', label: 'Home', icon: dot('#007aff') },
  { value: 'fav', label: 'Favorites', icon: dot('#ff375f') },
  { value: 'set', label: 'Settings', icon: dot('#8e8e93') },
];

const dockItems = [
  { id: 'a', label: 'Mail', icon: dot('#0a84ff') },
  { id: 'b', label: 'Music', icon: dot('#ff375f') },
  { id: 'c', label: 'Photos', icon: dot('#ff9f0a') },
  { id: 'd', label: 'Maps', icon: dot('#30d158') },
];

export function ShowcasePage() {
  const [bg, setBg] = useState('mesh');
  const [on, setOn] = useState(true);
  const [val, setVal] = useState(40);
  const src = BACKDROPS.find((b) => b.id === bg)!.src;

  return (
    <div
      data-testid="showcase"
      style={{
        minHeight: '100vh',
        paddingTop: 96,
        paddingBottom: 64,
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 grid gap-8">
        <div className="flex items-center gap-4">
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', textShadow: '0 1px 8px rgb(0 0 0 / .4)' }}>
            Liquid Glass showcase
          </h1>
          <SegmentedControl
            items={BACKDROPS.map((b) => ({ value: b.id, label: b.label }))}
            value={bg}
            onValueChange={setBg}
          />
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <Glass style={{ borderRadius: 28, padding: 20, minHeight: 130 }} className="lg-text">
            <strong>Regular</strong>
            <p style={{ opacity: 0.8, fontSize: 13 }}>Default adaptive material.</p>
          </Glass>
          <Glass variant="subtle" style={{ borderRadius: 28, padding: 20, minHeight: 130 }} className="lg-text">
            <strong>Subtle</strong>
            <p style={{ opacity: 0.8, fontSize: 13 }}>Lighter tint.</p>
          </Glass>
          <GlassCard style={{ borderRadius: 28, padding: 20, minHeight: 130 }}>
            <strong>GlassCard</strong>
            <p style={{ opacity: 0.8, fontSize: 13 }}>Pre-styled card.</p>
          </GlassCard>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Glass effect="clear" dim style={{ borderRadius: 28, padding: 20, minHeight: 100 }} className="lg-text">
            <strong>Clear + dim</strong>
          </Glass>
          <Glass effect="clear" style={{ borderRadius: 28, padding: 20, minHeight: 100 }} className="lg-text">
            <strong>Clear</strong>
          </Glass>
          <Glass tintColor="#0a84ff" style={{ borderRadius: 28, padding: 20, minHeight: 100 }} className="lg-text">
            <strong>tintColor</strong>
          </Glass>
          <Glass colorScheme="dark" interactive elasticity={0.15} style={{ borderRadius: 28, padding: 20, minHeight: 100 }} className="lg-text">
            <strong>Dark + interactive</strong>
          </Glass>
        </section>

        <section className="flex flex-wrap items-center gap-8">
          <GlassContainer spacing={24} gap={10}>
            <Glass style={{ width: 72, height: 72, borderRadius: 36 }} />
            <Glass style={{ width: 72, height: 72, borderRadius: 36 }} />
            <Glass style={{ width: 72, height: 72, borderRadius: 36 }} />
          </GlassContainer>
          <GlassContainer spacing={24} gap={48}>
            <Glass style={{ width: 72, height: 72, borderRadius: 36 }} />
            <Glass style={{ width: 72, height: 72, borderRadius: 36 }} />
          </GlassContainer>
          <Button effect="clear" elasticity={0.15}>Clear button</Button>
        </section>

        <section className="flex flex-wrap items-center gap-4">
          <Button>Glass</Button>
          <Button variant="filled">Filled</Button>
          <Button variant="filled" tint="#ff375f">Tinted</Button>
          <Button size="lg">Large</Button>
          <IconButton aria-label="Add" icon={dot('#fff')} />
          <Chip>Chip</Chip>
          <Badge>Badge</Badge>
        </section>

        <section className="flex flex-wrap items-center gap-6">
          <Switch checked={on} onCheckedChange={setOn} aria-label="Switch" />
          <div style={{ width: 240 }}>
            <Slider value={val} onValueChange={setVal} min={0} max={100} aria-label="Slider" />
          </div>
          <Input placeholder="Input field" style={{ width: 220 }} />
        </section>

        <section className="flex flex-wrap items-center gap-8">
          <TabBar items={tabItems} defaultValue="home" />
          <Dock items={dockItems} />
        </section>

        <Alert title="Heads up">Alerts, toasts, sheets and menus all share the same glass tokens.</Alert>
      </div>
    </div>
  );
}
