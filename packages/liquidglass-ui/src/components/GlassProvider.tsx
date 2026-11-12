import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface RefractionConfig {
  enabled: boolean;
  depth: number;
  dome: number;
  shine: number;
  lightAngle: number;
}

export interface GlassConfig {
  blur?: number;
  saturation?: number;
  bendStrength?: number;
  accentColor?: string;
  reducedMotion?: boolean;
  reducedTransparency?: boolean;
  refraction?: Partial<RefractionConfig>;
}

export interface GlassContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  config: GlassConfig;
  setConfig: (config: Partial<GlassConfig>) => void;
  refraction: RefractionConfig;
}

const DEFAULT_REFRACTION: RefractionConfig = {
  enabled: true,
  depth: 8,
  dome: 4,
  shine: 0.3,
  lightAngle: 225,
};

const GlassContext = createContext<GlassContextValue | null>(null);

export interface GlassProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  config?: GlassConfig;
  storageKey?: string;
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function GlassProvider({
  children,
  defaultTheme = 'system',
  config: initialConfig = {},
  storageKey = 'liquidglass-theme',
}: GlassProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    const stored = localStorage.getItem(storageKey);
    return (stored as Theme) || defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (theme === 'system') return getSystemTheme();
    return theme;
  });

  const [config, setConfigState] = useState<GlassConfig>(initialConfig);

  const refraction: RefractionConfig = {
    ...DEFAULT_REFRACTION,
    ...config.refraction,
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  const setConfig = (newConfig: Partial<GlassConfig>) => {
    setConfigState(prev => ({ ...prev, ...newConfig }));
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    if (theme === 'system') {
      setResolvedTheme(getSystemTheme());
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedTheme);
    
    if (config.blur !== undefined) {
      root.style.setProperty('--lg-blur', `${config.blur}px`);
    }
    if (config.saturation !== undefined) {
      root.style.setProperty('--lg-saturate', String(config.saturation));
    }
    if (config.accentColor) {
      root.style.setProperty('--lg-accent', config.accentColor);
    }
  }, [resolvedTheme, config]);

  return (
    <GlassContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        config,
        setConfig,
        refraction,
      }}
    >
      {children}
    </GlassContext.Provider>
  );
}

export function useGlass(): GlassContextValue {
  const context = useContext(GlassContext);
  if (!context) {
    throw new Error('useGlass must be used within a GlassProvider');
  }
  return context;
}

export function useTheme(): Pick<GlassContextValue, 'theme' | 'resolvedTheme' | 'setTheme'> {
  const { theme, resolvedTheme, setTheme } = useGlass();
  return { theme, resolvedTheme, setTheme };
}

export function useRefraction(): RefractionConfig {
  const context = useContext(GlassContext);
  if (!context) {
    return DEFAULT_REFRACTION;
  }
  return context.refraction;
}
