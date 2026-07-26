import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { listPayments, getPaymentStats } from '@/lib/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const kind = searchParams.get('kind') || undefined;

  try {
    const [payments, stats] = await Promise.all([
      listPayments({ status, kind }),
      getPaymentStats(),
    ]);
    return NextResponse.json({ ok: true, payments, stats });
  } catch (err) {
    console.error('[admin/payments] list failed:', err);
    return NextResponse.json({ ok: false, error: 'Could not load payments.' }, { status: 500 });
  }
}
