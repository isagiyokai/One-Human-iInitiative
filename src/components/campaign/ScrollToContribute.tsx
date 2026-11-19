'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion, animate } from 'motion/react';

interface ScrollToContributeProps {
  targetId: string;
}

export function ScrollToContribute({ targetId }: ScrollToContributeProps) {
  const reducedMotion = useReducedMotion();
  const isVisible = useMotionValue(0);
  const y = useSpring(isVisible, { stiffness: 400, damping: 35 });
  const scale = useMotionValue(1);

  const handleClick = () => {
    const target = document.getElementById(targetId);
    if (target) {
      if ('vibrate' in navigator) {
        navigator.vibrate(15);
      }

      animate(scale, 0.9, { duration: 0.08 }).then(() => {
        animate(scale, 1, { type: 'spring', stiffness: 400, damping: 20 });
      });

      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      target.focus({ preventScroll: true });
    }
  };

  React.useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.set(entry.isIntersecting ? 0 : 1);
      },
      { rootMargin: '100px', threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId, isVisible]);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40 lg:hidden"
      style={{ y, opacity: isVisible }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-earth-600 text-white text-sm font-medium shadow-lg hover:bg-earth-700 transition-colors focus:outline-none focus:ring-2 focus:ring-earth-500 focus:ring-offset-2"
        aria-label="Scroll to contribution methods"
        whileTap={{ scale: 0.95 }}
        style={{ scale }}
      >
        <motion.svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          animate={{ y: reducedMotion ? 0 : [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </motion.svg>
        <span className="hidden sm:inline">Contribute</span>
      </motion.button>
    </motion.div>
  );
}