'use client';

import React from 'react';
import { animate, useMotionValue, useSpring, useTransform } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  haptic?: boolean;
  whileTap?: { scale?: number };
}

export function Button({
  variant = 'default',
  size = 'md',
  loading = false,
  haptic = true,
  className = '',
  disabled,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const scale = useMotionValue(1);
  const tapScale = useMotionValue(1);
  const isPressed = useMotionValue(false);
  const reducedMotion = useReducedMotion();

  const variantStyles = {
    default: 'bg-charcoal-900 text-white hover:bg-charcoal-800 active:bg-charcoal-950 focus:ring-charcoal-500',
    outline: 'bg-transparent border-2 border-charcoal-900 text-charcoal-900 hover:bg-stone-50 active:bg-stone-100 focus:ring-charcoal-500',
    ghost: 'bg-transparent text-charcoal-700 hover:bg-stone-100 active:bg-stone-200 focus:ring-charcoal-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500',
    error: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5 min-h-[40px]',
    md: 'px-4 py-2 text-sm gap-2 min-h-[44px]',
    lg: 'px-6 py-3 text-base gap-2 min-h-[48px]',
  };

  const isDisabled = disabled || loading;

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    isPressed.set(true);
    if (!reducedMotion) {
      animate(tapScale, 0.96, { type: 'spring', stiffness: 400, damping: 20 });
    }
  };

  const handlePointerUp = () => {
    if (isDisabled) return;
    isPressed.set(false);
    if (!reducedMotion) {
      animate(tapScale, 1, { type: 'spring', stiffness: 300, damping: 25 });
    }
  };

  const handlePointerLeave = () => {
    if (isDisabled) return;
    isPressed.set(false);
    if (!reducedMotion) {
      animate(tapScale, 1, { type: 'spring', stiffness: 300, damping: 25 });
    }
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-colors duration-150 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      disabled={isDisabled}
      aria-busy={loading}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  return reduced;
}