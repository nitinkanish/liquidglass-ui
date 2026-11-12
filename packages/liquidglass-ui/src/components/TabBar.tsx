import { forwardRef, HTMLAttributes, ReactNode, ElementType, CSSProperties, useState } from 'react';
import { cn } from '../utils/cn';
import { useControllable } from '../hooks/use-controllable';
import { useReducedMotion } from '../hooks/use-reduced-motion';

export interface TabBarItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  href?: string;
}

export interface TabBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
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

    const selectedIndex = items.findIndex(item => item.value === value);
    const hasIcons = items.some(item => item.icon);

    const tabWidth = hasIcons ? 72 : 84;
    const tabHeight = hasIcons ? 52 : 32;
    const inset = 4;

    const handleSelect = (itemValue: string) => {
      setValue(itemValue);
    };

    const handlePointerDown = () => {
      if (!reducedMotion) setLift(1);
    };

    const handlePointerUp = () => {
      setLift(0);
    };

    const containerStyles: CSSProperties = {
      padding: inset,
      borderRadius: tabHeight / 2 + inset,
      ...style,
    };

    const lensStyles: CSSProperties = {
      '--lg-lift': lift,
      position: 'absolute',
      top: inset,
      left: inset,
      width: tabWidth + lift * 27,
      height: tabHeight + lift * 20,
      marginTop: -lift * 10,
      marginLeft: -lift * 13.5,
      borderRadius: (tabHeight + lift * 20) / 2,
      transform: `translateX(${selectedIndex * tabWidth}px) scale(${1 + lift * 0.05})`,
      transition: reducedMotion ? 'none' : 'transform 200ms var(--lg-ease-spring), width 150ms var(--lg-ease), height 150ms var(--lg-ease), margin 150ms var(--lg-ease)',
      background: 'var(--lg-selection)',
      boxShadow: lift > 0.5 
        ? `0 ${7 / (1 + lift * 0.5)}px ${11 / (1 + lift * 0.5)}px var(--lg-lens-drop)` 
        : 'none',
    } as CSSProperties;

    return (
      <nav
        ref={ref}
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          'lg-glass lg-interactive',
          'relative inline-flex',
          className
        )}
        style={containerStyles}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        {...props}
      >
        {/* Lens/Selection indicator */}
        {selectedIndex >= 0 && (
          <div className="lg-glass" style={lensStyles} />
        )}

        {/* Tabs */}
        <div className="relative flex z-10">
          {items.map((item) => {
            const isSelected = item.value === value;
            const TabElement = item.href && LinkComponent ? LinkComponent : 'button';

            return (
              <TabElement
                key={item.value}
                role="tab"
                aria-selected={isSelected}
                href={item.href}
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
                    ? (hasIcons ? 'var(--lg-fill)' : 'var(--lg-foreground)') 
                    : 'var(--lg-muted)',
                }}
              >
                {item.icon && (
                  <span className="flex items-center justify-center w-[26px] h-[26px]">
                    {item.icon}
                  </span>
                )}
                {(showLabels || !item.icon) && (
                  <span className="block">{item.label}</span>
                )}
              </TabElement>
            );
          })}
        </div>
      </nav>
    );
  }
);

TabBar.displayName = 'TabBar';
