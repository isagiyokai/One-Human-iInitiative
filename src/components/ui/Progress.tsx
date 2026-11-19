'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  animated?: boolean;
}

const progressStyles = {
  base: 'w-full overflow-hidden rounded-full bg-stone-200',
  sizes: {
    sm: 'h-1.5',
    md: 'h-3',
    lg: 'h-4',
  },
  variants: {
    default: 'bg-charcoal-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  },
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      showLabel = false,
      label,
      size = 'md',
      variant = 'default',
      animated = false,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotion();
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const displayProgress = useMotionValue(0);
    const springProgress = useSpring(displayProgress, {
      stiffness: 300,
      damping: 30,
      mass: 0.8
    });

    React.useEffect(() => {
      if (animated || displayProgress.get() === 0) {
        if (!reducedMotion) {
          displayProgress.set(percentage);
        } else {
          displayProgress.set(percentage);
        }
      }
    }, [percentage, animated, displayProgress, reducedMotion]);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(showLabel || label) && (
          <div className="flex justify-between text-sm font-medium text-charcoal-600 mb-1.5">
            <span>{label || 'Progress'}</span>
            <motion.span
              style={{ x: springProgress }}
              className="font-mono tabular-nums"
              aria-hidden="true"
            >
              {Math.round(displayProgress.get())}%
            </motion.span>
          </div>
        )}
        <div
          className={cn(progressStyles.base, progressStyles.sizes[size])}
          role="progressbar"
          aria-valuenow={Math.round(value)}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || 'Progress'}
        >
          <motion.div
            className={cn(progressStyles.variants[variant], 'h-full rounded-full')}
            style={{ width: reducedMotion ? `${percentage}%` : springProgress }}
            aria-hidden="true"
            initial={false}
            animate={reducedMotion ? undefined : { width: `${percentage}%` }}
            transition={reducedMotion ? undefined : { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';