import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';

const COLLECTION = 'leads';

export const LEAD_STATUSES = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'];

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

/** Slots already taken for a consultant on a date (as a Set of "HH:MM"). */
export async function getBookedSlots(cardId, dateStr) {
  const col = await getCollection(COLLECTION);
  const docs = await col
    .find(
      { kind: 'consultation', cardId, date: dateStr, status: { $ne: 'cancelled' } },
      { projection: { slot: 1 } }
    )
    .toArray();
  return new Set(docs.map((d) => d.slot));
}

/** Lists leads (newest first) with optional status/kind filters. */
export async function listLeads({ status, kind, limit = 500 } = {}) {
  const col = await getCollection(COLLECTION);
  const query = {};
  if (status && LEAD_STATUSES.includes(status)) query.status = status;
  if (kind) query.kind = kind;

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
  const todayStr = new Date().toISOString().slice(0, 10);

  const [total, newCount, upcoming, byStatus] = await Promise.all([
    col.countDocuments({}),
    col.countDocuments({ status: 'new' }),
    col.countDocuments({
      kind: 'consultation',
      status: { $nin: ['cancelled', 'completed'] },
      date: { $gte: todayStr },
    }),
    col
      .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
      .toArray(),
  ]);

  const statusCounts = Object.fromEntries(byStatus.map((s) => [s._id, s.count]));
  return { total, new: newCount, upcoming, statusCounts };
}

export async function updateLeadStatus(id, status) {
  if (!LEAD_STATUSES.includes(status)) throw new Error('Invalid status');
  if (!ObjectId.isValid(id)) return false;
  const col = await getCollection(COLLECTION);
  const _id = new ObjectId(id);

  const existing = await col.findOne({ _id }, { projection: { kind: 1 } });
  if (!existing) return false;

  const set = { status, updatedAt: new Date() };
  // Cancelling a consultation frees its slot; any other status re-reserves it.
  if (existing.kind === 'consultation') {
    set.active = status !== 'cancelled';
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
