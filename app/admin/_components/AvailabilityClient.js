'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, X, CheckCircle2 } from 'lucide-react';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SLOT_LENGTHS = [15, 20, 30, 45, 60, 90];

function todayStr() {
  const now = new Date();
  const off = now.getTimezoneOffset();
  return new Date(now.getTime() - off * 60_000).toISOString().slice(0, 10);
}

export default function AvailabilityClient() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [newOffDate, setNewOffDate] = useState('');

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
