import { useState } from 'react';
import {
  GlassCard,
  Button,
  IconButton,
  Switch,
  Slider,
  Input,
  SearchField,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  SegmentedControl,
  TabBar,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
  Avatar,
  Progress,
  Spinner,
  useToast,
  Modal,
  ModalFooter,
  Tooltip,
  Alert,
  Chip,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Separator,
  Toggle,
  useTheme,
  Drawer,
  Popover,
  ContextMenu,
  CommandPalette,
  Carousel,
  FAB,
  DatePicker,
} from 'liquidglass-ui';

const HomeIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const HeartIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const UserIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SunIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);


const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);


function App() {
  const { setTheme, resolvedTheme } = useTheme();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [volume, setVolume] = useState(65);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [selectedTab, setSelectedTab] = useState('home');
  const [selectedSegment, setSelectedSegment] = useState('week');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const commandItems = [
    { id: 'new-file', label: 'Create New File', description: 'Create a blank file', icon: <FileIcon />, onSelect: () => toast({ title: 'Creating file...' }), group: 'files' },
    { id: 'open', label: 'Open File', description: 'Open an existing file', icon: <FileIcon />, shortcut: '⌘O', onSelect: () => toast({ title: 'Opening...' }), group: 'files' },
    { id: 'search', label: 'Search Everything', description: 'Search across all files', icon: <SearchIcon />, shortcut: '⌘⇧F', onSelect: () => toast({ title: 'Searching...' }) },
    { id: 'settings', label: 'Open Settings', description: 'Configure preferences', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>, shortcut: '⌘,', onSelect: () => toast({ title: 'Opening settings...' }) },
  ];

  const contextMenuItems = [
    { label: 'Copy', shortcut: '⌘C', onSelect: () => toast({ title: 'Copied!' }) },
    { label: 'Paste', shortcut: '⌘V', onSelect: () => toast({ title: 'Pasted!' }) },
    'separator' as const,
    { label: 'Delete', destructive: true, onSelect: () => toast({ title: 'Deleted!', variant: 'error' as const }) },
  ];

  return (
    <div className="min-h-screen demo-bg">
      {/* Header */}
      <header className="sticky top-0 z-50">
        <GlassCard padding="none" radius="sm" className="mx-4 mt-4 !rounded-2xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">LG</span>
              </div>
              <span className="font-semibold text-lg">LiquidGlass UI</span>
            </div>
            <div className="flex items-center gap-2">
              <Toggle
                icon={resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
                pressed={resolvedTheme === 'dark'}
                onPressedChange={(pressed) => setTheme(pressed ? 'dark' : 'light')}
                aria-label="Toggle dark mode"
              />
            </div>
          </div>
        </GlassCard>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
          LiquidGlass UI
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Advanced Apple Liquid Glass (iOS 26 / macOS Tahoe) UI component library for React.
          Beautiful glassmorphism with SVG refraction effects, backdrop blur, and smooth animations.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button variant="filled" size="lg" onClick={() => toast({ title: 'Welcome!', description: 'Thanks for trying LiquidGlass UI', variant: 'success' })}>
            Get Started
          </Button>
          <Button variant="glass" size="lg">
            View on GitHub
          </Button>
        </div>
      </section>

      {/* Demo Sections */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-8">
        {/* Buttons */}
        <GlassCard>
          <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="filled">Filled</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="ghost">Ghost</Button>
            <Button destructive>Destructive</Button>
            <Button variant="filled" tint="#8b5cf6">Custom Tint</Button>
            <Button icon={<HeartIcon />}>With Icon</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex gap-4 mt-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex gap-4 mt-4">
            <IconButton icon={<HomeIcon />} aria-label="Home" />
            <IconButton icon={<HeartIcon />} variant="filled" aria-label="Like" />
            <IconButton icon={<SettingsIcon />} variant="ghost" aria-label="Settings" />
          </div>
        </GlassCard>

        {/* Form Controls */}
        <GlassCard>
          <h2 className="text-2xl font-semibold mb-6">Form Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Input & Search</h3>
              <Input placeholder="Enter your name" icon={<UserIcon />} />
              <SearchField placeholder="Search..." />
              <Select
                options={[
                  { value: 'react', label: 'React' },
                  { value: 'vue', label: 'Vue' },
                  { value: 'angular', label: 'Angular' },
                  { value: 'svelte', label: 'Svelte' },
                ]}
                placeholder="Select framework"
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Toggle & Slider</h3>
              <div className="flex items-center gap-3">
                <Switch checked={wifiEnabled} onCheckedChange={setWifiEnabled} aria-label="Wi-Fi" />
                <span>Wi-Fi {wifiEnabled ? 'On' : 'Off'}</span>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Volume</span>
                  <span>{volume}%</span>
                </div>
                <Slider value={volume} onValueChange={setVolume} aria-label="Volume" />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium mb-2">Checkbox</h3>
              <Checkbox label="Accept terms and conditions" defaultChecked />
              <Checkbox label="Subscribe to newsletter" />
              <Checkbox label="Remember me" disabled />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Radio Group</h3>
              <RadioGroup name="plan" defaultValue="pro">
                <Radio value="free" label="Free Plan" />
                <Radio value="pro" label="Pro Plan" />
                <Radio value="enterprise" label="Enterprise" />
              </RadioGroup>
            </div>
          </div>
        </GlassCard>

        {/* Navigation */}
        <GlassCard>
          <h2 className="text-2xl font-semibold mb-6">Navigation</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Segmented Control</h3>
              <SegmentedControl
                items={[
                  { value: 'day', label: 'Day' },
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                ]}
                value={selectedSegment}
                onValueChange={setSelectedSegment}
                aria-label="Time range"
              />
            </div>

            <div>
              <h3 className="font-medium mb-3">Tab Bar (iOS Style)</h3>
              <TabBar
                items={[
                  { value: 'home', label: 'Home', icon: <HomeIcon /> },
                  { value: 'favorites', label: 'Favorites', icon: <HeartIcon /> },
                  { value: 'profile', label: 'Profile', icon: <UserIcon /> },
                  { value: 'settings', label: 'Settings', icon: <SettingsIcon /> },
                ]}
                value={selectedTab}
                onValueChange={setSelectedTab}
                aria-label="Main navigation"
              />
            </div>

            <div>
              <h3 className="font-medium mb-3">Tabs</h3>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <GlassCard variant="outlined" padding="sm" className="mt-4">
                    Overview content with stats and summaries.
                  </GlassCard>
                </TabsContent>
                <TabsContent value="analytics">
                  <GlassCard variant="outlined" padding="sm" className="mt-4">
                    Analytics data and charts go here.
                  </GlassCard>
                </TabsContent>
                <TabsContent value="reports">
                  <GlassCard variant="outlined" padding="sm" className="mt-4">
                    Reports and downloadable content.
                  </GlassCard>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </GlassCard>

        {/* Data Display */}
        <GlassCard>
          <h2 className="text-2xl font-semibold mb-6">Data Display</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Avatars</h3>
              <div className="flex items-center gap-3">
                <Avatar size="xs" alt="John" />
                <Avatar size="sm" alt="Jane" status="online" />
                <Avatar size="md" alt="Bob" status="busy" />
                <Avatar size="lg" src="https://i.pravatar.cc/150?img=3" alt="Alice" />
                <Avatar size="xl" src="https://i.pravatar.cc/150?img=5" alt="Charlie" status="away" />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Chips</h3>
              <div className="flex flex-wrap gap-2">
                <Chip>React</Chip>
                <Chip variant="filled">TypeScript</Chip>
                <Chip variant="outlined">CSS</Chip>
                <Chip removable onRemove={() => {}}>Removable</Chip>
                <Chip selected onClick={() => {}}>Selected</Chip>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Progress</h3>
              <div className="space-y-4">
                <Progress value={65} showValue />
                <div className="flex gap-4">
                  <Progress variant="circular" value={75} size="sm" />
                  <Progress variant="circular" value={50} size="md" showValue />
                  <Progress variant="circular" indeterminate size="lg" />
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-medium mb-3">Accordion</h3>
            <Accordion type="single" defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is LiquidGlass UI?</AccordionTrigger>
                <AccordionContent>
                  LiquidGlass UI is an advanced Apple Liquid Glass component library for React,
                  featuring SVG refraction effects, backdrop blur, and smooth animations.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes! All components are built with accessibility in mind, including ARIA
                  attributes, keyboard navigation, and screen reader support.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I customize the theme?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. Use CSS custom properties to customize colors, blur intensity,
                  and more. The GlassProvider also accepts a config prop for programmatic theming.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </GlassCard>

        {/* Feedback */}
        <GlassCard>
          <h2 className="text-2xl font-semibold mb-6">Feedback</h2>
          
          <div className="space-y-4">
            <Alert variant="info" title="Information">
              This is an informational alert with helpful details.
            </Alert>
            <Alert variant="success" title="Success!">
              Your changes have been saved successfully.
            </Alert>
            <Alert variant="warning" title="Warning">
              Please review your settings before continuing.
            </Alert>
            <Alert variant="error" title="Error">
              Something went wrong. Please try again.
            </Alert>
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={() => toast({ title: 'Notification', description: 'This is a toast message' })}>
              Show Toast
            </Button>
            <Button onClick={() => toast({ title: 'Saved!', variant: 'success' })}>
              Success Toast
            </Button>
            <Button onClick={() => setModalOpen(true)}>
              Open Modal
            </Button>
            <Tooltip content="This is a helpful tooltip!">
              <Button variant="outlined">Hover for Tooltip</Button>
            </Tooltip>
          </div>
        </GlassCard>

        {/* Loading States */}
        <GlassCard>
          <h2 className="text-2xl font-semibold mb-6">Loading States</h2>
          <div className="flex items-center gap-6">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
            <Spinner size={48} color="var(--lg-accent)" />
          </div>
        </GlassCard>

        {/* Advanced Overlays */}
        <GlassCard>
          <h2 className="text-2xl font-semibold mb-6">Advanced Overlays</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Drawer</h3>
              <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Popover</h3>
              <div className="flex gap-4">
                <Popover
                  content={
                    <div className="w-64">
                      <h4 className="font-semibold mb-2">Popover Content</h4>
                      <p className="text-sm text-[var(--lg-muted)]">
                        This is a glass popover with some helpful content inside.
                      </p>
                    </div>
                  }
                >
                  <Button variant="outlined">Click Me</Button>
                </Popover>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Context Menu</h3>
              <ContextMenu items={contextMenuItems}>
                <GlassCard variant="outlined" padding="md" className="cursor-context-menu text-center">
                  Right-click this card to see the context menu
                </GlassCard>
              </ContextMenu>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Command Palette</h3>
              <Button onClick={() => setCommandPaletteOpen(true)}>
                Open Command Palette (⌘K)
              </Button>
              <p className="text-sm text-[var(--lg-muted)] mt-2">
                Try searching for "file" or "settings"
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Carousel */}
        <GlassCard>
          <h2 className="text-2xl font-semibold mb-6">Carousel</h2>
          <Carousel showDots showArrows>
            <GlassCard variant="elevated" className="h-48 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🎨</div>
                <h3 className="text-xl font-semibold">Beautiful Design</h3>
                <p className="text-[var(--lg-muted)]">Apple-inspired glass aesthetics</p>
              </div>
            </GlassCard>
            <GlassCard variant="elevated" className="h-48 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">♿</div>
                <h3 className="text-xl font-semibold">Fully Accessible</h3>
                <p className="text-[var(--lg-muted)]">ARIA compliant & keyboard navigable</p>
              </div>
            </GlassCard>
            <GlassCard variant="elevated" className="h-48 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="text-xl font-semibold">High Performance</h3>
                <p className="text-[var(--lg-muted)]">GPU-accelerated animations</p>
              </div>
            </GlassCard>
          </Carousel>
        </GlassCard>

        {/* Date Picker */}
        <GlassCard>
          <h2 className="text-2xl font-semibold mb-6">Date Picker</h2>
          <div className="flex flex-wrap items-center gap-4">
            <DatePicker 
              value={selectedDate}
              onValueChange={setSelectedDate}
              placeholder="Choose a date"
            />
            {selectedDate && (
              <Badge variant="secondary">
                Selected: {selectedDate.toLocaleDateString()}
              </Badge>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Floating Action Button Demo */}
      <FAB
        icon={<PlusIcon />}
        aria-label="Add new item"
        position="bottom-right"
        variant="primary"
        onClick={() => toast({ title: 'FAB clicked!', description: 'Floating Action Button works great.' })}
      />

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Settings"
        description="Customize your preferences"
      >
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            <Switch defaultChecked aria-label="Notifications" />
          </div>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch 
              checked={resolvedTheme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              aria-label="Dark mode"
            />
          </div>
          <Separator />
          <Button variant="filled" className="w-full" onClick={() => setDrawerOpen(false)}>
            Save Settings
          </Button>
        </div>
      </Drawer>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        items={commandItems}
        groups={{ files: 'Files' }}
      />

      {/* Footer */}
      <footer className="text-center py-8 text-white/60">
        <p>Developed by Nitin Kanish, Debugged Pro</p>
        <p className="text-sm mt-1">MIT License &copy; 2026</p>
      </footer>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Welcome to LiquidGlass UI"
        description="Experience the beauty of Apple's Liquid Glass design on the web."
      >
        <p className="mb-4">
          This modal demonstrates the glass effect with backdrop blur and subtle animations.
          All components are fully accessible and keyboard navigable.
        </p>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="filled" onClick={() => setModalOpen(false)}>
            Got it!
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
