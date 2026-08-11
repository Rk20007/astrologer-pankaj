import { getCollection } from '@/lib/mongodb';

const COLLECTION = 'settings';
const DOC_ID = 'availability';

// Consultants that accept timed appointments, keyed by a canonical id. Their
// slots are picked in the booking modal; everything else on the site is a
// simple enquiry. All bookings for one person share a single key, so a slot
// booked from any surface (appointments, pricing, home) blocks it everywhere.
export const CONSULTANTS = {
  bhawna: 'Bhawna Upadhyay',
  pankaj: 'Pankaj Ji',
};

// Different pages refer to the same person by different ids — map them all to
// the canonical key. Returns null for anything that is not a consultant.
const CONSULTANT_ALIASES = {
  bhawna: 'bhawna',
  'bhawna-upadhyay': 'bhawna',
  pankaj: 'pankaj',
  'pankaj-ji': 'pankaj',
  'pankaj-sir': 'pankaj',
};

export function resolveConsultant(id) {
  return CONSULTANT_ALIASES[id] || null;
}

export function isConsultant(id) {
  return Boolean(resolveConsultant(id));
}

// Sensible starting schedule the admin can edit: open Mon–Sat 10:00–18:00 in
// 30-minute slots, closed on Sunday.
export const DEFAULT_AVAILABILITY = {
  slotMinutes: 30,
  days: {
    0: { enabled: false, start: '10:00', end: '18:00' }, // Sunday
    1: { enabled: true, start: '10:00', end: '18:00' },
    2: { enabled: true, start: '10:00', end: '18:00' },
    3: { enabled: true, start: '10:00', end: '18:00' },
    4: { enabled: true, start: '10:00', end: '18:00' },
    5: { enabled: true, start: '10:00', end: '18:00' },
    6: { enabled: true, start: '10:00', end: '14:00' }, // Saturday
  },
  offDates: [], // specific YYYY-MM-DD dates with no bookings at all
  // Individual times taken off the calendar, e.g. { '2026-08-20': ['11:00'] }.
  // The rest of that day stays bookable.
  blockedSlots: {},
};

const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;
const YMD = /^\d{4}-\d{2}-\d{2}$/;

// Everything on this site is scheduled in Indian time, whatever timezone the
// server happens to run in — otherwise a slot at 20:00 IST would still look
// bookable to a UTC server at 16:00 IST.
export const SITE_TIMEZONE = 'Asia/Kolkata';

const zoneFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: SITE_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** The current date ("YYYY-MM-DD") and time ("HH:MM") in the site's timezone. */
export function nowParts(at = new Date()) {
  const parts = Object.fromEntries(
    zoneFormatter.formatToParts(at).map((p) => [p.type, p.value])
  );
  // Some runtimes still report midnight as hour 24 — normalise it.
  const hour = parts.hour === '24' ? '00' : parts.hour;
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${hour}:${parts.minute}`,
  };
}

/** Today's date ("YYYY-MM-DD") in the site's timezone. */
export function todayStr() {
  return nowParts().date;
}

export function isValidDate(dateStr) {
  return typeof dateStr === 'string' && YMD.test(dateStr);
}

export function isValidTime(value) {
  return typeof value === 'string' && HHMM.test(value);
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function fromMinutes(min) {
  const h = String(Math.floor(min / 60)).padStart(2, '0');
  const m = String(min % 60).padStart(2, '0');
  return `${h}:${m}`;
}

/** Day of week (0=Sun..6=Sat) for a YYYY-MM-DD string, timezone-independent. */
export function weekdayOf(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/**
 * Generates the list of slot start times ("HH:MM") for a day's window. The last
 * slot must finish on or before `end`, so a 10:00–18:00 window at 30 min stops
 * at 17:30.
 */
export function generateSlots(dayConfig, slotMinutes) {
  if (!dayConfig?.enabled) return [];
  const start = toMinutes(dayConfig.start);
  const end = toMinutes(dayConfig.end);
  const step = Math.max(5, Number(slotMinutes) || 30);
  const out = [];
  for (let t = start; t + step <= end; t += step) out.push(fromMinutes(t));
  return out;
}

/** Coerces a raw (possibly partial / untrusted) object into a valid config. */
export function normaliseConfig(raw) {
  const base = raw && typeof raw === 'object' ? raw : {};
  const slotMinutes = [15, 20, 30, 45, 60, 90].includes(Number(base.slotMinutes))
    ? Number(base.slotMinutes)
    : DEFAULT_AVAILABILITY.slotMinutes;

  const days = {};
  for (let d = 0; d <= 6; d += 1) {
    const src = base.days?.[d] || base.days?.[String(d)] || DEFAULT_AVAILABILITY.days[d];
    const start = isValidTime(src.start) ? src.start : DEFAULT_AVAILABILITY.days[d].start;
    const end = isValidTime(src.end) ? src.end : DEFAULT_AVAILABILITY.days[d].end;
    // A window that does not move forward is treated as closed.
    const valid = toMinutes(end) > toMinutes(start);
    days[d] = { enabled: Boolean(src.enabled) && valid, start, end };
  }

  const offDates = Array.isArray(base.offDates)
    ? [...new Set(base.offDates.filter(isValidDate))].sort()
    : [];

  // { 'YYYY-MM-DD': ['HH:MM', …] } — anything malformed is dropped rather than
  // stored, and a date whose list ends up empty is removed entirely.
  const blockedSlots = {};
  const rawBlocked =
    base.blockedSlots && typeof base.blockedSlots === 'object' && !Array.isArray(base.blockedSlots)
      ? base.blockedSlots
      : {};
  for (const [date, times] of Object.entries(rawBlocked)) {
    if (!isValidDate(date) || !Array.isArray(times)) continue;
    const clean = [...new Set(times.filter(isValidTime))].sort();
    if (clean.length > 0) blockedSlots[date] = clean;
  }

  return { slotMinutes, days, offDates, blockedSlots };
}

/** The times blocked by hand on a given date. */
export function blockedSlotsFor(config, dateStr) {
  return new Set(config?.blockedSlots?.[dateStr] || []);
}

/** Reads the availability config, falling back to the default if unset. */
export async function getAvailabilityConfig() {
  try {
    const col = await getCollection(COLLECTION);
    const doc = await col.findOne({ _id: DOC_ID });
    if (doc?.value) return normaliseConfig(doc.value);
  } catch (err) {
    console.error('[availability] falling back to default config:', err.message);
  }
  return { ...DEFAULT_AVAILABILITY };
}

/**
 * Saves (upserts) the availability config after normalising it. Blocked slots
 * for days that have already gone by are dropped, so the document does not grow
 * forever.
 */
export async function setAvailabilityConfig(raw) {
  const value = normaliseConfig(raw);
  const today = todayStr();
  value.blockedSlots = Object.fromEntries(
    Object.entries(value.blockedSlots).filter(([date]) => date >= today)
  );
  const col = await getCollection(COLLECTION);
  await col.updateOne(
    { _id: DOC_ID },
    { $set: { value, updatedAt: new Date() } },
    { upsert: true }
  );
  return value;
}

/**
 * Builds the bookable slots for a date given the config and the set of slots
 * already taken.
 *
 * Returns { closed, reason, slots:[{time, available, reason}] } where a slot's
 * `reason` says *why* it cannot be taken — 'past', 'blocked' (switched off by
 * hand in the admin panel) or 'booked'.
 *
 * Options:
 *   now       — { date, time } to treat as "now" (defaults to real time in IST)
 *   allowPast — keep past dates/times as available (used by the admin panel,
 *               which may need to record something after the fact)
 */
export function buildDaySlots(config, dateStr, bookedSet = new Set(), options = {}) {
  const { now = nowParts(), allowPast = false } = options;

  if (!isValidDate(dateStr)) return { closed: true, reason: 'invalid', slots: [] };

  if (!allowPast && dateStr < now.date) {
    return { closed: true, reason: 'past', slots: [] };
  }

  if (config.offDates?.includes(dateStr)) {
    return { closed: true, reason: 'off', slots: [] };
  }

  const dayConfig = config.days[weekdayOf(dateStr)];
  if (!dayConfig?.enabled) {
    return { closed: true, reason: 'weekly-off', slots: [] };
  }

  const blocked = blockedSlotsFor(config, dateStr);

  const slots = generateSlots(dayConfig, config.slotMinutes).map((time) => {
    const isPast = !allowPast && dateStr === now.date && time <= now.time;
    const reason = isPast ? 'past' : blocked.has(time) ? 'blocked' : bookedSet.has(time) ? 'booked' : null;
    return { time, available: reason === null, reason };
  });

  return { closed: false, reason: null, slots };
}
