const TOKEN_KEY = 'one-human-participation-token';

/**
 * Generate a per-browser random participation token.
 * The raw token stays in localStorage; only its SHA-256 hash is stored server-side.
 */
export function generateBrowserToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function getBrowserToken(): string {
  if (typeof window === 'undefined') return '';
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = generateBrowserToken();
    localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function registerBrowserToken(): Promise<{ success: boolean; tokenId?: string; error?: string }> {
  const token = getBrowserToken();
  if (!token) return { success: false, error: 'Browser token unavailable' };

  try {
    const response = await fetch('/api/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const payload = await response.json();
    if (!response.ok) return { success: false, error: payload.error || 'Failed to register token' };
    return { success: true, tokenId: payload.tokenId };
  } catch {
    return { success: false, error: 'Failed to register token' };
  }
}

export async function hasVoted(petitionId: string): Promise<boolean> {
  const token = getBrowserToken();
  try {
    const response = await fetch(`/api/votes?petitionId=${encodeURIComponent(petitionId)}&token=${encodeURIComponent(token)}`, { cache: 'no-store' });
    if (!response.ok) return false;
    const payload = await response.json();
    return Boolean(payload.hasVoted);
  } catch {
    return false;
  }
}

export async function submitVote(
  petitionId: string,
  choice: 'yes' | 'no'
): Promise<{ success: boolean; error?: string }> {
  const token = getBrowserToken();
  try {
    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ petitionId, choice, token }),
    });
    const payload = await response.json();
    if (!response.ok) return { success: false, error: payload.error || 'Failed to submit vote' };
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to submit vote' };
  }
}

export async function getVoteCounts(petitionId: string): Promise<{ yes: number; no: number; total: number }> {
  try {
    const response = await fetch(`/api/votes?petitionId=${encodeURIComponent(petitionId)}`, { cache: 'no-store' });
    if (!response.ok) return { yes: 0, no: 0, total: 0 };
    const payload = await response.json();
    return { yes: Number(payload.yes || 0), no: Number(payload.no || 0), total: Number(payload.total || 0) };
  } catch {
    return { yes: 0, no: 0, total: 0 };
  }
}

export async function validateBrowserToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/tokens?token=${encodeURIComponent(token)}`, { cache: 'no-store' });
    if (!response.ok) return false;
    const payload = await response.json();
    return Boolean(payload.valid);
  } catch {
    return false;
  }
}
