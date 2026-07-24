import crypto from 'crypto';
import { cookies } from 'next/headers';

/**
 * Lightweight, password-less identity for public visitors. When someone submits
 * a Kundali request we mint a signed cookie holding their user id, so the "My
 * Requests" page can show only their own requests — without building full
 * accounts / login. The cookie is httpOnly and signed, so it cannot be forged
 * to read someone else's requests.
 */
const COOKIE_NAME = 'kundali_user';
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function secret() {
  return (
    process.env.USER_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    'insecure-user-secret-change-me'
  );
}

function sign(payload) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('hex');
}

export function createUserToken(uid) {
  const payload = Buffer.from(JSON.stringify({ uid, t: Date.now() })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readUserToken(token) {
  if (!token || typeof token !== 'string') return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (Date.now() - data.t > MAX_AGE * 1000) return null;
    return typeof data.uid === 'string' ? data.uid : null;
  } catch {
    return null;
  }
}

/** Current visitor's user id, or null if this browser has never submitted. */
export async function getUserId() {
  const store = await cookies();
  return readUserToken(store.get(COOKIE_NAME)?.value);
}

export async function setUserSession(uid) {
  const store = await cookies();
  store.set(COOKIE_NAME, createUserToken(uid), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}
