# Third Party Notices

This file contains notices for third-party software used in this project.

## glisse

The glass refraction effect implementation in this library is based on [glisse](https://www.npmjs.com/package/glisse).

```
MIT License

Copyright (c) 2024 Caleb Brewer

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

### What was adapted

The following components from glisse were adapted for use in liquidglass-ui:

- **Displacement Map Generation** (`lensMap` function): Mathematical calculation of edge-based displacement values for lens refraction effect
- **SVG Filter Chain** (`buildFilter` function): Construction of SVG filter elements for chromatic aberration and edge refraction
- **Rim Light Calculation**: Light direction-based edge highlight computation
- **CSS Custom Properties**: Theme variable naming conventions for glass styling

The original implementation was written in TypeScript and has been adapted to work within the liquidglass-ui component architecture while maintaining visual fidelity to the original effect.
