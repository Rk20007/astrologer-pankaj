import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

/**
 * Guards an admin API route. Returns a 401 Response if not logged in, or null
 * if the request may proceed. Usage:
 *   const denied = await requireAuth();
 *   if (denied) return denied;
 */
export async function requireAuth() {
  if (await isAuthenticated()) return null;
  return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
}
