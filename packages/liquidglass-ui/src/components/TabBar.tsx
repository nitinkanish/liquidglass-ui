/**
 * TabBar — glisse-compatible floating glass selection lens
 *
 * Selection motion is transform-only (translateX + optional press scale) so the
 * indicator glides without layout thrash. SVG refraction stays on a fixed-size
 * lens so ResizeObserver never rebuilds filters mid-animation (that flicker was
 * the click glitch).
 */
import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  ElementType,
  CSSProperties,
  useState,
  useRef,
  useCallback,
  KeyboardEvent,
} from 'react';
import { cn } from '../utils/cn';
import { useControllable } from '../hooks/use-controllable';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useGlisseEffect } from '../hooks/use-glisse-effect';

export interface TabBarItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  href?: string;
}

export interface TabBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  items: TabBarItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  link?: ElementType;
  showLabels?: boolean;
}

export const TabBar = forwardRef<HTMLDivElement, TabBarProps>(
  (
    {
      className,
      style,
      items,
      value: controlledValue,
      defaultValue,
      onValueChange,
      link: LinkComponent,
      showLabels = true,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useControllable<string | null>({
      value: controlledValue,
      defaultValue: defaultValue ?? items[0]?.value ?? null,
      onChange: onValueChange as ((value: string | null) => void) | undefined,
    });

    const [lift, setLift] = useState(0);
    const reducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLElement>(null);
    const lensRef = useRef<HTMLDivElement>(null);

    const selectedIndex = Math.max(
      0,
      items.findIndex((item) => item.value === value)
    );
    const hasIcons = items.some((item) => item.icon);

    const tabWidth = hasIcons ? 72 : 84;
    const tabHeight = hasIcons ? 52 : 32;
    const inset = 4;
    // Modest press scale — kept inside the bar via overflow:hidden (no layout size change)
    const pressScale = 1 + lift * 0.06;

    // Container refraction: stable size, always enabled (not gated on lift)
    const { filterUrl: containerFilter, rimGradient: containerRim, isReady: containerReady } =
      useGlisseEffect(containerRef, {
        enabled: !reducedMotion,
        depth: 6,
        dome: 3,
      });

    // Lens refraction: FIXED layout size so filter maps are not rebuilt during glide/press
    const { filterUrl: lensFilter, rimGradient: lensRim, isReady: lensReady } = useGlisseEffect(
      lensRef,
      {
        enabled: !reducedMotion,
        depth: 3,
        dome: 2,
        splay: 0.5,
      }
    );

    const handleSelect = useCallback(
      (itemValue: string) => {
        setValue(itemValue);
      },
      [setValue]
    );

    const handlePointerDown = () => {
      if (!reducedMotion) setLift(1);
    };

    const handlePointerUp = () => {
      setLift(0);
    };

    const moveSelection = useCallback(
      (delta: number) => {
        if (!items.length) return;
        const next = (selectedIndex + delta + items.length) % items.length;
        setValue(items[next].value);
      },
      [items, selectedIndex, setValue]
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          moveSelection(1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          moveSelection(-1);
          break;
        case 'Home':
          e.preventDefault();
          if (items[0]) setValue(items[0].value);
          break;
        case 'End':
          e.preventDefault();
          if (items.length) setValue(items[items.length - 1].value);
          break;
        default:
          break;
      }
    };

    const setRefs = (node: HTMLElement | null) => {
      (containerRef as React.MutableRefObject<HTMLElement | null>).current = node;
      if (typeof ref === 'function') ref(node as HTMLDivElement);
      else if (ref)
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement;
    };

    const containerStyles: CSSProperties = {
      padding: inset,
      borderRadius: tabHeight / 2 + inset,
      overflow: 'hidden', // clip press-scale so the indicator never overflows the bar
      ...(containerReady && containerFilter
        ? { filter: containerFilter, backgroundImage: containerRim }
        : {}),
      ...style,
    };

    const lensStyles: CSSProperties = {
      position: 'absolute',
      top: inset,
      left: inset,
      width: tabWidth,
      height: tabHeight,
      borderRadius: tabHeight / 2,
      // Transform-only motion: glide on X, subtle press scale — no width/height/top/left animation
      transform: `translateX(${selectedIndex * tabWidth}px) scale(${pressScale})`,
      transformOrigin: 'center center',
      transition: reducedMotion
        ? 'none'
        : 'transform 220ms cubic-bezier(.25,.1,.25,1), background-color 140ms, box-shadow 140ms',
      backgroundColor: lift > 0.5 ? 'var(--lg-lens)' : 'var(--lg-selection)',
      boxShadow:
        lift > 0.5
          ? `0 ${7 / (1 + lift * 0.5)}px ${11 / (1 + lift * 0.5)}px var(--lg-lens-drop)`
          : 'none',
      pointerEvents: 'none',
      zIndex: 0,
      willChange: 'transform',
      ...(lensReady && lensFilter
        ? { filter: lensFilter, backgroundImage: lensRim }
        : {}),
    };

    return (
      <nav
        ref={setRefs}
        role="tablist"
        aria-label={ariaLabel}
        className={cn('lg-glass lg-interactive', 'relative inline-flex', className)}
        style={containerStyles}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {items.length > 0 && (
          <div
            ref={lensRef}
            aria-hidden
            data-testid="tabbar-indicator"
            data-index={selectedIndex}
            style={lensStyles}
          />
        )}

        <div className="relative flex z-[1]">
          {items.map((item, index) => {
            const isSelected = item.value === value;
            const TabElement = item.href && LinkComponent ? LinkComponent : 'button';

            return (
              <TabElement
                key={item.value}
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                href={item.href}
                type={TabElement === 'button' ? 'button' : undefined}
                onClick={() => handleSelect(item.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                  'flex flex-col items-center justify-center',
                  'border-0 bg-transparent cursor-pointer',
                  'no-underline transition-colors',
                  'lg-focus-ring',
                  hasIcons ? 'gap-0.5 text-[10px] font-medium' : 'text-sm'
                )}
                style={{
                  width: tabWidth,
                  height: tabHeight,
                  color: isSelected
                    ? hasIcons
                      ? 'var(--lg-fill)'
                      : 'var(--lg-foreground)'
                    : 'var(--lg-muted)',
                }}
                data-index={index}
              >
                {item.icon && (
                  <span className="flex items-center justify-center w-[26px] h-[26px]">
                    {item.icon}
                  </span>
                )}
                {(showLabels || !item.icon) && <span className="block">{item.label}</span>}
              </TabElement>
            );
          })}
        </div>
      </nav>
    );
  }
);

TabBar.displayName = 'TabBar';
