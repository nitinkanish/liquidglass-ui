# Liquid Glass UI Research Report

## Research Methodology

### REA Tool Investigation

**REA Tool**: https://github.com/morluto/rea

The REA (Reverse Engineer Anything) tool was cloned and examined. Key findings:

1. **What REA Actually Is**: REA is a sophisticated MCP-based reverse engineering framework designed for:
   - Binary analysis and disassembly
   - Native application introspection
   - Runtime behavior analysis
   - Works with tools like Hopper, IDA Pro, Frida
   
2. **Why REA Doesn't Apply Here**: The glisse package is:
   - A JavaScript/TypeScript npm package (not a binary)
   - Published as readable ESM/CJS source code
   - Has MIT license permitting direct study of source
   
3. **Conclusion**: REA is designed for reverse engineering compiled binaries and native code, not for analyzing open-source JavaScript libraries. Using `npm pack` to download the published package and examining its source code is the appropriate research method for UI component libraries.

### Fallback Research Method

We used the standard approach for npm package analysis: `npm pack glisse` to download the published tarball, combined with WebFetch for the documentation site.

**Sources Analyzed**:
1. npm package tarball (glisse@0.5.0, 242.3 kB unpacked)
2. Official documentation site: https://glisse.kelvinzhang.com
3. Published TypeScript type definitions
4. Bundled CSS (26.9 kB) and JavaScript (ESM + CJS)

---

## Reference Package: glisse

### License
**MIT License** - Copyright (c) 2026 Kelvin Zhang
- Permits learning from and studying the implementation
- Our library must be original code, not a copy

### Package Structure
```
glisse@0.5.0
├── dist/
│   ├── index.js      (100.0 kB ESM)
│   ├── index.cjs     (102.4 kB CommonJS)
│   ├── index.d.ts    (4.7 kB TypeScript types)
│   ├── index.d.cts   (4.7 kB CommonJS types)
│   └── styles.css    (26.9 kB)
├── LICENSE
├── README.md
└── package.json
```

### Build Configuration
- **Bundler**: tsdown (based on esbuild)
- **Output**: ESM + CJS with TypeScript declarations
- **Peer Dependencies**: React ≥18, React DOM ≥18
- **Runtime Dependencies**: None (zero dependencies!)
- **sideEffects**: Properly declared for CSS and JS entry points

### Export Map
```json
{
  ".": {
    "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
  },
  "./styles.css": "./dist/styles.css",
  "./package.json": "./package.json"
}
```

---

## Components in glisse

| Component | Description | Props |
|-----------|-------------|-------|
| **Glass** | Base glass panel | Standard div props |
| **Button** | Glass button | icon, variant (glass/filled), destructive, tint |
| **Input** | Text input | value, defaultValue, onValueChange, icon |
| **SearchField** | Search input | Same as Input, with magnifier icon |
| **Switch** | Toggle switch | checked, defaultChecked, onCheckedChange |
| **Slider** | Range slider | value, defaultValue, onValueChange, min, max, step |
| **SegmentedControl** | Segment picker | items[], value, defaultValue, onValueChange |
| **TabBar** | iOS-style tabs | items[], value, defaultValue, onValueChange, link |
| **Menu** | Context menu | items[], aria-label, icon, align |

---

## Glass Effect Technical Implementation

### 1. CSS backdrop-filter (Primary Glass Effect)
```css
.lg-glass {
  background-color: var(--lg-glass); /* semi-transparent bg */
  backdrop-filter: blur(var(--lg-blur, 3px)) saturate(1.5);
  box-shadow: inset 0 0 0 0.5px var(--lg-edge), /* subtle border */
              0 1px 3px var(--lg-drop); /* drop shadow */
}
```

### 2. SVG Filters for Refraction/Lensing
The "lifted lens" effect when interacting with components uses SVG filters:

**Filter Primitives Used**:
- `feDisplacementMap` - Creates the refraction/bending effect at edges
- `feComposite` - Composites multiple filter layers
- `feColorMatrix` - Adjusts colors for the lens effect
- `feTurbulence` (potentially) - For organic variation

