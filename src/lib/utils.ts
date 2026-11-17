import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Type for Supabase client with auth.getUser()
export type SupabaseAuthClient = {
  auth: {
    getUser: () => Promise<{
      data: { user: { email?: string | null } | null };
    }>;
  };
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'BTC' || currency === 'SOL' ? 6 : 2,
    maximumFractionDigits: currency === 'BTC' || currency === 'SOL' ? 8 : 2,
  }).format(amount);
}

export function formatNumber(num: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export function validateBitcoinAddress(address: string): boolean {
  // Basic validation for Bitcoin addresses
  // Bech32 (bc1...), Legacy (1...), SegWit (3...)
  const bech32Regex = /^bc1[a-z0-9]{39,59}$/i;
  const legacyRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  return bech32Regex.test(address) || legacyRegex.test(address);
}

export function validateSolanaAddress(address: string): boolean {
  // Basic validation for Solana addresses (base58, 32-44 chars)
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

export function validatePhantomUsername(username: string): boolean {
  // Phantom username: starts with @, alphanumeric and underscore, 3-30 chars
  const regex = /^@[a-zA-Z0-9_]{3,30}$/;
  return regex.test(username);
}

export function validateKoFiUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === 'ko-fi.com' || u.hostname.endsWith('.ko-fi.com');
  } catch {
    return false;
  }
}

export function validateBuyMeACoffeeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === 'buymeacoffee.com' || u.hostname.endsWith('.buymeacoffee.com');
  } catch {
    return false;
  }
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  expired: boolean;
}

export function getTimeRemaining(endDate: string): TimeRemaining {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const total = end - now;

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, expired: true };
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total, expired: false };
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Admin verification - checks if user email is in admin list
export function isAdminUser(email: string | undefined | null): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
  return adminEmails.includes(email.toLowerCase());
}

// Server-side admin verification (for use in API routes)
export async function verifyAdminAccess(supabase: SupabaseAuthClient): Promise<{ user: { email?: string | null }; isAdmin: boolean } | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const isAdmin = isAdminUser(user.email);

  return { user, isAdmin };
}