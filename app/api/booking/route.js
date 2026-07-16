import { NextResponse } from 'next/server';
import { contactInfo } from '@/data/site';

export const runtime = 'nodejs';

const MAX_LENGTHS = {
  name: 120,
  email: 200,
  phone: 32,
  service: 200,
  message: 4000,
  // Puja (Sankalp + billing) fields.
  yajmanName: 120,
  gotra: 120,
  fathersName: 120,
  grandfathersName: 120,
  ancestralPlace: 160,
  occupation: 120,
  city: 160,
  notes: 4000,
  pujaName: 200,
};

// Simple in-memory throttle. Resets on redeploy and is per-instance, so it
// blunts casual spam rather than a determined attacker — put a WAF or a
// shared store in front if this ever gets seriously targeted.
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

// Bound the map so a flood of unique IPs cannot grow it without limit.
function pruneHits() {
  if (hits.size < 5000) return;
  const now = Date.now();
  for (const [ip, entry] of hits) {
    if (now > entry.resetAt) hits.delete(ip);
  }
}

function validate(body) {
  const errors = {};
  const clean = {};

  for (const field of ['name', 'email', 'phone', 'message']) {
    const value = typeof body[field] === 'string' ? body[field].trim() : '';
    if (!value) {
      errors[field] = 'This field is required.';
      continue;
    }
    if (value.length > MAX_LENGTHS[field]) {
      errors[field] = `Please keep this under ${MAX_LENGTHS[field]} characters.`;
      continue;
    }
    clean[field] = value;
  }

  if (clean.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  // Deliberately permissive: international numbers vary wildly in format.
  if (clean.phone && !/^[\d\s+()-]{7,}$/.test(clean.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  const service = typeof body.service === 'string' ? body.service.trim() : '';
  clean.service = service.slice(0, MAX_LENGTHS.service);

  return { errors, clean };
}

// A puja booking carries the Sankalp details (in whose name the ritual is
// performed) plus billing contact details, instead of the free-text message
// the contact form sends.
function validatePuja(body) {
  const errors = {};
  const clean = {};

  // Required: who books it, how to reach them, and in whose name the sankalp
  // is taken.
  const required = {
    name: 'Please enter your name.',
    phone: 'Please enter your calling / WhatsApp number.',
    email: 'Please enter your email address.',
    city: 'Please enter your present city and state.',
    yajmanName: 'Please enter the name of the Yajman.',
    fathersName: "Please enter the father's name.",
  };

  // Optional but stored if present.
  const optional = ['gotra', 'grandfathersName', 'ancestralPlace', 'occupation', 'notes', 'pujaName'];

  for (const [field, message] of Object.entries(required)) {
    const value = typeof body[field] === 'string' ? body[field].trim() : '';
    if (!value) {
      errors[field] = message;
      continue;
    }
    if (value.length > MAX_LENGTHS[field]) {
      errors[field] = `Please keep this under ${MAX_LENGTHS[field]} characters.`;
      continue;
    }
    clean[field] = value;
  }

  for (const field of optional) {
    const value = typeof body[field] === 'string' ? body[field].trim() : '';
    if (value) clean[field] = value.slice(0, MAX_LENGTHS[field]);
  }

  if (clean.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (clean.phone && !/^[\d\s+()-]{7,}$/.test(clean.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  const quantity = Number.parseInt(body.quantity, 10);
  clean.quantity = Number.isFinite(quantity) && quantity > 0 && quantity <= 99 ? quantity : 1;

  // Carried through for the subject line / summary; not user-typed.
  clean.service = typeof body.service === 'string' ? body.service.trim().slice(0, MAX_LENGTHS.service) : '';

  return { errors, clean };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmail(data) {
  const rows = [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Service', data.service || '— not specified —'],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#6B5344;">${label}</td><td style="padding:6px 0;font-weight:600;color:#3A2412;">${escapeHtml(
          value
        )}</td></tr>`
    )
    .join('');

  return `
    <div style="font-family:system-ui,sans-serif;max-width:600px;">
      <h2 style="color:#C76B00;margin:0 0 16px;">New booking request</h2>
      <table style="border-collapse:collapse;margin-bottom:20px;">${rows}</table>
      <p style="color:#6B5344;margin:0 0 6px;">Message</p>
      <div style="white-space:pre-wrap;padding:14px;background:#F8F3E8;border-radius:10px;color:#3A2412;">${escapeHtml(
        data.message
      )}</div>
    </div>
  `;
}

function buildPujaEmail(data) {
  const row = (label, value) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#6B5344;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:6px 0;font-weight:600;color:#3A2412;">${escapeHtml(
      value || '—'
    )}</td></tr>`;

  const sankalp = [
    ['Name of Yajman', data.yajmanName],
    ['Gotra', data.gotra],
    ["Father's name", data.fathersName],
    ["Grandfather's name", data.grandfathersName],
    ['Ancestral Place', data.ancestralPlace],
  ]
    .map(([l, v]) => row(l, v))
    .join('');

  const billing = [
    ['Name', data.name],
    ['Calling / WhatsApp', data.phone],
    ['Email', data.email],
    ['Occupation', data.occupation],
    ['Present City & State', data.city],
  ]
    .map(([l, v]) => row(l, v))
    .join('');

  const notesBlock = data.notes
    ? `<p style="color:#6B5344;margin:20px 0 6px;">Order notes</p>
       <div style="white-space:pre-wrap;padding:14px;background:#F8F3E8;border-radius:10px;color:#3A2412;">${escapeHtml(
         data.notes
       )}</div>`
    : '';

  return `
    <div style="font-family:system-ui,sans-serif;max-width:600px;">
      <h2 style="color:#C76B00;margin:0 0 8px;">New puja booking</h2>
      <p style="margin:0 0 20px;font-weight:600;color:#3A2412;">
        ${escapeHtml(data.pujaName || data.service || 'Puja / Anushthan')}${
          data.quantity > 1 ? ` &times; ${data.quantity}` : ''
        }
      </p>

      <p style="color:#6B5344;margin:0 0 6px;font-weight:600;">Sankalp details</p>
      <table style="border-collapse:collapse;margin-bottom:20px;">${sankalp}</table>

      <p style="color:#6B5344;margin:0 0 6px;font-weight:600;">Billing details</p>
      <table style="border-collapse:collapse;">${billing}</table>

      ${notesBlock}
    </div>
  `;
}

async function sendEmail(data, kind) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_EMAIL_TO || contactInfo.email;
  const from = process.env.BOOKING_EMAIL_FROM;

  const isPuja = kind === 'puja';
  const pujaLabel = data.pujaName || data.service || 'Puja / Anushthan';
  const subject = isPuja
    ? `Puja booking: ${pujaLabel} — ${data.name}`
    : data.service
      ? `Booking request: ${data.service} — ${data.name}`
      : `New enquiry from ${data.name}`;

  // No mail credentials configured yet — log it so the enquiry is at least
  // recoverable from server logs, and tell the caller it was not delivered.
  if (!apiKey || !from) {
    console.warn(
      '[booking] RESEND_API_KEY/BOOKING_EMAIL_FROM not set — email not sent. Enquiry:',
      JSON.stringify(data)
    );
    return { delivered: false };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject,
      html: isPuja ? buildPujaEmail(data) : buildEmail(data),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend responded ${res.status}: ${detail}`);
  }

  return { delivered: true };
}

export async function POST(request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    pruneHits();
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

    // Honeypot: a real person never fills a field they cannot see.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ ok: true });
    }

    const kind = body.kind === 'puja' ? 'puja' : 'contact';
    const { errors, clean } = kind === 'puja' ? validatePuja(body) : validate(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const { delivered } = await sendEmail(clean, kind);

    return NextResponse.json({ ok: true, delivered });
  } catch (error) {
    console.error('[booking] Failed to process request:', error);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong on our side. Please try again or call us.' },
      { status: 500 }
    );
  }
}
