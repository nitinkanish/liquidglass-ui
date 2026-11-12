/**
 * TabBar — glisse-compatible floating glass selection lens
 */
import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  ElementType,
  CSSProperties,
  useState,
  useRef,
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

    const selectedIndex = items.findIndex((item) => item.value === value);
    const hasIcons = items.some((item) => item.icon);

    const tabWidth = hasIcons ? 72 : 84;
    const tabHeight = hasIcons ? 52 : 32;
    const inset = 4;
    const lensGrowX = hasIcons ? 24 : 27;
    const lensGrowY = hasIcons ? 16 : 20;

    const { filterUrl: containerFilter, rimGradient: containerRim, isReady: containerReady } =
      useGlisseEffect(containerRef, {
        enabled: !reducedMotion,
        depth: 6,
        dome: 3,
      });

    const { filterUrl: lensFilter, rimGradient: lensRim, isReady: lensReady } = useGlisseEffect(
      lensRef,
      {
        enabled: !reducedMotion && lift > 0.01,
        depth: 4,
        dome: 3,
        splay: 0.5,
      }
    );

    const handleSelect = (itemValue: string) => {
      setValue(itemValue);
    };

    const handlePointerDown = () => {
      if (!reducedMotion) setLift(1);
    };

    const handlePointerUp = () => {
      setLift(0);
    };

    const setRefs = (node: HTMLElement | null) => {
      (containerRef as React.MutableRefObject<HTMLElement | null>).current = node;
      if (typeof ref === 'function') ref(node as HTMLDivElement);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement;
    };

    const containerStyles: CSSProperties = {
      padding: inset,
      borderRadius: tabHeight / 2 + inset,
      ...(containerReady && containerFilter
        ? { filter: containerFilter, backgroundImage: containerRim }
        : {}),
      ...style,
    };

    const lensStyles: CSSProperties = {
      position: 'absolute',
      top: inset - (lift * lensGrowY) / 2,
      left: inset - (lift * lensGrowX) / 2,
      width: tabWidth + lift * lensGrowX,
      height: tabHeight + lift * lensGrowY,
      borderRadius: (tabHeight + lift * lensGrowY) / 2,
      transform: `translateX(${Math.max(0, selectedIndex) * tabWidth}px)`,
      transition: reducedMotion
        ? 'none'
        : 'transform 200ms cubic-bezier(.25,.1,.25,1), width 150ms cubic-bezier(.25,.1,.25,1), height 150ms cubic-bezier(.25,.1,.25,1), top 150ms, left 150ms, background-color 140ms',
      backgroundColor: lift > 0.5 ? 'var(--lg-lens)' : 'var(--lg-selection)',
      boxShadow:
        lift > 0.5
          ? `0 ${7 / (1 + lift * 0.5)}px ${11 / (1 + lift * 0.5)}px var(--lg-lens-drop)`
          : 'none',
      pointerEvents: 'none',
      zIndex: lift > 0.5 ? 2 : 0,
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
        {...props}
      >
        {selectedIndex >= 0 && <div ref={lensRef} aria-hidden style={lensStyles} />}

        <div className="relative flex z-[1]">
          {items.map((item) => {
            const isSelected = item.value === value;
            const TabElement = item.href && LinkComponent ? LinkComponent : 'button';

            return (
              <TabElement
                key={item.value}
                role="tab"
                aria-selected={isSelected}
                href={item.href}
                type={TabElement === 'button' ? 'button' : undefined}
                onClick={() => handleSelect(item.value)}
                className={cn(
                  'flex flex-col items-center justify-center',
                  'border-0 bg-transparent cursor-pointer',
                  'no-underline transition-colors',
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
