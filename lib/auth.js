import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return process.env.ADMIN_SESSION_SECRET || 'insecure-dev-secret-change-me';
}

function sign(payload) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('hex');
}

/** Builds a signed token: base64(payload).signature */
function createToken() {
  const payload = Buffer.from(
    JSON.stringify({ u: process.env.ADMIN_USERNAME || 'admin', t: Date.now() })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = sign(payload);
  // Constant-time comparison to avoid leaking the signature byte by byte.
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (Date.now() - data.t > MAX_AGE * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

/** True if the submitted username + password match the configured admin. */
export function checkCredentials(username, password) {
  const u = process.env.ADMIN_USERNAME || 'admin';
  const p = process.env.ADMIN_PASSWORD || '';
  if (!p) return false;
  // Compare in a way that is not trivially timing-dependent.
  const okU = username === u;
  const okP =
    password.length === p.length &&
    crypto.timingSafeEqual(Buffer.from(password), Buffer.from(p));
  return okU && okP;
}

export async function createSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Reads the cookie and returns true if the current request is authenticated. */
export async function isAuthenticated() {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}
