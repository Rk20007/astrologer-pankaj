import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { updateLeadStatus, deleteLead, LEAD_STATUSES, SlotTakenError } from '@/lib/leads';

export const runtime = 'nodejs';

// Update a lead's status: PATCH { status }.
export async function PATCH(request, { params }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = typeof body?.status === 'string' ? body.status : '';

  if (!LEAD_STATUSES.includes(status)) {
    return NextResponse.json({ ok: false, error: 'Invalid status.' }, { status: 400 });
  }

  try {
    const ok = await updateLeadStatus(id, status);
    if (!ok) return NextResponse.json({ ok: false, error: 'Lead not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof SlotTakenError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 409 });
    }
    console.error('[admin/leads] update failed:', err);
    return NextResponse.json({ ok: false, error: 'Could not update lead.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  try {
    const ok = await deleteLead(id);
    if (!ok) return NextResponse.json({ ok: false, error: 'Lead not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/leads] delete failed:', err);
    return NextResponse.json({ ok: false, error: 'Could not delete lead.' }, { status: 500 });
  }
}
