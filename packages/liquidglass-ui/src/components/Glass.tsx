/**
 * Glass Component - Apple Liquid Glass effect
 * 
 * Refraction implementation based on glisse (MIT License)
 * https://www.npmjs.com/package/glisse
 * Copyright (c) 2024 Caleb Brewer
 */

import { forwardRef, useRef, HTMLAttributes, CSSProperties } from 'react';
import { cn } from '../utils/cn';
import { usePointerPosition } from '../hooks/use-pointer-position';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useGlisseEffect } from '../hooks/use-glisse-effect';
import { createRimLightGradient } from '../core/svg-filters';

export interface GlassProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: 'default' | 'elevated' | 'subtle' | 'solid';
  /** Blur intensity in pixels */
  blur?: number;
  /** Color saturation multiplier */
  saturation?: number;
  /** Custom tint color */
  tint?: string;
  /** Enable pointer tracking for highlight effect */
  interactive?: boolean;
  /** Show rim light gradient */
  rimLight?: boolean;
  /** Enable glisse-style edge refraction (requires element dimensions) */
  refraction?: boolean;
  /** Refraction depth (pixels from edge) */
  refractionDepth?: number;
  /** Dome curvature for refraction */
  refractionDome?: number;
  /** Specular shine intensity (-2 to 2) */
  shine?: number;
  /** Light angle for rim and refraction (degrees) */
  lightAngle?: number;
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
      refraction = false,
      refractionDepth = 8,
      refractionDome = 4,
      shine = 0.3,
      lightAngle = 30,
      children,
      ...props
    },
    ref
  ) => {
    const localRef = useRef<HTMLDivElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || localRef;
    const reducedMotion = useReducedMotion();
    const pointerPosition = usePointerPosition(combinedRef, { enabled: interactive && !reducedMotion });
    
    // Glisse-style refraction effect
    const { filterUrl, rimGradient: glisseRim, isReady } = useGlisseEffect(combinedRef, {
      enabled: refraction && !reducedMotion,
      depth: refractionDepth,
      dome: refractionDome,
      shine,
      lightAngle,
    });

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

    // Apply rim light gradient
    if (refraction && isReady) {
      customStyles.backgroundImage = glisseRim;
    } else if (rimLight) {
      customStyles.backgroundImage = createRimLightGradient({ intensity: 0.15, angle: lightAngle });
    }

    // Apply refraction filter
    if (refraction && filterUrl && isReady) {
      customStyles.filter = filterUrl;
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
        data-rim={refraction && isReady ? '' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Glass.displayName = 'Glass';
