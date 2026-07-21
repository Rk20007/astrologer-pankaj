import crypto from 'crypto';
import { getCollection } from '@/lib/mongodb';

const COLLECTION = 'images';

/** The public URL a stored image is served from. */
export function imageUrl(id) {
  return `/api/images/${id}`;
}

/** Saves an uploaded file and returns its metadata (with public url). */
export async function saveImage({ buffer, contentType, filename }) {
  const col = await getCollection(COLLECTION);
  const id = crypto.randomBytes(12).toString('hex');
  const doc = {
    _id: id,
    filename: filename || 'upload',
    contentType: contentType || 'application/octet-stream',
    size: buffer.length,
    data: buffer, // stored as BSON Binary
    createdAt: new Date(),
  };
  await col.insertOne(doc);
  return { id, url: imageUrl(id), filename: doc.filename, size: doc.size, contentType: doc.contentType };
}

/** Lists stored images (newest first), without the binary payload. */
export async function listImages() {
  const col = await getCollection(COLLECTION);
  const docs = await col
    .find({}, { projection: { data: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => ({
    id: d._id,
    url: imageUrl(d._id),
    filename: d.filename,
    size: d.size,
    contentType: d.contentType,
    createdAt: d.createdAt,
  }));
}

/** Fetches one image's binary + content type for serving. */
export async function getImage(id) {
  const col = await getCollection(COLLECTION);
  const doc = await col.findOne({ _id: id });
  if (!doc) return null;
  // The driver returns Binary; normalise to a Node Buffer.
  const data = doc.data?.buffer ? Buffer.from(doc.data.buffer) : Buffer.from(doc.data);
  return { data, contentType: doc.contentType };
}

export async function deleteImage(id) {
  const col = await getCollection(COLLECTION);
  await col.deleteOne({ _id: id });
}
