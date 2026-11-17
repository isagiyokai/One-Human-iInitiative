'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
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
  animated: 'animate-pulse-subtle',
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
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
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(showLabel || label) && (
          <div className="flex justify-between text-sm font-medium text-charcoal-600 mb-1.5">
            <span>{label || 'Progress'}</span>
            <span aria-hidden="true">{percentage.toFixed(0)}%</span>
          </div>
        )}
        <div
          className={cn(
            progressStyles.base,
            progressStyles.sizes[size],
            className
          )}
          role="progressbar"
          aria-valuenow={Math.round(value)}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || 'Progress'}
        >
          <div
            className={cn(
              progressStyles.variants[variant],
              'h-full rounded-full transition-all duration-500 ease-out',
              animated && progressStyles.animated
            )}
            style={{ width: `${percentage}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';