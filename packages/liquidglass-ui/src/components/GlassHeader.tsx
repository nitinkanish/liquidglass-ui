/**
 * GlassHeader - a site header made of the library's Liquid Glass material.
 *
 * Two layouts: a full-width `bar` and a `floating` pill that hovers over the page. The glass reacts
 * to scroll (denser material and a tighter pill once the page moves, optional hide-on-scroll), and
 * collapses its links into a glass menu below a breakpoint. Refraction, rim light and tint all come
 * from `Glass`, so the header matches every other surface in the library.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useId as useReactId,
  useRef,
  useState,
  CSSProperties,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { Glass, GlassColorScheme } from './Glass';
import { useScrollState, ScrollTarget } from '../hooks/use-scroll-state';
import { useReducedMotion } from '../hooks/use-reduced-motion';

export interface GlassHeaderLink {
  /** Visible label. */
  label: ReactNode;
  /** Destination. */
  href: string;
  /** Marks the current page (`aria-current="page"`). */
  active?: boolean;
  /** Click handler, e.g. for client-side routing (call `event.preventDefault()`). */
  onClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
  /** Stable key; defaults to `href`. */
  key?: string;
}

export type GlassHeaderVariant = 'bar' | 'floating';
/** Preset glass tints, or any CSS color (blended into the material via `Glass` `tintColor`). */
export type GlassHeaderTint = 'neutral' | 'warm' | 'cool' | 'clear' | (string & {});

export interface GlassHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Brand area on the leading edge (logo, wordmark). */
  logo?: ReactNode;
  /** Navigation links. */
  links?: GlassHeaderLink[];
  /** Trailing actions such as a CTA button. Moves into the mobile menu when collapsed. */
  actions?: ReactNode;
  /** Extra content placed between the links and the actions (e.g. a search field). */
  children?: ReactNode;
  /** `bar` spans the width; `floating` is an inset pill. Default `floating`. */
  variant?: GlassHeaderVariant;
  /** For `floating`: render `actions` inside the pill or as a separate pill beside it. Default `inside`. */
  actionsPlacement?: 'inside' | 'outside';
  /** Stick to the top of the scroll container. Default true. */
  sticky?: boolean;
  /** Use `position: fixed` instead of sticky (overlays the page). Default false. */
  fixed?: boolean;
  /** Pixels of scroll before the header switches to its scrolled state. Default 8. */
  scrollThreshold?: number;
  /** Scroll container to watch instead of the window. */
  scrollContainer?: ScrollTarget;
  /** Slide the header away while scrolling down and bring it back on scroll up. Default false. */
  hideOnScroll?: boolean;
  /** For `bar`: no glass until the page scrolls, then the material fades in. Default false. */
  transparentAtTop?: boolean;
  /** Called when the scrolled state flips. */
  onScrolledChange?: (scrolled: boolean) => void;
  /** Glass tint: `neutral` (library material), `warm` cream, `cool` blue, `clear`, or any CSS color. Default `neutral`. */
  tint?: GlassHeaderTint;
  /** Force light or dark glass and text. Default `system` (follows the page theme). */
  colorScheme?: GlassColorScheme;
  /** Viewport width (px) below which links collapse into the menu. Default 768. */
  mobileBreakpoint?: number;
  /** Controlled mobile menu state. */
  menuOpen?: boolean;
  /** Initial mobile menu state when uncontrolled. */
  defaultMenuOpen?: boolean;
  /** Mobile menu state callback. */
  onMenuOpenChange?: (open: boolean) => void;
  /** Accessible name for the navigation landmark. Default `Main`. */
  navLabel?: string;
  /** Accessible labels for the menu toggle. */
  menuLabels?: { open?: string; close?: string };
  /** Custom link renderer, e.g. to use a router `Link`. Must spread `props` onto the anchor. */
  renderLink?: (link: GlassHeaderLink, props: HTMLAttributes<HTMLAnchorElement> & { href: string; className: string }) => ReactNode;
  /** Backdrop lens strength passed to `Glass` (Chromium). Default 0.3. */
  bend?: number;
  /** Chromatic aberration at the lens edge, 0-1. Default 0.4. */
  aberration?: number;
  /** Edge refraction and specular light from `Glass`. Default true. */
  refraction?: boolean;
  /** Class for the glass surface (the bar or the pill). */
  surfaceClassName?: string;
}

const PRESET_TINTS = new Set(['neutral', 'warm', 'cool', 'clear']);

function useCollapsed(breakpoint: number): { collapsed: boolean; ready: boolean } {
  const [state, setState] = useState({ collapsed: false, ready: false });
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setState({ collapsed: false, ready: true });
      return;
    }
    const mq = window.matchMedia(`(max-width: ${breakpoint - 0.02}px)`);
    const sync = () => setState({ collapsed: !!mq.matches, ready: true });
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, [breakpoint]);
  return state;
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="lg-header-toggle-icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path className="lg-header-toggle-line" data-line="top" d={open ? 'M5 5 L15 15' : 'M3 6.5 H17'} />
      <path className="lg-header-toggle-line" data-line="bottom" d={open ? 'M15 5 L5 15' : 'M3 13.5 H17'} />
    </svg>
  );
}

