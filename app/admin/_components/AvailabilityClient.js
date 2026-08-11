'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, X, CheckCircle2, Ban, CalendarDays } from 'lucide-react';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SLOT_LENGTHS = [15, 20, 30, 45, 60, 90];

function todayStr() {
  const now = new Date();
  const off = now.getTimezoneOffset();
  return new Date(now.getTime() - off * 60_000).toISOString().slice(0, 10);
}

/** Day of week (0=Sun) for a YYYY-MM-DD string, without timezone drift. */
function weekdayOf(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function fromMinutes(min) {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}

/**
 * The slot times a date would have under the config currently on screen —
 * computed here rather than fetched, so unsaved changes to the working hours
 * are reflected straight away.
 */
function slotsForDate(config, dateStr) {
  if (!dateStr) return [];
  if (config.offDates?.includes(dateStr)) return [];
  const day = config.days[weekdayOf(dateStr)] || config.days[String(weekdayOf(dateStr))];
  if (!day?.enabled) return [];
  const step = Math.max(5, Number(config.slotMinutes) || 30);
  const start = toMinutes(day.start);
  const end = toMinutes(day.end);
  const out = [];
  for (let t = start; t + step <= end; t += step) out.push(fromMinutes(t));
  return out;
}

function formatSlot(time) {
  const [h, m] = time.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${period}`;
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Turns single times off on a chosen date — for the days that are working days
 * but where one or two hours are not free. A time that already has an
 * appointment in it is shown as booked instead: the way to clear that is to
 * cancel or reschedule the booking on the Leads page.
 */
function BlockedSlotsPanel({ config, slotDate, setSlotDate, dayInfo, onToggle, onSetAll, onClearDate }) {
  const times = slotsForDate(config, slotDate);
  const blocked = config.blockedSlots?.[slotDate] || [];
  const bookedAt = new Map(
    (dayInfo.slots || []).filter((s) => s.bookings?.length > 0).map((s) => [s.time, s.bookings])
  );
  const pastAt = new Set((dayInfo.slots || []).filter((s) => s.past).map((s) => s.time));
  const blockable = times.filter((t) => !bookedAt.has(t));
  const blockedDates = Object.keys(config.blockedSlots || {}).sort();

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-1 text-sm font-semibold text-gray-900">Block individual times</h2>
      <p className="mb-4 text-sm text-gray-500">
        Pick a date to see its slots, then switch off any time you are not free. Blocked times
        disappear from the booking form on the website; the rest of the day stays open.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="date"
          min={todayStr()}
          value={slotDate}
          onChange={(e) => setSlotDate(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
        />
        {slotDate && times.length > 0 && (
          <>
            <button
              onClick={() => onSetAll(slotDate, blockable, true)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Block all
            </button>
            <button
              onClick={() => onClearDate(slotDate)}
              disabled={blocked.length === 0}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              Unblock all
            </button>
          </>
        )}
      </div>

      {!slotDate && (
        <p className="flex items-center gap-2 text-sm text-gray-400">
          <CalendarDays className="h-4 w-4" /> Choose a date to see its time slots.
        </p>
      )}

      {slotDate && dayInfo.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{dayInfo.error}</p>
      )}

      {slotDate && !dayInfo.error && times.length === 0 && (
        <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-500">
          {config.offDates?.includes(slotDate)
            ? 'This date is marked as a day off, so there are no slots to block.'
            : 'This weekday is switched off above, so there are no slots on it.'}
        </p>
      )}

      {slotDate && times.length > 0 && (
        <>
          {dayInfo.loading && (
            <p className="mb-2 flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking existing bookings…
            </p>
          )}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {times.map((time) => {
              const bookings = bookedAt.get(time);
              const isBlocked = blocked.includes(time);
              const isPast = pastAt.has(time);

              if (bookings) {
                return (
                  <div
                    key={time}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-left"
                    title={bookings.map((b) => `${b.name} (${b.consultantName})`).join(', ')}
                  >
                    <span className="block text-sm font-semibold text-emerald-800">
                      {formatSlot(time)}
                    </span>
                    <span className="block truncate text-[11px] text-emerald-700">
                      Booked · {bookings.map((b) => b.name).join(', ')}
                    </span>
                  </div>
                );
              }

              return (
                <button
                  key={time}
                  onClick={() => onToggle(slotDate, time)}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                    isBlocked
                      ? 'border-red-200 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                    {isBlocked && <Ban className="h-3.5 w-3.5" />}
                    {formatSlot(time)}
                  </span>
                  <span className="block text-[11px] text-gray-400">
                    {isBlocked ? 'Blocked — click to open' : isPast ? 'Already gone by' : 'Open — click to block'}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {blockedDates.length > 0 && (
        <div className="mt-5 border-t border-gray-100 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Dates with blocked times
          </p>
          <div className="flex flex-wrap gap-2">
            {blockedDates.map((date) => (
              <span
                key={date}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700"
              >
                <button onClick={() => setSlotDate(date)} className="hover:underline">
                  {formatDate(date)} · {config.blockedSlots[date].length} blocked
                </button>
                <button onClick={() => onClearDate(date)} aria-label={`Clear blocked times on ${date}`}>
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AvailabilityClient() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [newOffDate, setNewOffDate] = useState('');
  // "Block individual times" panel.
  const [slotDate, setSlotDate] = useState('');
  const [dayInfo, setDayInfo] = useState({ loading: false, slots: [], error: '' });

  useEffect(() => {
    fetch('/api/admin/availability')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setConfig(data.config);
        else setError(data.error || 'Failed to load.');
      })
      .catch(() => setError('Failed to load availability.'))
      .finally(() => setLoading(false));
  }, []);

  function updateDay(index, patch) {
    setSaved(false);
    setConfig((c) => ({ ...c, days: { ...c.days, [index]: { ...c.days[index], ...patch } } }));
  }

  function addOffDate() {
    if (!newOffDate) return;
    setSaved(false);
    setConfig((c) => ({
      ...c,
      offDates: [...new Set([...(c.offDates || []), newOffDate])].sort(),
    }));
    setNewOffDate('');
  }

  function removeOffDate(date) {
    setSaved(false);
    setConfig((c) => ({ ...c, offDates: c.offDates.filter((d) => d !== date) }));
  }

  // Who is booked on the selected date — needed so a time that already has an
  // appointment in it is shown as taken rather than as free to block.
  const loadDay = useCallback((date) => {
    if (!date) {
      setDayInfo({ loading: false, slots: [], error: '' });
      return;
    }
    setDayInfo({ loading: true, slots: [], error: '' });
    fetch(`/api/admin/availability/day?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) throw new Error(data.error || 'Could not load that day.');
        setDayInfo({ loading: false, slots: data.slots, error: '' });
      })
      .catch((err) => setDayInfo({ loading: false, slots: [], error: err.message }));
  }, []);

  useEffect(() => {
    loadDay(slotDate);
  }, [slotDate, loadDay]);

  function toggleSlot(date, time) {
    setSaved(false);
    setConfig((c) => {
      const current = c.blockedSlots?.[date] || [];
      const next = current.includes(time)
        ? current.filter((t) => t !== time)
        : [...current, time].sort();
      const blockedSlots = { ...(c.blockedSlots || {}) };
      if (next.length > 0) blockedSlots[date] = next;
      else delete blockedSlots[date];
      return { ...c, blockedSlots };
    });
  }

  function setAllSlots(date, times, blocked) {
    setSaved(false);
    setConfig((c) => {
      const blockedSlots = { ...(c.blockedSlots || {}) };
      if (blocked && times.length > 0) blockedSlots[date] = [...times].sort();
      else delete blockedSlots[date];
      return { ...c, blockedSlots };
    });
  }

  function clearBlockedDate(date) {
    setSaved(false);
    setConfig((c) => {
      const blockedSlots = { ...(c.blockedSlots || {}) };
      delete blockedSlots[date];
      return { ...c, blockedSlots };
    });
  }

  async function save() {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Save failed.');
      setConfig(data.config);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="flex items-center gap-2 py-10 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading availability…
      </p>
    );
  }

  if (!config) {
    return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error || 'Could not load.'}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Appointment Availability</h1>
      <p className="mt-0.5 mb-6 text-sm text-gray-500">
        Set the working hours for each day. Booking slots are generated automatically, and any slot
        already booked is shown as unavailable to visitors.
      </p>

      {/* Slot length */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <label className="block text-sm font-semibold text-gray-900">Slot length</label>
        <p className="mb-3 text-sm text-gray-500">How long each appointment slot is.</p>
        <div className="flex flex-wrap gap-2">
          {SLOT_LENGTHS.map((m) => (
            <button
              key={m}
              onClick={() => {
                setSaved(false);
                setConfig((c) => ({ ...c, slotMinutes: m }));
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                config.slotMinutes === m
                  ? 'bg-amber-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {m} min
            </button>
          ))}
        </div>
      </div>

      {/* Weekly hours */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-gray-900">Weekly working hours</h2>
        <p className="mb-4 text-sm text-gray-500">Turn a day off to stop taking bookings on it entirely.</p>
        <div className="space-y-2">
          {DAY_NAMES.map((name, index) => {
            const day = config.days[index] || config.days[String(index)];
            return (
              <div
                key={index}
                className={`flex flex-wrap items-center gap-3 rounded-lg border p-3 ${
                  day.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <label className="flex w-32 items-center gap-2 font-medium text-gray-800">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={(e) => updateDay(index, { enabled: e.target.checked })}
                    className="h-4 w-4 accent-amber-600"
                  />
                  {name}
                </label>

                {day.enabled ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="time"
                      value={day.start}
                      onChange={(e) => updateDay(index, { start: e.target.value })}
                      className="rounded-lg border border-gray-200 px-2 py-1.5 focus:border-amber-400 focus:outline-none"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={day.end}
                      onChange={(e) => updateDay(index, { end: e.target.value })}
                      className="rounded-lg border border-gray-200 px-2 py-1.5 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Closed</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Off dates */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-gray-900">Days off / holidays</h2>
        <p className="mb-4 text-sm text-gray-500">
          Block specific dates (e.g. a holiday). No bookings can be made on these days even if the
          weekday is normally open.
        </p>

        <div className="mb-4 flex items-center gap-2">
          <input
            type="date"
            min={todayStr()}
            value={newOffDate}
            onChange={(e) => setNewOffDate(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
          <button
            onClick={addOffDate}
            disabled={!newOffDate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" /> Add day off
          </button>
        </div>

        {config.offDates?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {config.offDates.map((date) => (
              <span
                key={date}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700"
              >
                {date}
                <button onClick={() => removeOffDate(date)} aria-label={`Remove ${date}`}>
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No days off set.</p>
        )}
      </div>

      {/* Individual blocked times */}
      <BlockedSlotsPanel
        config={config}
        slotDate={slotDate}
        setSlotDate={setSlotDate}
        dayInfo={dayInfo}
        onToggle={toggleSlot}
        onSetAll={setAllSlots}
        onClearDate={clearBlockedDate}
      />

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <div className="sticky bottom-0 flex items-center gap-3 border-t border-gray-200 bg-gray-100 py-4">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
