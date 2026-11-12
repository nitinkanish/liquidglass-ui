import { forwardRef, HTMLAttributes, ReactNode, useState, useRef, CSSProperties } from 'react';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/use-reduced-motion';

export interface DockItem {
  id: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  badge?: number;
}

export interface DockProps extends HTMLAttributes<HTMLDivElement> {
  items: DockItem[];
  magnification?: number;
  distance?: number;
  direction?: 'bottom' | 'left' | 'right';
}

export const Dock = forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      style,
      items,
      magnification = 1.5,
      distance = 100,
      direction = 'bottom',
      ...props
    },
    ref
  ) => {
    const [mouseX, setMouseX] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    const handleMouseMove = (e: React.MouseEvent) => {
      if (reducedMotion) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMouseX(e.clientX - rect.left);
      }
    };

    const handleMouseLeave = () => {
      setMouseX(null);
    };

    const getScale = (index: number): number => {
      if (mouseX === null || reducedMotion) return 1;

      const iconSize = 48;
      const gap = 8;
      const totalWidth = items.length * (iconSize + gap) - gap;
      const startX = (containerRef.current?.offsetWidth || 0) / 2 - totalWidth / 2;
      const iconCenter = startX + index * (iconSize + gap) + iconSize / 2;

      const distanceFromMouse = Math.abs(mouseX - iconCenter);
      if (distanceFromMouse > distance) return 1;

      const scale = 1 + (magnification - 1) * (1 - distanceFromMouse / distance);
      return scale;
    };

    const isHorizontal = direction === 'bottom';

    return (
      <div
        ref={ref}
        className={cn(
          'lg-glass lg-glass-elevated',
          'inline-flex items-end gap-2 p-2',
          !isHorizontal && 'flex-col items-center',
          className
        )}
        style={{
          borderRadius: 20,
          ...style,
        }}
        {...props}
      >
        <div
          ref={containerRef}
          className={cn(
            'flex items-end gap-2',
            !isHorizontal && 'flex-col items-center'
          )}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {items.map((item, index) => {
            const scale = getScale(index);
            const Element = item.href ? 'a' : 'button';

            const itemStyles: CSSProperties = {
              transform: `scale(${scale})`,
              transformOrigin: isHorizontal ? 'bottom center' : 
                direction === 'left' ? 'center right' : 'center left',
              transition: reducedMotion ? 'none' : 'transform 150ms var(--lg-ease-spring)',
            };

            return (
              <Element
                key={item.id}
                href={item.href}
                onClick={item.onClick}
                className={cn(
                  'lg-glass lg-interactive lg-focus-ring',
                  'relative flex items-center justify-center',
                  'w-12 h-12 p-0 border-0 rounded-xl',
                  'text-[var(--lg-foreground)]',
                  'hover:bg-[var(--lg-glass-active)] transition-colors'
                )}
                style={itemStyles}
                title={item.label}
                aria-label={item.label}
              >
                <span className="w-6 h-6">{item.icon}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--lg-destructive)] text-white text-[10px] font-medium"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Element>
            );
          })}
        </div>
      </div>
    );
  }
);

Dock.displayName = 'Dock';
