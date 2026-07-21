import { getCollection } from '@/lib/mongodb';
import { getDefault, isValidKey, contentRegistry } from '@/lib/contentRegistry';

const COLLECTION = 'content';

/**
 * Reads a content section. Returns whatever is saved in MongoDB, or the
 * default from the data files if nothing has been saved (or the DB is
 * unreachable) — so the site never breaks, it just shows the original content.
 */
export async function getContent(key) {
  if (!isValidKey(key)) return undefined;
  try {
    const col = await getCollection(COLLECTION);
    const doc = await col.findOne({ _id: key });
    if (doc && doc.value !== undefined) return doc.value;
  } catch (err) {
    console.error(`[content] falling back to default for "${key}":`, err.message);
  }
  return getDefault(key);
}

/** Reads every registered section at once, keyed by content key. */
export async function getAllContent() {
  const result = {};
  let saved = new Map();
  try {
    const col = await getCollection(COLLECTION);
    const docs = await col.find({}).toArray();
    saved = new Map(docs.map((d) => [d._id, d.value]));
  } catch (err) {
    console.error('[content] getAllContent falling back to defaults:', err.message);
  }
  for (const key of Object.keys(contentRegistry)) {
    result[key] = saved.has(key) ? saved.get(key) : getDefault(key);
  }
  return result;
}

/** Saves (upserts) a content section. */
export async function setContent(key, value) {
  if (!isValidKey(key)) {
    throw new Error(`Unknown content key: ${key}`);
  }
  const col = await getCollection(COLLECTION);
  await col.updateOne(
    { _id: key },
    { $set: { value, updatedAt: new Date() } },
    { upsert: true }
  );
  return value;
}

/** Restores a section to its original default from the data files. */
export async function resetContent(key) {
  if (!isValidKey(key)) throw new Error(`Unknown content key: ${key}`);
  const col = await getCollection(COLLECTION);
  await col.deleteOne({ _id: key });
  return getDefault(key);
}
