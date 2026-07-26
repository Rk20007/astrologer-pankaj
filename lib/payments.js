import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';
import {
  PAYMENT_STATUSES,
  PAYMENT_STATUS_KEYS,
  PAYMENT_STATUS_LABEL,
  PAYMENT_KIND_KEYS,
} from '@/lib/paymentMeta';

export { PAYMENT_STATUSES, PAYMENT_STATUS_KEYS, PAYMENT_STATUS_LABEL };

const COLLECTION = 'payments';

/** Thrown when the same UTR has already been submitted. */
export class DuplicateUtrError extends Error {
  constructor() {
    super('This transaction reference has already been submitted. Our team is verifying it.');
    this.name = 'DuplicateUtrError';
  }
}

// One UTR can only ever belong to one payment, so a client cannot submit the
// same transaction against two bookings. The unique index closes the race that
// a plain findOne() check would leave open.
let indexesReady = null;
async function ensureIndexes(col) {
  if (indexesReady) return;
  indexesReady = Promise.all([
    col.createIndex({ createdAt: -1 }),
    col.createIndex({ status: 1, createdAt: -1 }),
    col.createIndex({ refId: 1 }),
    col.createIndex({ utr: 1 }, { unique: true, name: 'uniq_utr' }),
  ]).catch((err) => {
    // Don't wedge future calls if index creation hiccups; log and carry on.
    console.error('[payments] ensureIndexes failed:', err.message);
    indexesReady = null;
  });
  await indexesReady;
}

function generateCode() {
  return `PAY-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

function serialise(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

/**
 * Records a payment the client says they have made. It always lands as
 * `pending_verification` — nothing is trusted until an admin checks the bank
 * statement and approves it.
 */
export async function createPayment(data) {
  const col = await getCollection(COLLECTION);
  await ensureIndexes(col);

  const now = new Date();
  const doc = {
    code: generateCode(),
    kind: PAYMENT_KIND_KEYS.includes(data.kind) ? data.kind : 'other',
    service: data.service || '',
    // Which record this pays for, when it was opened from a booking flow.
    refId: data.refId || '',
    refCode: data.refCode || '',
    name: data.name,
    phone: data.phone,
    email: (data.email || '').toLowerCase(),
    amount: data.amount,
    utr: data.utr,
    method: data.method || 'upi',
    paidAt: data.paidAt || '',
    note: data.note || '',
    status: 'pending_verification',
    reviewNote: '',
    reviewedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const res = await col.insertOne(doc);
    return serialise({ _id: res.insertedId, ...doc });
  } catch (err) {
    if (err?.code === 11000) throw new DuplicateUtrError();
    throw err;
  }
}

export async function getPayment(id) {
  if (!ObjectId.isValid(id)) return null;
  const col = await getCollection(COLLECTION);
  return serialise(await col.findOne({ _id: new ObjectId(id) }));
}

/** Every payment submitted against one booking / request, newest first. */
export async function listPaymentsForRef(refId) {
  if (!refId) return [];
  const col = await getCollection(COLLECTION);
  const docs = await col.find({ refId }).sort({ createdAt: -1 }).toArray();
  return docs.map(serialise);
}

export async function listPayments({ status, kind, limit = 500 } = {}) {
  const col = await getCollection(COLLECTION);
  const query = {};
  if (status && PAYMENT_STATUS_KEYS.includes(status)) query.status = status;
  if (kind && PAYMENT_KIND_KEYS.includes(kind)) query.kind = kind;

  const docs = await col
    .find(query)
    .sort({ createdAt: -1 })
    .limit(Math.min(2000, Math.max(1, limit)))
    .toArray();
  return docs.map(serialise);
}

export async function getPaymentStats() {
  const col = await getCollection(COLLECTION);
  const [total, byStatus, approvedTotal] = await Promise.all([
    col.countDocuments({}),
    col.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]).toArray(),
    col
      .aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, sum: { $sum: '$amount' } } },
      ])
      .toArray(),
  ]);

  const statusCounts = Object.fromEntries(byStatus.map((s) => [s._id, s.count]));
  return { total, statusCounts, approvedAmount: approvedTotal[0]?.sum || 0 };
}

/**
 * Approves or rejects a submitted payment. `reviewNote` is the admin's reason —
 * it is shown back to the client on their request page, so keep it plain.
 */
export async function reviewPayment(id, status, { reviewNote = '', by = 'admin' } = {}) {
  if (!PAYMENT_STATUS_KEYS.includes(status)) throw new Error('Invalid status');
  if (!ObjectId.isValid(id)) return false;

  const col = await getCollection(COLLECTION);
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status,
        reviewNote: String(reviewNote || '').slice(0, 2000),
        reviewedBy: by,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );
  return res.matchedCount > 0;
}

export async function deletePayment(id) {
  if (!ObjectId.isValid(id)) return false;
  const col = await getCollection(COLLECTION);
  const res = await col.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}
