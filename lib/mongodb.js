import { MongoClient } from 'mongodb';

/**
 * Cached MongoDB connection.
 *
 * In development Next.js clears module state on every hot reload, which would
 * otherwise open a new connection on each change and exhaust the pool. We stash
 * the client promise on `globalThis` so it survives reloads.
 */
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'astrology_cms';

if (!uri) {
  throw new Error('MONGODB_URI is not set. Add it to .env.local');
}

let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!globalThis._mongoClientPromise) {
    globalThis._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}
