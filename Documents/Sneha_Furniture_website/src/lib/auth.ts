import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { encrypt, decrypt, type SessionData, type SessionPayload } from '@/lib/session';

export { encrypt, decrypt };
export type { SessionData, SessionPayload };

const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days, in seconds

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionData) {
  const session = await encrypt(payload);
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    maxAge: SESSION_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

// Admin check that re-reads the role from the database, so a demoted admin
// loses access immediately instead of when their token expires.
export async function getAdminSession(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.id }, select: { role: true } });
  return user?.role === 'ADMIN' ? session : null;
}

// For admin pages. Every admin page must call this itself: Next renders layouts and pages
// in parallel, so a redirect in the admin layout alone does not stop page data being sent.
export async function assertAdminPage() {
  const admin = await getAdminSession();
  if (!admin) redirect('/');
  return admin;
}

// For API routes: returns a 401/403 response when the caller is not an admin.
export async function requireAdmin(): Promise<{ session: SessionPayload; error?: never } | { error: NextResponse; session?: never }> {
  const session = await getSession();
  if (!session?.id) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  const admin = await getAdminSession();
  if (!admin) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { session: admin };
}
