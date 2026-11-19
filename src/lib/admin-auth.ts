import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const ADMIN_USERNAME = 'PunahumanGG';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!;
const SESSION_SECRET = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET!);
const SESSION_MAX_AGE = parseInt(process.env.ADMIN_SESSION_MAX_AGE || '604800', 10); // 7 days default
const COOKIE_NAME = 'admin_session';

interface AdminSession {
  username: string;
  iat: number;
  exp: number;
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) {
    return false;
  }
  if (!ADMIN_PASSWORD_HASH) {
    throw new Error('ADMIN_PASSWORD_HASH not configured');
  }
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export async function createSession(username: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_MAX_AGE)
    .sign(SESSION_SECRET);
  return token;
}

export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return {
      username: payload.username as string,
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  // WebKit requires non-secure cookies on localhost for cookie persistence
  // Since we're testing on localhost, always use secure: false
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: false,
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
  return username === ADMIN_USERNAME;
}