export const GlassHeader = forwardRef<HTMLElement, GlassHeaderProps>(
  (
    {
      className,
      style,
      logo,
      links = [],
      actions,
      children,
      variant = 'floating',
      actionsPlacement = 'inside',
      sticky = true,
      fixed = false,
      scrollThreshold = 8,
      scrollContainer,
      hideOnScroll = false,
      transparentAtTop = false,
      onScrolledChange,
      tint = 'neutral',
      colorScheme = 'system',
      mobileBreakpoint = 768,
      menuOpen: menuOpenProp,
      defaultMenuOpen = false,
      onMenuOpenChange,
      navLabel = 'Main',
      menuLabels,
      renderLink,
      bend,
      aberration,
      refraction,
      surfaceClassName,
      ...props
    },
    ref
  ) => {
    const reactId = useReactId();
    const menuId = `lg-header-menu-${reactId.replace(/:/g, '')}`;
    const surfaceRef = useRef<HTMLDivElement>(null);
    const menuSurfaceRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const reducedMotion = useReducedMotion();
    const { scrolled, direction, y } = useScrollState({ threshold: scrollThreshold, target: scrollContainer });
    const { collapsed, ready } = useCollapsed(mobileBreakpoint);

    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultMenuOpen);
    const isControlled = menuOpenProp !== undefined;
    const open = (isControlled ? menuOpenProp : uncontrolledOpen) && collapsed;
    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onMenuOpenChange?.(next);
      },
      [isControlled, onMenuOpenChange]
    );

    const lastScrolled = useRef(scrolled);
    useEffect(() => {
      if (lastScrolled.current !== scrolled) {
        lastScrolled.current = scrolled;
        onScrolledChange?.(scrolled);
      }
    }, [scrolled, onScrolledChange]);

    // Close the menu on Escape, and when the layout grows past the breakpoint
    useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false);
          toggleRef.current?.focus();
        }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [open, setOpen]);

    useEffect(() => {
      if (!collapsed && (isControlled ? menuOpenProp : uncontrolledOpen)) setOpen(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collapsed]);

    // Move focus into the menu when it opens
    useEffect(() => {
      if (!open) return;
      const first = document.getElementById(menuId)?.querySelector<HTMLElement>('a, button');
      first?.focus({ preventScroll: true });
    }, [open, menuId]);

    const hidden = hideOnScroll && !open && direction === 'down' && y > 96;
    const isPreset = PRESET_TINTS.has(tint);
    const tintColor = isPreset ? undefined : tint;
    const glassEffect = tint === 'clear' ? 'clear' : 'regular';
    const glassScheme = colorScheme;

    const renderAnchor = (link: GlassHeaderLink, inMenu: boolean) => {
      const linkClass = cn('lg-header-link', inMenu && 'lg-header-menu-link');
      const anchorProps = {
        href: link.href,
        className: linkClass,
        'aria-current': link.active ? ('page' as const) : undefined,
        'data-active': link.active ? '' : undefined,
        onClick: (e: ReactMouseEvent<HTMLAnchorElement>) => {
          link.onClick?.(e);
          if (inMenu) setOpen(false);
        },
      };
      return renderLink ? renderLink(link, anchorProps) : <a {...anchorProps}>{link.label}</a>;
    };

    const navList = (inMenu: boolean) =>
      links.length > 0 ? (
        <ul className={inMenu ? 'lg-header-menu-list' : 'lg-header-list'} role="list">
          {links.map((link) => (
            <li key={link.key ?? link.href}>{renderAnchor(link, inMenu)}</li>
          ))}
        </ul>
      ) : null;

    const glassShared = {
      colorScheme: glassScheme,
      tintColor,
      effect: glassEffect,
      bend,
      aberration,
      refraction,
    } as const;

    const outsideActions = variant === 'floating' && actionsPlacement === 'outside' && actions;
    const hasMenu = links.length > 0 || !!actions || !!children;

    const rootStyle: CSSProperties = { ...style };

    return (
      <header
        ref={ref}
        className={cn('lg-header', className)}
        style={rootStyle}
        data-variant={variant}
        data-tint={isPreset ? tint : 'custom'}
        data-scrolled={scrolled ? '' : undefined}
        data-hidden={hidden ? '' : undefined}
        data-position={fixed ? 'fixed' : sticky ? 'sticky' : 'static'}
        data-transparent-top={transparentAtTop && variant === 'bar' ? '' : undefined}
        data-collapsed={collapsed ? '' : undefined}
        data-ready={ready ? '' : undefined}
        data-menu-open={open ? '' : undefined}
        data-reduced-motion={reducedMotion ? '' : undefined}
        data-lg-scheme={colorScheme === 'system' ? undefined : colorScheme}
        {...props}
      >
        <div className="lg-header-row">
          <Glass ref={surfaceRef} className={cn('lg-header-surface', surfaceClassName)} {...glassShared}>
            {logo != null && <div className="lg-header-brand">{logo}</div>}
            {links.length > 0 && (
              <nav className="lg-header-nav" aria-label={navLabel}>
                {navList(false)}
              </nav>
            )}
            {children != null && <div className="lg-header-extra">{children}</div>}
            {actions != null && !outsideActions && <div className="lg-header-actions">{actions}</div>}
            {hasMenu && (
              <button
                ref={toggleRef}
                type="button"
                className="lg-header-toggle"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={open ? menuLabels?.close ?? 'Close menu' : menuLabels?.open ?? 'Open menu'}
                onClick={() => setOpen(!open)}
              >
                <MenuIcon open={open} />
              </button>
            )}
          </Glass>
          {outsideActions && (
            <Glass ref={ctaRef} className="lg-header-surface lg-header-cta" {...glassShared}>
              {actions}
            </Glass>
          )}
        </div>

        {hasMenu && (
          <Glass
            ref={menuSurfaceRef}
            id={menuId}
            className="lg-header-menu"
            data-open={open ? '' : undefined}
            hidden={!open}
            {...glassShared}
          >
            {links.length > 0 && <nav aria-label={`${navLabel} (menu)`}>{navList(true)}</nav>}
            {children != null && <div className="lg-header-menu-extra">{children}</div>}
            {actions != null && <div className="lg-header-menu-actions">{actions}</div>}
          </Glass>
        )}
      </header>
    );
  }
);

GlassHeader.displayName = 'GlassHeader';
