import crypto from 'crypto';
import { getCollection } from '@/lib/mongodb';

/**
 * The admin login, once it has been changed from inside the panel.
 *
 * Until someone sets a password here, the login is whatever `ADMIN_USERNAME` /
 * `ADMIN_PASSWORD` say in the environment — that is how the site starts life.
 * Saving a new password writes a scrypt hash to the database, and from then on
 * the database wins: the env password stops working, so a leaked `.env` cannot
 * be used to get back in.
 *
 * `version` bumps on every change and is baked into the session cookie, so
 * changing the password signs every other browser out.
 */
const COLLECTION = 'settings';
const DOC_ID = 'adminAccount';

const KEY_LENGTH = 64;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };

// The account is read on every authenticated request, so hold it briefly rather
// than hitting Mongo each time. "No account set" is cached too — that is the
// state the site starts in, and it would otherwise be the one case that queried
// on every single request. Any write clears the cache immediately.
const CACHE_MS = 15_000;
let cache = { at: 0, value: null };

export function clearAdminAccountCache() {
  cache = { at: 0, value: null };
}

/** The stored account, or null if the login still comes from the environment. */
export async function getAdminAccount() {
  if (cache.at > 0 && Date.now() - cache.at < CACHE_MS) return cache.value;
  const col = await getCollection(COLLECTION);
  const doc = await col.findOne({ _id: DOC_ID });
  const value = doc?.value?.hash ? doc.value : null;
  cache = { at: Date.now(), value };
  return value;
}

/** Same as getAdminAccount, but a database hiccup reads as "not set". */
export async function getAdminAccountSafe() {
  try {
    return await getAdminAccount();
  } catch (err) {
    console.error('[adminAccount] read failed:', err.message);
    return null;
  }
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, KEY_LENGTH, SCRYPT_PARAMS).toString('hex');
}

/** Constant-time check of a password against a stored account. */
export function verifyPassword(account, password) {
  if (!account?.hash || !account?.salt || typeof password !== 'string' || !password) return false;
  let candidate;
  try {
    candidate = hashPassword(password, account.salt);
  } catch {
    return false;
  }
  const a = Buffer.from(candidate, 'hex');
  const b = Buffer.from(account.hash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Rules kept deliberately simple, but enough to stop "1234". */
export function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 10) {
    return 'The new password must be at least 10 characters long.';
  }
  if (password.length > 200) return 'That password is too long.';
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Use at least one letter and one number.';
  }
  return null;
}

export function validateUsername(username) {
  if (typeof username !== 'string' || username.trim().length < 3) {
    return 'The username must be at least 3 characters long.';
  }
  if (username.trim().length > 60) return 'That username is too long.';
  return null;
}

/**
 * Writes a new username + password. Returns the saved account (without the
 * secret bits) — its `version` is what the new session cookie carries.
 */
export async function setAdminCredentials({ username, password }) {
  const salt = crypto.randomBytes(16).toString('hex');
  const value = {
    username: username.trim(),
    salt,
    hash: hashPassword(password, salt),
    version: Date.now(),
    updatedAt: new Date(),
  };

  const col = await getCollection(COLLECTION);
  await col.updateOne({ _id: DOC_ID }, { $set: { value } }, { upsert: true });
  clearAdminAccountCache();

  return { username: value.username, version: value.version, updatedAt: value.updatedAt };
}

/** What the panel shows on the account screen — never the hash or the salt. */
export async function getAdminAccountSummary() {
  const account = await getAdminAccountSafe();
  return {
    username: account?.username || process.env.ADMIN_USERNAME || 'admin',
    // True while the login is still the one from .env.local.
    usingEnvPassword: !account,
    updatedAt: account?.updatedAt || null,
  };
}
