# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **`GlassHeader`**: a site header built from the shared Liquid Glass material (`Glass`), so it keeps the same lens, rim light and tint behaviour as every other surface.
  - `variant="bar" | "floating"` (inset pill), plus `actionsPlacement="outside"` to put the CTA in its own pill.
  - `sticky` (default) or `fixed` positioning.
  - A scroll-reactive state (`data-scrolled`): denser material, a tighter pill and a deeper shadow. Tune it with `scrollThreshold`, use `scrollContainer` for nested scrollers, and listen with `onScrolledChange`.
  - `hideOnScroll`, and `transparentAtTop` for the bar.
  - `tint="neutral" | "warm" | "cool" | "clear"` or any CSS color, and `colorScheme` for theme.
  - A responsive glass mobile menu below `mobileBreakpoint` (controlled or uncontrolled; Escape, link tap and focus handling).
  - `renderLink` for router links.
  - SSR-safe, with a pre-hydration CSS collapse on narrow screens, and Reduce Motion support.
- **`MorphingGlass`**: a thick glass body that morphs continuously between `sphere`, `drop`, `pebble`, `plate`, `disc` and `pill`.
  - Rendered with WebGL signed-distance-field raymarching: two shape SDFs are blended, and R/G/B are refracted separately for chromatic dispersion, with Fresnel reflection, specular highlights and a thin-film rim.
  - Props: `shapes` / `shape`, `duration`, `hold`, `easing` (`linear`, `ease-in-out`, `ease-out`, `spring` or a function), `autoplay` / `paused` / `loop`, `rotate`, `thickness`, `size`, `dispersion`, `ior`, `tint`, `tintStrength`, `background` (`stripes`, `transparent` or an image URL) and `colors`.
  - An imperative handle with `play`, `pause` and `goTo`.
  - Pauses offscreen and in hidden tabs, shows a still shape under Reduce Motion, falls back to the CSS glass material without WebGL, and is SSR-safe.
- `useScrollState` hook (`scrolled`, `direction`, `y`; window or a scroll container) and `nextScrollState`.
- Morph helpers: `MORPH_SHAPES`, `morphFrameAt`, `resolveMorphEasing`, `parseColor` and `supportsWebGL`.
- Docs:
  - `/docs/components/glass-header`, with a live demo over scrolling content and controls.
  - `/docs/components/morphing-glass`, with a poster-style hero and controls.
  - Chrome-free demos at `/demos/glass-header` and `/demos/morphing-glass`.
  - A new "Effects" category.
- Tests: unit tests for both components and the scroll hook, plus Playwright e2e specs (`e2e/glass-header.spec.ts`, `e2e/morphing-glass.spec.ts`).

## [0.3.0] - 2026-11-15

### Added

- **Apple Liquid Glass fidelity across every component.** All components that use `.lg-glass` now share one material: specular rim (`::before`) driven by `--lg-light-angle`, inner luminance, top/bottom edge light, ambient + contact shadows, pointer sheen, and brightness/saturation tuned for light and dark.
- **Real backdrop lensing** (Chromium): an SVG displacement lens bends what is behind the glass, with chromatic aberration. Applied automatically to every glass surface by `GlassProvider` (`config.autoLens`, default on) and by component hooks. New `bend` / `dispersion` options on `useGlisseEffect`, and `attachBackdropLens` / `detachBackdropLens`.
- `Glass`: `variant="clear" | "regular"`, `effect="regular" | "clear" | "none"`, `tintColor`, `colorScheme`, `overLight`, `dim`, `elasticity`, `aberration`, `bend`, `specular="pointer"`, `animated`, `animationDuration`; interactive glass now swells and glows on press.
- `GlassContainer` with `spacing` / `gap` / `direction`: neighbouring glass merges with a liquid neck.
- `GlassProvider` `config.light` (`pointer` | `motion` | `static`): the specular light follows the pointer or device tilt. `useLightSource`, `lightAngleFromVector`.
- `useElasticity` / `computeElasticity`, plus `elasticity` on `Button` and `IconButton`; `effect="clear"` on `Button` and `IconButton`.
- `getGlassSupport()` capability tiers (`lens` / `material` / `solid`).
- Scoped `data-lg-scheme="light" | "dark"` token blocks, new tokens (`--lg-specular`, `--lg-inner-glow`, `--lg-glass-clear`, `--lg-press-scale`, ...), `.lg-glass-clear`, `.lg-glass-flat` classes.
- Docs: `/showcase` page demonstrating regular / clear / tinted / dark / merging glass.

### Changed

- Glass default material is lighter (`--lg-glass` alpha 0.5, `--lg-blur` 12px, 4px under an active lens) so refraction stays readable.
- Reduce Motion no longer switches glass refraction off (Apple keeps the static lens); it disables press bounce, elasticity and the moving light. Reduce Transparency now drops blur, lens and filters entirely and uses an opaque surface. `prefers-contrast: more` strengthens edges.
- `IconButton` gains the same lens as `Button`; ghost/outlined buttons use `.lg-glass-flat`; `Badge` `secondary` and clickable `Chip` use the shared material; `Switch`/`Slider` thumbs refract the track behind them.

### Fixed

- Glass refraction never activated under React StrictMode (remount skipped rebuilding the filter because the last-measured size was cached).
- Glisse-style filter had no `scale` and no filter region, so displacement was a no-op and light maps stretched across the viewport. Filter regions are now sized to the element (layout size, so scaled thumbs are correct) and padded so shadows are not clipped.
- Docs image paths ignored the `/liquidglass-ui/` base path.

### Attribution

Ideas from [liquid-glass-react](https://github.com/rdev/liquid-glass-react) (MIT, Max Rovensky) and [@callstack/liquid-glass](https://github.com/callstack/liquid-glass) (MIT, Oskar Kwaśniewski); see `THIRD_PARTY_NOTICES.md`. Visual targets are Apple's public Liquid Glass guidance (Figma kit not used).

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
