# LiquidGlass UI

> Advanced Apple Liquid Glass (iOS 26 / macOS Tahoe) UI component library for React with SVG refraction effects, backdrop blur, and beautiful animations.

[![npm version](https://img.shields.io/npm/v/liquidglass-ui.svg)](https://www.npmjs.com/package/liquidglass-ui)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## Features

- **Authentic Liquid Glass Effect** - Backdrop blur, saturation, SVG displacement filters for realistic refraction
- **30+ Components** - Buttons, inputs, modals, tabs, navigation, and more
- **Dark Mode Support** - Automatic adaptation to system preferences
- **Accessibility First** - Full ARIA support, keyboard navigation, screen reader friendly
- **Zero Runtime Dependencies** - Just React as a peer dependency
- **TypeScript Native** - Full type definitions included
- **Tree Shakeable** - Only import what you use
- **Responsive** - Works on desktop and mobile

## Installation

```bash
npm install liquidglass-ui
# or
pnpm add liquidglass-ui
# or
yarn add liquidglass-ui
```

## Quick Start

```tsx
import { GlassProvider, Button, GlassCard, Switch } from 'liquidglass-ui';
import 'liquidglass-ui/styles.css';

function App() {
  return (
    <GlassProvider>
      <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', minHeight: '100vh', padding: 20 }}>
        <GlassCard>
          <h1>Welcome to LiquidGlass UI</h1>
          <p>Beautiful glass components for React</p>
          <Button variant="filled">Get Started</Button>
          <Switch aria-label="Dark mode" />
        </GlassCard>
      </div>
    </GlassProvider>
  );
}
```

## Components

### Layout & Containers
- `GlassProvider` - Theme provider with light/dark mode support
- `Glass` - Base glass panel with customizable blur and tint
- `GlassCard` - Card component with glass styling

### Buttons & Actions
- `Button` - Glass, filled, outlined, and ghost variants
- `IconButton` - Icon-only button
- `Toggle` - Toggleable button

### Form Controls
- `Input` - Text input with icon support
- `Textarea` - Multi-line text input
- `SearchField` - Search input with clear button
- `Select` - Dropdown select
- `Checkbox` - Checkbox with label
- `Radio` / `RadioGroup` - Radio buttons
- `Switch` - iOS-style toggle switch
- `Slider` - Range slider with glass thumb

### Navigation
- `TabBar` - iOS-style bottom tab bar with icons
- `SegmentedControl` - Segmented control with animated thumb
- `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` - Tab panel
- `Navbar` / `NavbarLink` - Navigation bar
- `Sidebar` - Collapsible sidebar
- `Dock` - macOS-style dock with magnification

### Overlays
- `Modal` - Modal dialog
- `Sheet` - Bottom/side sheet
- `Menu` - Context/dropdown menu
- `Tooltip` - Tooltip on hover

### Feedback
- `Toast` / `ToastProvider` / `useToast` - Toast notifications
- `Alert` - Alert messages
- `Progress` - Linear and circular progress
- `Spinner` - Loading spinner

### Data Display
- `Badge` - Status badges
- `Avatar` - User avatars with status
- `Chip` - Tags and chips
- `Accordion` - Collapsible content

### Utility
- `Separator` - Visual separator
- `Skeleton` - Loading skeleton

## Theming

### CSS Custom Properties

Customize the look using CSS variables:

```css
:root {
  --lg-accent: #007aff;
  --lg-blur: 20px;
  --lg-glass: rgb(255 255 255 / 0.65);
  --lg-saturate: 1.8;
}
```

### GlassProvider Config

```tsx
<GlassProvider
  defaultTheme="system" // 'light' | 'dark' | 'system'
  config={{
    blur: 24,
    saturation: 2,
    accentColor: '#8b5cf6',
  }}
>
  {/* Your app */}
</GlassProvider>
```

## Accessibility

All components include:
- Proper ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support
- `prefers-reduced-motion` support
- `prefers-reduced-transparency` support

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 76+ |
| Firefox | 103+ |
| Safari | 9+ (with prefixes) |
| Edge | 79+ |
| iOS Safari | 9+ |

**Note:** `backdrop-filter` requires browser support. The library provides graceful fallbacks for unsupported browsers.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT License - Copyright (c) 2026 Nitin Kanish, Debugged Pro

---

**Developed by Nitin Kanish, Debugged Pro**
