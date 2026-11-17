import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'admin_session';

export async function middleware(request: NextRequest) {
  // Check for admin session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  let isAuthenticated = false;

  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
      if (session.expiresAt > Date.now()) {
        isAuthenticated = true;
      }
    } catch {
      // Invalid session cookie
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin/login') {
      // Allow access to login page
      if (isAuthenticated) {
        // Redirect authenticated users to dashboard
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // Require authentication for all other admin routes
    if (!isAuthenticated) {
      const redirectUrl = new URL('/admin/login', request.url);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};