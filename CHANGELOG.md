# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-12

### Added

- Initial release of LiquidGlass UI
- Core glass effects with SVG filters for refraction/lensing
- GlassProvider for theming and configuration
- 30+ components with full accessibility support:
  - **Base**: Glass, GlassCard
  - **Buttons**: Button, IconButton, Toggle
  - **Forms**: Input, Textarea, SearchField, Select, Checkbox, Radio, Switch, Slider
  - **Navigation**: TabBar, SegmentedControl, Tabs, Navbar, Sidebar, Dock
  - **Overlays**: Modal, Sheet, Menu, Tooltip
  - **Feedback**: Toast, Alert, Progress, Spinner
  - **Data Display**: Badge, Avatar, Chip, Accordion
  - **Layout**: Separator, Skeleton
- CSS custom properties for easy theming
- Light/dark mode support with system preference detection
- `prefers-reduced-motion` and `prefers-reduced-transparency` support
- Graceful fallbacks for browsers without backdrop-filter support
- Comprehensive TypeScript types
- ESM and CommonJS builds
- Documentation site with interactive demos
- Full test suite with Vitest and Testing Library

### Browser Support

- Chrome/Edge 76+
- Firefox 103+
- Safari 9+ (with prefixes)
- iOS Safari 9+

## [Unreleased]

- Drawer component
- Popover component  
- Command palette component
- Carousel component
- Date picker component
