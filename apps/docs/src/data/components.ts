export interface ComponentProp {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export interface ComponentData {
  name: string;
  slug: string;
  description: string;
  category: string;
  props: ComponentProp[];
}

export const categories = [
  { id: 'layout', name: 'Layout', icon: '📐' },
  { id: 'buttons', name: 'Buttons', icon: '🔘' },
  { id: 'forms', name: 'Forms', icon: '📝' },
  { id: 'navigation', name: 'Navigation', icon: '🧭' },
  { id: 'overlays', name: 'Overlays', icon: '🎭' },
  { id: 'feedback', name: 'Feedback', icon: '💬' },
  { id: 'data-display', name: 'Data Display', icon: '📊' },
  { id: 'actions', name: 'Actions', icon: '⚡' },
];

export const components: ComponentData[] = [
  // Layout
  {
    name: 'GlassProvider',
    slug: 'glass-provider',
    description: 'Theme provider that wraps your app and provides glass styling context.',
    category: 'layout',
    props: [
      { name: 'theme', type: "'light' | 'dark' | 'system'", default: "'system'", description: 'Color theme mode' },
      { name: 'config', type: 'GlassConfig', description: 'Configuration for blur, saturation, accent color' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Child elements' },
    ],
  },
  {
    name: 'Glass',
    slug: 'glass',
    description: 'Base glass panel component with backdrop blur and optional refraction effects.',
    category: 'layout',
    props: [
      { name: 'variant', type: "'default' | 'elevated' | 'outlined'", default: "'default'", description: 'Visual variant' },
      { name: 'blur', type: 'number', default: '3', description: 'Blur intensity in pixels' },
      { name: 'className', type: 'string', description: 'Additional CSS classes' },
    ],
  },
  {
    name: 'GlassCard',
    slug: 'glass-card',
    description: 'Pre-styled card with glass effect, commonly used for content containers.',
    category: 'layout',
    props: [
      { name: 'variant', type: "'default' | 'elevated' | 'outlined'", default: "'default'", description: 'Visual variant' },
      { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Internal padding' },
      { name: 'radius', type: "'none' | 'sm' | 'md' | 'lg' | 'xl'", default: "'lg'", description: 'Border radius' },
    ],
  },
  // Buttons
  {
    name: 'Button',
    slug: 'button',
    description: 'Primary button component with glass styling and multiple variants.',
    category: 'buttons',
    props: [
      { name: 'variant', type: "'glass' | 'filled' | 'outlined' | 'ghost'", default: "'glass'", description: 'Button style variant' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size' },
      { name: 'destructive', type: 'boolean', default: 'false', description: 'Destructive/danger styling' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading spinner' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button' },
      { name: 'icon', type: 'ReactNode', description: 'Icon to display before text' },
      { name: 'tint', type: 'string', description: 'Custom accent color' },
    ],
  },
  {
    name: 'IconButton',
    slug: 'icon-button',
    description: 'Button containing only an icon, commonly used for toolbars.',
    category: 'buttons',
    props: [
      { name: 'icon', type: 'ReactNode', required: true, description: 'Icon element' },
      { name: 'variant', type: "'glass' | 'filled' | 'ghost'", default: "'glass'", description: 'Button style' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size' },
      { name: 'aria-label', type: 'string', required: true, description: 'Accessibility label' },
    ],
  },
  {
    name: 'Toggle',
    slug: 'toggle',
    description: 'Toggle button that can be pressed/unpressed, like a checkbox button.',
    category: 'buttons',
    props: [
      { name: 'pressed', type: 'boolean', description: 'Controlled pressed state' },
      { name: 'defaultPressed', type: 'boolean', default: 'false', description: 'Initial pressed state' },
      { name: 'onPressedChange', type: '(pressed: boolean) => void', description: 'Callback when pressed changes' },
      { name: 'icon', type: 'ReactNode', description: 'Icon to display' },
    ],
  },
  // Forms
  {
    name: 'Input',
    slug: 'input',
    description: 'Text input field with glass styling.',
    category: 'forms',
    props: [
      { name: 'value', type: 'string', description: 'Controlled value' },
      { name: 'defaultValue', type: 'string', description: 'Initial value' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Change callback' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text' },
      { name: 'icon', type: 'ReactNode', description: 'Leading icon' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input' },
    ],
  },
  {
    name: 'Textarea',
    slug: 'textarea',
    description: 'Multi-line text input with glass styling.',
    category: 'forms',
    props: [
      { name: 'value', type: 'string', description: 'Controlled value' },
      { name: 'defaultValue', type: 'string', description: 'Initial value' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Change callback' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text' },
      { name: 'rows', type: 'number', default: '3', description: 'Number of visible rows' },
    ],
  },
  {
    name: 'SearchField',
    slug: 'search-field',
    description: 'Search input with magnifying glass icon and clear button.',
    category: 'forms',
    props: [
      { name: 'value', type: 'string', description: 'Controlled value' },
      { name: 'defaultValue', type: 'string', description: 'Initial value' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Change callback' },
      { name: 'placeholder', type: 'string', default: "'Search...'", description: 'Placeholder text' },
      { name: 'onSearch', type: '(value: string) => void', description: 'Search submit callback' },
    ],
  },
  {
    name: 'Select',
    slug: 'select',
    description: 'Dropdown select component with glass styling.',
    category: 'forms',
    props: [
      { name: 'options', type: 'SelectOption[]', required: true, description: 'Array of options' },
      { name: 'value', type: 'string', description: 'Controlled selected value' },
      { name: 'defaultValue', type: 'string', description: 'Initial selected value' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Change callback' },
      { name: 'placeholder', type: 'string', description: 'Placeholder when nothing selected' },
    ],
  },
  {
    name: 'Checkbox',
    slug: 'checkbox',
    description: 'Checkbox input with label.',
    category: 'forms',
    props: [
      { name: 'checked', type: 'boolean', description: 'Controlled checked state' },
      { name: 'defaultChecked', type: 'boolean', description: 'Initial checked state' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Change callback' },
      { name: 'label', type: 'string', description: 'Label text' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the checkbox' },
    ],
  },
  {
    name: 'Radio',
    slug: 'radio',
    description: 'Radio button input, used within RadioGroup.',
    category: 'forms',
    props: [
      { name: 'value', type: 'string', required: true, description: 'Value for this option' },
      { name: 'label', type: 'string', description: 'Label text' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the radio' },
    ],
  },
  {
    name: 'RadioGroup',
    slug: 'radio-group',
    description: 'Container for Radio buttons ensuring single selection.',
    category: 'forms',
    props: [
      { name: 'name', type: 'string', required: true, description: 'Form field name' },
      { name: 'value', type: 'string', description: 'Controlled selected value' },
      { name: 'defaultValue', type: 'string', description: 'Initial selected value' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Change callback' },
    ],
  },
  {
    name: 'Switch',
    slug: 'switch',
    description: 'Toggle switch for boolean values.',
    category: 'forms',
    props: [
      { name: 'checked', type: 'boolean', description: 'Controlled checked state' },
      { name: 'defaultChecked', type: 'boolean', description: 'Initial checked state' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Change callback' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the switch' },
      { name: 'aria-label', type: 'string', required: true, description: 'Accessibility label' },
    ],
  },
  {
    name: 'Slider',
    slug: 'slider',
    description: 'Range slider for numeric values.',
    category: 'forms',
    props: [
      { name: 'value', type: 'number', description: 'Controlled value' },
      { name: 'defaultValue', type: 'number', default: '0', description: 'Initial value' },
      { name: 'onValueChange', type: '(value: number) => void', description: 'Change callback' },
      { name: 'min', type: 'number', default: '0', description: 'Minimum value' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
      { name: 'step', type: 'number', default: '1', description: 'Step increment' },
    ],
  },
  {
    name: 'DatePicker',
    slug: 'date-picker',
    description: 'Calendar date picker with keyboard navigation.',
    category: 'forms',
    props: [
      { name: 'value', type: 'Date | null', description: 'Controlled selected date' },
      { name: 'defaultValue', type: 'Date | null', description: 'Initial selected date' },
      { name: 'onValueChange', type: '(date: Date | null) => void', description: 'Change callback' },
      { name: 'minDate', type: 'Date', description: 'Minimum selectable date' },
      { name: 'maxDate', type: 'Date', description: 'Maximum selectable date' },
      { name: 'placeholder', type: 'string', default: "'Select date'", description: 'Placeholder text' },
    ],
  },
  // Navigation
  {
    name: 'TabBar',
    slug: 'tab-bar',
    description: 'iOS-style bottom tab bar navigation.',
    category: 'navigation',
    props: [
      { name: 'items', type: 'TabBarItem[]', required: true, description: 'Array of tab items' },
      { name: 'value', type: 'string', description: 'Controlled selected tab' },
      { name: 'defaultValue', type: 'string', description: 'Initial selected tab' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Change callback' },
    ],
  },
  {
    name: 'SegmentedControl',
    slug: 'segmented-control',
    description: 'Segmented control for switching between options.',
    category: 'navigation',
    props: [
      { name: 'items', type: 'SegmentedControlItem[]', required: true, description: 'Array of segments' },
      { name: 'value', type: 'string', description: 'Controlled selected value' },
      { name: 'defaultValue', type: 'string', description: 'Initial selected value' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Change callback' },
    ],
  },
  {
    name: 'Tabs',
    slug: 'tabs',
    description: 'Tab container for organizing content into panels.',
    category: 'navigation',
    props: [
      { name: 'defaultValue', type: 'string', description: 'Initially active tab' },
      { name: 'value', type: 'string', description: 'Controlled active tab' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Change callback' },
    ],
  },
  {
    name: 'TabsList',
    slug: 'tabs-list',
    description: 'Container for tab triggers.',
    category: 'navigation',
    props: [],
  },
  {
    name: 'TabsTrigger',
    slug: 'tabs-trigger',
    description: 'Button that activates a tab panel.',
    category: 'navigation',
    props: [
      { name: 'value', type: 'string', required: true, description: 'Tab value identifier' },
    ],
  },
  {
    name: 'TabsContent',
    slug: 'tabs-content',
    description: 'Content panel shown when its tab is active.',
    category: 'navigation',
    props: [
      { name: 'value', type: 'string', required: true, description: 'Tab value this content belongs to' },
    ],
  },
  {
    name: 'Navbar',
    slug: 'navbar',
    description: 'Top navigation bar with glass effect.',
    category: 'navigation',
    props: [
      { name: 'sticky', type: 'boolean', default: 'true', description: 'Stick to top on scroll' },
      { name: 'blur', type: 'boolean', default: 'true', description: 'Apply blur when scrolled' },
    ],
  },
  {
    name: 'NavbarLink',
    slug: 'navbar-link',
    description: 'Link component for use within Navbar.',
    category: 'navigation',
    props: [
      { name: 'href', type: 'string', required: true, description: 'Link URL' },
      { name: 'active', type: 'boolean', description: 'Active state styling' },
    ],
  },
  {
    name: 'Sidebar',
    slug: 'sidebar',
    description: 'Collapsible side navigation panel.',
    category: 'navigation',
    props: [
      { name: 'collapsed', type: 'boolean', description: 'Controlled collapsed state' },
      { name: 'defaultCollapsed', type: 'boolean', default: 'false', description: 'Initial collapsed state' },
      { name: 'onCollapsedChange', type: '(collapsed: boolean) => void', description: 'Change callback' },
    ],
  },
  {
    name: 'SidebarItem',
    slug: 'sidebar-item',
    description: 'Navigation item within Sidebar.',
    category: 'navigation',
    props: [
      { name: 'icon', type: 'ReactNode', description: 'Item icon' },
      { name: 'label', type: 'string', required: true, description: 'Item label' },
      { name: 'active', type: 'boolean', description: 'Active state' },
      { name: 'href', type: 'string', description: 'Link URL' },
      { name: 'onClick', type: '() => void', description: 'Click handler' },
    ],
  },
  {
    name: 'SidebarGroup',
    slug: 'sidebar-group',
    description: 'Group of related sidebar items with optional label.',
    category: 'navigation',
    props: [
      { name: 'label', type: 'string', description: 'Group label' },
    ],
  },
  {
    name: 'Dock',
    slug: 'dock',
    description: 'macOS-style dock with magnification effect.',
    category: 'navigation',
    props: [
      { name: 'items', type: 'DockItem[]', required: true, description: 'Array of dock items' },
      { name: 'position', type: "'bottom' | 'left' | 'right'", default: "'bottom'", description: 'Dock position' },
      { name: 'magnification', type: 'boolean', default: 'true', description: 'Enable hover magnification' },
    ],
  },
  {
    name: 'Carousel',
    slug: 'carousel',
    description: 'Carousel/slider for displaying multiple items.',
    category: 'navigation',
    props: [
      { name: 'autoPlay', type: 'boolean', default: 'false', description: 'Auto-advance slides' },
      { name: 'autoPlayInterval', type: 'number', default: '5000', description: 'Auto-play interval in ms' },
      { name: 'showDots', type: 'boolean', default: 'true', description: 'Show dot indicators' },
      { name: 'showArrows', type: 'boolean', default: 'true', description: 'Show navigation arrows' },
      { name: 'loop', type: 'boolean', default: 'true', description: 'Loop back to start' },
    ],
  },
  // Overlays
  {
    name: 'Modal',
    slug: 'modal',
    description: 'Modal dialog with glass effect backdrop.',
    category: 'overlays',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controlled open state' },
      { name: 'onOpenChange', type: '(open: boolean) => void', required: true, description: 'Open state callback' },
      { name: 'title', type: 'string', description: 'Modal title' },
      { name: 'description', type: 'string', description: 'Modal description' },
    ],
  },
  {
    name: 'ModalFooter',
    slug: 'modal-footer',
    description: 'Footer section for Modal with action buttons.',
    category: 'overlays',
    props: [],
  },
  {
    name: 'Sheet',
    slug: 'sheet',
    description: 'Bottom sheet overlay that slides up.',
    category: 'overlays',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controlled open state' },
      { name: 'onOpenChange', type: '(open: boolean) => void', required: true, description: 'Open state callback' },
      { name: 'title', type: 'string', description: 'Sheet title' },
    ],
  },
  {
    name: 'Drawer',
    slug: 'drawer',
    description: 'Side drawer that slides in from left or right.',
    category: 'overlays',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controlled open state' },
      { name: 'onOpenChange', type: '(open: boolean) => void', required: true, description: 'Open state callback' },
      { name: 'side', type: "'left' | 'right'", default: "'right'", description: 'Side to slide from' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Drawer width' },
      { name: 'title', type: 'string', description: 'Drawer title' },
    ],
  },
  {
    name: 'Popover',
    slug: 'popover',
    description: 'Floating popover anchored to a trigger element.',
    category: 'overlays',
    props: [
      { name: 'content', type: 'ReactNode', required: true, description: 'Popover content' },
      { name: 'open', type: 'boolean', description: 'Controlled open state' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Open state callback' },
      { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'bottom'", description: 'Preferred side' },
      { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", description: 'Alignment' },
    ],
  },
  {
    name: 'Menu',
    slug: 'menu',
    description: 'Dropdown menu with items and separators.',
    category: 'overlays',
    props: [
      { name: 'items', type: 'MenuItem[]', required: true, description: 'Array of menu items' },
      { name: 'icon', type: 'ReactNode', description: 'Trigger icon' },
      { name: 'align', type: "'start' | 'end'", default: "'start'", description: 'Menu alignment' },
    ],
  },
  {
    name: 'ContextMenu',
    slug: 'context-menu',
    description: 'Right-click context menu.',
    category: 'overlays',
    props: [
      { name: 'items', type: 'ContextMenuEntry[]', required: true, description: 'Array of menu items' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable context menu' },
    ],
  },
  {
    name: 'CommandPalette',
    slug: 'command-palette',
    description: 'Searchable command palette (Cmd+K style).',
    category: 'overlays',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controlled open state' },
      { name: 'onOpenChange', type: '(open: boolean) => void', required: true, description: 'Open state callback' },
      { name: 'items', type: 'CommandItem[]', required: true, description: 'Array of commands' },
      { name: 'placeholder', type: 'string', default: "'Type a command...'", description: 'Search placeholder' },
      { name: 'groups', type: 'Record<string, string>', description: 'Group labels' },
    ],
  },
  {
    name: 'Tooltip',
    slug: 'tooltip',
    description: 'Tooltip that appears on hover.',
    category: 'overlays',
    props: [
      { name: 'content', type: 'ReactNode', required: true, description: 'Tooltip content' },
      { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", description: 'Preferred side' },
      { name: 'delay', type: 'number', default: '300', description: 'Show delay in ms' },
    ],
  },
  // Feedback
  {
    name: 'Toast',
    slug: 'toast',
    description: 'Toast notification that appears temporarily.',
    category: 'feedback',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Toast title' },
      { name: 'description', type: 'string', description: 'Toast description' },
      { name: 'variant', type: "'default' | 'success' | 'error' | 'warning'", default: "'default'", description: 'Toast variant' },
      { name: 'duration', type: 'number', default: '5000', description: 'Duration in ms' },
    ],
  },
  {
    name: 'ToastProvider',
    slug: 'toast-provider',
    description: 'Provider component for toast notifications.',
    category: 'feedback',
    props: [
      { name: 'position', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", default: "'bottom-right'", description: 'Toast position' },
    ],
  },
  {
    name: 'Alert',
    slug: 'alert',
    description: 'Static alert/banner for important messages.',
    category: 'feedback',
    props: [
      { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: 'Alert variant' },
      { name: 'title', type: 'string', description: 'Alert title' },
      { name: 'dismissible', type: 'boolean', default: 'false', description: 'Show dismiss button' },
      { name: 'onDismiss', type: '() => void', description: 'Dismiss callback' },
    ],
  },
  {
    name: 'Progress',
    slug: 'progress',
    description: 'Progress indicator (linear or circular).',
    category: 'feedback',
    props: [
      { name: 'value', type: 'number', description: 'Progress value (0-100)' },
      { name: 'variant', type: "'linear' | 'circular'", default: "'linear'", description: 'Progress variant' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Show indeterminate animation' },
      { name: 'showValue', type: 'boolean', default: 'false', description: 'Show percentage value' },
    ],
  },
  {
    name: 'Spinner',
    slug: 'spinner',
    description: 'Loading spinner animation.',
    category: 'feedback',
    props: [
      { name: 'size', type: "number | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Spinner size' },
      { name: 'color', type: 'string', description: 'Custom color' },
    ],
  },
  // Data Display
  {
    name: 'Badge',
    slug: 'badge',
    description: 'Small badge/tag for status or labels.',
    category: 'data-display',
    props: [
      { name: 'variant', type: "'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'", default: "'default'", description: 'Badge variant' },
    ],
  },
  {
    name: 'Avatar',
    slug: 'avatar',
    description: 'User avatar with image or initials fallback.',
    category: 'data-display',
    props: [
      { name: 'src', type: 'string', description: 'Image URL' },
      { name: 'alt', type: 'string', required: true, description: 'Alt text / name for initials' },
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Avatar size' },
      { name: 'status', type: "'online' | 'offline' | 'busy' | 'away'", description: 'Status indicator' },
    ],
  },
  {
    name: 'Chip',
    slug: 'chip',
    description: 'Chip/tag for selections or filters.',
    category: 'data-display',
    props: [
      { name: 'variant', type: "'default' | 'filled' | 'outlined'", default: "'default'", description: 'Chip variant' },
      { name: 'removable', type: 'boolean', default: 'false', description: 'Show remove button' },
      { name: 'onRemove', type: '() => void', description: 'Remove callback' },
      { name: 'selected', type: 'boolean', description: 'Selected state' },
      { name: 'onClick', type: '() => void', description: 'Click handler' },
    ],
  },
  {
    name: 'Accordion',
    slug: 'accordion',
    description: 'Expandable accordion container.',
    category: 'data-display',
    props: [
      { name: 'type', type: "'single' | 'multiple'", default: "'single'", description: 'Single or multiple open items' },
      { name: 'defaultValue', type: 'string | string[]', description: 'Initially open item(s)' },
      { name: 'collapsible', type: 'boolean', default: 'true', description: 'Allow collapsing all items' },
    ],
  },
  {
    name: 'AccordionItem',
    slug: 'accordion-item',
    description: 'Individual accordion item.',
    category: 'data-display',
    props: [
      { name: 'value', type: 'string', required: true, description: 'Unique identifier' },
    ],
  },
  {
    name: 'AccordionTrigger',
    slug: 'accordion-trigger',
    description: 'Clickable header that toggles accordion item.',
    category: 'data-display',
    props: [],
  },
  {
    name: 'AccordionContent',
    slug: 'accordion-content',
    description: 'Content revealed when accordion item is open.',
    category: 'data-display',
    props: [],
  },
  {
    name: 'Separator',
    slug: 'separator',
    description: 'Visual separator line.',
    category: 'data-display',
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Separator direction' },
    ],
  },
  {
    name: 'Skeleton',
    slug: 'skeleton',
    description: 'Loading placeholder skeleton.',
    category: 'data-display',
    props: [
      { name: 'width', type: 'string | number', description: 'Skeleton width' },
      { name: 'height', type: 'string | number', description: 'Skeleton height' },
      { name: 'variant', type: "'text' | 'circular' | 'rectangular'", default: "'text'", description: 'Shape variant' },
    ],
  },
  // Actions
  {
    name: 'FloatingActionButton',
    slug: 'floating-action-button',
    description: 'Floating action button (FAB) for primary actions.',
    category: 'actions',
    props: [
      { name: 'icon', type: 'ReactNode', required: true, description: 'FAB icon' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'FAB size' },
      { name: 'variant', type: "'primary' | 'secondary' | 'glass'", default: "'primary'", description: 'FAB variant' },
      { name: 'position', type: "'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left'", default: "'bottom-right'", description: 'Screen position' },
      { name: 'extended', type: 'boolean', default: 'false', description: 'Extended style with label' },
      { name: 'label', type: 'string', description: 'Label text (when extended)' },
      { name: 'aria-label', type: 'string', required: true, description: 'Accessibility label' },
    ],
  },
];

export function getComponentBySlug(slug: string): ComponentData | undefined {
  return components.find(c => c.slug === slug);
}

export function getComponentsByCategory(category: string): ComponentData[] {
  return components.filter(c => c.category === category);
}
