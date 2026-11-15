/**
 * Glass Component - Apple Liquid Glass effect with glisse-style refraction
 * 
 * Refraction implementation based on glisse (MIT License)
 * https://github.com/0kzh/glisse
 * Copyright (c) 2024 Kelvin Zhang
 */

import { forwardRef, useRef, useState, HTMLAttributes, CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { cn } from '../utils/cn';
import { usePointerPosition } from '../hooks/use-pointer-position';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { lightAngleFromVector } from '../hooks/use-light-source';
import { useElasticity } from '../hooks/use-elasticity';
import { useGlisseEffect } from '../hooks/use-glisse-effect';
import { createRimLightGradient } from '../core/svg-filters';
import { useRefraction } from './GlassProvider';

export type GlassEffect = 'regular' | 'clear' | 'none';
export type GlassColorScheme = 'light' | 'dark' | 'system';

export interface GlassProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant. `regular` is the same material as `default`; `clear` is Apple's
   * highly translucent Liquid Glass variant for media-rich backgrounds.
   */
  variant?: 'default' | 'regular' | 'elevated' | 'subtle' | 'clear' | 'solid';
  /**
   * Material effect, mirroring UIGlassEffect / @callstack/liquid-glass.
   * Takes precedence over `variant` when set. Changing it animates the
   * materialisation (`none` is a transparent surface).
   */
  effect?: GlassEffect;
  /**
   * Color blended into the glass (UIGlassEffect `tintColor`). Unlike `tint` it keeps the
   * material, blur and white specular rim instead of replacing the background.
   */
  tintColor?: string;
  /**
   * Force light or dark glass tokens regardless of page theme, e.g. dark glass over
   * dark imagery inside a light page. `system` follows the page theme.
   */
  colorScheme?: GlassColorScheme;
  /** Dim the material and deepen its shadow when it sits over bright content. */
  overLight?: boolean;
  /** Add a darkening layer to `clear` glass so labels stay legible over bright media. */
  dim?: boolean;
  /**
   * Elastic stretch toward the pointer, 0 = off. Interactive glass reacts to the
   * pointer within 200px of its edge. Try 0.15.
   */
  elasticity?: number;
  /** Chromatic aberration at the lens edge, 0-1. Default 0.4. */
  aberration?: number;
  /** Lens strength relative to the shorter side (Chromium). Default 0.4, 0 disables backdrop bending. */
  bend?: number;
  /**
   * Make the specular rim follow the pointer over this element (`pointer`) instead of
   * the page-level light source (`static`).
   */
  specular?: 'static' | 'pointer';
  /** Animate material changes (effect, tint). Default true. */
  animated?: boolean;
  /** Duration of material animations in ms. */
  animationDuration?: number;
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
      effect,
      tintColor,
      colorScheme = 'system',
      overLight = false,
      dim = false,
      elasticity = 0,
      aberration,
      bend,
      specular = 'static',
      animated = true,
      animationDuration,
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
    const pointerPosition = usePointerPosition(combinedRef, {
      enabled: (interactive || specular === 'pointer') && !reducedMotion,
    });
    const [isPressed, setIsPressed] = useState(false);
    useElasticity(combinedRef, { amount: elasticity, enabled: !reducedMotion });
    
    // Get global refraction config
    const globalRefraction = useRefraction();
    
    // Resolve refraction settings (prop overrides global)
    const shouldRefract = refraction ?? globalRefraction.enabled;
    const depth = refractionDepth ?? globalRefraction.depth;
    const dome = refractionDome ?? globalRefraction.dome;
    const shineValue = shine ?? globalRefraction.shine;
    const angle = lightAngle ?? globalRefraction.lightAngle;
    
    const effectiveEffect: GlassEffect =
      effect ?? (variant === 'clear' ? 'clear' : 'regular');

    // Glisse-style refraction effect
    const { filterUrl, rimGradient: glisseRim, isReady } = useGlisseEffect(combinedRef, {
      // Reduce Motion keeps the (static) lens; Reduce Transparency is handled inside the hook.
      enabled: shouldRefract && effectiveEffect !== 'none',
      bend,
      dispersion: aberration,
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

    if (tintColor) {
      customStyles['--lg-tint-color'] = tintColor;
    }

    if (animated === false) {
      customStyles['--lg-material-duration'] = '0ms';
    } else if (animationDuration !== undefined) {
      customStyles['--lg-material-duration'] = `${animationDuration}ms`;
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

    if ((interactive || specular === 'pointer') && pointerPosition.isInside) {
      customStyles['--lg-pointer-x'] = `${pointerPosition.percentX}%`;
      customStyles['--lg-pointer-y'] = `${pointerPosition.percentY}%`;
      if (specular === 'pointer') {
        // Light the rim from the side the pointer is on
        customStyles['--lg-light-angle'] = `${Math.round(
          lightAngleFromVector(pointerPosition.percentX - 50, pointerPosition.percentY - 50)
        )}deg`;
      }
    }

    const variantClasses = {
      default: 'lg-glass',
      regular: 'lg-glass',
      elevated: 'lg-glass lg-glass-elevated',
      subtle: 'lg-glass lg-glass-subtle',
      clear: 'lg-glass lg-glass-clear',
      solid: '',
    };

    // `effect` wins over `variant`
    const materialClass =
      effect === 'clear'
        ? 'lg-glass lg-glass-clear'
        : effect === 'regular' && variant === 'solid'
          ? 'lg-glass'
          : effect === 'none'
            ? 'lg-glass'
            : variantClasses[variant];

    const interactiveHandlers = interactive
      ? {
          onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => {
            setIsPressed(true);
            props.onPointerDown?.(e);
          },
          onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => {
            setIsPressed(false);
            props.onPointerUp?.(e);
          },
          onPointerCancel: (e: ReactPointerEvent<HTMLDivElement>) => {
            setIsPressed(false);
            props.onPointerCancel?.(e);
          },
          onPointerLeave: (e: ReactPointerEvent<HTMLDivElement>) => {
            setIsPressed(false);
            props.onPointerLeave?.(e);
          },
        }
      : {};

    return (
      <div
        ref={combinedRef}
        className={cn(materialClass, className)}
        style={customStyles}
        data-hover={(interactive || specular === 'pointer') && pointerPosition.isInside ? '' : undefined}
        data-rim={shouldRefract && isReady ? '' : undefined}
        data-live={interactive ? '' : undefined}
        data-pressed={isPressed ? '' : undefined}
        data-effect={effect}
        data-tinted={tintColor ? '' : undefined}
        data-over-light={overLight ? '' : undefined}
        data-dim={dim ? '' : undefined}
        data-elastic={elasticity > 0 ? '' : undefined}
        data-lg-scheme={colorScheme === 'system' ? undefined : colorScheme}
        {...props}
        {...interactiveHandlers}
      >
        {children}
      </div>
    );
  }
);

Glass.displayName = 'Glass';
