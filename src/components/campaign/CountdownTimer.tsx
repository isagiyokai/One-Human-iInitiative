'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence, animate } from 'motion/react';
import { Card, CardContent } from '@/components/ui/Card';
import { useCountdown } from '@/hooks/useCountdown';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { CampaignStatus } from '@/lib/campaign';

interface CountdownTimerProps {
  endDate: string;
  startDate?: string;
  status: CampaignStatus;
}

export function CountdownTimer({ endDate, startDate, status }: CountdownTimerProps) {
  const reducedMotion = useReducedMotion();
  const timeRemaining = useCountdown({
    endTimestamp: endDate,
    status,
    intervalMs: reducedMotion ? 60000 : 1000,
  });

  const { days, hours, minutes, seconds, isExpired, isStarted, isPaused } = timeRemaining;
  const isNotStarted = !isStarted;

  if (status === 'draft' || status === 'completed') {
    return null;
  }

  const statusConfigs = {
    target_reached: {
      color: 'emerald',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Target Reached',
      description: 'Campaign completed successfully',
    },
    expired: {
      color: 'red',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Campaign Ended',
      description: 'The campaign period has expired',
    },
    paused: {
      color: 'amber',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Campaign Paused',
      description: 'Temporarily paused by administrator',
    },
    not_started: {
      color: 'charcoal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Starting Soon',
    },
  };

  if (status === 'target_reached') {
    return renderStatusCard(statusConfigs.target_reached);
  }

  if (status === 'expired') {
    return renderStatusCard(statusConfigs.expired);
  }

  if (isPaused) {
    return renderStatusCard(statusConfigs.paused);
  }

  if (isNotStarted) {
    const start = new Date(startDate || endDate);
    return (
      <StatusCard color="charcoal">
        {statusConfigs.not_started.icon}
        <span className="font-semibold">{statusConfigs.not_started.label}</span>
        <p className="text-sm text-charcoal-600 mt-1">
          Begins {start.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </StatusCard>
    );
  }

  if (isExpired) {
    return renderStatusCard({
      ...statusConfigs.expired,
      label: 'Time Expired',
      description: 'The campaign has ended',
    });
  }

  return (
    <Card variant="outlined" padding="md">
      <CardContent>
        <div className="text-center mb-4">
          <span className="text-sm font-medium text-charcoal-700 uppercase tracking-wider">
            Time Remaining
          </span>
        </div>

        <div
          className="flex items-center justify-center gap-3"
          role="timer"
          aria-live="polite"
          aria-label={`Time remaining: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
        >
          <TimeUnit value={days} label="Days" reducedMotion={reducedMotion} />
          <TimeSeparator reducedMotion={reducedMotion} />
          <TimeUnit value={hours} label="Hours" reducedMotion={reducedMotion} />
          <TimeSeparator reducedMotion={reducedMotion} />
          <TimeUnit value={minutes} label="Minutes" reducedMotion={reducedMotion} />
          <TimeSeparator reducedMotion={reducedMotion} />
          <TimeUnit value={seconds} label="Seconds" reducedMotion={reducedMotion} />
        </div>

        <p className="mt-4 text-center text-xs text-stone-500">
          Updates in real-time · Your local timezone
        </p>
      </CardContent>
    </Card>
  );
}

function StatusCard({ children, color }: { children: React.ReactNode; color: string }) {
  const colorMap = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    charcoal: 'bg-charcoal-50 border-charcoal-200 text-charcoal-700',
  };

  return (
    <Card variant="outlined" padding="md" className={colorMap[color as keyof typeof colorMap]}>
      <CardContent className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function renderStatusCard(config: { color: string; icon: React.ReactNode; label: string; description: string }) {
  return <StatusCard color={config.color}>{config.icon}<span className="font-semibold">{config.label}</span><p className="text-sm mt-1">{config.description}</p></StatusCard>;
}

function TimeUnit({ value, label, reducedMotion }: { value: number; label: string; reducedMotion: boolean }) {
  const prevValue = React.useRef(value);
  const displayValue = useMotionValue(value);
  const springValue = useSpring(displayValue, {
    stiffness: 300,
    damping: 30,
    mass: 0.5
  });

  React.useEffect(() => {
    if (value !== prevValue.current) {
      if (!reducedMotion) {
        animate(displayValue, value, { type: 'spring', stiffness: 400, damping: 25 });
      } else {
        displayValue.set(value);
      }
      prevValue.current = value;
    }
  }, [value, displayValue, reducedMotion]);

  return (
    <div className="flex flex-col items-center min-w-[60px]">
      <div className="relative">
        <motion.span
          style={{ y: springValue }}
          className="block w-[60px] text-center text-2xl sm:text-3xl font-bold tabular-nums text-charcoal-900 font-mono overflow-hidden"
        >
          {value.toString().padStart(2, '0')}
        </motion.span>
      </div>
      <span className="text-xs text-stone-500 uppercase tracking-wider mt-1">{label}</span>
    </div>
  );
}

function TimeSeparator({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      className="flex items-center text-2xl sm:text-3xl font-bold text-charcoal-400 font-mono"
      aria-hidden="true"
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: reducedMotion ? 'none' : 'flex' }}
    >
      :
    </motion.div>
  );
}

