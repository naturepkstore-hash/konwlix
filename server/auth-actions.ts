'use server';

import prisma from '@/lib/prisma';
import { hashPassword, verifyPassword, createSessionToken, setSessionCookie, clearSessionCookie } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function loginAction(formData: FormData) {
  const identifier = formData.get('identifier') as string;
  const password = formData.get('password') as string;

  if (!identifier || !password) {
    return { error: 'Please enter your username/email and password.' };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: identifier.trim(), mode: 'insensitive' } },
          { email: { equals: identifier.trim().toLowerCase() } },
        ],
      },
    });

    if (!user) {
      return { error: 'Invalid username or password.' };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { error: 'Invalid username or password.' };
    }

    const token = await createSessionToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    await setSessionCookie(token);
    await logAuditEvent({
      userId: user.id,
      action: 'USER_LOGIN',
      targetType: 'USER',
      targetId: user.id,
    });

    return { success: true, user: { username: user.username, role: user.role } };
  } catch (error) {
    console.error('Login action error:', error);
    return { error: 'Authentication service temporarily unavailable. Please try again.' };
  }
}

export async function registerAction(formData: FormData) {
  const username = (formData.get('username') as string || '').trim().toLowerCase();
  const email = (formData.get('email') as string || '').trim().toLowerCase();
  const password = formData.get('password') as string;
  const displayName = (formData.get('displayName') as string || '').trim();

  if (!username || username.length < 3 || username.length > 30) {
    return { error: 'Username must be between 3 and 30 characters.' };
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return { error: 'Username can only contain alphanumeric characters and underscores.' };
  }

  if (!email || !email.includes('@')) {
    return { error: 'Please provide a valid email address.' };
  }

  if (!password || password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }

  try {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existing) {
      return { error: 'A user with that username or email already exists.' };
    }

    const passwordHash = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        displayName: displayName || username,
        role: 'REGISTERED',
        reputation: 10,
      },
    });

    const token = await createSessionToken({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });

    await setSessionCookie(token);
    await logAuditEvent({
      userId: newUser.id,
      action: 'USER_REGISTERED',
      targetType: 'USER',
      targetId: newUser.id,
    });

    return { success: true, user: { username: newUser.username, role: newUser.role } };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Unable to complete registration. Please try again.' };
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  return { success: true };
}
