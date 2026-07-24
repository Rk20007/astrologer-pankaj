import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';
import { KUNDALI_STATUSES, STATUS_KEYS, STATUS_LABEL, SERVICE_NAME } from '@/lib/kundaliStatusMeta';

export { KUNDALI_STATUSES, STATUS_KEYS, STATUS_LABEL, SERVICE_NAME };

const USERS = 'users';
const REQUESTS = 'kundali_requests';
const LOGS = 'kundali_status_logs';
const PDFS = 'kundali_pdfs';

function generateCode() {
  return `KND-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

/** Upserts a user by email and returns their id as a string. */
export async function upsertUser({ name, email, phone }) {
  const col = await getCollection(USERS);
  const now = new Date();
  const res = await col.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: { name, phone, updatedAt: now },
      $setOnInsert: { email: email.toLowerCase(), createdAt: now },
    },
    { upsert: true, returnDocument: 'after' }
  );
  // Driver returns the doc (or, on some versions, { value }).
  const doc = res?.value || res;
  return doc._id.toString();
}

async function logStatus({ requestId, from, to, note, by }) {
  const col = await getCollection(LOGS);
  await col.insertOne({
    requestId: new ObjectId(requestId),
    from: from || null,
    to,
    note: note || '',
    by: by || 'system',
    at: new Date(),
  });
}

/** Creates a Kundali request (status: pending_review) and its first status log. */
export async function createRequest(data) {
  const userId = await upsertUser({ name: data.name, email: data.email, phone: data.phone });

  const col = await getCollection(REQUESTS);
  const now = new Date();
  const doc = {
    code: generateCode(),
    userId: new ObjectId(userId),
    service: SERVICE_NAME,
    name: data.name,
    email: data.email.toLowerCase(),
    phone: data.phone,
    dob: data.dob,
    birthTime: data.unknownBirthTime ? '' : data.birthTime,
    unknownBirthTime: Boolean(data.unknownBirthTime),
    birthPlace: data.birthPlace,
    language: data.language,
    questions: data.questions || '',
    status: 'pending_review',
    internalNotes: [],
    pdf: null,
    createdAt: now,
    updatedAt: now,
  };

  const res = await col.insertOne(doc);
  await logStatus({ requestId: res.insertedId, from: null, to: 'pending_review', note: 'Request submitted', by: 'user' });

  return { id: res.insertedId.toString(), code: doc.code, userId };
}

function serialise(doc) {
  if (!doc) return null;
  const { _id, userId, ...rest } = doc;
  return {
    id: _id.toString(),
    userId: userId?.toString() || null,
    ...rest,
    hasPdf: Boolean(doc.pdf),
  };
}

export async function getRequest(id) {
  if (!ObjectId.isValid(id)) return null;
  const col = await getCollection(REQUESTS);
  return serialise(await col.findOne({ _id: new ObjectId(id) }));
}

/** A request scoped to its owner — returns null if it isn't theirs. */
export async function getRequestForUser(id, userId) {
  if (!ObjectId.isValid(id) || !ObjectId.isValid(userId)) return null;
  const col = await getCollection(REQUESTS);
  return serialise(await col.findOne({ _id: new ObjectId(id), userId: new ObjectId(userId) }));
}

export async function listRequestsByUser(userId) {
  if (!ObjectId.isValid(userId)) return [];
  const col = await getCollection(REQUESTS);
  const docs = await col.find({ userId: new ObjectId(userId) }).sort({ createdAt: -1 }).toArray();
  return docs.map(serialise);
}

export async function listAllRequests({ status } = {}) {
  const col = await getCollection(REQUESTS);
  const query = {};
  if (status && STATUS_KEYS.includes(status)) query.status = status;
  const docs = await col.find(query).sort({ createdAt: -1 }).limit(2000).toArray();
  return docs.map(serialise);
}

export async function getRequestStats() {
  const col = await getCollection(REQUESTS);
  const [total, byStatus] = await Promise.all([
    col.countDocuments({}),
    col.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]).toArray(),
  ]);
  const statusCounts = Object.fromEntries(byStatus.map((s) => [s._id, s.count]));
  return { total, statusCounts };
}

export async function getStatusLogs(requestId) {
  if (!ObjectId.isValid(requestId)) return [];
  const col = await getCollection(LOGS);
  const docs = await col.find({ requestId: new ObjectId(requestId) }).sort({ at: 1 }).toArray();
  return docs.map(({ _id, requestId: rid, ...rest }) => ({ id: _id.toString(), ...rest }));
}

/** Updates status (with a log entry). Returns false if the request is gone. */
export async function updateRequestStatus(id, status, { note, by = 'admin' } = {}) {
  if (!STATUS_KEYS.includes(status)) throw new Error('Invalid status');
  if (!ObjectId.isValid(id)) return false;
  const col = await getCollection(REQUESTS);
  const _id = new ObjectId(id);
  const existing = await col.findOne({ _id }, { projection: { status: 1 } });
  if (!existing) return false;

  const set = { status, updatedAt: new Date() };
  if (status === 'delivered') set.deliveredAt = new Date();

  await col.updateOne({ _id }, { $set: set });
  await logStatus({ requestId: _id, from: existing.status, to: status, note, by });
  return true;
}

/** Appends an internal (admin-only) note. */
export async function addInternalNote(id, text, by = 'admin') {
  if (!ObjectId.isValid(id)) return false;
  const clean = String(text || '').trim().slice(0, 4000);
  if (!clean) return false;
  const col = await getCollection(REQUESTS);
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    { $push: { internalNotes: { text: clean, by, at: new Date() } }, $set: { updatedAt: new Date() } }
  );
  return res.matchedCount > 0;
}

/**
 * Stores the finished PDF (replacing any previous one) and advances the request
 * to "PDF Ready" if it isn't already delivered.
 */
export async function attachPdf(id, { buffer, contentType, filename }) {
  if (!ObjectId.isValid(id)) return false;
  const _id = new ObjectId(id);
  const requests = await getCollection(REQUESTS);
  const existing = await requests.findOne({ _id }, { projection: { status: 1 } });
  if (!existing) return false;

  const pdfs = await getCollection(PDFS);
  await pdfs.deleteMany({ requestId: _id });
  await pdfs.insertOne({
    requestId: _id,
    data: buffer,
    contentType: contentType || 'application/pdf',
    filename: filename || 'kundali.pdf',
    size: buffer.length,
    uploadedAt: new Date(),
  });

  const pdfMeta = { filename: filename || 'kundali.pdf', size: buffer.length, uploadedAt: new Date() };
  const set = { pdf: pdfMeta, updatedAt: new Date() };
  // Uploading a PDF naturally means it's ready — unless it was already delivered.
  const advance = existing.status !== 'delivered' && existing.status !== 'pdf_ready';
  if (advance) set.status = 'pdf_ready';

  await requests.updateOne({ _id }, { $set: set });
  if (advance) {
    await logStatus({ requestId: _id, from: existing.status, to: 'pdf_ready', note: 'PDF uploaded', by: 'admin' });
  }
  return true;
}

/** Raw PDF bytes for download, or null. */
export async function getPdf(requestId) {
  if (!ObjectId.isValid(requestId)) return null;
  const pdfs = await getCollection(PDFS);
  const doc = await pdfs.findOne({ requestId: new ObjectId(requestId) });
  if (!doc) return null;
  const data = doc.data?.buffer ? Buffer.from(doc.data.buffer) : Buffer.from(doc.data);
  return { data, contentType: doc.contentType || 'application/pdf', filename: doc.filename || 'kundali.pdf' };
}
