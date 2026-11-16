'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="system"
      className="toaster-group"
      toastOptions={{
        classNames: {
          toast: 'rounded-xl border border-stone-200 bg-white text-charcoal-900 shadow-lg',
          description: 'text-stone-600',
          actionButton: 'rounded-lg bg-charcoal-900 text-white hover:bg-charcoal-800',
          cancelButton: 'rounded-lg border border-stone-300 hover:bg-stone-100',
          closeButton: 'text-stone-400 hover:text-stone-600',
        },
        style: {
          background: 'var(--color-warm-white)',
          color: 'var(--color-charcoal-900)',
          border: '1px solid var(--color-stone-200)',
        },
        duration: 4000,
      }}
    />
  );
}