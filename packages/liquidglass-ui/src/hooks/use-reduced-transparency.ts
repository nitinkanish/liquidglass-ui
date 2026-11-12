import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-transparency: reduce)';

function getInitialState(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(QUERY).matches;
}

export function useReducedTransparency(): boolean {
  const [reducedTransparency, setReducedTransparency] = useState(getInitialState);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    
    const handler = (event: MediaQueryListEvent) => {
      setReducedTransparency(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    setReducedTransparency(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  return reducedTransparency;
}
