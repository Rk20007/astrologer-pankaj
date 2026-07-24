import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { listAllRequests, getRequestStats } from '@/lib/kundali';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;

  try {
    const [requests, stats] = await Promise.all([listAllRequests({ status }), getRequestStats()]);
    return NextResponse.json({ ok: true, requests, stats });
  } catch (err) {
    console.error('[admin/kundali] list failed:', err);
    return NextResponse.json({ ok: false, error: 'Could not load requests.' }, { status: 500 });
  }
}
