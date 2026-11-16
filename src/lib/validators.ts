import { z } from 'zod';

// Campaign validators
export const campaignSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10).max(5000),
  target: z.number().int().min(1000).max(50000),
  maxTarget: z.number().int().min(10000).max(50000),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(['draft', 'active', 'paused', 'target_reached', 'expired', 'completed']),
  heroTitle: z.string().min(1).max(200),
  heroTagline: z.string().min(1).max(500),
  publicContent: z.string().max(10000).optional(),
}).refine(data => data.target <= data.maxTarget, {
  message: 'Target cannot exceed maximum target',
  path: ['target'],
});

export const campaignSettingsSchema = z.object({
  bitcoinAddress: z.string().regex(/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,59}$/, 'Invalid Bitcoin address'),
  solanaAddress: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana address'),
  // Phantom usernames: alphanumeric only, 3-30 chars after @, no underscores
  phantomUsername: z.string().regex(/^@[a-zA-Z0-9]{3,30}$/, 'Invalid Phantom username (must start with @, alphanumeric only, 3-30 chars)'),
  kofiEnabled: z.boolean(),
  kofiUrl: z.string().url().optional().or(z.literal('')),
  kofiLabel: z.string().max(100).optional(),
  kofiStatus: z.enum(['pending_approval', 'active', 'disabled']).optional(),
}).refine(data => !data.kofiEnabled || (data.kofiUrl && data.kofiUrl !== ''), {
  message: 'Ko-fi URL is required when Ko-fi is enabled',
  path: ['kofiUrl'],
});

// Contribution validators
export const contributionSchema = z.object({
  paymentMethod: z.enum(['bitcoin', 'solana', 'phantom', 'kofi']),
  transactionHash: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3).toUpperCase(),
});

export const bitcoinContributionSchema = contributionSchema.extend({
  paymentMethod: z.literal('bitcoin'),
  transactionHash: z.string().length(64).regex(/^[a-f0-9]+$/, 'Invalid Bitcoin transaction hash'),
  currency: z.literal('BTC'),
  amount: z.number().positive().max(21_000_000),
});

export const solanaContributionSchema = contributionSchema.extend({
  paymentMethod: z.literal('solana'),
  transactionHash: z.string().min(80).max(90).regex(/^[1-9A-HJ-NP-Za-km-z]+$/, 'Invalid Solana transaction signature'),
  currency: z.literal('SOL'),
  amount: z.number().positive().max(500_000_000),
});

export const phantomContributionSchema = contributionSchema.extend({
  paymentMethod: z.literal('phantom'),
  transactionHash: z.string().min(1).max(100),
  currency: z.literal('SOL'),
  amount: z.number().positive().max(500_000_000),
});

export const kofiContributionSchema = contributionSchema.extend({
  paymentMethod: z.literal('kofi'),
  transactionHash: z.string().min(1).max(100),
  currency: z.literal('USD'),
  amount: z.number().positive().max(100_000),
});

// Repayment contact validators
export const repaymentContactSchema = z.object({
  contributionId: z.string().uuid(),
  platform: z.enum(['ko-fi', 'buy-me-a-coffee']),
  url: z.string().url(),
  consentGiven: z.literal(true), // Must be explicitly true
}).refine(data => data.url.startsWith('https://'), {
  message: 'URL must use HTTPS',
  path: ['url'],
});

// Expense validators
export const expenseSchema = z.object({
  category: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  amount: z.number().positive().max(1_000_000),
  currency: z.string().length(3).toUpperCase().default('USD'),
  status: z.enum(['draft', 'published']).default('draft'),
  evidenceUrl: z.string().url().optional().or(z.literal('')),
});

// Petition validators
export const petitionSchema = z.object({
  requestedTarget: z.number().int().min(10000).max(50000),
  reason: z.string().min(10).max(2000),
});

export const voteSchema = z.object({
  petitionId: z.string().uuid(),
  choice: z.enum(['yes', 'no']),
  token: z.string().min(32).max(64), // Hashed token
});

// Update validators
export const updateSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  imageUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('draft'),
});

// Admin action validators
export const adminActionSchema = z.object({
  action: z.string().min(1).max(100),
  resource: z.string().min(1).max(50),
  resourceId: z.string().optional(),
  details: z.record(z.unknown()).optional(),
});

// Type exports
export type CampaignInput = z.infer<typeof campaignSchema>;
export type CampaignSettingsInput = z.infer<typeof campaignSettingsSchema>;
export type ContributionInput = z.infer<typeof contributionSchema>;
export type BitcoinContributionInput = z.infer<typeof bitcoinContributionSchema>;
export type SolanaContributionInput = z.infer<typeof solanaContributionSchema>;
export type PhantomContributionInput = z.infer<typeof phantomContributionSchema>;
export type KofiContributionInput = z.infer<typeof kofiContributionSchema>;
export type RepaymentContactInput = z.infer<typeof repaymentContactSchema>;
export type ExpenseInput = z.infer<typeof expenseSchema>;
export type PetitionInput = z.infer<typeof petitionSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type AdminActionInput = z.infer<typeof adminActionSchema>;