import { useId as useReactId } from 'react';

let idCounter = 0;

export function useId(providedId?: string): string {
  const reactId = useReactId();
  
  if (providedId) {
    return providedId;
  }
  
  return reactId || `lg-${++idCounter}`;
}
