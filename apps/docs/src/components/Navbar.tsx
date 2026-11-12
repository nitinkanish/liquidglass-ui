import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme, Drawer } from '@nkanish/liquidglass-ui';
import { DocsSidebar } from './DocsSidebar';

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

interface NavbarProps {
  onSearchOpen: () => void;
}

const navLinks = [
  { to: '/docs', label: 'Docs' },
  { to: '/components', label: 'Components' },
  { to: '/refraction', label: 'Refraction' },
];

export function Navbar({ onSearchOpen }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === '/docs'
      ? location.pathname === '/docs' || location.pathname.startsWith('/docs/')
      : location.pathname.startsWith(path);

  const showDocsSidebar = location.pathname.startsWith('/docs');

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-[var(--docs-bg)]/80 backdrop-blur-xl border-b border-[var(--docs-border)]'
            : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Hamburger — always available below md */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] -ml-2 rounded-lg text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] hover:bg-[var(--docs-bg-elevated)] transition-colors"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <MenuIcon />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 text-[var(--docs-text)] no-underline min-w-0"
            >
              <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">LG</span>
              </div>
              <span className="font-semibold text-lg truncate hidden xs:block sm:block">
                LiquidGlass UI
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--docs-accent)]/20 text-[var(--docs-accent)] font-medium shrink-0">
                v0.2.0
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm transition-colors min-h-[44px] inline-flex items-center ${
                    isActive(link.to)
                      ? 'text-[var(--docs-text)]'
                      : 'text-[var(--docs-text-muted)] hover:text-[var(--docs-text)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={onSearchOpen}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] sm:min-w-0 sm:px-3 rounded-lg border border-[var(--docs-border)] bg-[var(--docs-bg-elevated)] text-[var(--docs-text-muted)] text-sm hover:border-[var(--docs-text-muted)] transition-colors"
                aria-label="Search components"
              >
                <SearchIcon />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden lg:inline px-1.5 py-0.5 rounded bg-[var(--docs-bg)] text-xs">
                  ⌘K
                </kbd>
              </button>

              <a
                href="https://github.com/nitinkanish/liquidglass-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] hover:bg-[var(--docs-bg-elevated)] transition-colors"
                aria-label="GitHub repository"
              >
                <GithubIcon />
              </a>

              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-[var(--docs-text-muted)] hover:text-[var(--docs-text)] hover:bg-[var(--docs-bg-elevated)] transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <Drawer
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        side="left"
        title="Menu"
        size="sm"
      >
        <div className="flex flex-col gap-6 pt-2 pb-8">
          <nav className="flex flex-col gap-1" aria-label="Mobile primary">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center min-h-[44px] px-3 rounded-lg text-base no-underline transition-colors ${
                  isActive(link.to)
                    ? 'bg-[var(--docs-accent)]/10 text-[var(--docs-accent)]'
                    : 'text-[var(--docs-text)] hover:bg-[var(--docs-bg-elevated)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {showDocsSidebar && (
            <div className="border-t border-[var(--docs-border)] pt-4">
              <DocsSidebar variant="drawer" />
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
