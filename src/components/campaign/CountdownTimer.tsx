'use client';

import type { ReactNode } from 'react';
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
  const { days, hours, minutes, seconds, isExpired, isStarted, isPaused } = useCountdown({
    endTimestamp: endDate,
    status,
    intervalMs: reducedMotion ? 60000 : 1000,
  });

  if (status === 'completed') return null;

  if (status === 'target_reached') {
    return <StatusCard color="emerald" label="Target Reached" description="Campaign completed successfully" />;
  }
  if (status === 'expired' || isExpired) {
    return <StatusCard color="red" label="Campaign Ended" description="The campaign period has expired" />;
  }
  if (isPaused) {
    return <StatusCard color="amber" label="Campaign Paused" description="Temporarily paused by administrator" />;
  }
  if (!isStarted) {
    const start = new Date(startDate || endDate);
    return (
      <StatusCard color="charcoal" label="Starting Soon">
        Begins {start.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </StatusCard>
    );
  }

  return (
    <Card variant="outlined" padding="md">
      <CardContent>
        <div className="text-center mb-5">
          <span className="text-sm font-medium text-charcoal-700 uppercase tracking-wider">
            Time Remaining
          </span>
        </div>

        <div
          className="grid grid-cols-4 gap-2 sm:gap-3 max-w-xl mx-auto"
          role="timer"
          aria-live="off"
          aria-label={`Time remaining: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
        >
          <TimeUnit value={days} label="Days" />
          <TimeUnit value={hours} label="Hours" />
          <TimeUnit value={minutes} label="Minutes" />
          <TimeUnit value={seconds} label="Seconds" />
        </div>

        <p className="mt-4 text-center text-xs text-stone-500">
          Updates in real time · Your local timezone
        </p>
      </CardContent>
    </Card>
  );
}

function StatusCard({
  children,
  color,
  label,
  description,
}: {
  children?: ReactNode;
  color: 'emerald' | 'red' | 'amber' | 'charcoal';
  label: string;
  description?: string;
}) {
  const colorMap = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    charcoal: 'bg-charcoal-50 border-charcoal-200 text-charcoal-700',
  };

  return (
    <Card variant="outlined" padding="md" className={colorMap[color]}>
      <CardContent className="text-center">
        <p className="font-semibold">{label}</p>
        {description && <p className="text-sm mt-1">{description}</p>}
        {children && <p className="text-sm mt-1">{children}</p>}
      </CardContent>
    </Card>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-0 flex flex-col items-center justify-center rounded-lg bg-stone-50 px-1 py-3">
      <span className="flex w-full min-h-10 items-center justify-center text-center text-2xl sm:text-3xl leading-none font-bold font-mono tabular-nums text-charcoal-900">
        {Math.max(0, value).toString().padStart(2, '0')}
      </span>
      <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-wider text-stone-500">
        {label}
      </span>
    </div>
  );
}
