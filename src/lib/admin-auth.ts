'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Hardcoded admin credentials
const ADMIN_USERNAME = 'PunahumanGG';
const ADMIN_PASSWORD = 'Punalex10k$';
const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

export interface AdminSession {
  username: string;
  expiresAt: number;
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function createSession(username: string): Promise<string> {
  const session: AdminSession = {
    username,
    expiresAt: Date.now() + SESSION_DURATION * 1000,
  };

  const sessionData = Buffer.from(JSON.stringify(session)).toString('base64');

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });

  return sessionData;
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session: AdminSession = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());

    if (session.expiresAt < Date.now()) {
      await destroySession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return session;
}