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

  try {
    const [leads, stats] = await Promise.all([
      listLeads({ status, kind }),
      getLeadStats(),
    ]);
    return NextResponse.json({ ok: true, leads, stats });
  } catch (err) {
    console.error('[admin/leads] list failed:', err);
    return NextResponse.json({ ok: false, error: 'Could not load leads.' }, { status: 500 });
  }
}
