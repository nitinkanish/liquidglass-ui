# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-11-12

### Fixed

- **TabBar / SegmentedControl click glitch** — the selection indicator no longer flickers, jumps, or overflows when changing tabs. Root cause: press/lift animated `width`/`height`/`top`/`left`, so `ResizeObserver` rebuilt the SVG displacement filter every animation frame (and lift toggled the filter on/off). Fix: transform-only glide (`translateX` + subtle press `scale`), fixed lens layout size, stable refraction filter, and `overflow: hidden` on the bar so the indicator stays clipped.
- Keyboard arrow / Home / End navigation for TabBar and SegmentedControl
- Indicator alignment covered by Playwright + unit selection tests

## [0.2.0] - 2026-11-12

### Added

- **Glisse-compatible glass refraction effect** - Edge lensing, chromatic aberration, and specular highlights that visually match [glisse](https://www.npmjs.com/package/glisse)
- `refraction` prop on `Glass` component to enable the effect
- `refractionDepth`, `refractionDome`, `shine`, and `lightAngle` props for fine-tuning the refraction
- `useGlisseEffect` hook for custom glass effect implementations
- `clearGlisseCache()` utility to clear displacement map cache
- `THIRD_PARTY_NOTICES.md` with glisse attribution

### Changed

- Updated Glass component to support glisse-style refraction
- Documentation site now uses workspace dependency for development
- Docs build script now builds the library first for clean Vercel builds

### Attribution

Glass refraction implementation based on [glisse](https://github.com/0kzh/glisse) (MIT License) by Kelvin Zhang.

## [0.1.0] - 2026-11-12

### Added

- Initial release with 57 components
- GlassProvider for theme management
- Glass, GlassCard base components
- Button, IconButton, Toggle
- Input, Textarea, SearchField, Select, Checkbox, Radio, Switch, Slider, DatePicker
- TabBar, SegmentedControl, Tabs, Navbar, Sidebar, Dock, Carousel
- Modal, Sheet, Drawer, Popover, ContextMenu, CommandPalette, Menu, Tooltip
- Toast, Alert, Progress, Spinner
- Badge, Avatar, Chip, Accordion, Separator, Skeleton
- FloatingActionButton (FAB)
- Dark mode support with system preference detection
- Full ARIA accessibility support
- 86 comprehensive tests
- HeroUI-inspired documentation site with dark theme
