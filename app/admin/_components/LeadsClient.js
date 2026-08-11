'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Loader2,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Clock,
  RefreshCw,
  Inbox,
  CalendarClock,
  AlertTriangle,
  History,
  X,
} from 'lucide-react';

const STATUSES = ['new', 'contacted', 'confirmed', 'rescheduled', 'completed', 'missed', 'cancelled'];

const STATUS_STYLE = {
  new: 'bg-amber-100 text-amber-800 border-amber-200',
  contacted: 'bg-blue-100 text-blue-800 border-blue-200',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rescheduled: 'bg-violet-100 text-violet-800 border-violet-200',
  completed: 'bg-gray-100 text-gray-700 border-gray-200',
  missed: 'bg-orange-100 text-orange-800 border-orange-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

// Appointments still waiting to happen — once their time goes by without one of
// these being cleared, the booking counts as missed and wants rescheduling.
const OPEN_STATUSES = ['new', 'contacted', 'confirmed', 'rescheduled'];

const KIND_LABEL = {
  consultation: 'Consultation',
  contact: 'Enquiry',
  puja: 'Puja',
};

function formatSlot(time) {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

/** Now, in Indian time — the schedule is kept in IST wherever the admin is. */
function nowParts() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value])
  );
  const hour = parts.hour === '24' ? '00' : parts.hour;
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${hour}:${parts.minute}` };
}

/** An appointment whose time has gone by while it was still open. */
function isMissed(lead, now) {
  if (lead.kind !== 'consultation' || !lead.date) return false;
  if (!OPEN_STATUSES.includes(lead.status)) return false;
  if (lead.date < now.date) return true;
  return lead.date === now.date && Boolean(lead.slot) && lead.slot <= now.time;
}

function formatDay(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent || 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

/**
 * Moves one appointment to another date and time. The slots come from the live
 * availability config, so a time that is booked, blocked or already gone by
 * cannot be picked by accident — though the admin can knowingly override the
 * schedule (a slot outside working hours, say) with "book it anyway". Two
 * bookings can never end up in the same slot, override or not.
 */
function RescheduleDialog({ lead, onClose, onDone }) {
  const now = nowParts();
  const [date, setDate] = useState(lead.date && lead.date >= now.date ? lead.date : now.date);
  const [slot, setSlot] = useState('');
  const [day, setDay] = useState({ loading: true, slots: [], closed: false, reason: null, error: '' });
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [override, setOverride] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSlot('');
    setError('');
    setDay({ loading: true, slots: [], closed: false, reason: null, error: '' });

    const qs = new URLSearchParams({
      date,
      consultant: lead.cardId || '',
      excludeLead: lead.id,
    });
    fetch(`/api/admin/availability/day?${qs}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.ok) throw new Error(data.error || 'Could not load that day.');
        setDay({ loading: false, slots: data.slots, closed: data.closed, reason: data.reason, error: '' });
      })
      .catch((err) => {
        if (!cancelled) setDay({ loading: false, slots: [], closed: false, reason: null, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [date, lead.cardId, lead.id]);

  function slotState(s) {
    if (s.bookings?.length > 0) return { ok: false, label: `Booked · ${s.bookings[0].name}` };
    if (s.blocked) return { ok: false, label: 'Blocked' };
    if (s.past) return { ok: false, label: 'Gone by' };
    return { ok: true, label: 'Free' };
  }

  async function submit() {
    if (!slot) {
      setError('Please choose a new time.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, slot, note, force: override }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(
          data.overridable && !override
            ? `${data.error} Tick “book it anyway” to override.`
            : data.error || 'Could not reschedule this appointment.'
        );
        setSaving(false);
        return;
      }
      onDone(data.lead);
    } catch {
      setError('Could not reach the server. Please try again.');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-gray-900/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Reschedule appointment"
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-5">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-900">Reschedule appointment</h2>
            <p className="mt-0.5 truncate text-sm text-gray-500">
              {lead.name}
              {lead.date ? ` · currently ${formatDay(lead.date)} at ${formatSlot(lead.slot)}` : ''}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">New date</label>
            <input
              type="date"
              value={date}
              min={override ? undefined : now.date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">New time</p>

            {day.loading && (
              <p className="flex items-center gap-2 py-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading times…
              </p>
            )}

            {!day.loading && day.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{day.error}</p>
            )}

            {!day.loading && !day.error && day.slots.length === 0 && (
              <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">
                No slots on this day — it is a day off or outside the weekly working hours. Pick
                another date, or enter a time below with “book it anyway”.
              </p>
            )}

            {!day.loading && day.slots.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {day.slots.map((s) => {
                  const state = slotState(s);
                  const disabled = !state.ok && !(override && !s.bookings?.length);
                  return (
                    <button
                      key={s.time}
                      type="button"
                      disabled={disabled}
                      title={state.label}
                      onClick={() => setSlot(s.time)}
                      className={`rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${
                        slot === s.time
                          ? 'border-amber-600 bg-amber-600 text-white'
                          : disabled
                            ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300 line-through'
                            : state.ok
                              ? 'border-gray-200 bg-white text-gray-700 hover:border-amber-400 hover:bg-amber-50'
                              : 'border-orange-200 bg-orange-50 text-orange-700'
                      }`}
                    >
                      {formatSlot(s.time)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {(override || day.slots.length === 0) && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Or type a time (24h)
              </label>
              <input
                type="time"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Why it moved — kept in the booking's history"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={override}
              onChange={(e) => setOverride(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-amber-600"
            />
            <span>
              Book it anyway — ignore working hours, days off and blocked times. A slot another
              client already holds still cannot be used.
            </span>
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 p-4">
          <button onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving || !slot}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Rescheduling…' : 'Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LeadsClient() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [rescheduling, setRescheduling] = useState(null);
  const [now] = useState(nowParts);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const qs =
        filter === 'all' ? '' : filter === 'needs reschedule' ? '?missed=1' : `?status=${filter}`;
      const res = await fetch(`/api/admin/leads${qs}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to load leads.');
      setLeads(data.leads);
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(id, status) {
    setBusyId(id);
    // Optimistic update.
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      // Refresh stats quietly.
      const s = await fetch('/api/admin/leads').then((r) => r.json()).catch(() => null);
      if (s?.ok) setStats(s.stats);
    } catch {
      setError('Could not update status. Reloading.');
      load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this lead permanently?')) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setError('Could not delete lead.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Every booking and enquiry that comes in from the website.
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total leads" value={stats.total} />
          <StatCard label="New / unread" value={stats.new} accent="text-amber-600" />
          <StatCard label="Upcoming appts" value={stats.upcoming} accent="text-emerald-600" />
          <StatCard
            label="Missed — reschedule"
            value={stats.missed || 0}
            accent={stats.missed ? 'text-orange-600' : 'text-gray-900'}
          />
        </div>
      )}

      {stats?.missed > 0 && filter !== 'needs reschedule' && (
        <button
          onClick={() => setFilter('needs reschedule')}
          className="mb-4 flex w-full items-center justify-between gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-left transition-colors hover:bg-orange-100"
        >
          <span className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-orange-600" />
            <span>
              <span className="block text-sm font-semibold text-orange-900">
                {stats.missed} appointment{stats.missed === 1 ? '' : 's'} went by without being closed off
              </span>
              <span className="block text-sm text-orange-700">
                Give each one a new date and time, or mark it completed / cancelled.
              </span>
            </span>
          </span>
          <span className="shrink-0 text-sm font-semibold text-orange-700">Show them →</span>
        </button>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'needs reschedule', ...STATUSES].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-amber-600 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="flex items-center gap-2 py-10 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading leads…
        </p>
      ) : leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <Inbox className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-500">No leads yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            New enquiries and bookings from the website will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900">{lead.name}</p>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      {KIND_LABEL[lead.kind] || lead.kind}
                    </span>
                    {/* {lead.delivered === false && (
                      <span
                        title="Notification email was not delivered"
                        className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600"
                      >
                        email failed
                      </span>
                    )} */}
                  </div>

                  {lead.service && (
                    <p className="mt-1 text-sm font-medium text-amber-700">{lead.service}</p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 hover:text-amber-700">
                      <Phone className="h-3.5 w-3.5" /> {lead.phone}
                    </a>
                    <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 hover:text-amber-700">
                      <Mail className="h-3.5 w-3.5" /> {lead.email}
                    </a>
                    {lead.date && (
                      <span className="inline-flex items-center gap-1.5 font-medium text-gray-800">
                        <Calendar className="h-3.5 w-3.5" /> {formatDay(lead.date)}
                      </span>
                    )}
                    {lead.slot && (
                      <span className="inline-flex items-center gap-1.5 font-medium text-gray-800">
                        <Clock className="h-3.5 w-3.5" /> {formatSlot(lead.slot)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                      STATUS_STYLE[lead.status] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              </div>

              {isMissed(lead, now) && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5">
                  <p className="flex items-center gap-2 text-sm font-medium text-orange-800">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    This appointment&rsquo;s time has passed and it is still open — reschedule it or
                    close it off.
                  </p>
                  <button
                    onClick={() => setRescheduling(lead)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-700"
                  >
                    <CalendarClock className="h-4 w-4" /> Reschedule
                  </button>
                </div>
              )}

              {lead.rescheduleHistory?.length > 0 && (
                <div className="mt-3 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-800">
                  <p className="flex items-center gap-1.5 font-semibold">
                    <History className="h-3.5 w-3.5" />
                    Rescheduled {lead.rescheduleHistory.length}{' '}
                    {lead.rescheduleHistory.length === 1 ? 'time' : 'times'}
                  </p>
                  <ul className="mt-1 space-y-0.5 text-[13px] text-violet-700">
                    {lead.rescheduleHistory.map((entry, i) => (
                      <li key={i}>
                        {entry.from?.date ? `${formatDay(entry.from.date)} ${formatSlot(entry.from.slot)}` : '—'}
                        {' → '}
                        {formatDay(entry.to?.date)} {formatSlot(entry.to?.slot)}
                        {entry.note ? ` · ${entry.note}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(lead.message || lead.notes || lead.yajmanName) && (
                <div className="mt-3 space-y-1 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                  {lead.yajmanName && (
                    <p>
                      <span className="font-semibold">Yajman:</span> {lead.yajmanName}
                      {lead.gotra ? ` · Gotra ${lead.gotra}` : ''}
                      {lead.fathersName ? ` · Father ${lead.fathersName}` : ''}
                    </p>
                  )}
                  {lead.message && <p className="whitespace-pre-wrap">{lead.message}</p>}
                  {lead.notes && <p className="whitespace-pre-wrap">{lead.notes}</p>}
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-400">Received {formatDateTime(lead.createdAt)}</p>
                <div className="flex items-center gap-2">
                  {lead.kind === 'consultation' && (
                    <button
                      onClick={() => setRescheduling(lead)}
                      disabled={busyId === lead.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-amber-400 hover:bg-amber-50 disabled:opacity-50"
                    >
                      <CalendarClock className="h-4 w-4" /> Reschedule
                    </button>
                  )}
                  <select
                    value={lead.status}
                    disabled={busyId === lead.id}
                    onChange={(e) => changeStatus(lead.id, e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm font-medium text-gray-700 focus:border-amber-400 focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => remove(lead.id)}
                    disabled={busyId === lead.id}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label="Delete lead"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rescheduling && (
        <RescheduleDialog
          lead={rescheduling}
          onClose={() => setRescheduling(null)}
          onDone={(updated) => {
            setRescheduling(null);
            setLeads((prev) =>
              // The "needs reschedule" view is about appointments still waiting
              // to be moved, so one that just was drops out of the list.
              filter === 'needs reschedule'
                ? prev.filter((l) => l.id !== updated.id)
                : prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l))
            );
            fetch('/api/admin/leads')
              .then((r) => r.json())
              .then((s) => s?.ok && setStats(s.stats))
              .catch(() => {});
          }}
        />
      )}
    </div>
  );
}
