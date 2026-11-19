import { cookies } from 'next/headers';
import { verifySession } from '@/lib/admin-auth';

const SESSION_COOKIE_NAME = 'admin_session';

export async function verifyAdminApiAuth(): Promise<{ error: string; status: number } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }

  const session = await verifySession(token);
  if (!session) {
    return { error: 'Invalid or expired admin session', status: 401 };
  }

  return null;
}
