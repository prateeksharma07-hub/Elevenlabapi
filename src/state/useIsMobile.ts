import { useState, useEffect } from 'react';

/**
 * useIsMobile hook
 * Detects mobile viewport (width <= 768px or coarse pointer)
 * Isolated strictly for mobile art direction without affecting desktop.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    return window.innerWidth <= breakpoint || (isCoarse && window.innerWidth <= 1024);
  });

  useEffect(() => {
    const check = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(window.innerWidth <= breakpoint || (isCoarse && window.innerWidth <= 1024));
    };

    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isMobile;
}
