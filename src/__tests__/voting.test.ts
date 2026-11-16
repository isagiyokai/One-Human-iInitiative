import { generateBrowserToken, hashToken } from '@/lib/browser-token';

// Mock crypto.getRandomValues for test environment
const mockGetRandomValues = jest.fn((array: Uint8Array) => {
  for (let i = 0; i < array.length; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return array;
});

// Mock crypto.subtle.digest for hashToken
const mockDigest = jest.fn(async (algorithm: string, data: Uint8Array) => {
  // Simple mock: return a hash based on the input data
  const hash = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    hash[i] = data[i % data.length] ^ (i * 7);
  }
  return hash.buffer;
});

Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: mockGetRandomValues,
    subtle: {
      digest: mockDigest,
    },
  },
  configurable: true,
});

// Mock Supabase client for validateBrowserToken
const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockFrom = jest.fn(() => ({ select: mockSelect }));

jest.mock('@/lib/supabase/browser', () => ({
  createClient: jest.fn(() => ({
    from: mockFrom,
  })),
}));

// Import validateBrowserToken after mocking
let validateBrowserToken: (token: string) => Promise<boolean>;

beforeAll(async () => {
  const browserTokenModule = await import('@/lib/browser-token');
  validateBrowserToken = browserTokenModule.validateBrowserToken;
});

describe('Browser Token Voting', () => {
  beforeEach(() => {
    mockGetRandomValues.mockClear();
    mockDigest.mockClear();
    mockSingle.mockClear();
    mockEq.mockClear();
    mockSelect.mockClear();
    mockFrom.mockClear();
  });

  describe('generateBrowserToken', () => {
    it('generates a token with correct format', () => {
      const token = generateBrowserToken();
      expect(token).toMatch(/^[a-f0-9]{64}$/);
    });

    it('generates unique tokens', () => {
      const tokens = new Set();
      for (let i = 0; i < 100; i++) {
        tokens.add(generateBrowserToken());
      }
      expect(tokens.size).toBe(100);
    });

    it('generates 256-bit entropy (32 bytes = 64 hex chars)', () => {
      const token = generateBrowserToken();
      expect(token.length).toBe(64);
    });
  });

  describe('hashToken', () => {
    it('produces consistent hash for same input', async () => {
      const token = 'a'.repeat(64);
      const hash1 = await hashToken(token);
      const hash2 = await hashToken(token);
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64);
    });

    it('produces different hash for different input', async () => {
      const hash1 = await hashToken('a'.repeat(64));
      const hash2 = await hashToken('b'.repeat(64));
      expect(hash1).not.toBe(hash2);
    });

    it('produces valid hex string', async () => {
      const hash = await hashToken('test');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('validateBrowserToken', () => {
    it('validates a correctly formatted token', async () => {
      const token = generateBrowserToken();
      // Mock the database to return a token
      mockSingle.mockResolvedValueOnce({ data: { id: 'test-id' }, error: null });

      const result = await validateBrowserToken(token);
      expect(result).toBe(true);
    });

    it('rejects empty string', async () => {
      const result = await validateBrowserToken('');
      expect(result).toBe(false);
    });

    it('rejects non-hex characters', async () => {
      const result = await validateBrowserToken('g'.repeat(64));
      expect(result).toBe(false);
    });

    it('rejects wrong length', async () => {
      const result1 = await validateBrowserToken('a'.repeat(32));
      const result2 = await validateBrowserToken('a'.repeat(128));
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it('rejects non-string input', async () => {
      const result1 = await validateBrowserToken(null as unknown as string);
      const result2 = await validateBrowserToken(undefined as unknown as string);
      const result3 = await validateBrowserToken(123 as unknown as string);
      expect(result1).toBe(false);
      expect(result2).toBe(false);
      expect(result3).toBe(false);
    });
  });
});