'use client';

import React from 'react';
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

export function CampaignProgress({
  raised = 0,
  target = 10000,
  contributorCount = 0,
  status = 'active',
  endDate,
  startDate,
}: CampaignProgressProps) {
  const percentage = target > 0 ? Math.min((raised / target) * 100, 100) : 0;
  const isTargetReached = status === 'target_reached' || raised >= target;
  const isExpired = status === 'expired';
  const isCompleted = status === 'completed';
  const isPaused = status === 'paused';
  const canContribute = status === 'active' && !isTargetReached && !isExpired;

  const { label: statusLabel, variant: statusVariant } = statusConfig[status];

  return (
    <div className="space-y-8">
      {/* Main Progress Card */}
      <Card variant="elevated" padding="lg" className="max-w-2xl mx-auto">
        <CardHeader className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant={statusVariant} size="lg">
              {statusLabel}
            </Badge>
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Campaign Progress</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Amount Raised */}
          <div className="text-center">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-900 tabular-nums">
              {formatCurrency(raised)}
            </div>
            <p className="mt-2 text-stone-600">
              of {formatCurrency(target)} target
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <Progress
              value={raised}
              max={target}
              showLabel
              label="Target Progress"
              size="lg"
              variant={isTargetReached ? 'success' : 'default'}
              animated={canContribute}
            />
            <p className="text-center text-sm text-stone-500">
              {percentage.toFixed(1)}% funded
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-charcoal-900 tabular-nums">
                {formatNumber(contributorCount)}
              </div>
              <p className="text-sm text-stone-600">Confirmed Contributors</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-charcoal-900 tabular-nums">
                {formatCurrency(target - raised)}
              </div>
              <p className="text-sm text-stone-600">
                {isTargetReached ? 'Target Reached!' : 'Remaining to Target'}
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          {endDate && (
            <CountdownTimer
              endDate={endDate}
              startDate={startDate}
              status={status}
            />
          )}

          {/* Status Messages */}
          {isTargetReached && (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-800 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <strong>Target Reached!</strong>
              </div>
              <p className="text-emerald-700">
                The campaign has reached its funding target. Contributions are now closed.
              </p>
            </div>
          )}

          {isExpired && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-center">
              <div className="flex items-center justify-center gap-2 text-red-800 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <strong>Campaign Expired</strong>
              </div>
              <p className="text-red-700">
                The campaign has ended. Final totals are displayed above.
              </p>
            </div>
          )}

          {isPaused && (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-center">
              <div className="flex items-center justify-center gap-2 text-amber-800 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <strong>Campaign Paused</strong>
              </div>
              <p className="text-amber-700">
                The campaign is temporarily paused. Please check back later.
              </p>
            </div>
          )}

          {isCompleted && (
            <div className="p-4 rounded-lg bg-charcoal-100 border border-charcoal-200 text-center">
              <div className="flex items-center justify-center gap-2 text-charcoal-800 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <strong>Campaign Completed</strong>
              </div>
              <p className="text-charcoal-700">
                This campaign has been finalized. Thank you to all contributors.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contribution Status Note */}
      {canContribute && (
        <div className="text-center text-sm text-stone-600">
          <p>Contributions are currently open. Choose a method below to support the campaign.</p>
        </div>
      )}
    </div>
  );
}