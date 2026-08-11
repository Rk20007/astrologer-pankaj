import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getAdminAccountSafe, verifyPassword } from '@/lib/adminAccount';

const COOKIE_NAME = 'admin_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return process.env.ADMIN_SESSION_SECRET || 'insecure-dev-secret-change-me';
}

function sign(payload) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('hex');
}

/**
 * Builds a signed token: base64(payload).signature
 *
 * `v` is the credential version of the password the session was opened with.
 * Changing the password bumps that version, which invalidates every cookie
 * carrying the old one — i.e. a password change signs the other browsers out.
 */
function createToken({ username, version }) {
  const payload = Buffer.from(
    JSON.stringify({ u: username, t: Date.now(), v: version ?? null })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

async function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = sign(payload);
  // Constant-time comparison to avoid leaking the signature byte by byte.
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  let data;
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch {
    return false;
  }
  if (Date.now() - data.t > MAX_AGE * 1000) return false;

  // A session opened before the current password was set is no longer valid.
  const account = await getAdminAccountSafe();
  if (account && data.v !== account.version) return false;

  return true;
}

/**
 * True if the submitted username + password match the current admin login —
 * the one saved in the panel if there is one, otherwise the environment.
 */
export async function checkCredentials(username, password) {
  if (typeof username !== 'string' || typeof password !== 'string') return false;

  const account = await getAdminAccountSafe();
  if (account) {
    const okU = username === account.username;
    const okP = verifyPassword(account, password);
    return okU && okP;
  }

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

/** Opens a session for the current login (saved account, or the env one). */
export async function createSession() {
  const account = await getAdminAccountSafe();
  const store = await cookies();
  store.set(
    COOKIE_NAME,
    createToken({
      username: account?.username || process.env.ADMIN_USERNAME || 'admin',
      version: account?.version ?? null,
    }),
    {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: MAX_AGE,
    }
  );
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Reads the cookie and returns true if the current request is authenticated. */
export async function isAuthenticated() {
  const store = await cookies();
  return await verifyToken(store.get(COOKIE_NAME)?.value);
}
