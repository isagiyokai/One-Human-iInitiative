import { createClient } from './supabase/browser';
import { getAdminClient } from './supabase/admin';

const TOKEN_KEY = 'one-human-participation-token';

/**
 * Generate a new browser participation token
 * Stored in localStorage and hashed version sent to server
 */
export function generateBrowserToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create browser token from localStorage
 */
export function getBrowserToken(): string {
  if (typeof window === 'undefined') return '';

  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = generateBrowserToken();
    localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

/**
 * Hash token for server storage (SHA-256)
 */
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Register or verify token with server
 */
export async function registerBrowserToken(): Promise<{ success: boolean; tokenId?: string; error?: string }> {
  const token = getBrowserToken();
  const tokenHash = await hashToken(token);

  try {
    const supabase = createClient();

    // Try to insert new token
    const { data, error } = await supabase
      .from('browser_participation_tokens')
      .insert({
        token_hash: tokenHash,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      // If duplicate, try to get existing
      if (error.code === '23505') { // Unique violation
        const { data: existing } = await supabase
          .from('browser_participation_tokens')
          .select('id')
          .eq('token_hash', tokenHash)
          .single();

        if (existing) {
          return { success: true, tokenId: existing.id };
        }
      }
      return { success: false, error: error.message };
    }

    return { success: true, tokenId: data.id };
  } catch {
    return { success: false, error: 'Failed to register token' };
  }
}

/**
 * Check if token has already voted on a petition
 */
export async function hasVoted(petitionId: string): Promise<boolean> {
  const token = getBrowserToken();
  const tokenHash = await hashToken(token);

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('votes')
      .select('id')
      .eq('petition_id', petitionId)
      .eq('token_hash', tokenHash)
      .single();

    return !!data;
  } catch {
    return false;
  }
}

/**
 * Submit a vote for a petition
 */
export async function submitVote(
  petitionId: string,
  choice: 'yes' | 'no'
): Promise<{ success: boolean; error?: string }> {
  const token = getBrowserToken();
  const tokenHash = await hashToken(token);

  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('votes')
      .insert({
        petition_id: petitionId,
        token_hash: tokenHash,
        choice,
        created_at: new Date().toISOString(),
      });

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { success: false, error: 'You have already voted on this petition' };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Failed to submit vote' };
  }
}

/**
 * Get vote counts for a petition
 */
export async function getVoteCounts(petitionId: string): Promise<{ yes: number; no: number; total: number }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('votes')
      .select('choice')
      .eq('petition_id', petitionId);

    if (error) {
      return { yes: 0, no: 0, total: 0 };
    }

    const yes = data.filter(v => v.choice === 'yes').length;
    const no = data.filter(v => v.choice === 'no').length;

    return { yes, no, total: yes + no };
  } catch {
    return { yes: 0, no: 0, total: 0 };
  }
}

/**
 * Admin: Get token info (for debugging)
 */
export async function getTokenInfo(tokenHash: string) {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('browser_participation_tokens')
    .select('*')
    .eq('token_hash', tokenHash)
    .single();

  if (error) return null;
  return data;
}

/**
 * Validate a browser token by checking if it exists in the database
 */
export async function validateBrowserToken(token: string): Promise<boolean> {
  const tokenHash = await hashToken(token);

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('browser_participation_tokens')
      .select('id')
      .eq('token_hash', tokenHash)
      .single();

    if (error || !data) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Admin: Get all tokens with vote counts
 */
export async function getAllTokens() {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('browser_participation_tokens')
    .select(`
      id,
      token_hash,
      created_at,
      votes:vote_count
    `);

  if (error) return [];
  return data;
}

/**
 * Rate limiting helper - check if IP has made too many requests
 * This would be implemented server-side with a proper rate limiter
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export async function checkRateLimit(ipHash: string, limit = 10, windowMs = 60_000): Promise<RateLimitResult> {
  // This is a placeholder - implement with Redis or database in production
  return {
    allowed: true,
    remaining: limit,
    resetAt: Date.now() + windowMs,
  };
}