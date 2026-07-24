'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, RefreshCw, FileText, Inbox, ArrowRight } from 'lucide-react';
import { KUNDALI_STATUSES, STATUS_KEYS, STATUS_LABEL, STATUS_STYLE } from '@/lib/kundaliStatusMeta';

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent || 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

export default function KundaliAdminClient() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const qs = filter === 'all' ? '' : `?status=${filter}`;
      const res = await fetch(`/api/admin/kundali${qs}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to load.');
      setRequests(data.requests);
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kundali PDF Requests</h1>
          <p className="mt-0.5 text-sm text-gray-500">Written horoscope report requests from the website.</p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          <StatCard label="Total" value={stats.total} />
          {KUNDALI_STATUSES.map((s) => (
            <StatCard key={s.key} label={s.label} value={stats.statusCounts?.[s.key] || 0} />
          ))}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {['all', ...STATUS_KEYS].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-amber-600 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="flex items-center gap-2 py-10 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading requests…
        </p>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <Inbox className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-500">No requests here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <Link
              key={req.id}
              href={`/admin/kundali/${req.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-md"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-amber-700">{req.code}</span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[req.status] || ''}`}>
                    {STATUS_LABEL[req.status] || req.status}
                  </span>
                  {req.hasPdf && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-800">
                      <FileText className="h-3 w-3" /> PDF
                    </span>
                  )}
                </div>
                <p className="mt-1 font-semibold text-gray-900">{req.name}</p>
                <p className="text-sm text-gray-500">
                  {req.phone} · {req.language} · DOB {req.dob} · {formatDate(req.createdAt)}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700">
                Open <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
