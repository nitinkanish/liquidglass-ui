import { useState } from 'react';
import {
  Button,
  IconButton,
  Toggle,
  Input,
  Textarea,
  SearchField,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Slider,
  DatePicker,
  TabBar,
  SegmentedControl,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Modal,
  ModalFooter,
  Sheet,
  Drawer,
  Popover,
  ContextMenu,
  CommandPalette,
  Tooltip,
  useToast,
  Alert,
  Progress,
  Spinner,
  Badge,
  Avatar,
  Chip,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Separator,
  Skeleton,
  Carousel,
  FAB,
  GlassCard,
  Glass,
} from 'liquidglass-ui';
import { CodeBlock } from './CodeBlock';

interface ComponentDemoProps {
  componentName: string;
  slug: string;
}

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

function ToastDemo() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast({ title: 'Toast!', description: 'This is a toast notification.' })}>
      Show Toast
    </Button>
  );
}

export function ComponentDemo({ componentName, slug }: ComponentDemoProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);
  const [sliderValue, setSliderValue] = useState(50);
  const [selectedTab, setSelectedTab] = useState('home');
  const [selectedSegment, setSelectedSegment] = useState('week');
  const [togglePressed, setTogglePressed] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const demos: Record<string, { preview: React.ReactNode; code: string }> = {
    'glass-provider': {
      preview: <p className="text-[var(--docs-text-muted)]">GlassProvider wraps your app - see usage code below.</p>,
      code: `<GlassProvider theme="dark">
  <App />
</GlassProvider>`,
    },
    'glass': {
      preview: (
        <Glass className="p-6 w-full max-w-sm">
          <p>This is a basic Glass panel with backdrop blur.</p>
        </Glass>
      ),
      code: `<Glass className="p-6">
  <p>This is a basic Glass panel with backdrop blur.</p>
</Glass>`,
    },
    'glass-card': {
      preview: (
        <GlassCard className="p-6 w-full max-w-sm">
          <h3 className="font-semibold mb-2">Glass Card</h3>
          <p className="text-sm text-[var(--docs-text-muted)]">A pre-styled card with glass effect.</p>
        </GlassCard>
      ),
      code: `<GlassCard className="p-6">
  <h3>Glass Card</h3>
  <p>A pre-styled card with glass effect.</p>
</GlassCard>`,
    },
    'button': {
      preview: (
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="filled">Filled</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="ghost">Ghost</Button>
          <Button destructive>Destructive</Button>
        </div>
      ),
      code: `<Button>Default</Button>
<Button variant="filled">Filled</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="ghost">Ghost</Button>
<Button destructive>Destructive</Button>`,
    },
    'icon-button': {
      preview: (
        <div className="flex gap-3">
          <IconButton icon={<HeartIcon />} aria-label="Like" />
          <IconButton icon={<SettingsIcon />} variant="filled" aria-label="Settings" />
          <IconButton icon={<HomeIcon />} variant="ghost" aria-label="Home" />
        </div>
      ),
      code: `<IconButton icon={<HeartIcon />} aria-label="Like" />
<IconButton icon={<SettingsIcon />} variant="filled" aria-label="Settings" />`,
    },
    'toggle': {
      preview: (
        <Toggle 
          icon={<HeartIcon />} 
          pressed={togglePressed} 
          onPressedChange={setTogglePressed}
          aria-label="Toggle favorite"
        />
      ),
      code: `<Toggle 
  icon={<HeartIcon />} 
  pressed={pressed} 
  onPressedChange={setPressed}
  aria-label="Toggle favorite"
/>`,
    },
    'input': {
      preview: (
        <Input placeholder="Enter your name" icon={<UserIcon />} className="w-full max-w-sm" />
      ),
      code: `<Input placeholder="Enter your name" icon={<UserIcon />} />`,
    },
    'textarea': {
      preview: (
        <Textarea placeholder="Write your message..." rows={3} className="w-full max-w-sm" />
      ),
      code: `<Textarea placeholder="Write your message..." rows={3} />`,
    },
    'search-field': {
      preview: (
        <SearchField placeholder="Search..." className="w-full max-w-sm" />
      ),
      code: `<SearchField placeholder="Search..." />`,
    },
    'select': {
      preview: (
        <Select
          options={[
            { value: 'react', label: 'React' },
            { value: 'vue', label: 'Vue' },
            { value: 'angular', label: 'Angular' },
          ]}
          placeholder="Select framework"
          className="w-full max-w-sm"
        />
      ),
      code: `<Select
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
  ]}
  placeholder="Select framework"
/>`,
    },
    'checkbox': {
      preview: (
        <div className="space-y-2">
          <Checkbox label="Accept terms" defaultChecked />
          <Checkbox label="Subscribe to newsletter" />
        </div>
      ),
      code: `<Checkbox label="Accept terms" defaultChecked />
<Checkbox label="Subscribe to newsletter" />`,
    },
    'radio': {
      preview: (
        <RadioGroup name="plan" defaultValue="pro">
          <Radio value="free" label="Free Plan" />
          <Radio value="pro" label="Pro Plan" />
          <Radio value="enterprise" label="Enterprise" />
        </RadioGroup>
      ),
      code: `<RadioGroup name="plan" defaultValue="pro">
  <Radio value="free" label="Free Plan" />
  <Radio value="pro" label="Pro Plan" />
</RadioGroup>`,
    },
    'radio-group': {
      preview: (
        <RadioGroup name="example" defaultValue="a">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      ),
      code: `<RadioGroup name="example" defaultValue="a">
  <Radio value="a" label="Option A" />
  <Radio value="b" label="Option B" />
</RadioGroup>`,
    },
    'switch': {
      preview: (
        <div className="flex items-center gap-3">
          <Switch checked={switchOn} onCheckedChange={setSwitchOn} aria-label="Toggle" />
          <span>{switchOn ? 'On' : 'Off'}</span>
        </div>
      ),
      code: `<Switch checked={on} onCheckedChange={setOn} aria-label="Toggle" />`,
    },
    'slider': {
      preview: (
        <div className="w-full max-w-sm">
          <div className="flex justify-between mb-2">
            <span>Volume</span>
            <span>{sliderValue}%</span>
          </div>
          <Slider value={sliderValue} onValueChange={setSliderValue} aria-label="Volume" />
        </div>
      ),
      code: `<Slider value={value} onValueChange={setValue} aria-label="Volume" />`,
    },
    'date-picker': {
      preview: (
        <DatePicker 
          value={selectedDate} 
          onValueChange={setSelectedDate}
          placeholder="Select a date"
        />
      ),
      code: `<DatePicker 
  value={date} 
  onValueChange={setDate}
  placeholder="Select a date"
/>`,
    },
    'tab-bar': {
      preview: (
        <TabBar
          items={[
            { value: 'home', label: 'Home', icon: <HomeIcon /> },
            { value: 'favorites', label: 'Favorites', icon: <HeartIcon /> },
            { value: 'settings', label: 'Settings', icon: <SettingsIcon /> },
          ]}
          value={selectedTab}
          onValueChange={setSelectedTab}
          aria-label="Navigation"
        />
      ),
      code: `<TabBar
  items={[
    { value: 'home', label: 'Home', icon: <HomeIcon /> },
    { value: 'favorites', label: 'Favorites', icon: <HeartIcon /> },
  ]}
  value={tab}
  onValueChange={setTab}
/>`,
    },
    'segmented-control': {
      preview: (
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
      ),
      code: `<SegmentedControl
  items={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
  ]}
  value={segment}
  onValueChange={setSegment}
/>`,
    },
    'tabs': {
      preview: (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <GlassCard className="p-4 mt-4">Overview content here</GlassCard>
          </TabsContent>
          <TabsContent value="analytics">
            <GlassCard className="p-4 mt-4">Analytics content here</GlassCard>
          </TabsContent>
        </Tabs>
      ),
      code: `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="analytics">Analytics content</TabsContent>
</Tabs>`,
    },
    'modal': {
      preview: (
        <>
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Modal open={modalOpen} onOpenChange={setModalOpen} title="Modal Title" description="This is a modal description.">
            <p>Modal content goes here.</p>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="filled" onClick={() => setModalOpen(false)}>Confirm</Button>
            </ModalFooter>
          </Modal>
        </>
      ),
      code: `<Modal open={open} onOpenChange={setOpen} title="Modal Title">
  <p>Modal content goes here.</p>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="filled" onClick={() => setOpen(false)}>Confirm</Button>
  </ModalFooter>
</Modal>`,
    },
    'sheet': {
      preview: (
        <>
          <Button onClick={() => setSheetOpen(true)}>Open Sheet</Button>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="Sheet Title">
            <p className="p-4">Sheet content goes here.</p>
          </Sheet>
        </>
      ),
      code: `<Sheet open={open} onOpenChange={setOpen} title="Sheet Title">
  <p>Sheet content goes here.</p>
</Sheet>`,
    },
    'drawer': {
      preview: (
        <>
          <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} title="Drawer" side="right">
            <p>Drawer content goes here.</p>
          </Drawer>
        </>
      ),
      code: `<Drawer open={open} onOpenChange={setOpen} title="Drawer" side="right">
  <p>Drawer content goes here.</p>
</Drawer>`,
    },
    'popover': {
      preview: (
        <Popover content={<div className="p-4">Popover content</div>}>
          <Button>Open Popover</Button>
        </Popover>
      ),
      code: `<Popover content={<div>Popover content</div>}>
  <Button>Open Popover</Button>
</Popover>`,
    },
    'context-menu': {
      preview: (
        <ContextMenu items={[
          { label: 'Copy', onSelect: () => {} },
          { label: 'Paste', onSelect: () => {} },
          'separator',
          { label: 'Delete', onSelect: () => {}, destructive: true },
        ]}>
          <GlassCard className="p-6 text-center cursor-context-menu">
            Right-click me
          </GlassCard>
        </ContextMenu>
      ),
      code: `<ContextMenu items={[
  { label: 'Copy', onSelect: () => {} },
  { label: 'Paste', onSelect: () => {} },
  'separator',
  { label: 'Delete', onSelect: () => {}, destructive: true },
]}>
  <div>Right-click me</div>
</ContextMenu>`,
    },
    'command-palette': {
      preview: (
        <>
          <Button onClick={() => setCommandOpen(true)}>Open Command Palette</Button>
          <CommandPalette
            open={commandOpen}
            onOpenChange={setCommandOpen}
            items={[
              { id: '1', label: 'New File', onSelect: () => setCommandOpen(false) },
              { id: '2', label: 'Open Settings', onSelect: () => setCommandOpen(false) },
            ]}
          />
        </>
      ),
      code: `<CommandPalette
  open={open}
  onOpenChange={setOpen}
  items={[
    { id: '1', label: 'New File', onSelect: () => {} },
    { id: '2', label: 'Open Settings', onSelect: () => {} },
  ]}
/>`,
    },
    'tooltip': {
      preview: (
        <Tooltip content="This is a tooltip">
          <Button>Hover me</Button>
        </Tooltip>
      ),
      code: `<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>`,
    },
    'toast': {
      preview: <ToastDemo />,
      code: `const { toast } = useToast();

<Button onClick={() => toast({ title: 'Toast!', description: 'Message' })}>
  Show Toast
</Button>`,
    },
    'alert': {
      preview: (
        <div className="space-y-3 w-full max-w-md">
          <Alert variant="info" title="Info">This is an info alert.</Alert>
          <Alert variant="success" title="Success">Operation completed!</Alert>
          <Alert variant="warning" title="Warning">Please review this.</Alert>
          <Alert variant="error" title="Error">Something went wrong.</Alert>
        </div>
      ),
      code: `<Alert variant="info" title="Info">This is an info alert.</Alert>
<Alert variant="success" title="Success">Operation completed!</Alert>`,
    },
    'progress': {
      preview: (
        <div className="space-y-4 w-full max-w-sm">
          <Progress value={65} showValue />
          <div className="flex gap-4">
            <Progress variant="circular" value={75} size="sm" />
            <Progress variant="circular" value={50} size="md" showValue />
          </div>
        </div>
      ),
      code: `<Progress value={65} showValue />
<Progress variant="circular" value={75} />`,
    },
    'spinner': {
      preview: (
        <div className="flex gap-4">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      ),
      code: `<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`,
    },
    'badge': {
      preview: (
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      ),
      code: `<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="destructive">Destructive</Badge>`,
    },
    'avatar': {
      preview: (
        <div className="flex items-center gap-3">
          <Avatar size="xs" alt="John" />
          <Avatar size="sm" alt="Jane" status="online" />
          <Avatar size="md" alt="Bob" status="busy" />
          <Avatar size="lg" src="https://i.pravatar.cc/150?img=3" alt="Alice" />
        </div>
      ),
      code: `<Avatar size="md" alt="John" status="online" />
<Avatar src="https://example.com/avatar.jpg" alt="Jane" />`,
    },
    'chip': {
      preview: (
        <div className="flex flex-wrap gap-2">
          <Chip>React</Chip>
          <Chip variant="filled">TypeScript</Chip>
          <Chip variant="outlined">CSS</Chip>
          <Chip removable onRemove={() => {}}>Removable</Chip>
        </div>
      ),
      code: `<Chip>React</Chip>
<Chip variant="filled">TypeScript</Chip>
<Chip removable onRemove={() => {}}>Removable</Chip>`,
    },
    'accordion': {
      preview: (
        <Accordion type="single" defaultValue="item-1" className="w-full max-w-md">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is LiquidGlass UI?</AccordionTrigger>
            <AccordionContent>
              A React component library with Apple-style glass effects.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes, all components support ARIA and keyboard navigation.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
      code: `<Accordion type="single" defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>Question 1</AccordionTrigger>
    <AccordionContent>Answer 1</AccordionContent>
  </AccordionItem>
</Accordion>`,
    },
    'separator': {
      preview: (
        <div className="w-full max-w-sm">
          <p className="mb-3">Content above</p>
          <Separator />
          <p className="mt-3">Content below</p>
        </div>
      ),
      code: `<Separator />
<Separator orientation="vertical" />`,
    },
    'skeleton': {
      preview: (
        <div className="space-y-3 w-full max-w-sm">
          <Skeleton width="100%" height={20} />
          <Skeleton width="80%" height={20} />
          <div className="flex gap-3">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="space-y-2 flex-1">
              <Skeleton width="60%" height={16} />
              <Skeleton width="40%" height={16} />
            </div>
          </div>
        </div>
      ),
      code: `<Skeleton width="100%" height={20} />
<Skeleton variant="circular" width={40} height={40} />`,
    },
    'carousel': {
      preview: (
        <Carousel showDots showArrows className="w-full max-w-md">
          <GlassCard className="h-32 flex items-center justify-center">Slide 1</GlassCard>
          <GlassCard className="h-32 flex items-center justify-center">Slide 2</GlassCard>
          <GlassCard className="h-32 flex items-center justify-center">Slide 3</GlassCard>
        </Carousel>
      ),
      code: `<Carousel showDots showArrows>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>`,
    },
    'floating-action-button': {
      preview: (
        <div className="relative h-40 w-full">
          <div className="absolute bottom-4 right-4">
            <FAB icon={<PlusIcon />} aria-label="Add" variant="primary" position="bottom-right" style={{ position: 'relative', bottom: 0, right: 0 }} />
          </div>
        </div>
      ),
      code: `<FAB
  icon={<PlusIcon />}
  aria-label="Add new item"
  position="bottom-right"
  variant="primary"
/>`,
    },
  };

  const demo = demos[slug] || {
    preview: <p className="text-[var(--docs-text-muted)]">Demo coming soon for {componentName}</p>,
    code: `import { ${componentName} } from 'liquidglass-ui';`,
  };

  return <CodeBlock code={demo.code} preview={demo.preview} />;
}
