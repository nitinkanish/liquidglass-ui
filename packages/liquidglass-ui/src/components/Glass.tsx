/**
 * Glass Component - Apple Liquid Glass effect with glisse-style refraction
 * 
 * Refraction implementation based on glisse (MIT License)
 * https://github.com/0kzh/glisse
 * Copyright (c) 2024 Kelvin Zhang
 */

import { forwardRef, useRef, HTMLAttributes, CSSProperties } from 'react';
import { cn } from '../utils/cn';
import { usePointerPosition } from '../hooks/use-pointer-position';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useGlisseEffect } from '../hooks/use-glisse-effect';
import { createRimLightGradient } from '../core/svg-filters';
import { useRefraction } from './GlassProvider';

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
  /** Show rim light gradient (legacy, superseded by refraction) */
  rimLight?: boolean;
  /** 
   * Enable glisse-style edge refraction with chromatic aberration and specular highlights.
   * Defaults to true. Set to false to disable.
   */
  refraction?: boolean;
  /** Refraction depth in pixels from edge. Default: 8 */
  refractionDepth?: number;
  /** Dome curvature for lens effect. Default: 4 */
  refractionDome?: number;
  /** Specular shine intensity (-2 to 2). Default: 0.3 */
  shine?: number;
  /** Light angle in degrees for rim and refraction. Default: 225 */
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
      refraction,
      refractionDepth,
      refractionDome,
      shine,
      lightAngle,
      children,
      ...props
    },
    ref
  ) => {
    const localRef = useRef<HTMLDivElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || localRef;
    const reducedMotion = useReducedMotion();
    const pointerPosition = usePointerPosition(combinedRef, { enabled: interactive && !reducedMotion });
    
    // Get global refraction config
    const globalRefraction = useRefraction();
    
    // Resolve refraction settings (prop overrides global)
    const shouldRefract = refraction ?? globalRefraction.enabled;
    const depth = refractionDepth ?? globalRefraction.depth;
    const dome = refractionDome ?? globalRefraction.dome;
    const shineValue = shine ?? globalRefraction.shine;
    const angle = lightAngle ?? globalRefraction.lightAngle;
    
    // Glisse-style refraction effect
    const { filterUrl, rimGradient: glisseRim, isReady } = useGlisseEffect(combinedRef, {
      enabled: shouldRefract && !reducedMotion,
      depth,
      dome,
      shine: shineValue,
      lightAngle: angle,
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
    if (shouldRefract && isReady) {
      customStyles.backgroundImage = glisseRim;
    } else if (rimLight) {
      customStyles.backgroundImage = createRimLightGradient({ intensity: 0.15, angle });
    }

    // Apply refraction filter
    if (shouldRefract && filterUrl && isReady) {
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
        data-rim={shouldRefract && isReady ? '' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Glass.displayName = 'Glass';
