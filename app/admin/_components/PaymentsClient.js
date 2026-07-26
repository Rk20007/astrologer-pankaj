'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Loader2,
  RefreshCw,
  IndianRupee,
  Check,
  X,
  Copy,
  Phone,
  Mail,
  ChevronDown,
} from 'lucide-react';
import {
  PAYMENT_STATUSES,
  PAYMENT_STATUS_KEYS,
  PAYMENT_STATUS_LABEL,
  PAYMENT_STATUS_STYLE,
  PAYMENT_KIND_LABEL,
} from '@/lib/paymentMeta';

function formatDateTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatINR(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent || 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function PaymentRow({ payment, onReview, busyId }) {
  const [open, setOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [copied, setCopied] = useState(false);
  const busy = busyId === payment.id;
  const pending = payment.status === 'pending_verification';

  async function copyUtr() {
    try {
      await navigator.clipboard.writeText(payment.utr);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked — the UTR is on screen and can be selected by hand.
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-bold text-amber-700">{payment.code}</span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                PAYMENT_STATUS_STYLE[payment.status] || ''
              }`}
            >
              {PAYMENT_STATUS_LABEL[payment.status] || payment.status}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              {PAYMENT_KIND_LABEL[payment.kind] || payment.kind}
            </span>
          </div>

          <p className="mt-1.5 text-lg font-bold text-gray-900">
            {formatINR(payment.amount)}{' '}
            <span className="text-sm font-medium text-gray-500">· {payment.name}</span>
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              UTR
              <button
                onClick={copyUtr}
                title="Copy UTR"
                className="inline-flex items-center gap-1 rounded border border-gray-200 px-1.5 py-0.5 font-mono text-xs font-bold text-gray-800 hover:bg-gray-50"
              >
                {payment.utr}
                {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              </button>
            </span>
            <span>{payment.method === 'bank' ? 'Bank transfer' : 'UPI'}</span>
            {payment.paidAt && <span>Paid {payment.paidAt}</span>}
            <span>Submitted {formatDateTime(payment.createdAt)}</span>
          </div>

          {(payment.service || payment.refCode) && (
            <p className="mt-1 text-sm text-gray-500">
              {payment.service}
              {payment.refCode && (
                <>
                  {payment.service ? ' · ' : ''}
                  <span className="font-mono font-semibold text-gray-700">{payment.refCode}</span>
                </>
              )}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex gap-2">
            <a
              href={`tel:${payment.phone}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              title={payment.phone}
            >
              <Phone className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/${String(payment.phone).replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-green-600 hover:bg-green-50"
              title="WhatsApp"
            >
              WA
            </a>
            {payment.email && (
              <a
                href={`mailto:${payment.email}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                title={payment.email}
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              aria-expanded={open}
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {pending && (
            <div className="flex gap-2">
              <button
                onClick={() => onReview(payment.id, 'approved', reviewNote)}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Approve
              </button>
              <button
                onClick={() => onReview(payment.id, 'rejected', reviewNote)}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <X className="h-4 w-4" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="space-y-3 border-t border-gray-100 bg-gray-50/60 p-4">
          <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            <p>
              <span className="text-gray-500">Phone:</span>{' '}
              <span className="font-medium text-gray-900">{payment.phone}</span>
            </p>
            <p>
              <span className="text-gray-500">Email:</span>{' '}
              <span className="font-medium text-gray-900">{payment.email || '—'}</span>
            </p>
            <p>
              <span className="text-gray-500">Booking ref:</span>{' '}
              <span className="font-medium text-gray-900">{payment.refCode || payment.refId || '—'}</span>
            </p>
            <p>
              <span className="text-gray-500">Reviewed:</span>{' '}
              <span className="font-medium text-gray-900">
                {payment.reviewedAt ? formatDateTime(payment.reviewedAt) : 'Not yet'}
              </span>
            </p>
          </div>

          {payment.note && (
            <div>
              <p className="text-sm text-gray-500">Client note</p>
              <p className="mt-1 whitespace-pre-wrap rounded-lg bg-white p-3 text-sm text-gray-800">
                {payment.note}
              </p>
            </div>
          )}

          {payment.reviewNote && (
            <div>
              <p className="text-sm text-gray-500">Review note</p>
              <p className="mt-1 whitespace-pre-wrap rounded-lg bg-white p-3 text-sm text-gray-800">
                {payment.reviewNote}
              </p>
            </div>
          )}

          {pending && (
            <div>
              <label className="mb-1.5 block text-sm text-gray-500">
                Review note (shown to the client if you reject)
              </label>
              <input
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="e.g. Amount received and matched against the statement."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PaymentsClient() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('pending_verification');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const qs = filter === 'all' ? '' : `?status=${filter}`;
      const res = await fetch(`/api/admin/payments${qs}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to load.');
      setPayments(data.payments);
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

  async function review(id, status, reviewNote) {
    setBusyId(id);
    setError('');
    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewNote }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Update failed.');
      // Reload so the list respects the current filter and the stats stay right.
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            UPI payments submitted from the website. Check each UTR against the bank statement before
            approving.
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
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard label="Total" value={stats.total} />
          {PAYMENT_STATUSES.map((s) => (
            <StatCard
              key={s.key}
              label={s.label}
              value={stats.statusCounts?.[s.key] || 0}
              accent={
                s.key === 'approved'
                  ? 'text-emerald-600'
                  : s.key === 'rejected'
                    ? 'text-red-600'
                    : 'text-amber-600'
              }
            />
          ))}
          <StatCard label="Approved value" value={formatINR(stats.approvedAmount)} accent="text-gray-900" />
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {['all', ...PAYMENT_STATUS_KEYS].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-amber-600 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : PAYMENT_STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="flex items-center gap-2 py-10 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading payments…
        </p>
      ) : payments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <IndianRupee className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-500">No payments here.</p>
          <p className="mt-1 text-sm text-gray-400">
            Payments submitted through the website will appear in this list.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <PaymentRow key={payment.id} payment={payment} onReview={review} busyId={busyId} />
          ))}
        </div>
      )}
    </div>
  );
}
