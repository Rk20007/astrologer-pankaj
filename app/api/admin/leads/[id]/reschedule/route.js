import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import {
  rescheduleLead,
  getBookedSlots,
  getLead,
  SlotTakenError,
  NotReschedulableError,
} from '@/lib/leads';
import {
  getAvailabilityConfig,
  buildDaySlots,
  isValidDate,
  isValidTime,
  resolveConsultant,
} from '@/lib/availability';

export const runtime = 'nodejs';

/**
 * Moves an appointment to a new date + time: POST { date, slot, note?, force? }.
 *
 * The new slot is checked against the live availability config (working hours,
 * days off, individually blocked times) and against the other bookings for the
 * same consultant. `force: true` lets the admin override the schedule itself —
 * e.g. squeezing someone into a Sunday — but never lets two bookings share a
 * slot; that is still guarded by the unique index.
 */
export async function POST(request, { params }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const date = typeof body?.date === 'string' ? body.date : '';
  const slot = typeof body?.slot === 'string' ? body.slot : '';
  const note = typeof body?.note === 'string' ? body.note : '';
  const force = body?.force === true;

  if (!isValidDate(date)) {
    return NextResponse.json({ ok: false, error: 'Please choose a valid date.' }, { status: 400 });
  }
  if (!isValidTime(slot)) {
    return NextResponse.json({ ok: false, error: 'Please choose a valid time.' }, { status: 400 });
  }
  try {
    const existing = await getLead(id);
    if (!existing) {
      return NextResponse.json({ ok: false, error: 'Lead not found.' }, { status: 404 });
    }
    if (existing.kind !== 'consultation') {
      return NextResponse.json(
        { ok: false, error: 'Only appointments with a date and time can be rescheduled.' },
        { status: 400 }
      );
    }
    if (existing.date === date && existing.slot === slot) {
      return NextResponse.json(
        { ok: false, error: 'That is already this appointment’s date and time.' },
        { status: 400 }
      );
    }

    const consultant = resolveConsultant(existing.cardId);
    if (!consultant) {
      return NextResponse.json(
        { ok: false, error: 'This booking has no consultant, so it cannot be rescheduled.' },
        { status: 400 }
      );
    }

    // The booking's own current slot must not count against it.
    const booked = await getBookedSlots(consultant, date, { excludeId: id });
    if (booked.has(slot)) {
      return NextResponse.json(
        { ok: false, error: 'Another appointment already holds that time.' },
        { status: 409 }
      );
    }

    if (!force) {
      const config = await getAvailabilityConfig();
      const { closed, reason, slots } = buildDaySlots(config, date, booked);
      const match = slots.find((s) => s.time === slot);

      if (closed) {
        const message =
          reason === 'past'
            ? 'That date has already passed.'
            : reason === 'off'
              ? 'That date is marked as a day off.'
              : 'There are no working hours set for that day.';
        return NextResponse.json({ ok: false, error: message, overridable: true }, { status: 409 });
      }
      if (!match) {
        return NextResponse.json(
          { ok: false, error: 'That time is outside the working hours for that day.', overridable: true },
          { status: 409 }
        );
      }
      if (!match.available) {
        const message =
          match.reason === 'blocked'
            ? 'That time is blocked off on the availability page.'
            : match.reason === 'past'
              ? 'That time has already passed.'
              : 'That time is already booked.';
        return NextResponse.json(
          { ok: false, error: message, overridable: match.reason !== 'booked' },
          { status: 409 }
        );
      }
    }

    const lead = await rescheduleLead(id, { date, slot, note });
    if (!lead) return NextResponse.json({ ok: false, error: 'Lead not found.' }, { status: 404 });
    return NextResponse.json({ ok: true, lead });
  } catch (err) {
    if (err instanceof SlotTakenError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 409 });
    }
    if (err instanceof NotReschedulableError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
    }
    console.error('[admin/leads] reschedule failed:', err);
    return NextResponse.json(
      { ok: false, error: 'Could not reschedule this appointment.' },
      { status: 500 }
    );
  }
}
