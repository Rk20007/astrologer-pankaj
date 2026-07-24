import { NextResponse } from 'next/server';
import { getAvailabilityConfig, buildDaySlots, isValidDate, resolveConsultant } from '@/lib/availability';
import { getBookedSlots } from '@/lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Public slot lookup for the booking modal:
 *   GET /api/availability?date=YYYY-MM-DD&consultant=<cardId>
 * Returns the day's slots with each one flagged available/booked, or closed:true
 * if that day is a weekly off or a specific off date.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const consultant = resolveConsultant(searchParams.get('consultant'));

  if (!isValidDate(date)) {
    return NextResponse.json({ ok: false, error: 'A valid date is required.' }, { status: 400 });
  }
  if (!consultant) {
    return NextResponse.json({ ok: false, error: 'Unknown consultant.' }, { status: 400 });
  }

  // Never offer slots in the past.
  const today = new Date().toISOString().slice(0, 10);
  if (date < today) {
    return NextResponse.json({ ok: true, date, closed: true, reason: 'past', slots: [] });
  }

  try {
    const config = await getAvailabilityConfig();
    const booked = await getBookedSlots(consultant, date);
    const { closed, reason, slots } = buildDaySlots(config, date, booked);
    return NextResponse.json({ ok: true, date, closed, reason, slots });
  } catch (err) {
    console.error('[availability] lookup failed:', err);
    return NextResponse.json(
      { ok: false, error: 'Could not load available times. Please try again.' },
      { status: 500 }
    );
  }
}
