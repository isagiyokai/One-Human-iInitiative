'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to get animation duration based on reduced motion preference
 * Returns 0 if reduced motion is preferred, otherwise returns the provided duration
 */
export function useAnimationDuration(
  normalDuration: number,
  prefersReducedMotion?: boolean
): number {
  const reduced = prefersReducedMotion ?? useReducedMotion();
  return reduced ? 0 : normalDuration;
}

/**
 * Hook for conditional animation classes
 */
export function useAnimationClass(
  baseClass: string,
  animateClass: string,
  prefersReducedMotion?: boolean
): string {
  const reduced = prefersReducedMotion ?? useReducedMotion();
  return reduced ? baseClass : `${baseClass} ${animateClass}`;
}