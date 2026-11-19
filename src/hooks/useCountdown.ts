'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CampaignStatus } from '@/lib/campaign';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isPaused: boolean;
  isStarted: boolean;
  totalSeconds: number;
}

interface UseCountdownOptions {
  endTimestamp: string;
  status: CampaignStatus;
  onExpire?: () => void;
  intervalMs?: number;
}

export function useCountdown({
  endTimestamp,
  status,
  onExpire,
  intervalMs = 1000,
}: UseCountdownOptions) {
  const calculateTimeRemaining = useCallback((
    end: string,
    campaignStatus: CampaignStatus
  ): TimeRemaining => {
    const now = new Date();
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - now.getTime();
    const isStarted = campaignStatus !== 'draft';

    if (campaignStatus === 'paused') {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
        isPaused: true,
        isStarted,
        totalSeconds: 0,
      };
    }

    if (
      diffMs <= 0 ||
      campaignStatus === 'expired' ||
      campaignStatus === 'completed' ||
      campaignStatus === 'target_reached'
    ) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        isPaused: false,
        isStarted,
        totalSeconds: 0,
      };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      isPaused: false,
      isStarted,
      totalSeconds,
    };
  }, []);

  // Define the calculation before the lazy initializer uses it.
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(endTimestamp, status)
  );

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining(endTimestamp, status));

    // A draft campaign displays its scheduled start date rather than a running timer.
    if (
      status === 'draft' ||
      status === 'paused' ||
      status === 'expired' ||
      status === 'completed' ||
      status === 'target_reached'
    ) {
      return;
    }

    const interval = setInterval(() => {
      const newTime = calculateTimeRemaining(endTimestamp, status);
      setTimeRemaining(newTime);

      if (newTime.isExpired && !timeRemaining.isExpired) {
        onExpire?.();
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [endTimestamp, status, calculateTimeRemaining, intervalMs, onExpire, timeRemaining.isExpired]);

  return timeRemaining;
}
