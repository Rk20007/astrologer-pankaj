import { NextResponse } from 'next/server';
import { paymentSubmissionSchema } from '@/lib/paymentSchema';
import { createPayment, DuplicateUtrError } from '@/lib/payments';

export const runtime = 'nodejs';

// Simple per-instance throttle (mirrors /api/booking and /api/kundali).
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

function pruneHits() {
  if (hits.size < 5000) return;
  const now = Date.now();
  for (const [ip, entry] of hits) {
    if (now > entry.resetAt) hits.delete(ip);
  }
}

/**
 * A client tells us they have paid via the UPI QR, supplying the UTR. Nothing
 * here confirms the money arrived — an admin verifies it against the bank
 * statement and approves it from /admin/payments.
 */
export async function POST(request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    pruneHits();
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many attempts. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
    }

    // Honeypot — a real person never fills a field they cannot see.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ ok: true, code: 'PAY-OK' });
    }

    const parsed = paymentSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      const errors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field && !errors[field]) errors[field] = issue.message;
      }
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const payment = await createPayment(parsed.data);
    return NextResponse.json({ ok: true, id: payment.id, code: payment.code });
  } catch (error) {
    if (error instanceof DuplicateUtrError) {
      return NextResponse.json({ ok: false, errors: { utr: error.message } }, { status: 409 });
    }
    console.error('[payments] Failed to record payment:', error);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong on our side. Please try again or send the screenshot on WhatsApp.' },
      { status: 500 }
    );
  }
}
