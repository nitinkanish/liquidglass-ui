# Third Party Notices

This file contains attributions for third-party code used in LiquidGlass UI.

## glisse

The glass refraction effect implementation is based on [glisse](https://github.com/0kzh/glisse).

```
MIT License

Copyright (c) 2024 Kelvin Zhang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Attribution

The following files contain code derived from glisse:

- `src/hooks/use-glisse-effect.ts` - SVG displacement map generation and filter chain
- `src/components/Glass.tsx` - Refraction effect integration

The implementation ports glisse's displacement map generation algorithm (lensMap function),
SVG filter construction (buildFilter), and PNG encoding for feImage elements.

## liquid-glass-react

Ideas for pointer-following specular borders, directional elasticity, chromatic aberration control, over-light shadowing and the Firefox fallback come from [liquid-glass-react](https://github.com/rdev/liquid-glass-react). No code was copied or added as a dependency; the behaviours were reimplemented.

```
MIT License

Copyright 2025 MAX ROVENSKY
```

## @callstack/liquid-glass

API ideas (`effect` regular/clear/none, `tintColor`, `colorScheme`, interactive mode, container merging with `spacing`, capability fallback) mirror [@callstack/liquid-glass](https://github.com/callstack/liquid-glass), a React Native wrapper over Apple's native `UIGlassEffect`. No code was copied or added as a dependency.

```
MIT License

Copyright (c) 2025 Oskar Kwaśniewski
```
