import {
  contributionSchema,
  bitcoinContributionSchema,
  solanaContributionSchema,
  phantomContributionSchema,
  kofiContributionSchema,
  campaignSettingsSchema,
  expenseSchema,
  petitionSchema,
  voteSchema,
} from '@/lib/validators';

// Valid test addresses
const VALID_BITCOIN_ADDRESS = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
const VALID_BITCOIN_ADDRESS_LEGACY = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
const VALID_SOLANA_ADDRESS = 'So11111111111111111111111111111111111111112';
// Valid Solana transaction signature (88 chars base58) - using only valid base58 chars (no I, O, l, 0)
// Base58 alphabet: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
const VALID_SOLANA_TX_HASH = '5KJp9mN2xV7qR4wE8tY3uJ1pP6aS9dF2gH5jK8mN3nB6vC9xZ2qW5rT8yU1pQ7hJ6kM9nP2bVcXzAbCdEfGh';
const VALID_PHANTOM_USERNAME = '@phantomuser123';

describe('Validators', () => {
  describe('contributionSchema (base)', () => {
    it('validates a valid Bitcoin contribution', () => {
      const result = contributionSchema.safeParse({
        paymentMethod: 'bitcoin',
        transactionHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        amount: 0.025,
        currency: 'BTC',
      });
      expect(result.success).toBe(true);
    });

    it('validates a valid Solana contribution', () => {
      const result = contributionSchema.safeParse({
        paymentMethod: 'solana',
        transactionHash: VALID_SOLANA_TX_HASH,
        amount: 150,
        currency: 'SOL',
      });
      expect(result.success).toBe(true);
    });

    it('validates a valid Phantom username contribution', () => {
      const result = contributionSchema.safeParse({
        paymentMethod: 'phantom',
        transactionHash: 'phantom_user123',
        amount: 75,
        currency: 'SOL',
      });
      expect(result.success).toBe(true);
    });

    it('validates a valid Ko-fi contribution', () => {
      const result = contributionSchema.safeParse({
        paymentMethod: 'kofi',
        transactionHash: 'kofi_1234567890',
        amount: 25,
        currency: 'USD',
      });
      expect(result.success).toBe(true);
    });

    it('rejects negative amount', () => {
      const result = contributionSchema.safeParse({
        paymentMethod: 'bitcoin',
        transactionHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        amount: -1,
        currency: 'BTC',
      });
      expect(result.success).toBe(false);
    });

    it('rejects zero amount', () => {
      const result = contributionSchema.safeParse({
        paymentMethod: 'bitcoin',
        transactionHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        amount: 0,
        currency: 'BTC',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid payment method', () => {
      const result = contributionSchema.safeParse({
        paymentMethod: 'invalid',
        transactionHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        amount: 0.025,
        currency: 'BTC',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing transaction hash', () => {
      const result = contributionSchema.safeParse({
        paymentMethod: 'bitcoin',
        amount: 0.025,
        currency: 'BTC',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('bitcoinContributionSchema', () => {
    it('validates a valid Bitcoin contribution', () => {
      const result = bitcoinContributionSchema.safeParse({
        paymentMethod: 'bitcoin',
        transactionHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        amount: 0.025,
        currency: 'BTC',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid Bitcoin transaction hash (wrong length)', () => {
      const result = bitcoinContributionSchema.safeParse({
        paymentMethod: 'bitcoin',
        transactionHash: 'a1b2c3',
        amount: 0.025,
        currency: 'BTC',
      });
      expect(result.success).toBe(false);
    });

    it('rejects non-hex Bitcoin transaction hash', () => {
      const result = bitcoinContributionSchema.safeParse({
        paymentMethod: 'bitcoin',
        transactionHash: 'g1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        amount: 0.025,
        currency: 'BTC',
      });
      expect(result.success).toBe(false);
    });

    it('rejects wrong currency', () => {
      const result = bitcoinContributionSchema.safeParse({
        paymentMethod: 'bitcoin',
        transactionHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        amount: 0.025,
        currency: 'SOL',
      });
      expect(result.success).toBe(false);
    });

    it('rejects amount too large', () => {
      const result = bitcoinContributionSchema.safeParse({
        paymentMethod: 'bitcoin',
        transactionHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        amount: 30_000_000,
        currency: 'BTC',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('solanaContributionSchema', () => {
    it('validates a valid Solana contribution', () => {
      const result = solanaContributionSchema.safeParse({
        paymentMethod: 'solana',
        transactionHash: VALID_SOLANA_TX_HASH,
        amount: 150,
        currency: 'SOL',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid Solana transaction hash (too short)', () => {
      const result = solanaContributionSchema.safeParse({
        paymentMethod: 'solana',
        transactionHash: 'short',
        amount: 150,
        currency: 'SOL',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid Solana transaction hash (wrong format)', () => {
      const result = solanaContributionSchema.safeParse({
        paymentMethod: 'solana',
        transactionHash: 'not-a-valid-base58-with-invalid-chars!',
        amount: 150,
        currency: 'SOL',
      });
      expect(result.success).toBe(false);
    });

    it('rejects wrong currency', () => {
      const result = solanaContributionSchema.safeParse({
        paymentMethod: 'solana',
        transactionHash: '5KJp9mN2xV7qR4wE8tY3uI1oP6aS9dF2gH5jK8lM3nB6vC9xZ2qW5rT8yU1iO4p',
        amount: 150,
        currency: 'BTC',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('phantomContributionSchema', () => {
    it('validates a valid Phantom contribution', () => {
      const result = phantomContributionSchema.safeParse({
        paymentMethod: 'phantom',
        transactionHash: 'some_transaction_id',
        amount: 75,
        currency: 'SOL',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('kofiContributionSchema', () => {
    it('validates a valid Ko-fi contribution', () => {
      const result = kofiContributionSchema.safeParse({
        paymentMethod: 'kofi',
        transactionHash: 'kofi_1234567890',
        amount: 25,
        currency: 'USD',
      });
      expect(result.success).toBe(true);
    });

    it('rejects wrong currency', () => {
      const result = kofiContributionSchema.safeParse({
        paymentMethod: 'kofi',
        transactionHash: 'kofi_1234567890',
        amount: 25,
        currency: 'SOL',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('campaignSettingsSchema', () => {
    it('validates a valid campaign settings object', () => {
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: VALID_BITCOIN_ADDRESS,
        solanaAddress: VALID_SOLANA_ADDRESS,
        phantomUsername: VALID_PHANTOM_USERNAME,
        kofiEnabled: false,
        kofiUrl: '',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'disabled',
      });
      expect(result.success).toBe(true);
    });

    it('validates a valid campaign settings object with legacy Bitcoin address', () => {
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: VALID_BITCOIN_ADDRESS_LEGACY,
        solanaAddress: VALID_SOLANA_ADDRESS,
        phantomUsername: VALID_PHANTOM_USERNAME,
        kofiEnabled: false,
        kofiUrl: '',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'disabled',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid Bitcoin address', () => {
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: 'invalid',
        solanaAddress: VALID_SOLANA_ADDRESS,
        phantomUsername: VALID_PHANTOM_USERNAME,
        kofiEnabled: false,
        kofiUrl: '',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'disabled',
      });
      expect(result.success).toBe(false);
    });

    it('rejects Bitcoin address with invalid characters', () => {
      // 'O' and 'I' and 'l' are not valid in Bitcoin bech32
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlO',
        solanaAddress: VALID_SOLANA_ADDRESS,
        phantomUsername: VALID_PHANTOM_USERNAME,
        kofiEnabled: false,
        kofiUrl: '',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'disabled',
      });
      expect(result.success).toBe(false);
    });

    it('rejects Bitcoin address too short (less than 25 chars after prefix)', () => {
      // bc1 + only 20 chars = too short
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: 'bc1qxy2kgdygjrsqtzq2',
        solanaAddress: VALID_SOLANA_ADDRESS,
        phantomUsername: VALID_PHANTOM_USERNAME,
        kofiEnabled: false,
        kofiUrl: '',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'disabled',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid Solana address', () => {
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: VALID_BITCOIN_ADDRESS,
        solanaAddress: 'invalid',
        phantomUsername: VALID_PHANTOM_USERNAME,
        kofiEnabled: false,
        kofiUrl: '',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'disabled',
      });
      expect(result.success).toBe(false);
    });

    it('rejects Solana address with invalid characters', () => {
      // 'I', 'O', 'l', '0' are not valid in base58
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: VALID_BITCOIN_ADDRESS,
        solanaAddress: 'So1111111111111111111111111111111111111111I',
        phantomUsername: VALID_PHANTOM_USERNAME,
        kofiEnabled: false,
        kofiUrl: '',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'disabled',
      });
      expect(result.success).toBe(false);
    });

    it('rejects Solana address too short (less than 32 chars)', () => {
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: VALID_BITCOIN_ADDRESS,
        solanaAddress: 'short',
        phantomUsername: VALID_PHANTOM_USERNAME,
        kofiEnabled: false,
        kofiUrl: '',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'disabled',
      });
      expect(result.success).toBe(false);
    });

    it('rejects Solana address too long (more than 44 chars)', () => {
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: VALID_BITCOIN_ADDRESS,
        solanaAddress: 'So1111111111111111111111111111111111111111123',
        phantomUsername: VALID_PHANTOM_USERNAME,
        kofiEnabled: false,
        kofiUrl: '',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'disabled',
      });
      expect(result.success).toBe(false);
    });

    it('rejects phantom username with underscore', () => {
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: VALID_BITCOIN_ADDRESS,
        solanaAddress: VALID_SOLANA_ADDRESS,
        phantomUsername: '@phantom_user123',
        kofiEnabled: false,
        kofiUrl: '',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'disabled',
      });
      expect(result.success).toBe(false);
    });

    it('rejects phantom username without @ prefix', () => {
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: VALID_BITCOIN_ADDRESS,
        solanaAddress: VALID_SOLANA_ADDRESS,
        phantomUsername: 'phantomuser123',
        kofiEnabled: false,
        kofiUrl: '',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'disabled',
      });
      expect(result.success).toBe(false);
    });

    it('accepts phantom username without underscore', () => {
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: VALID_BITCOIN_ADDRESS,
        solanaAddress: VALID_SOLANA_ADDRESS,
        phantomUsername: VALID_PHANTOM_USERNAME,
        kofiEnabled: false,
        kofiUrl: '',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'disabled',
      });
      expect(result.success).toBe(true);
    });

    it('validates Ko-fi URL when enabled', () => {
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: VALID_BITCOIN_ADDRESS,
        solanaAddress: VALID_SOLANA_ADDRESS,
        phantomUsername: VALID_PHANTOM_USERNAME,
        kofiEnabled: true,
        kofiUrl: 'https://ko-fi.com/testuser',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'active',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid Ko-fi URL when enabled', () => {
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: VALID_BITCOIN_ADDRESS,
        solanaAddress: VALID_SOLANA_ADDRESS,
        phantomUsername: VALID_PHANTOM_USERNAME,
        kofiEnabled: true,
        kofiUrl: 'not-a-url',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'active',
      });
      expect(result.success).toBe(false);
    });

    it('rejects enabling Ko-fi without URL', () => {
      const result = campaignSettingsSchema.safeParse({
        bitcoinAddress: VALID_BITCOIN_ADDRESS,
        solanaAddress: VALID_SOLANA_ADDRESS,
        phantomUsername: VALID_PHANTOM_USERNAME,
        kofiEnabled: true,
        kofiUrl: '',
        kofiLabel: 'Support us on Ko-fi',
        kofiStatus: 'active',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('expenseSchema', () => {
    it('validates a valid expense', () => {
      const result = expenseSchema.safeParse({
        category: 'Hosting & Infrastructure',
        description: 'Vercel Pro plan',
        amount: 60,
        currency: 'USD',
        status: 'published',
        evidenceUrl: 'https://example.com/receipt.pdf',
      });
      expect(result.success).toBe(true);
    });

    it('rejects negative amount', () => {
      const result = expenseSchema.safeParse({
        category: 'Hosting',
        description: 'Test',
        amount: -10,
        currency: 'USD',
        status: 'draft',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid status', () => {
      const result = expenseSchema.safeParse({
        category: 'Hosting',
        description: 'Test',
        amount: 10,
        currency: 'USD',
        status: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('petitionSchema', () => {
    it('validates a valid petition', () => {
      const result = petitionSchema.safeParse({
        requestedTarget: 20000,
        reason: 'Need more funds for housing costs and deposits',
      });
      expect(result.success).toBe(true);
    });

    it('rejects target below minimum', () => {
      const result = petitionSchema.safeParse({
        requestedTarget: 5000,
        reason: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('rejects target above max', () => {
      const result = petitionSchema.safeParse({
        requestedTarget: 60000,
        reason: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty reason', () => {
      const result = petitionSchema.safeParse({
        requestedTarget: 20000,
        reason: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('voteSchema', () => {
    it('validates a yes vote', () => {
      const result = voteSchema.safeParse({
        petitionId: '123e4567-e89b-12d3-a456-426614174000',
        choice: 'yes',
        token: 'a'.repeat(64),
      });
      expect(result.success).toBe(true);
    });

    it('validates a no vote', () => {
      const result = voteSchema.safeParse({
        petitionId: '123e4567-e89b-12d3-a456-426614174000',
        choice: 'no',
        token: 'b'.repeat(64),
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid vote value', () => {
      const result = voteSchema.safeParse({
        petitionId: '123e4567-e89b-12d3-a456-426614174000',
        choice: 'maybe',
        token: 'a'.repeat(64),
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid petitionId (not UUID)', () => {
      const result = voteSchema.safeParse({
        petitionId: 'not-a-uuid',
        choice: 'yes',
        token: 'a'.repeat(64),
      });
      expect(result.success).toBe(false);
    });

    it('rejects token too short', () => {
      const result = voteSchema.safeParse({
        petitionId: '123e4567-e89b-12d3-a456-426614174000',
        choice: 'yes',
        token: 'short',
      });
      expect(result.success).toBe(false);
    });

    it('rejects token too long', () => {
      const result = voteSchema.safeParse({
        petitionId: '123e4567-e89b-12d3-a456-426614174000',
        choice: 'yes',
        token: 'a'.repeat(65),
      });
      expect(result.success).toBe(false);
    });
  });
});