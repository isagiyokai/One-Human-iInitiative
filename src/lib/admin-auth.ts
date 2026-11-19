import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE = Math.min(
  Math.max(Number.parseInt(process.env.ADMIN_SESSION_MAX_AGE || '604800', 10) || 604800, 300),
  604800
);
const SESSION_ISSUER = 'one-human-initiative';
const SESSION_AUDIENCE = 'one-human-initiative-admin';

interface AdminSession {
  username: string;
  iat: number;
  exp: number;
}

function getConfiguredSessionSecret(): Uint8Array | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;

  const encoded = new TextEncoder().encode(secret);
  return encoded.byteLength >= 32 ? encoded : null;
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD_HASH &&
    getConfiguredSessionSecret()
  );
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedUsername || !passwordHash || !getConfiguredSessionSecret()) {
    throw new Error('Admin authentication is not configured');
  }

  if (username !== expectedUsername || typeof password !== 'string' || password.length === 0) {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}

export async function createSession(username: string): Promise<string> {
  const secret = getConfiguredSessionSecret();
  if (!secret || !process.env.ADMIN_USERNAME || username !== process.env.ADMIN_USERNAME) {
    throw new Error('Admin authentication is not configured');
  }

  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_MAX_AGE)
    .sign(secret);
}

export async function verifySession(token: string): Promise<AdminSession | null> {
  const secret = getConfiguredSessionSecret();
  if (!secret || !token) return null;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });

    if (
      typeof payload.username !== 'string' ||
      payload.username !== process.env.ADMIN_USERNAME ||
      typeof payload.iat !== 'number' ||
      typeof payload.exp !== 'number'
    ) {
      return null;
    }

    return {
      username: payload.username,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token ? verifySession(token) : null;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function isValidUsername(username: string): boolean {
  return Boolean(process.env.ADMIN_USERNAME) && username === process.env.ADMIN_USERNAME;
}
