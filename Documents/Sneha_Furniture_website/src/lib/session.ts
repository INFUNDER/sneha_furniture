import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

// Kept free of database/next imports so proxy.ts can use it cheaply.
export type SessionPayload = JWTPayload & {
  id: string;
  email: string;
  role: string;
  name: string;
};

export type SessionData = Pick<SessionPayload, 'id' | 'email' | 'role' | 'name'>;

function getKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      // Never fall back to a known secret in production: anyone could forge an admin session.
      throw new Error('JWT_SECRET is not set');
    }
    return new TextEncoder().encode('dev-only-secret-not-for-production');
  }
  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getKey());
}

export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, getKey(), {
    algorithms: ['HS256'],
  });
  return payload as SessionPayload;
}
