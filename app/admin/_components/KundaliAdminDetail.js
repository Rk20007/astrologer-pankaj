'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Loader2,
  ArrowLeft,
  Download,
  Upload,
  FileText,
  CheckCircle2,
  StickyNote,
  Mail,
  Phone,
} from 'lucide-react';
import { KUNDALI_STATUSES, STATUS_LABEL, STATUS_STYLE } from '@/lib/kundaliStatusMeta';

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

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-gray-100 py-2.5 sm:flex-row sm:justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

export default function KundaliAdminDetail({ id }) {
  const [request, setRequest] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/kundali/${id}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to load.');
      setRequest(data.request);
      setLogs(data.logs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  function applyResult(data) {
    if (data.request) setRequest(data.request);
    if (data.logs) setLogs(data.logs);
  }

  async function patch(payload) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/kundali/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Update failed.');
      applyResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(status) {
    await patch({ status });
  }

  async function addNote() {
    if (!note.trim()) return;
    await patch({ note: note.trim() });
    setNote('');
  }

  async function uploadPdf(file) {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`/api/admin/kundali/${id}/pdf`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Upload failed.');
      applyResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  if (loading) {
    return (
      <p className="flex items-center gap-2 py-10 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading request…
      </p>
    );
  }

  if (!request) {
    return (
      <div>
        <Link href="/admin/kundali" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4" /> All requests
        </Link>
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error || 'Request not found.'}</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/kundali" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft className="h-4 w-4" /> All requests
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-amber-700">{request.code}</span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[request.status] || ''}`}>
              {STATUS_LABEL[request.status] || request.status}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{request.name}</h1>
          <p className="text-sm text-gray-500">Requested {formatDateTime(request.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <a href={`tel:${request.phone}`} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Phone className="h-4 w-4" /> Call
          </a>
          <a href={`mailto:${request.email}`} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Mail className="h-4 w-4" /> Email
          </a>
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: details + PDF */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-2 font-bold text-gray-900">Birth &amp; contact details</h2>
            <DetailRow label="Email" value={request.email} />
            <DetailRow label="Mobile" value={request.phone} />
            <DetailRow label="Date of Birth" value={request.dob} />
            <DetailRow label="Time of Birth" value={request.unknownBirthTime ? 'Not known' : request.birthTime} />
            <DetailRow label="Place of Birth" value={request.birthPlace} />
            <DetailRow label="Preferred Language" value={request.language} />
            {request.questions && (
              <div className="pt-3">
                <p className="mb-1 text-sm text-gray-500">Questions / Special requirements</p>
                <p className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-sm text-gray-800">{request.questions}</p>
              </div>
            )}
          </div>

          {/* PDF upload */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 font-bold text-gray-900">Final Kundali PDF</h2>
            {request.hasPdf ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-violet-50 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-violet-700" />
                  <div>
                    <p className="font-medium text-gray-900">{request.pdf?.filename || 'kundali.pdf'}</p>
                    <p className="text-xs text-gray-500">
                      {request.pdf?.size ? `${Math.round(request.pdf.size / 1024)} KB · ` : ''}
                      Uploaded {formatDateTime(request.pdf?.uploadedAt)}
                    </p>
                  </div>
                </div>
                <a
                  href={`/api/kundali/requests/${request.id}/pdf`}
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                >
                  <Download className="h-4 w-4" /> Download
                </a>
              </div>
            ) : (
              <p className="mb-3 text-sm text-gray-500">No PDF uploaded yet.</p>
            )}

            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-4 text-sm font-medium text-gray-600 transition-colors hover:border-amber-400 hover:bg-amber-50">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? 'Uploading…' : request.hasPdf ? 'Replace PDF' : 'Upload PDF'}
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                disabled={uploading}
                onChange={(e) => uploadPdf(e.target.files?.[0])}
              />
            </label>

            <a
              href={`/api/kundali/requests/${request.id}/summary`}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:underline"
            >
              <Download className="h-4 w-4" /> Download auto request summary
            </a>
          </div>

          {/* Internal notes */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
              <StickyNote className="h-4 w-4 text-amber-600" /> Internal notes
            </h2>
            {request.internalNotes?.length > 0 ? (
              <ul className="mb-4 space-y-2">
                {request.internalNotes.map((n, i) => (
                  <li key={i} className="rounded-lg bg-gray-50 p-3 text-sm text-gray-800">
                    <p className="whitespace-pre-wrap">{n.text}</p>
                    <p className="mt-1 text-xs text-gray-400">{formatDateTime(n.at)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 text-sm text-gray-400">No notes yet. These are visible to admins only.</p>
            )}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="3"
              placeholder="Add an internal note…"
              className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-amber-400 focus:outline-none"
            />
            <button
              onClick={addNote}
              disabled={busy || !note.trim()}
              className="mt-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40"
            >
              Add note
            </button>
          </div>
        </div>

        {/* Right: status control + timeline */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 font-bold text-gray-900">Update status</h2>
            <div className="space-y-2">
              {KUNDALI_STATUSES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => changeStatus(s.key)}
                  disabled={busy || request.status === s.key}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    request.status === s.key
                      ? 'cursor-default border-amber-300 bg-amber-50 text-amber-800'
                      : 'border-gray-200 text-gray-700 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  {s.label}
                  {request.status === s.key && <CheckCircle2 className="h-4 w-4 text-amber-600" />}
                </button>
              ))}
            </div>
            {request.status !== 'delivered' && (
              <button
                onClick={() => changeStatus('delivered')}
                disabled={busy}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" /> Mark as Delivered
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 font-bold text-gray-900">Timeline</h2>
            <ol className="space-y-4">
              {logs.map((log, i) => (
                <li key={log.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full ${i === logs.length - 1 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-amber-600'}`}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    {i < logs.length - 1 && <span className="mt-1 w-px flex-1 bg-gray-200" />}
                  </div>
                  <div className="pb-1">
                    <p className="text-sm font-semibold text-gray-900">{STATUS_LABEL[log.to] || log.to}</p>
                    <p className="text-xs text-gray-400">{formatDateTime(log.at)}</p>
                    {log.note && <p className="mt-0.5 text-sm text-gray-600">{log.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
