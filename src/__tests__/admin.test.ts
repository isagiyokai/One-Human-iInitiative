import { campaignSettingsSchema } from '@/lib/validators';

// Valid test addresses that match the validator regex patterns
const VALID_BITCOIN_ADDRESS = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
const VALID_BITCOIN_ADDRESS_LEGACY = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
const VALID_BITCOIN_ADDRESS_LEGACY_3 = '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy';
const VALID_SOLANA_ADDRESS = 'So11111111111111111111111111111111111111112';
const VALID_SOLANA_ADDRESS_2 = '5KJp9mN2xV7qR4wE8tY3uJ1pP6aS9dF2gH5jK8mN3n';
const VALID_PHANTOM_USERNAME = '@phantomuser123';

describe('Admin Access Control', () => {
  describe('Wallet Address Updates', () => {
    it('validates Bitcoin address format', () => {
      const validAddresses = [
        VALID_BITCOIN_ADDRESS,
        VALID_BITCOIN_ADDRESS_LEGACY,
        VALID_BITCOIN_ADDRESS_LEGACY_3,
      ];

      validAddresses.forEach((address) => {
        const result = campaignSettingsSchema.safeParse({
          bitcoinAddress: address,
          solanaAddress: VALID_SOLANA_ADDRESS,
          phantomUsername: VALID_PHANTOM_USERNAME,
          kofiEnabled: false,
          kofiUrl: '',
          kofiLabel: 'Support us on Ko-fi',
          kofiStatus: 'disabled',
        });
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid Bitcoin address format', () => {
      const invalidAddresses = [
        'invalid',
        'bc1qxy2kgdygjrsqtzq2', // too short (only 20 chars after bc1)
        'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlO', // invalid character 'O'
        'not-a-bitcoin-address',
      ];

      invalidAddresses.forEach((address) => {
        const result = campaignSettingsSchema.safeParse({
          bitcoinAddress: address,
          solanaAddress: VALID_SOLANA_ADDRESS,
          phantomUsername: VALID_PHANTOM_USERNAME,
          kofiEnabled: false,
          kofiUrl: '',
          kofiLabel: 'Support us on Ko-fi',
          kofiStatus: 'disabled',
        });
        expect(result.success).toBe(false);
      });
    });

    it('validates Solana address format', () => {
      const validAddresses = [
        VALID_SOLANA_ADDRESS,
        VALID_SOLANA_ADDRESS_2, // 44 chars valid base58
      ];

      validAddresses.forEach((address) => {
        const result = campaignSettingsSchema.safeParse({
          bitcoinAddress: VALID_BITCOIN_ADDRESS,
          solanaAddress: address,
          phantomUsername: VALID_PHANTOM_USERNAME,
          kofiEnabled: false,
          kofiUrl: '',
          kofiLabel: 'Support us on Ko-fi',
          kofiStatus: 'disabled',
        });
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid Solana address format', () => {
      const invalidAddresses = [
        'invalid',
        'short',
        'not-base58-format',
        'So1111111111111111111111111111111111111111I', // invalid character 'I'
        'So1111111111111111111111111111111111111111123', // too long (45 chars)
      ];

      invalidAddresses.forEach((address) => {
        const result = campaignSettingsSchema.safeParse({
          bitcoinAddress: VALID_BITCOIN_ADDRESS,
          solanaAddress: address,
          phantomUsername: VALID_PHANTOM_USERNAME,
          kofiEnabled: false,
          kofiUrl: '',
          kofiLabel: 'Support us on Ko-fi',
          kofiStatus: 'disabled',
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Ko-fi Toggle', () => {
    it('allows enabling Ko-fi with valid URL', () => {
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

    it('allows disabling Ko-fi', () => {
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
  });

  describe('Phantom Username Validation', () => {
    it('accepts valid Phantom username without underscore', () => {
      const validUsernames = [
        VALID_PHANTOM_USERNAME,
        '@user123',
        '@testuser',
        '@a1b2c3',
      ];

      validUsernames.forEach((username) => {
        const result = campaignSettingsSchema.safeParse({
          bitcoinAddress: VALID_BITCOIN_ADDRESS,
          solanaAddress: VALID_SOLANA_ADDRESS,
          phantomUsername: username,
          kofiEnabled: false,
          kofiUrl: '',
          kofiLabel: 'Support us on Ko-fi',
          kofiStatus: 'disabled',
        });
        expect(result.success).toBe(true);
      });
    });

    it('rejects Phantom username with underscore', () => {
      const invalidUsernames = [
        '@phantom_user123',
        '@user_name',
        '@_test',
        '@test_',
      ];

      invalidUsernames.forEach((username) => {
        const result = campaignSettingsSchema.safeParse({
          bitcoinAddress: VALID_BITCOIN_ADDRESS,
          solanaAddress: VALID_SOLANA_ADDRESS,
          phantomUsername: username,
          kofiEnabled: false,
          kofiUrl: '',
          kofiLabel: 'Support us on Ko-fi',
          kofiStatus: 'disabled',
        });
        expect(result.success).toBe(false);
      });
    });

    it('rejects Phantom username without @ prefix', () => {
      const invalidUsernames = [
        'phantomuser123',
        'user123',
        'testuser',
      ];

      invalidUsernames.forEach((username) => {
        const result = campaignSettingsSchema.safeParse({
          bitcoinAddress: VALID_BITCOIN_ADDRESS,
          solanaAddress: VALID_SOLANA_ADDRESS,
          phantomUsername: username,
          kofiEnabled: false,
          kofiUrl: '',
          kofiLabel: 'Support us on Ko-fi',
          kofiStatus: 'disabled',
        });
        expect(result.success).toBe(false);
      });
    });
  });
});