import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { listLeads, getLeadStats } from '@/lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lists leads (newest first) plus the header stat counts, with optional
// ?status= and ?kind= filters.
export async function GET(request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const kind = searchParams.get('kind') || undefined;
  // ?missed=1 → only appointments whose time has passed and that are still
  // open, i.e. the ones that need rescheduling.
  const missed = searchParams.get('missed') === '1';

  try {
    const [leads, stats] = await Promise.all([
      listLeads({ status, kind, missed }),
      getLeadStats(),
    ]);
    return NextResponse.json({ ok: true, leads, stats });
  } catch (err) {
    console.error('[admin/leads] list failed:', err);
    return NextResponse.json({ ok: false, error: 'Could not load leads.' }, { status: 500 });
  }
}
