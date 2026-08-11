import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';
import { isValidDate, isValidTime, nowParts } from '@/lib/availability';

const COLLECTION = 'leads';

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'confirmed',
  'rescheduled',
  'completed',
  'missed',
  'cancelled',
];

// Statuses after which the appointment no longer holds its time slot, so the
// time goes back on sale for everyone else.
export const SLOT_FREEING_STATUSES = ['cancelled', 'missed'];

// An appointment still waiting to happen — these are the ones that count as
// "missed" once their time has gone by.
export const OPEN_STATUSES = ['new', 'contacted', 'confirmed', 'rescheduled'];

/**
 * True when a consultation's time has already gone by while it was still open,
 * i.e. it was never completed, cancelled or rescheduled — the bookings that
 * need chasing up and putting back on the calendar.
 */
export function isMissedAppointment(lead, now = nowParts()) {
  if (!lead || lead.kind !== 'consultation') return false;
  if (!OPEN_STATUSES.includes(lead.status)) return false;
  if (!lead.date) return false;
  if (lead.date < now.date) return true;
  return lead.date === now.date && Boolean(lead.slot) && lead.slot <= now.time;
}

// A booked slot only blocks the same consultant on the same date. Cancelled
// bookings free the slot again. Partial indexes only allow equality-style
// filters (no $ne), so active consultation bookings carry `active: true`, which
// we clear on cancellation.
let indexesReady = null;
async function ensureIndexes(col) {
  if (indexesReady) return;
  indexesReady = Promise.all([
    col.createIndex({ createdAt: -1 }),
    col.createIndex(
      { cardId: 1, date: 1, slot: 1 },
      {
        unique: true,
        name: 'uniq_consultation_slot',
        partialFilterExpression: {
          kind: 'consultation',
          active: true,
        },
      }
    ),
  ]).catch((err) => {
    // Don't wedge future calls if index creation hiccups (e.g. a pre-existing
    // conflicting doc); log and let inserts proceed.
    console.error('[leads] ensureIndexes failed:', err.message);
    indexesReady = null;
  });
  await indexesReady;
}

/** Thrown when the requested consultation slot is already taken. */
export class SlotTakenError extends Error {
  constructor() {
    super('That time slot has just been booked. Please choose another.');
    this.name = 'SlotTakenError';
  }
}

/** Thrown when a reschedule is attempted on something that has no time slot. */
export class NotReschedulableError extends Error {
  constructor() {
    super('Only appointments with a date and time can be rescheduled.');
    this.name = 'NotReschedulableError';
  }
}

/**
 * Inserts a lead. For consultations a unique index guards against two people
 * grabbing the same slot at once — a duplicate-key error becomes SlotTakenError.
 */
export async function createLead(lead) {
  const col = await getCollection(COLLECTION);
  await ensureIndexes(col);

  const now = new Date();
  const doc = {
    ...lead,
    status: 'new',
    source: 'website',
    createdAt: now,
    updatedAt: now,
  };
  // Only consultations reserve a slot; the flag drives the unique slot index.
  if (lead.kind === 'consultation') doc.active = true;

  try {
    const res = await col.insertOne(doc);
    return { id: res.insertedId.toString(), ...doc };
  } catch (err) {
    if (err?.code === 11000) throw new SlotTakenError();
    throw err;
  }
}

/** Records whether the notification email went out, for the given lead. */
export async function markLeadDelivered(id, delivered) {
  try {
    const col = await getCollection(COLLECTION);
    await col.updateOne({ _id: new ObjectId(id) }, { $set: { delivered: Boolean(delivered) } });
  } catch (err) {
    console.error('[leads] markLeadDelivered failed:', err.message);
  }
}

/**
 * Slots already taken for a consultant on a date (as a Set of "HH:MM").
 * `excludeId` leaves one booking out — used when rescheduling, so a booking
 * never counts as blocking its own time.
 */
export async function getBookedSlots(cardId, dateStr, { excludeId } = {}) {
  const col = await getCollection(COLLECTION);
  const query = {
    kind: 'consultation',
    cardId,
    date: dateStr,
    status: { $nin: SLOT_FREEING_STATUSES },
  };
  if (excludeId && ObjectId.isValid(excludeId)) query._id = { $ne: new ObjectId(excludeId) };

  const docs = await col.find(query, { projection: { slot: 1 } }).toArray();
  return new Set(docs.map((d) => d.slot));
}

/** One lead by id, or null if the id is unknown or malformed. */
export async function getLead(id) {
  if (!ObjectId.isValid(id)) return null;
  const col = await getCollection(COLLECTION);
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? serialise(doc) : null;
}

