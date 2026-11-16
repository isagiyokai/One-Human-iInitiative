'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { useCountdown } from '@/hooks/useCountdown';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CountdownTimerProps {
  endDate: string;
  startDate?: string;
  status: 'draft' | 'active' | 'paused' | 'target_reached' | 'expired' | 'completed';
}

export function CountdownTimer({ endDate, startDate, status }: CountdownTimerProps) {
  const reducedMotion = useReducedMotion();
  const timeRemaining = useCountdown({
    endTimestamp: endDate,
    status: status as any,
    intervalMs: reducedMotion ? 60000 : 1000,
  });

  const { days, hours, minutes, seconds, isExpired, isStarted, isPaused } = timeRemaining;
  const isActive = status === 'active' && !isExpired && isStarted;
  const isNotStarted = !isStarted;

  if (status === 'draft' || status === 'completed') {
    return null;
  }

  if (status === 'target_reached') {
    return (
      <Card variant="outlined" padding="md">
        <CardContent className="text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-700 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Target Reached</span>
          </div>
          <p className="text-sm text-emerald-600">Campaign completed successfully</p>
        </CardContent>
      </Card>
    );
  }

  if (status === 'expired') {
    return (
      <Card variant="outlined" padding="md">
        <CardContent className="text-center">
          <div className="flex items-center justify-center gap-2 text-red-700 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Campaign Ended</span>
          </div>
          <p className="text-sm text-red-600">The campaign period has expired</p>
        </CardContent>
      </Card>
    );
  }

  if (isPaused) {
    return (
      <Card variant="outlined" padding="md">
        <CardContent className="text-center">
          <div className="flex items-center justify-center gap-2 text-amber-700 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Campaign Paused</span>
          </div>
          <p className="text-sm text-amber-600">Temporarily paused by administrator</p>
        </CardContent>
      </Card>
    );
  }

  if (isNotStarted) {
    const start = new Date(startDate || endDate);
    return (
      <Card variant="outlined" padding="md">
        <CardContent className="text-center">
          <div className="flex items-center justify-center gap-2 text-charcoal-700 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Starting Soon</span>
          </div>
          <p className="text-sm text-charcoal-600">
            Begins {start.toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isExpired) {
    return (
      <Card variant="outlined" padding="md">
        <CardContent className="text-center">
          <div className="flex items-center justify-center gap-2 text-red-700 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Time Expired</span>
          </div>
          <p className="text-sm text-red-600">The campaign has ended</p>
        </CardContent>
      </Card>
    );
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
          <TimeUnit value={days} label="Days" />
          <TimeSeparator />
          <TimeUnit value={hours} label="Hours" />
          <TimeSeparator />
          <TimeUnit value={minutes} label="Minutes" />
          <TimeSeparator />
          <TimeUnit value={seconds} label="Seconds" />
        </div>

        <p className="mt-4 text-center text-xs text-stone-500">
          Updates in real-time · Your local timezone
        </p>
      </CardContent>
    </Card>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[60px]">
      <div className="relative">
        <span className="block w-[60px] text-center text-2xl sm:text-3xl font-bold tabular-nums text-charcoal-900 font-mono">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-stone-500 uppercase tracking-wider mt-1">{label}</span>
    </div>
  );
}

function TimeSeparator() {
  return (
    <div className="flex items-center text-2xl sm:text-3xl font-bold text-charcoal-400 font-mono animate-pulse" aria-hidden="true">
      :
    </div>
  );
}