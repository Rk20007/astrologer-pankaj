import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import {
  getRequest,
  getStatusLogs,
  updateRequestStatus,
  addInternalNote,
  STATUS_KEYS,
} from '@/lib/kundali';
import { listPaymentsForRef } from '@/lib/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Full request detail + its status timeline.
export async function GET(request, { params }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  const req = await getRequest(id);
  if (!req) return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });

  const logs = await getStatusLogs(id);
  const payments = await listPaymentsForRef(id).catch(() => []);
  return NextResponse.json({ ok: true, request: req, logs, payments });
}

// Update status and/or append an internal note in one call.
export async function PATCH(request, { params }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const { status, note } = body;

  if (status !== undefined && !STATUS_KEYS.includes(status)) {
    return NextResponse.json({ ok: false, error: 'Invalid status.' }, { status: 400 });
  }

  try {
    let touched = false;
    if (note) {
      const ok = await addInternalNote(id, note);
      if (!ok) return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
      touched = true;
    }
    if (status) {
      // A note supplied alongside a status change is recorded on the status log too.
      const ok = await updateRequestStatus(id, status, { note });
      if (!ok) return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
      touched = true;
    }
    if (!touched) {
      return NextResponse.json({ ok: false, error: 'Nothing to update.' }, { status: 400 });
    }

    const req = await getRequest(id);
    const logs = await getStatusLogs(id);
    const payments = await listPaymentsForRef(id).catch(() => []);
    return NextResponse.json({ ok: true, request: req, logs, payments });
  } catch (err) {
    console.error('[admin/kundali] update failed:', err);
    return NextResponse.json({ ok: false, error: 'Could not update request.' }, { status: 500 });
  }
}