/** Every consultation booked on a date, for the admin day view. */
export async function listDayBookings(dateStr) {
  if (!isValidDate(dateStr)) return [];
  const col = await getCollection(COLLECTION);
  const docs = await col
    .find(
      { kind: 'consultation', date: dateStr },
      { projection: { name: 1, slot: 1, cardId: 1, status: 1, service: 1 } }
    )
    .sort({ slot: 1 })
    .toArray();
  return docs.map(serialise);
}

/**
 * Lists leads (newest first) with optional status/kind filters. `missed:true`
 * narrows it to appointments whose time has gone by while still open — the ones
 * waiting to be rescheduled.
 */
export async function listLeads({ status, kind, missed, limit = 500 } = {}) {
  const col = await getCollection(COLLECTION);
  const query = {};
  if (status && LEAD_STATUSES.includes(status)) query.status = status;
  if (kind) query.kind = kind;
  if (missed) {
    const now = nowParts();
    query.kind = 'consultation';
    query.status = { $in: OPEN_STATUSES };
    query.$or = [{ date: { $lt: now.date } }, { date: now.date, slot: { $lte: now.time } }];
  }

  const docs = await col
    .find(query)
    .sort({ createdAt: -1 })
    .limit(Math.min(2000, Math.max(1, limit)))
    .toArray();

  return docs.map(serialise);
}

/** Small counts for the dashboard header cards. */
export async function getLeadStats() {
  const col = await getCollection(COLLECTION);
  const now = nowParts();
  const today = now.date;

  const [total, newCount, upcoming, missed, byStatus] = await Promise.all([
    col.countDocuments({}),
    col.countDocuments({ status: 'new' }),
    col.countDocuments({
      kind: 'consultation',
      status: { $nin: ['cancelled', 'completed', 'missed'] },
      date: { $gte: today },
    }),
    // Appointments whose time has gone by while still open — they need to be
    // rescheduled (or closed off).
    col.countDocuments({
      kind: 'consultation',
      status: { $in: OPEN_STATUSES },
      $or: [{ date: { $lt: today } }, { date: today, slot: { $lte: now.time } }],
    }),
    col
      .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
      .toArray(),
  ]);

  const statusCounts = Object.fromEntries(byStatus.map((s) => [s._id, s.count]));
  return { total, new: newCount, upcoming, missed, statusCounts };
}

export async function updateLeadStatus(id, status) {
  if (!LEAD_STATUSES.includes(status)) throw new Error('Invalid status');
  if (!ObjectId.isValid(id)) return false;
  const col = await getCollection(COLLECTION);
  const _id = new ObjectId(id);

  const existing = await col.findOne({ _id }, { projection: { kind: 1 } });
  if (!existing) return false;

  const set = { status, updatedAt: new Date() };
  // Cancelling or writing off a consultation frees its slot; any other status
  // re-reserves it.
  if (existing.kind === 'consultation') {
    set.active = !SLOT_FREEING_STATUSES.includes(status);
  }

  try {
    await col.updateOne({ _id }, { $set: set });
  } catch (err) {
    // Re-activating a booking whose slot was taken in the meantime.
    if (err?.code === 11000) throw new SlotTakenError();
    throw err;
  }
  return true;
}

/**
 * Moves a consultation to a new date + time. The caller is expected to have
 * checked the new slot against the availability config; the unique slot index
 * closes the final race here, exactly as it does for a fresh booking.
 *
 * The previous date/time is kept in `rescheduleHistory`, so the admin can see
 * how often a booking has been moved.
 */
export async function rescheduleLead(id, { date, slot, note } = {}) {
  if (!ObjectId.isValid(id)) return null;
  if (!isValidDate(date) || !isValidTime(slot)) throw new Error('Invalid date or slot');

  const col = await getCollection(COLLECTION);
  await ensureIndexes(col);

  const _id = new ObjectId(id);
  const existing = await col.findOne({ _id });
  if (!existing) return null;
  if (existing.kind !== 'consultation') throw new NotReschedulableError();

  const now = new Date();
  const entry = {
    from: { date: existing.date || null, slot: existing.slot || null },
    to: { date, slot },
    at: now,
  };
  if (note) entry.note = String(note).slice(0, 500);

  try {
    await col.updateOne(
      { _id },
      {
        $set: {
          date,
          slot,
          status: 'rescheduled',
          active: true,
          rescheduledAt: now,
          updatedAt: now,
        },
        $push: { rescheduleHistory: entry },
      }
    );
  } catch (err) {
    if (err?.code === 11000) throw new SlotTakenError();
    throw err;
  }

  const updated = await col.findOne({ _id });
  return serialise(updated);
}

export async function deleteLead(id) {
  if (!ObjectId.isValid(id)) return false;
  const col = await getCollection(COLLECTION);
  const res = await col.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}

function serialise(doc) {
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}
