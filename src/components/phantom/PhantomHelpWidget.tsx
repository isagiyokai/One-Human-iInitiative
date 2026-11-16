'use client';

import React from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PhantomTutorial } from './PhantomTutorial';

export function PhantomHelpWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <>
      {/* Floating Help Button */}
      <button
        type="button"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-charcoal-900 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-charcoal-500 focus:ring-offset-2 ${
          reducedMotion ? '' : 'animate-pulse-subtle'
        }`}
        onClick={() => setIsOpen(true)}
        aria-label="Open Phantom Wallet tutorial"
        aria-expanded={isOpen}
        aria-controls="phantom-tutorial-panel"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="sr-only">New to crypto? Get help</span>
      </button>

      {/* Tutorial Panel */}
      {isOpen && (
        <PhantomTutorial
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          reducedMotion={reducedMotion}
        />
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm ${
            reducedMotion ? '' : 'animate-fade-in'
          }`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}