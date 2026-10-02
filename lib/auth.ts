import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from './prisma';
import { Role } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'knowlix-production-grade-session-encryption-secret-key-32c'
);

const COOKIE_NAME = 'knowlix_session';

export interface SessionPayload {
  userId: string;
  username: string;
  email: string;
  role: Role;
  expires: number;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: Omit<SessionPayload, 'expires'>): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
  return new SignJWT({ ...payload, expires })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload || !payload.userId) return null;

    // Check if user is blocked or deleted in db
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        reputation: true,
        createdAt: true,
        blocksReceived: {
          where: { isActive: true },
          take: 1,
        },
      },
    });

    if (!user) return null;

    const activeBlock = user.blocksReceived[0] || null;

    return {
      ...user,
      isBlocked: !!activeBlock,
      blockReason: activeBlock?.reason || null,
      blockScope: activeBlock?.scope || null,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
