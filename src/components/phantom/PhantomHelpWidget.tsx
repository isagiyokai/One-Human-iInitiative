'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence, animate } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PhantomTutorial } from './PhantomTutorial';

export function PhantomHelpWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const reducedMotion = useReducedMotion();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const panelOrigin = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const panelX = useMotionValue(0);
  const panelY = useMotionValue(0);
  const panelScale = useMotionValue(0);
  const panelOpacity = useMotionValue(0);

  const springConfig = { stiffness: 400, damping: 35, mass: 0.5 };
  const springX = useSpring(panelX, springConfig);
  const springY = useSpring(panelY, springConfig);
  const springScale = useSpring(panelScale, springConfig);
  const springOpacity = useSpring(panelOpacity, springConfig);

  const openPanel = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const panelWidth = 400;
    const panelHeight = 520;

    const targetX = Math.min(rect.left - panelWidth + 70, viewportWidth - panelWidth - 24);
    const targetY = Math.min(rect.top - panelHeight - 16, viewportHeight - panelHeight - 24);

    panelOrigin.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

    const startX = panelOrigin.current.x - panelWidth / 2;
    const startY = panelOrigin.current.y - panelHeight / 2;

    panelX.set(startX);
    panelY.set(startY);
    panelScale.set(0.9);
    panelOpacity.set(0);

    setIsOpen(true);

    if (!reducedMotion) {
      animate(panelX, targetX, springConfig);
      animate(panelY, targetY, springConfig);
      animate(panelScale, 1, { ...springConfig, stiffness: 300, damping: 30 });
      animate(panelOpacity, 1, { duration: 0.15, ease: 'easeOut' });
    } else {
      panelX.set(targetX);
      panelY.set(targetY);
      panelScale.set(1);
      panelOpacity.set(1);
    }
  };

  const closePanel = () => {
    if (!reducedMotion) {
      animate(panelX, panelOrigin.current.x - 200, { ...springConfig, stiffness: 500, damping: 40 });
      animate(panelY, panelOrigin.current.y - 260, { ...springConfig, stiffness: 500, damping: 40 });
      animate(panelScale, 0.9, { ...springConfig, stiffness: 400, damping: 35 });
      animate(panelOpacity, 0, { duration: 0.1, ease: 'easeIn' });
    }
    // Set immediately for test compatibility; AnimatePresence mode="pop" handles exit animation
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        ref={buttonRef}
        type="button"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-charcoal-900 text-white flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-charcoal-500 focus:ring-offset-2 ${!reducedMotion ? 'animate-pulse-subtle' : ''}`}
        onClick={openPanel}
        aria-label="Open Phantom Wallet tutorial"
        aria-expanded={isOpen}
        aria-controls="phantom-tutorial-panel"
        whileHover={{ scale: 1.05, boxShadow: '0 12px 24px -4px rgb(0 0 0 / 0.15), 0 8px 16px -8px rgb(0 0 0 / 0.1)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          transition: reducedMotion ? 'none' : undefined,
        }}
      >
        <motion.svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          animate={{ scale: reducedMotion ? 1 : [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </motion.svg>
        <span className="sr-only">New to crypto? Get help</span>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={closePanel}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.2, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Tutorial Panel - Spring-based with anchored origin */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="phantom-tutorial-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="phantom-tutorial-title"
            className="fixed z-50 w-[400px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)] overflow-hidden rounded-2xl bg-white shadow-[0_25px_50px_-12px_rgb(0_0_0/0.15),_0_12px_24px_-8px_rgb(0_0_0/0.1)] border border-stone-100"
            style={{
              x: springX,
              y: springY,
              scale: reducedMotion ? 1 : springScale,
              opacity: springOpacity,
              transformOrigin: 'center center',
            }}
            initial={false}
            animate={reducedMotion ? {} : undefined}
            exit={reducedMotion ? {} : undefined}
            transition={reducedMotion ? undefined : { type: 'spring', stiffness: 400, damping: 35 }}
          >
            <PhantomTutorial
              isOpen={isOpen}
              onClose={closePanel}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}