'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({
  label,
  hint,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-charcoal-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full rounded-lg border bg-white px-4 py-2.5 text-charcoal-900
          placeholder:text-stone-400
          focus:outline-none focus:ring-2 focus:ring-offset-0
          transition-colors duration-200
          ${error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-stone-300 focus:ring-charcoal-500 focus:border-charcoal-500'
          }
          disabled:bg-stone-50 disabled:text-stone-500 disabled:cursor-not-allowed
          ${className}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-stone-500">
          {hint}
        </p>
      )}
    </div>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Textarea({
  label,
  hint,
  error,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-charcoal-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          w-full rounded-lg border bg-white px-4 py-2.5 text-charcoal-900
          placeholder:text-stone-400 resize-y min-h-[100px]
          focus:outline-none focus:ring-2 focus:ring-offset-0
          transition-colors duration-200
          ${error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-stone-300 focus:ring-charcoal-500 focus:border-charcoal-500'
          }
          disabled:bg-stone-50 disabled:text-stone-500 disabled:cursor-not-allowed
          ${className}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${textareaId}-hint`} className="mt-1.5 text-sm text-stone-500">
          {hint}
        </p>
      )}
    </div>
  );
}