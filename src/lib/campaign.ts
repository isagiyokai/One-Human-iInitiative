import { getTimeRemaining, type TimeRemaining } from './utils';

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'target_reached' | 'expired' | 'completed';
export type { TimeRemaining };

export interface Campaign {
  id: string;
  name: string;
  description: string;
  target: number;
  maxTarget: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  heroTitle: string;
  heroTagline: string;
  publicContent?: string;
  confirmedAmount: number;
  confirmedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignSettings {
  bitcoinAddress: string;
  solanaAddress: string;
  phantomUsername: string;
  kofiEnabled: boolean;
  kofiUrl: string;
  kofiLabel: string;
  kofiStatus: 'pending_approval' | 'active' | 'disabled';
}

export function computeCampaignStatus(
  campaign: Pick<Campaign, 'status' | 'startDate' | 'endDate' | 'confirmedAmount' | 'target'>,
  now = new Date()
): CampaignStatus {
  // If manually set to paused or completed, respect that
  if (campaign.status === 'paused' || campaign.status === 'completed') {
    return campaign.status;
  }

  const start = new Date(campaign.startDate).getTime();
  const end = new Date(campaign.endDate).getTime();
  const nowTime = now.getTime();

  // Not started yet
  if (nowTime < start) {
    return 'draft';
  }

  // Target reached takes precedence over expired
  if (campaign.confirmedAmount >= campaign.target) {
    return 'target_reached';
  }

  // Expired
  if (nowTime > end) {
    return 'expired';
  }

  // Active
  return 'active';
}

export function getCampaignProgress(campaign: Pick<Campaign, 'confirmedAmount' | 'target'>): {
  percentage: number;
  remaining: number;
  isComplete: boolean;
} {
  const percentage = campaign.target > 0
    ? Math.min(100, (campaign.confirmedAmount / campaign.target) * 100)
    : 0;

  const remaining = Math.max(0, campaign.target - campaign.confirmedAmount);

  return {
    percentage: Math.round(percentage * 100) / 100,
    remaining,
    isComplete: campaign.confirmedAmount >= campaign.target,
  };
}

export function getCountdownInfo(endDate: string) {
  return getTimeRemaining(endDate);
}

export function canAcceptContributions(campaign: Campaign): boolean {
  const status = computeCampaignStatus(campaign);
  return status === 'active';
}

export function getCampaignStateMessage(campaign: Campaign): {
  title: string;
  description: string;
  variant: 'info' | 'success' | 'warning' | 'error';
} {
  const status = computeCampaignStatus(campaign);
  const progress = getCampaignProgress(campaign);
  const countdown = getCountdownInfo(campaign.endDate);

  switch (status) {
    case 'draft':
      return {
        title: 'Campaign Starting Soon',
        description: `Campaign starts on ${new Date(campaign.startDate).toLocaleDateString()}`,
        variant: 'info',
      };
    case 'active':
      if (progress.isComplete) {
        return {
          title: 'Target Reached!',
          description: 'Campaign has reached its funding target',
          variant: 'success',
        };
      }
      return {
        title: 'Campaign Active',
        description: `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m remaining`,
        variant: 'info',
      };
    case 'paused':
      return {
        title: 'Campaign Paused',
        description: 'Contributions are temporarily paused by the administrator',
        variant: 'warning',
      };
    case 'target_reached':
      return {
        title: 'Target Reached!',
        description: 'Campaign has reached its funding target',
        variant: 'success',
      };
    case 'expired':
      return {
        title: 'Campaign Ended',
        description: 'The campaign period has expired',
        variant: 'error',
      };
    case 'completed':
      return {
        title: 'Campaign Completed',
        description: `Final amount: $${progress.percentage.toLocaleString()} (${progress.percentage}% of target)`,
        variant: 'success',
      };
    default:
      return {
        title: 'Unknown Status',
        description: '',
        variant: 'info',
      };
  }
}

export function getStatusBadgeVariant(status: CampaignStatus): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'draft':
      return 'default';
    case 'active':
      return 'info';
    case 'paused':
      return 'warning';
    case 'target_reached':
      return 'success';
    case 'expired':
      return 'error';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
}

export function formatCampaignForPublic(campaign: Campaign, settings: CampaignSettings) {
  const status = computeCampaignStatus(campaign);
  const progress = getCampaignProgress(campaign);
  const countdown = getCountdownInfo(campaign.endDate);
  const stateMessage = getCampaignStateMessage(campaign);

  return {
    ...campaign,
    status,
    progress,
    countdown,
    stateMessage,
    settings: {
      bitcoinAddress: settings.bitcoinAddress,
      solanaAddress: settings.solanaAddress,
      phantomUsername: settings.phantomUsername,
      kofiEnabled: settings.kofiEnabled && settings.kofiStatus === 'active',
      kofiUrl: settings.kofiUrl,
      kofiLabel: settings.kofiLabel,
    },
  };
}

export const MAX_TARGET = 50_000;
export const MIN_TARGET = 10_000;

export function validateTargetIncrease(currentTarget: number, requestedTarget: number): {
  valid: boolean;
  error?: string;
} {
  if (requestedTarget <= currentTarget) {
    return { valid: false, error: 'Requested target must be higher than current target' };
  }
  if (requestedTarget > MAX_TARGET) {
    return { valid: false, error: `Target cannot exceed $${MAX_TARGET.toLocaleString()}` };
  }
  if (requestedTarget < MIN_TARGET) {
    return { valid: false, error: `Target must be at least $${MIN_TARGET.toLocaleString()}` };
  }
  return { valid: true };
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  switch (currency) {
    case 'BTC':
      return `${amount.toFixed(8)} BTC`;
    case 'SOL':
      return `${amount.toFixed(2)} SOL`;
    case 'USD':
    default:
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
  }
}