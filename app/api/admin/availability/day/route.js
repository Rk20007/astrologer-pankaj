import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import {
  getAvailabilityConfig,
  buildDaySlots,
  blockedSlotsFor,
  isValidDate,
  resolveConsultant,
  nowParts,
  CONSULTANTS,
} from '@/lib/availability';
import { getBookedSlots, listDayBookings, SLOT_FREEING_STATUSES } from '@/lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * One day's schedule for the admin panel:
 *   GET /api/admin/availability/day?date=YYYY-MM-DD[&consultant=…][&excludeLead=…]
 *
 * Returns the generated slots with why each one cannot be taken, plus the
 * bookings sitting on that date. Two screens use it:
 *   - Availability → blocking individual times (no consultant given, so every
 *     booking on the day is listed against its slot)
 *   - Leads → rescheduling one appointment (a consultant is given, and that
 *     booking is left out of the "already taken" set)
 */
export async function GET(request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const consultantParam = searchParams.get('consultant');
  const excludeLead = searchParams.get('excludeLead') || undefined;

  if (!isValidDate(date)) {
    return NextResponse.json({ ok: false, error: 'A valid date is required.' }, { status: 400 });
  }

  const consultant = consultantParam ? resolveConsultant(consultantParam) : null;
  if (consultantParam && !consultant) {
    return NextResponse.json({ ok: false, error: 'Unknown consultant.' }, { status: 400 });
  }

  try {
    const config = await getAvailabilityConfig();
    const [bookings, booked] = await Promise.all([
      listDayBookings(date),
      consultant ? getBookedSlots(consultant, date, { excludeId: excludeLead }) : new Set(),
    ]);

    // Admin views show past days too — they just come back flagged.
    const { closed, reason, slots } = buildDaySlots(config, date, booked, { allowPast: true });
    const blocked = blockedSlotsFor(config, date);

    // Bookings that still hold their slot, so the day view can show who is in it.
    const held = bookings.filter((b) => !SLOT_FREEING_STATUSES.includes(b.status));

    const now = nowParts();
    const detailed = slots.map((s) => {
      const on = held.filter((b) => b.slot === s.time && b.id !== excludeLead);
      const past = date < now.date || (date === now.date && s.time <= now.time);
      return {
        ...s,
        past,
        blocked: blocked.has(s.time),
        bookings: on.map((b) => ({
          id: b.id,
          name: b.name,
          status: b.status,
          consultant: b.cardId,
          consultantName: CONSULTANTS[b.cardId] || b.cardId,
        })),
      };
    });

    return NextResponse.json({
      ok: true,
      date,
      closed,
      reason,
      isPastDate: date < now.date,
      slotMinutes: config.slotMinutes,
      consultant,
      slots: detailed,
      bookings,
    });
  } catch (err) {
    console.error('[admin/availability/day] lookup failed:', err);
    return NextResponse.json({ ok: false, error: 'Could not load that day.' }, { status: 500 });
  }
}
