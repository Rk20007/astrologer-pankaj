import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { checkCredentials, createSession } from '@/lib/auth';
import {
  getAdminAccountSummary,
  setAdminCredentials,
  validatePassword,
  validateUsername,
} from '@/lib/adminAccount';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Who is logged in, and whether the password still comes from .env.local. */
export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    return NextResponse.json({ ok: true, account: await getAdminAccountSummary() });
  } catch (err) {
    console.error('[admin/account] read failed:', err);
    return NextResponse.json({ ok: false, error: 'Could not load the account.' }, { status: 500 });
  }
}

/**
 * Changes the login: PUT { currentPassword, newPassword, confirmPassword, username? }.
 *
 * The current password is required even though the caller is already signed in,
 * so a machine left logged in cannot be used to lock the owner out. Saving
 * bumps the credential version, which signs out every other browser; this one
 * gets a fresh cookie so the admin is not thrown out of the page they are on.
 */
export async function PUT(request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword : '';
  const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : '';
  const confirmPassword = typeof body?.confirmPassword === 'string' ? body.confirmPassword : '';

  try {
    const current = await getAdminAccountSummary();
    const username = typeof body?.username === 'string' && body.username.trim()
      ? body.username.trim()
      : current.username;

    const usernameError = validateUsername(username);
    if (usernameError) {
      return NextResponse.json({ ok: false, error: usernameError }, { status: 400 });
    }

    if (!(await checkCredentials(current.username, currentPassword))) {
      return NextResponse.json(
        { ok: false, error: 'That is not the current password.' },
        { status: 400 }
      );
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return NextResponse.json({ ok: false, error: passwordError }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { ok: false, error: 'The two new passwords do not match.' },
        { status: 400 }
      );
    }
    if (newPassword === currentPassword) {
      return NextResponse.json(
        { ok: false, error: 'The new password must be different from the current one.' },
        { status: 400 }
      );
    }

    await setAdminCredentials({ username, password: newPassword });
    // Re-issue this browser's cookie against the new credentials.
    await createSession();

    return NextResponse.json({ ok: true, account: await getAdminAccountSummary() });
  } catch (err) {
    console.error('[admin/account] password change failed:', err);
    return NextResponse.json(
      { ok: false, error: 'Could not save the new password.' },
      { status: 500 }
    );
  }
}
