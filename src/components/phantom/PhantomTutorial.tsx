'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';

interface PhantomTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  reducedMotion: boolean;
}

// Detect test environment to handle fake timers
const isTestEnv = typeof jest !== 'undefined' || process.env.NODE_ENV === 'test';

const steps = [
  {
    title: 'Welcome to the Tutorial',
    description: 'This guide will walk you through setting up Phantom Wallet and making your first contribution to the One Human Initiative campaign.',
    illustration: 'welcome',
  },
  {
    title: 'Install Phantom Wallet',
    description: 'Visit phantom.app or search "Phantom Wallet" in your browser\'s extension store. Available for Chrome, Brave, Firefox, Edge, and as a mobile app.',
    illustration: 'install',
  },
  {
    title: 'Create a New Wallet',
    description: 'Click "Create New Wallet" and set a secure password. This password encrypts your wallet locally — Phantom never sees it.',
    illustration: 'create',
  },
  {
    title: 'Save Your Recovery Phrase',
    description: '<strong className="text-red-600">CRITICAL:</strong> Write down your 12-word recovery phrase on paper. Store it securely offline. <strong>Never share it with anyone.</strong> Not even Phantom support will ask for it.',
    illustration: 'recovery',
    warning: true,
  },
  {
    title: 'Fund Your Wallet with SOL',
    description: 'Buy SOL on an exchange (Coinbase, Binance, Kraken, etc.) and send it to your Phantom address. You need SOL for transaction fees (~0.001 SOL per transaction).',
    illustration: 'fund',
  },
  {
    title: 'Copy the Campaign Address',
    description: 'On the campaign homepage, go to the "Solana" or "Phantom Username" contribution method. Click "Copy Address" to copy the recipient address to your clipboard.',
    illustration: 'copy',
  },
  {
    title: 'Open Phantom & Click Send',
    description: 'Click the Phantom extension icon, then click "Send" (paper plane icon). Paste the campaign address in the recipient field.',
    illustration: 'send',
  },
  {
    title: 'Enter Amount & Confirm',
    description: 'Enter the amount of SOL or USDC you want to contribute. Review the network fee (very small on Solana). Click "Send" to confirm.',
    illustration: 'confirm',
  },
  {
    title: 'Copy Transaction Signature',
    description: 'After sending, click the transaction in Phantom\'s activity tab. Click "Copy Signature" (looks like a long string of letters/numbers). This is your proof of contribution.',
    illustration: 'signature',
  },
  {
    title: 'Submit for Verification',
    description: 'Return to the campaign site and use the contribution form (coming soon) to submit your transaction signature. Admin will verify on-chain and your contribution will count toward the target.',
    illustration: 'verify',
  },
];

const illustrations: Record<string, React.ReactNode> = {
  welcome: (
    <svg className="w-24 h-24 mx-auto text-earth-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  install: (
    <svg className="w-24 h-24 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  create: (
    <svg className="w-24 h-24 mx-auto text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  recovery: (
    <svg className="w-24 h-24 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  fund: (
    <svg className="w-24 h-24 mx-auto text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  copy: (
    <svg className="w-24 h-24 mx-auto text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
    </svg>
  ),
  send: (
    <svg className="w-24 h-24 mx-auto text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  confirm: (
    <svg className="w-24 h-24 mx-auto text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  signature: (
    <svg className="w-24 h-24 mx-auto text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  verify: (
    <svg className="w-24 h-24 mx-auto text-earth-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 01-9 9m9-9a9 9 0 00-9-9" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9" />
    </svg>
  ),
};

const springTransition = { type: 'spring', stiffness: 300, damping: 30 } as const;
const springTransitionSlow = { type: 'spring', stiffness: 400, damping: 30 } as const;
const springTransitionFast = { type: 'spring', stiffness: 400, damping: 25 } as const;

type SpringTransition = { type: 'spring'; stiffness: number; damping: number; mass?: number };

function getAnimProps(reducedMotion: boolean, customTransition?: SpringTransition) {
  if (reducedMotion || isTestEnv) {
    return { initial: false, animate: false, transition: { duration: 0 } };
  }
  return { transition: customTransition || springTransition };
}

