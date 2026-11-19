'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CountdownTimer } from './CountdownTimer';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface CampaignProgressProps {
  raised?: number;
  target?: number;
  contributorCount?: number;
  status?: 'draft' | 'active' | 'paused' | 'target_reached' | 'expired' | 'completed';
  endDate?: string;
  startDate?: string;
}

const statusConfig = {
  draft: { label: 'Draft', variant: 'default' as const },
  active: { label: 'Active', variant: 'success' as const },
  paused: { label: 'Paused', variant: 'warning' as const },
  target_reached: { label: 'Target Reached', variant: 'success' as const },
  expired: { label: 'Expired', variant: 'error' as const },
  completed: { label: 'Completed', variant: 'default' as const },
};

const springTransition = { type: 'spring', stiffness: 300, damping: 30 } as const;
const springTransitionSlow = { type: 'spring', stiffness: 400, damping: 30 } as const;
const springTransitionFast = { type: 'spring', stiffness: 400, damping: 25 } as const;

type SpringTransition = { type: 'spring'; stiffness: number; damping: number; mass?: number };

function getAnimationProps(reducedMotion: boolean, customTransition?: SpringTransition) {
  if (reducedMotion) {
    return { initial: false, animate: false, transition: { duration: 0 } };
  }
  return { transition: customTransition || springTransition };
}

export function CampaignProgress({
  raised = 0,
  target = 10000,
  contributorCount = 0,
  status = 'active',
  endDate,
  startDate,
}: CampaignProgressProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const percentage = target > 0 ? Math.min((raised / target) * 100, 100) : 0;
  const isTargetReached = status === 'target_reached' || raised >= target;
  const isExpired = status === 'expired';
  const isCompleted = status === 'completed';
  const isPaused = status === 'paused';
  const canContribute = status === 'active' && !isTargetReached && !isExpired;

  const { label: statusLabel, variant: statusVariant } = statusConfig[status];

  // Spring animations for stat numbers
  const raisedValue = useMotionValue(0);
  const springRaised = useSpring(raisedValue, { stiffness: 200, damping: 25, mass: 0.8 });
  const contributorValue = useMotionValue(0);
  const springContributors = useSpring(contributorValue, { stiffness: 200, damping: 25, mass: 0.8 });

  React.useEffect(() => {
    raisedValue.set(raised);
    contributorValue.set(contributorCount);
  }, [raised, contributorCount, raisedValue, contributorValue]);

  const statusAnimProps = getAnimationProps(reducedMotion, springTransitionSlow);
  const contentAnimProps = getAnimationProps(reducedMotion, springTransition);
  const iconAnimProps = getAnimationProps(reducedMotion, springTransitionFast);

  return (
    <div className="space-y-8">
      {/* Main Progress Card */}
      <Card variant="elevated" padding="lg" className="max-w-2xl mx-auto">
        <CardHeader className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              {...statusAnimProps}
            >
              <Badge variant={statusVariant} size="lg">
                {statusLabel}
              </Badge>
            </motion.div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-charcoal-900">Campaign Progress</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Amount Raised - Spring animated */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            {...contentAnimProps}
          >
            <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-charcoal-900 tabular-nums leading-[1.05]">
              <motion.span
                style={{ x: springRaised }}
                className="font-mono"
              >
                {formatCurrency(raisedValue.get())}
              </motion.span>
            </div>
            <p className="mt-3 text-lg text-stone-600 leading-relaxed">
              of <span className="font-medium text-charcoal-900">{formatCurrency(target)}</span> target
            </p>
          </motion.div>

          {/* Progress Bar - Spring animated */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            {...contentAnimProps}
          >
            <Progress
              value={raised}
              max={target}
              showLabel
              label="Target Progress"
              size="lg"
              variant={isTargetReached ? 'success' : 'default'}
              animated={canContribute}
            />
            <motion.p
              className="text-center text-sm text-stone-500 font-medium"
              style={{ x: springRaised }}
            >
              {percentage.toFixed(1)}% funded
            </motion.p>
          </motion.div>

          {/* Stats Grid - Spring animated */}
          <motion.div
            className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-stone-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            {...contentAnimProps}
          >
            <motion.div
              className="text-center p-4 rounded-xl bg-stone-50"
              whileHover={reducedMotion ? undefined : { y: -2, scale: 1.01 }}
              transition={reducedMotion ? undefined : { type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="text-3xl font-bold text-charcoal-900 tabular-nums">
                <motion.span
                  style={{ x: springContributors }}
                  className="font-mono"
                >
                  {formatNumber(contributorValue.get())}
                </motion.span>
              </div>
              <p className="text-sm text-stone-600 mt-1">Confirmed Contributors</p>
            </motion.div>
            <motion.div
              className="text-center p-4 rounded-xl bg-stone-50"
              whileHover={reducedMotion ? undefined : { y: -2, scale: 1.01 }}
              transition={reducedMotion ? undefined : { type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="text-3xl font-bold text-charcoal-900 tabular-nums">
                {formatCurrency(target - raised)}
              </div>
              <p className="text-sm text-stone-600 mt-1">
                {isTargetReached ? 'Target Reached!' : 'Remaining to Target'}
              </p>
            </motion.div>
          </motion.div>

          {/* Countdown Timer */}
          {endDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              {...contentAnimProps}
            >
              <CountdownTimer
                endDate={endDate}
                startDate={startDate}
                status={status}
              />
            </motion.div>
          )}

          {/* Status Messages */}
          {isTargetReached && (
            <motion.div
              className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              {...statusAnimProps}
            >
              <div className="flex items-center justify-center gap-2 text-emerald-800 mb-2">
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  {...iconAnimProps}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>
                <strong>Target Reached!</strong>
              </div>
              <p className="text-emerald-700 leading-relaxed">
                The campaign has reached its funding target. Contributions are now closed.
              </p>
            </motion.div>
          )}

          {isExpired && (
            <motion.div
              className="p-5 rounded-xl bg-red-50 border border-red-200 text-center"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              {...statusAnimProps}
            >
              <div className="flex items-center justify-center gap-2 text-red-800 mb-2">
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  initial={{ rotate: 180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  {...iconAnimProps}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>
                <strong>Campaign Expired</strong>
              </div>
              <p className="text-red-700 leading-relaxed">
                The campaign has ended. Final totals are displayed above.
              </p>
            </motion.div>
          )}

          {isPaused && (
            <motion.div
              className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-center"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              {...statusAnimProps}
            >
              <div className="flex items-center justify-center gap-2 text-amber-800 mb-2">
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  {...iconAnimProps}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </motion.svg>
                <strong>Campaign Paused</strong>
              </div>
              <p className="text-amber-700 leading-relaxed">
                The campaign is temporarily paused. Please check back later.
              </p>
            </motion.div>
          )}

          {isCompleted && (
            <motion.div
              className="p-5 rounded-xl bg-charcoal-100 border border-charcoal-200 text-center"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              {...statusAnimProps}
            >
              <div className="flex items-center justify-center gap-2 text-charcoal-800 mb-2">
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  {...iconAnimProps}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>
                <strong>Campaign Completed</strong>
              </div>
              <p className="text-charcoal-700 leading-relaxed">
                This campaign has been finalized. Thank you to all contributors.
              </p>
            </motion.div>
          )}

          {/* Contribution Status Note */}
          {canContribute && (
            <motion.div
              className="text-center pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              {...contentAnimProps}
            >
              <p className="text-stone-600 leading-relaxed">
                Contributions are currently open. Choose a method below to support the campaign.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}