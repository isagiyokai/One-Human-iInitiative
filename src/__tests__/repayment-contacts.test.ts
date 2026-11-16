import { repaymentContactSchema } from '@/lib/validators';

describe('Repayment Contact Validation', () => {
  describe('repaymentContactSchema', () => {
    const validContributionId = '123e4567-e89b-12d3-a456-426614174000';

    it('validates a valid Ko-fi contact', () => {
      const result = repaymentContactSchema.safeParse({
        platform: 'ko-fi',
        url: 'https://ko-fi.com/testuser',
        contributionId: validContributionId,
        consentGiven: true,
      });
      expect(result.success).toBe(true);
    });

    it('validates a valid Buy Me a Coffee contact', () => {
      const result = repaymentContactSchema.safeParse({
        platform: 'buy-me-a-coffee',
        url: 'https://buymeacoffee.com/testuser',
        contributionId: validContributionId,
        consentGiven: true,
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid platform', () => {
      const result = repaymentContactSchema.safeParse({
        platform: 'patreon',
        url: 'https://patreon.com/testuser',
        contributionId: validContributionId,
        consentGiven: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid Ko-fi URL', () => {
      const result = repaymentContactSchema.safeParse({
        platform: 'ko-fi',
        url: 'not-a-url',
        contributionId: validContributionId,
        consentGiven: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid Buy Me a Coffee URL', () => {
      const result = repaymentContactSchema.safeParse({
        platform: 'buy-me-a-coffee',
        url: 'not-a-url',
        contributionId: validContributionId,
        consentGiven: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing consent', () => {
      const result = repaymentContactSchema.safeParse({
        platform: 'ko-fi',
        url: 'https://ko-fi.com/testuser',
        contributionId: validContributionId,
        consentGiven: false,
      });
      expect(result.success).toBe(false);
    });

    it('rejects non-HTTPS URL', () => {
      const result = repaymentContactSchema.safeParse({
        platform: 'ko-fi',
        url: 'http://ko-fi.com/testuser',
        contributionId: validContributionId,
        consentGiven: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid UUID contributionId', () => {
      const result = repaymentContactSchema.safeParse({
        platform: 'ko-fi',
        url: 'https://ko-fi.com/testuser',
        contributionId: 'invalid-uuid',
        consentGiven: true,
      });
      expect(result.success).toBe(false);
    });
  });
});