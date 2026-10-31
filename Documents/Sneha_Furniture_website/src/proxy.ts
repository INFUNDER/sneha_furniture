import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt, type SessionPayload } from '@/lib/session';

const protectedRoutes = ['/checkout', '/profile'];
const adminRoutes = ['/admin'];
const authRoutes = ['/login', '/register'];

// Note: API routes are excluded by the matcher below, so every /api route
// must do its own auth check (see requireAdmin / getSession in lib/auth.ts).
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // Public pages skip session decoding entirely for speed.
  if (!isProtectedRoute && !isAdminRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const session = request.cookies.get('session')?.value;
  let decoded: SessionPayload | null = null;

  if (session) {
    try {
      decoded = await decrypt(session);
    } catch {
      // Invalid or expired token
    }
  }

  // 1. Authenticated User accessing Login/Register -> Redirect to Profile
  if (isAuthRoute && decoded) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // 2. Unauthenticated User accessing Protected/Admin routes -> Redirect to Login
  if ((isProtectedRoute || isAdminRoute) && !decoded) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }

  // 3. Authenticated User accessing Admin without ADMIN role -> Redirect Home
  // (the admin layout re-checks the role against the database)
  if (isAdminRoute && decoded && decoded.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. Proceed to render the protected or auth route, but kill browser caching (bfcache)
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