export function PhantomTutorial({ isOpen, onClose, reducedMotion }: PhantomTutorialProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);
  const [prevStep, setPrevStep] = React.useState(-1);

  const progressValue = useMotionValue(0);
  const springProgress = useSpring(progressValue, { stiffness: 300, damping: 30 });

  const stepContentKey = `${currentStep}-${completed ? 'complete' : 'step'}`;

  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setCompleted(false);
      setPrevStep(-1);
      progressValue.set(0);
    }
  }, [isOpen, progressValue]);

  React.useEffect(() => {
    if (!isOpen) return;
    const progress = ((currentStep + 1) / steps.length) * 100;
    progressValue.set(progress);
  }, [currentStep, completed, progressValue]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      setCompleted(true);
      setTimeout(() => {
        onClose();
        setCompleted(false);
        setCurrentStep(0);
      }, 1500);
    } else {
      setPrevStep(currentStep);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setPrevStep(currentStep);
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleReplay = () => {
    setCurrentStep(0);
    setCompleted(false);
    setPrevStep(-1);
  };

  const panelAnimProps = getAnimProps(reducedMotion, { type: 'spring', stiffness: 400, damping: 35, mass: 0.5 });
  const contentAnimProps = getAnimProps(reducedMotion, springTransition);
  const iconAnimProps = getAnimProps(reducedMotion, springTransitionFast);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.2, ease: 'easeOut' }}
      >
        <motion.div
          id="phantom-tutorial-panel"
          className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          {...panelAnimProps}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-200">
            <div>
              <h2 id="tutorial-title" className="text-xl font-bold text-charcoal-900">
                Phantom Wallet Tutorial
              </h2>
              <p id="tutorial-description" className="text-sm text-stone-500">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close tutorial"
              className="text-stone-500 hover:text-charcoal-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Progress Bar - Spring animated */}
          <div className="h-1 bg-stone-100 overflow-hidden">
            <motion.div
              className="h-full bg-earth-500"
              style={{ width: springProgress }}
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Tutorial progress"
            />
          </div>

          {/* Step Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <AnimatePresence mode={isTestEnv ? 'popLayout' : 'wait'}>
              {completed ? (
                <CompletionScreen key="complete" onReplay={handleReplay} onClose={onClose} reducedMotion={reducedMotion} />
              ) : (
                <StepContent
                  key={stepContentKey}
                  step={step}
                  stepNumber={currentStep + 1}
                  totalSteps={steps.length}
                  illustrations={illustrations}
                  reducedMotion={reducedMotion}
                  direction={currentStep > prevStep ? 'forward' : 'backward'}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <motion.div
            className="flex items-center justify-between p-6 border-t border-stone-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            {...contentAnimProps}
          >
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
              aria-label="Previous step"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentStep ? 'bg-earth-500' : 'bg-stone-300'}`}
                  onClick={() => {
                    setPrevStep(currentStep);
                    setCurrentStep(index);
                  }}
                  aria-label={`Go to step ${index + 1}`}
                  aria-current={index === currentStep ? 'step' : undefined}
                  whileTap={reducedMotion ? undefined : { scale: 0.8 }}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              aria-label={isLastStep ? 'Complete tutorial' : 'Next step'}
            >
              {isLastStep ? (
                <>
                  Complete
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              ) : (
                <>
                  Next
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function StepContent({
  step,
  stepNumber,
  totalSteps,
  illustrations,
  reducedMotion,
  direction,
}: {
  step: typeof steps[0];
  stepNumber: number;
  totalSteps: number;
  illustrations: Record<string, React.ReactNode>;
  reducedMotion: boolean;
  direction: 'forward' | 'backward';
}) {
  const slideX = direction === 'forward' ? 30 : -30;
  const stepAnimProps = getAnimProps(reducedMotion, { type: 'spring', stiffness: 400, damping: 30 });
  const contentAnimProps = getAnimProps(reducedMotion, springTransition);
  const iconAnimProps = getAnimProps(reducedMotion, { type: 'spring', stiffness: 300, damping: 25 });
  const illustrationAnimProps = getAnimProps(reducedMotion, { type: 'spring', stiffness: 400, damping: 25 });
  const counterAnimProps = getAnimProps(reducedMotion, springTransition);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: slideX }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -slideX }}
      {...stepAnimProps}
    >
      {/* Illustration */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        {...contentAnimProps}
      >
        <div className="relative w-32 h-32 mx-auto rounded-2xl bg-stone-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            {...illustrationAnimProps}
          >
            {illustrations[step.illustration]}
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        {...contentAnimProps}
      >
        <h3 className="text-2xl font-bold text-charcoal-900">{step.title}</h3>
        <div className="prose prose-sm max-w-none text-stone-600 leading-relaxed">
          <p dangerouslySetInnerHTML={{ __html: step.description }} />
        </div>

        {step.warning && (
          <motion.div
            className="p-4 rounded-lg bg-red-50 border border-red-200"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            {...iconAnimProps}
          >
            <div className="flex items-start gap-3">
              <motion.svg
                className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                {...iconAnimProps}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </motion.svg>
              <div className="text-sm text-red-800">
                <p className="font-semibold">Security Warning</p>
                <p>Never share your recovery phrase or private key with anyone. Legitimate services will never ask for these.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step Counter */}
        <motion.div
          className="flex items-center justify-center gap-2 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          {...counterAnimProps}
        >
          {Array.from({ length: totalSteps }, (_, i) => (
            <motion.span
              key={i}
              className={`w-8 h-1 rounded ${i === stepNumber - 1 ? 'bg-earth-500' : 'bg-stone-200'}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i === stepNumber - 1 ? 1 : 0.5 }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30, delay: i * 0.05 }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Official Link */}
      <motion.div
        className="pt-4 border-t border-stone-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        {...contentAnimProps}
      >
        <a
          href="https://phantom.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-earth-600 hover:text-earth-700 hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Visit official Phantom website
        </a>
      </motion.div>
    </motion.div>
  );
}

function CompletionScreen({
  onReplay,
  onClose,
  reducedMotion,
}: {
  onReplay: () => void;
  onClose: () => void;
  reducedMotion: boolean;
}) {
  const completionAnimProps = getAnimProps(reducedMotion, springTransition);
  const iconAnimProps = getAnimProps(reducedMotion, { type: 'spring', stiffness: 400, damping: 25 });
  const contentAnimProps = getAnimProps(reducedMotion, springTransition);

  return (
    <motion.div
      className="text-center space-y-6 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      {...completionAnimProps}
    >
      <motion.div
        className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        {...iconAnimProps}
      >
        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      <motion.h3
        className="text-2xl font-bold text-charcoal-900"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        {...contentAnimProps}
      >
        You&apos;re Ready!
      </motion.h3>
      <motion.p
        className="text-stone-600 leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        {...contentAnimProps}
      >
        You now know how to set up Phantom Wallet and contribute to the campaign.
        Remember: keep your recovery phrase safe and never share it.
      </motion.p>
      <motion.div
        className="flex gap-4 justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        {...contentAnimProps}
      >
        <Button variant="outline" onClick={onReplay} whileTap={reducedMotion ? undefined : { scale: 0.96 }}>
          Replay Tutorial
        </Button>
        <Button onClick={onClose} whileTap={reducedMotion ? undefined : { scale: 0.96 }}>
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  );
}