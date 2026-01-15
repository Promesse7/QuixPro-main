import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Add listener
    mediaQuery.addEventListener('change', listener);
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
