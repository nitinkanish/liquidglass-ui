import { forwardRef, useRef, useEffect, HTMLAttributes, CSSProperties } from 'react';
import { cn } from '../utils/cn';
import { usePointerPosition } from '../hooks/use-pointer-position';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { createRimLightGradient, createSpecularHighlight } from '../core/svg-filters';

export interface GlassProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'solid';
  blur?: number;
  saturation?: number;
  tint?: string;
  interactive?: boolean;
  rimLight?: boolean;
  bendStrength?: number;
}

export const Glass = forwardRef<HTMLDivElement, GlassProps>(
  (
    {
      className,
      style,
      variant = 'default',
      blur,
      saturation,
      tint,
      interactive = false,
      rimLight = false,
      bendStrength = 0.3,
      children,
      ...props
    },
    ref
  ) => {
    const localRef = useRef<HTMLDivElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || localRef;
    const reducedMotion = useReducedMotion();
    const pointerPosition = usePointerPosition(combinedRef, { enabled: interactive && !reducedMotion });

    const customStyles: CSSProperties & Record<string, string | number | undefined> = {
      ...style,
    };

    if (blur !== undefined) {
      customStyles['--lg-blur'] = `${blur}px`;
    }

    if (saturation !== undefined) {
      customStyles['--lg-saturate'] = String(saturation);
    }

    if (tint) {
      customStyles.backgroundColor = tint;
    }

    if (rimLight) {
      customStyles.backgroundImage = createRimLightGradient({ intensity: 0.2 });
    }

    if (interactive && pointerPosition.isInside) {
      customStyles['--lg-pointer-x'] = `${pointerPosition.percentX}%`;
      customStyles['--lg-pointer-y'] = `${pointerPosition.percentY}%`;
    }

    const variantClasses = {
      default: 'lg-glass',
      elevated: 'lg-glass lg-glass-elevated',
      subtle: 'lg-glass lg-glass-subtle',
      solid: '',
    };

    return (
      <div
        ref={combinedRef}
        className={cn(variantClasses[variant], className)}
        style={customStyles}
        data-hover={interactive && pointerPosition.isInside ? '' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Glass.displayName = 'Glass';
