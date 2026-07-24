import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { getAvailabilityConfig, setAvailabilityConfig } from '@/lib/availability';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    const config = await getAvailabilityConfig();
    return NextResponse.json({ ok: true, config });
  } catch (err) {
    console.error('[admin/availability] read failed:', err);
    return NextResponse.json({ ok: false, error: 'Could not load availability.' }, { status: 500 });
  }
}

// Replaces the whole config (weekly hours, slot length, off dates). The values
// are normalised server-side, so a malformed payload can't corrupt the schedule.
export async function PUT(request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const config = await setAvailabilityConfig(body);
    return NextResponse.json({ ok: true, config });
  } catch (err) {
    console.error('[admin/availability] save failed:', err);
    return NextResponse.json({ ok: false, error: 'Could not save availability.' }, { status: 500 });
  }
}