**Key Technique**: Filters are dynamically generated and injected into a hidden `<defs>` SVG element. Each component surface gets a unique filter ID that's applied via CSS `filter: url("#filter-id")`.

### 3. Specular Rim Highlights
```css
/* Rim lighting via radial gradient */
.lg-glass::after {
  background: radial-gradient(
    circle 240px at var(--lg-x, 50%) var(--lg-y, 50%),
    rgb(255 255 255 / 0.035),
    rgb(255 255 255 / 0.025) 50%,
    transparent
  );
}
```
The `--lg-x` and `--lg-y` variables track pointer position for interactive highlights.

### 4. Animation & Motion
- Uses CSS transitions with custom easing: `cubic-bezier(0.25, 0.1, 0.25, 1)`
- "Lift" animations controlled by CSS custom property `--lg-lift` (0 to 1)
- Spring-like motion achieved via carefully tuned transition curves

### 5. Light/Dark Mode Adaptation
Extensive CSS custom properties for both modes:

**Light Mode**:
- Glass: `rgb(255 255 255 / 0.6)`
- Edge: `rgb(0 0 0 / 0.08)`
- Rim shine: `0.3`

**Dark Mode**:
- Glass: `rgb(40 40 40 / 0.62)`
- Edge: `rgb(255 255 255 / 0.08)`
- Rim shine: `0.13`

---

## API Design Patterns

### Controlled/Uncontrolled Pattern
All interactive components support both:
```tsx
// Controlled
<Slider value={volume} onValueChange={setVolume} />

// Uncontrolled
<Slider defaultValue={50} />
```

### Value Naming Convention
- `value` / `defaultValue` for most components
- `checked` / `defaultChecked` for boolean states (Switch)
- `onValueChange` / `onCheckedChange` callbacks

### Backdrop Integration
Components that refract need a backdrop container:
```tsx
<div data-glisse-backdrop>
  <Scene /> {/* Content to refract */}
</div>
<Glass /> {/* Glass component */}
```

---

## Accessibility Features
- ARIA labels required for all interactive components
- `aria-checked` for Switch
- Keyboard navigation support
- Focus visible states with ring outline
- Touch manipulation handling

---

## Browser Support Considerations

### Features with Potential Fallbacks Needed
1. **backdrop-filter**: Not supported in older Firefox, some Safari versions
2. **SVG filters on backdrop**: Only Chromium applies SVG filters to live backdrop
3. **text-box: trim-both cap alphabetic**: Very new CSS property
4. **color-mix()**: Modern browsers only

---

## Our Library: Planned Improvements

### Package Name
**Primary Choice**: `liquidglass-ui` ✓ Available
**Alternatives**:
- `glassmorphic-ui` ✓ Available (was unpublished)
- `glass-vapor` ✓ Available

### Additional Components (Beyond glisse)
1. **Layout**: GlassProvider, GlassCard, GlassPanel, Sidebar, Drawer
2. **Navigation**: Navbar, Dock (macOS style), CommandPalette
3. **Feedback**: Toast, Alert, Badge, Progress (linear + circular), Spinner
4. **Forms**: Select/Dropdown, Textarea, Checkbox, Radio, Toggle
5. **Overlays**: Modal/Dialog, Sheet (bottom sheet), Popover, Tooltip
6. **Data Display**: Avatar, Chip/Tag, Accordion, Carousel
7. **Actions**: IconButton, FloatingActionButton

### Technical Improvements
1. Full `prefers-reduced-motion` support
2. `prefers-reduced-transparency` support  
3. Graceful fallbacks for unsupported browsers
4. Web Components / vanilla JS layer for non-React users
5. Comprehensive ARIA implementation
6. CSS-only mode for basic glass effect

---

## Summary

glisse provides an excellent reference implementation of Apple's Liquid Glass aesthetic. Key insights:
- Zero runtime dependencies is achievable
- SVG filters are the secret to the refraction/lens effect
- Extensive CSS custom properties enable easy theming
- The "lift" animation pattern creates the iOS-like tactile feel

Our library will build on these foundations while:
- Expanding the component set significantly (30+ components)
- Adding accessibility features throughout
- Providing framework-agnostic alternatives
- Including comprehensive documentation with interactive demos
