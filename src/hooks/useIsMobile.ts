import { useState, useEffect } from 'react';

/**
 * Hook that returns true when the viewport width is below the `md` breakpoint (768px).
 * Uses `matchMedia` for efficient, event-driven updates (no resize polling).
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 767px)').matches
      : false
  );

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    mql.addEventListener('change', handler);
    // Sync in case SSR initial value was wrong
    setIsMobile(mql.matches);

    return () => mql.removeEventListener('change', handler);
  }, []);

  return isMobile;
};
