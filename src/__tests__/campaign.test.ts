import { computeCampaignStatus, formatCurrency, CampaignStatus } from '@/lib/campaign';

describe('Campaign Logic', () => {
  const baseCampaign = {
    id: '1',
    name: 'Test Campaign',
    description: 'Test',
    target: 10000,
    maxTarget: 50000,
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-02-14T23:59:59Z',
    status: 'draft' as CampaignStatus,
    heroTitle: 'Test',
    heroTagline: 'Test',
    confirmedAmount: 0,
    confirmedCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  describe('computeCampaignStatus', () => {
    it('returns draft before start date', () => {
      const result = computeCampaignStatus(
        { ...baseCampaign, status: 'draft' },
        new Date('2024-01-10T00:00:00Z')
      );
      expect(result).toBe('draft');
    });

    it('returns active during campaign period with no target reached', () => {
      const result = computeCampaignStatus(
        { ...baseCampaign, status: 'active', confirmedAmount: 5000 },
        new Date('2024-01-20T00:00:00Z')
      );
      expect(result).toBe('active');
    });

    it('returns target_reached when confirmed amount >= target', () => {
      const result = computeCampaignStatus(
        { ...baseCampaign, status: 'active', confirmedAmount: 10000 },
        new Date('2024-01-20T00:00:00Z')
      );
      expect(result).toBe('target_reached');
    });

    it('returns expired after end date', () => {
      const result = computeCampaignStatus(
        { ...baseCampaign, status: 'active', confirmedAmount: 5000 },
        new Date('2024-02-20T00:00:00Z')
      );
      expect(result).toBe('expired');
    });

    it('returns paused when manually paused', () => {
      const result = computeCampaignStatus(
        { ...baseCampaign, status: 'paused', confirmedAmount: 5000 },
        new Date('2024-01-20T00:00:00Z')
      );
      expect(result).toBe('paused');
    });

    it('returns completed when manually completed', () => {
      const result = computeCampaignStatus(
        { ...baseCampaign, status: 'completed', confirmedAmount: 10000 },
        new Date('2024-01-20T00:00:00Z')
      );
      expect(result).toBe('completed');
    });

    it('respects paused status even after end date', () => {
      const result = computeCampaignStatus(
        { ...baseCampaign, status: 'paused', confirmedAmount: 5000 },
        new Date('2024-02-20T00:00:00Z')
      );
      expect(result).toBe('paused');
    });

    it('respects completed status even after end date', () => {
      const result = computeCampaignStatus(
        { ...baseCampaign, status: 'completed', confirmedAmount: 10000 },
        new Date('2024-02-20T00:00:00Z')
      );
      expect(result).toBe('completed');
    });

    it('target_reached takes precedence over expired', () => {
      const result = computeCampaignStatus(
        { ...baseCampaign, status: 'active', confirmedAmount: 10000 },
        new Date('2024-02-20T00:00:00Z')
      );
      expect(result).toBe('target_reached');
    });

    it('never exceeds max target of 50000', () => {
      const result = computeCampaignStatus(
        { ...baseCampaign, status: 'active', confirmedAmount: 60000, target: 60000 },
        new Date('2024-01-20T00:00:00Z')
      );
      expect(result).toBe('target_reached');
    });
  });

  describe('formatCurrency', () => {
    it('formats USD correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(10000)).toBe('$10,000.00');
      expect(formatCurrency(10000.5)).toBe('$10,000.50');
    });

    it('formats BTC correctly', () => {
      expect(formatCurrency(0.025, 'BTC')).toBe('0.02500000 BTC');
    });

    it('formats SOL correctly', () => {
      expect(formatCurrency(150, 'SOL')).toBe('150.00 SOL');
    });

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('handles small amounts', () => {
      expect(formatCurrency(0.01)).toBe('$0.01');
    });
  });
});