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
} from 'lucide-react';

const STATUSES = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'];

const STATUS_STYLE = {
  new: 'bg-amber-100 text-amber-800 border-amber-200',
  contacted: 'bg-blue-100 text-blue-800 border-blue-200',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  completed: 'bg-gray-100 text-gray-700 border-gray-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

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

export default function LeadsClient() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const qs = filter === 'all' ? '' : `?status=${filter}`;
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
          <StatCard label="Confirmed" value={stats.statusCounts?.confirmed || 0} accent="text-blue-600" />
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {['all', ...STATUSES].map((f) => (
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
                        <Calendar className="h-3.5 w-3.5" /> {lead.date}
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
    </div>
  );
}
