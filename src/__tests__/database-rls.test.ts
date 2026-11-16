/**
 * Database RLS Policy Tests
 *
 * These tests require a running Supabase instance with the correct schema and RLS policies.
 * They are skipped by default in the unit test suite.
 *
 * To run these tests:
 * 1. Start Supabase locally: `supabase start`
 * 2. Set environment variables in .env.local
 * 3. Run with: `npm run test:db`
 */

import { createClient } from '@supabase/supabase-js';

// Check if Supabase is configured and running
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const hasSupabaseConfig = supabaseUrl && supabaseAnonKey && supabaseServiceKey;
const runDbTests = process.env.RUN_DB_TESTS === 'true' && hasSupabaseConfig;

const anonClient = hasSupabaseConfig ? createClient(supabaseUrl!, supabaseAnonKey!) : null;
const serviceClient = hasSupabaseConfig ? createClient(supabaseUrl!, supabaseServiceKey!) : null;

const describeDb = runDbTests ? describe : describe.skip;

describeDb('Database RLS Policies (requires Supabase)', () => {
  beforeAll(() => {
    if (!runDbTests) {
      console.log('Skipping database RLS tests. Set RUN_DB_TESTS=true and configure Supabase to run.');
    }
  }, 10000);

  describe('Public Access (anon key)', () => {
    it('allows reading campaigns', async () => {
      const { data, error } = await anonClient!.from('campaigns').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows reading campaign_settings', async () => {
      const { data, error } = await anonClient!.from('campaign_settings').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows reading published campaign_updates', async () => {
      const { data, error } = await anonClient!.from('campaign_updates').select('*').eq('status', 'published').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows reading published expenses', async () => {
      const { data, error } = await anonClient!.from('expenses').select('*').eq('status', 'published').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows reading active petitions', async () => {
      const { data, error } = await anonClient!.from('petitions').select('*').eq('status', 'voting').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows reading petition aggregates', async () => {
      const { data, error } = await anonClient!.from('petition_aggregates_public').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows reading contribution aggregates', async () => {
      const { data, error } = await anonClient!.from('contribution_aggregates_public').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows reading expense summary', async () => {
      const { data, error } = await anonClient!.from('expense_summary_public').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows reading campaign progress public', async () => {
      const { data, error } = await anonClient!.from('campaign_progress_public').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows reading campaign settings public', async () => {
      const { data, error } = await anonClient!.from('campaign_settings_public').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);
  });

  describe('Public Access Denied (anon key)', () => {
    it('denies reading repayment_contacts', async () => {
      const { error } = await anonClient!.from('repayment_contacts').select('*').limit(1);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('42501');
    }, 10000);

    it('denies reading admin_audit_logs', async () => {
      const { error } = await anonClient!.from('admin_audit_logs').select('*').limit(1);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('42501');
    }, 10000);

    it('denies reading browser_participation_tokens', async () => {
      const { error } = await anonClient!.from('browser_participation_tokens').select('*').limit(1);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('42501');
    }, 10000);

    it('denies reading private campaign_settings columns', async () => {
      const { error } = await anonClient!.from('campaign_settings').select('kofi_url, kofi_status').limit(1);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('42501');
    }, 10000);
  });

  describe('Admin Access (service role)', () => {
    it('allows full access to campaigns', async () => {
      const { data, error } = await serviceClient!.from('campaigns').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows full access to campaign_settings', async () => {
      const { data, error } = await serviceClient!.from('campaign_settings').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows full access to contributions', async () => {
      const { data, error } = await serviceClient!.from('contributions').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows full access to repayment_contacts', async () => {
      const { data, error } = await serviceClient!.from('repayment_contacts').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows full access to expenses', async () => {
      const { data, error } = await serviceClient!.from('expenses').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows full access to petitions', async () => {
      const { data, error } = await serviceClient!.from('petitions').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows full access to votes', async () => {
      const { data, error } = await serviceClient!.from('votes').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows full access to campaign_updates', async () => {
      const { data, error } = await serviceClient!.from('campaign_updates').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows full access to admin_audit_logs', async () => {
      const { data, error } = await serviceClient!.from('admin_audit_logs').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('allows full access to browser_participation_tokens', async () => {
      const { data, error } = await serviceClient!.from('browser_participation_tokens').select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);
  });

  describe('Contribution Operations', () => {
    it('allows inserting contribution with anon key', async () => {
      const { data, error } = await anonClient!.from('contributions').insert({
        payment_method: 'bitcoin',
        transaction_hash: 'test' + 'a'.repeat(60),
        amount: 0.01,
        currency: 'BTC',
      }).select().single();
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('prevents duplicate transaction hash', async () => {
      const txHash = 'test' + 'b'.repeat(60);
      await anonClient!.from('contributions').insert({
        payment_method: 'bitcoin',
        transaction_hash: txHash,
        amount: 0.01,
        currency: 'BTC',
      });
      const { error } = await anonClient!.from('contributions').insert({
        payment_method: 'bitcoin',
        transaction_hash: txHash,
        amount: 0.01,
        currency: 'BTC',
      });
      expect(error).not.toBeNull();
      expect(error?.code).toBe('23505'); // unique violation
    }, 10000);
  });

  describe('Vote Operations', () => {
    it('allows inserting vote with anon key', async () => {
      const { data, error } = await anonClient!.from('votes').insert({
        token_id: 'test' + 'c'.repeat(60),
        petition_id: 'test-petition',
        choice: 'yes',
      }).select().single();
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('prevents duplicate vote from same token', async () => {
      const tokenId = 'test' + 'd'.repeat(60);
      await anonClient!.from('votes').insert({
        token_id: tokenId,
        petition_id: 'test-petition-2',
        choice: 'yes',
      });
      const { error } = await anonClient!.from('votes').insert({
        token_id: tokenId,
        petition_id: 'test-petition-2',
        choice: 'no',
      });
      expect(error).not.toBeNull();
      expect(error?.code).toBe('23505'); // unique violation
    }, 10000);
  });

  describe('Repayment Contact Operations', () => {
    it('allows inserting contact with anon key', async () => {
      const { data, error } = await anonClient!.from('repayment_contacts').insert({
        platform: 'ko-fi',
        url: 'https://ko-fi.com/test',
        contribution_id: '123e4567-e89b-12d3-a456-426614174000',
        consent: true,
      }).select().single();
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 10000);

    it('rejects contact without consent', async () => {
      const { error } = await anonClient!.from('repayment_contacts').insert({
        platform: 'ko-fi',
        url: 'https://ko-fi.com/test',
        contribution_id: '123e4567-e89b-12d3-a456-426614174000',
        consent: false,
      });
      expect(error).not.toBeNull();
      expect(error?.code).toBe('23514'); // check constraint violation
    }, 10000);
  });
});