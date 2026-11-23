import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { GlassHeader } from '../GlassHeader';

const links = [
  { label: 'Product', href: '#product', active: true },
  { label: 'Pricing', href: '#pricing' },
];

function mockViewport(mobile: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('max-width') ? mobile : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => {
  mockViewport(false);
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
});

async function scrollWindow(y: number) {
  await act(async () => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    await new Promise((r) => setTimeout(r, 30));
  });
}

describe('GlassHeader', () => {
  it('renders logo, nav links with aria-current and actions on glass', () => {
    render(<GlassHeader logo={<span>Brand</span>} links={links} actions={<button>Start</button>} />);
    expect(screen.getByRole('banner')).toHaveAttribute('data-variant', 'floating');
    expect(screen.getByText('Brand')).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Product' })[0]).toHaveAttribute('aria-current', 'page');
    expect(screen.getAllByRole('link', { name: 'Pricing' })[0]).not.toHaveAttribute('aria-current');
    expect(screen.getAllByText('Start').length).toBeGreaterThan(0);
    expect(document.querySelector('.lg-header-surface')).toHaveClass('lg-glass');
  });

  it('supports the bar variant, sticky / fixed / static positioning', () => {
    const { rerender } = render(<GlassHeader variant="bar" links={links} />);
    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('data-variant', 'bar');
    expect(header).toHaveAttribute('data-position', 'sticky');
    rerender(<GlassHeader variant="bar" fixed links={links} />);
    expect(header).toHaveAttribute('data-position', 'fixed');
    rerender(<GlassHeader variant="bar" sticky={false} links={links} />);
    expect(header).toHaveAttribute('data-position', 'static');
  });

  it('places actions in their own pill with actionsPlacement="outside"', () => {
    render(<GlassHeader links={links} actions={<button>Go</button>} actionsPlacement="outside" />);
    expect(document.querySelector('.lg-header-cta')).toHaveClass('lg-glass');
    expect(document.querySelector('.lg-header-actions')).toBeNull();
  });

  it('enters the scrolled state past the threshold and reports it', async () => {
    const onScrolledChange = vi.fn();
    render(<GlassHeader links={links} scrollThreshold={20} onScrolledChange={onScrolledChange} />);
    const header = screen.getByRole('banner');
    expect(header).not.toHaveAttribute('data-scrolled');
    await scrollWindow(10);
    expect(header).not.toHaveAttribute('data-scrolled');
    await scrollWindow(80);
    expect(header).toHaveAttribute('data-scrolled');
    expect(onScrolledChange).toHaveBeenLastCalledWith(true);
    await scrollWindow(0);
    expect(header).not.toHaveAttribute('data-scrolled');
    expect(onScrolledChange).toHaveBeenLastCalledWith(false);
  });

  it('hides while scrolling down and returns on scroll up with hideOnScroll', async () => {
    render(<GlassHeader links={links} hideOnScroll />);
    const header = screen.getByRole('banner');
    await scrollWindow(300);
    expect(header).toHaveAttribute('data-hidden');
    await scrollWindow(200);
    expect(header).not.toHaveAttribute('data-hidden');
  });

  it('maps tint presets and custom colors onto the Glass material', () => {
    const { rerender } = render(<GlassHeader links={links} tint="warm" />);
    expect(screen.getByRole('banner')).toHaveAttribute('data-tint', 'warm');
    rerender(<GlassHeader links={links} tint="#ff6a2b" />);
    expect(screen.getByRole('banner')).toHaveAttribute('data-tint', 'custom');
    const surface = document.querySelector('.lg-header-surface') as HTMLElement;
    expect(surface).toHaveAttribute('data-tinted');
    expect(surface.style.getPropertyValue('--lg-tint-color')).toBe('#ff6a2b');
    rerender(<GlassHeader links={links} tint="clear" />);
    expect(document.querySelector('.lg-header-surface')).toHaveClass('lg-glass-clear');
  });

  it('scopes the theme with colorScheme', () => {
    render(<GlassHeader links={links} colorScheme="dark" />);
    expect(screen.getByRole('banner')).toHaveAttribute('data-lg-scheme', 'dark');
    expect(document.querySelector('.lg-header-surface')).toHaveAttribute('data-lg-scheme', 'dark');
  });

  it('collapses on mobile and opens / closes the glass menu', () => {
    mockViewport(true);
    const onMenuOpenChange = vi.fn();
    render(<GlassHeader links={links} actions={<button>Start</button>} onMenuOpenChange={onMenuOpenChange} />);
    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('data-collapsed');
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const menu = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(menu).toHaveAttribute('hidden');

    fireEvent.click(toggle);
    expect(onMenuOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(menu).not.toHaveAttribute('hidden');
    expect(header).toHaveAttribute('data-menu-open');
    // focus moves into the menu
    expect(menu.contains(document.activeElement)).toBe(true);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(menu).toHaveAttribute('hidden');
    expect(document.activeElement).toBe(toggle);

    fireEvent.click(toggle);
    const menuLink = menu.querySelector('a')!;
    fireEvent.click(menuLink);
    expect(menu).toHaveAttribute('hidden');
  });

  it('never opens the menu on desktop even when controlled open', () => {
    mockViewport(false);
    render(<GlassHeader links={links} menuOpen />);
    expect(screen.getByRole('banner')).not.toHaveAttribute('data-menu-open');
  });

  it('supports a controlled menu', () => {
    mockViewport(true);
    const { rerender } = render(<GlassHeader links={links} menuOpen={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('banner')).not.toHaveAttribute('data-menu-open');
    rerender(<GlassHeader links={links} menuOpen />);
    expect(screen.getByRole('banner')).toHaveAttribute('data-menu-open');
  });

  it('uses renderLink for router integration', () => {
    render(
      <GlassHeader
        links={links}
        renderLink={(link, props) => (
          <a {...props} data-router="yes">
            {link.label}
          </a>
        )}
      />
    );
    expect(screen.getAllByRole('link', { name: 'Pricing' })[0]).toHaveAttribute('data-router', 'yes');
  });

  it('renders on the server without touching window', () => {
    const html = renderToString(<GlassHeader logo="Brand" links={links} actions={<button>Go</button>} />);
    expect(html).toContain('lg-header');
    expect(html).toContain('Brand');
    expect(html).not.toContain('data-ready');
  });
});
