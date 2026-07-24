import { NextResponse } from 'next/server';
import { kundaliRequestSchema } from '@/lib/kundaliSchema';
import { createRequest } from '@/lib/kundali';
import { setUserSession } from '@/lib/userSession';

export const runtime = 'nodejs';

// Simple per-instance throttle (mirrors /api/booking).
const RATE_LIMIT = { windowMs: 60_000, max: 5 };
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

export async function POST(request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
    }

    // Honeypot — a bot fills the hidden field.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ ok: true, code: 'KND-OK' });
    }

    const parsed = kundaliRequestSchema.safeParse(body);
    if (!parsed.success) {
      const errors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field && !errors[field]) errors[field] = issue.message;
      }
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const { id, code, userId } = await createRequest(parsed.data);

    // Tie this browser to the user so they can see the request under "My Requests".
    await setUserSession(userId);

    return NextResponse.json({ ok: true, id, code });
  } catch (error) {
    console.error('[kundali] Failed to create request:', error);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong on our side. Please try again.' },
      { status: 500 }
    );
  }
}
