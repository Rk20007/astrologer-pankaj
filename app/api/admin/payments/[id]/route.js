import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { getPayment, reviewPayment, deletePayment, PAYMENT_STATUS_KEYS } from '@/lib/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  const payment = await getPayment(id);
  if (!payment) return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
  return NextResponse.json({ ok: true, payment });
}

/** Approve or reject a submitted payment, with an optional reason. */
export async function PATCH(request, { params }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const { status, reviewNote } = body;
  if (!PAYMENT_STATUS_KEYS.includes(status)) {
    return NextResponse.json({ ok: false, error: 'Invalid status.' }, { status: 400 });
  }

  try {
    const ok = await reviewPayment(id, status, { reviewNote });
    if (!ok) return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ ok: true, payment: await getPayment(id) });
  } catch (err) {
    console.error('[admin/payments] update failed:', err);
    return NextResponse.json({ ok: false, error: 'Could not update payment.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  const ok = await deletePayment(id);
  if (!ok) return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
