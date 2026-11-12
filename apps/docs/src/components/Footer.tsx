import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-[var(--docs-border)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">LG</span>
              </div>
              <span className="font-semibold text-lg text-[var(--docs-text)]">LiquidGlass UI</span>
            </div>
            <p className="text-[var(--docs-text-muted)] text-sm max-w-md">
              Advanced Apple Liquid Glass (iOS 26 / macOS Tahoe) UI component library for React. 
              Beautiful glassmorphism with SVG refraction effects and smooth animations.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-[var(--docs-text)] mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/docs" className="text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/components" className="text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] transition-colors">
                  Components
                </Link>
              </li>
              <li>
                <a href="https://github.com/nitinkanish/liquidglass-ui" target="_blank" rel="noopener noreferrer" className="text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.npmjs.com/package/@nkanish/liquidglass-ui" target="_blank" rel="noopener noreferrer" className="text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] transition-colors">
                  npm
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--docs-text)] mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://github.com/nitinkanish/liquidglass-ui/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] transition-colors">
                  MIT License
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[var(--docs-border)] text-center">
          <p className="text-[var(--docs-text-muted)] text-sm">
            Developed by <span className="text-[var(--docs-text)]">Nitin Kanish</span>, <span className="text-[var(--docs-text)]">Debugged Pro</span>
          </p>
          <p className="text-[var(--docs-text-muted)] text-xs mt-1">
            © 2026 All rights reserved. MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
