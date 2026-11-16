'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'default',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variantStyles = {
    default: 'bg-charcoal-900 text-white hover:bg-charcoal-800 focus:ring-charcoal-500',
    outline: 'bg-transparent border-2 border-charcoal-900 text-charcoal-900 hover:bg-stone-50 focus:ring-charcoal-500',
    ghost: 'bg-transparent text-charcoal-700 hover:bg-stone-100 focus:ring-charcoal-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      disabled={isDisabled}
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