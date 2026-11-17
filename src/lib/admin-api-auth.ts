import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'admin_session';

export async function verifyAdminApiAuth(): Promise<{ error: string; status: number } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return { error: 'Unauthorized', status: 401 };
  }

  try {
    const session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    if (session.expiresAt < Date.now()) {
      return { error: 'Session expired', status: 401 };
    }
    return null;
  } catch {
    return { error: 'Invalid session', status: 401 };
  }
}