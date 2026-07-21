'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminField from './AdminField';

export default function ContentEditorClient({ contentKey, label, description, initialValue }) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState('form'); // 'form' | 'json'
  const [jsonText, setJsonText] = useState(() => JSON.stringify(initialValue, null, 2));
  const [jsonError, setJsonError] = useState('');

  async function save() {
    setSaving(true);
    setStatus('');
    let toSave = value;
    if (mode === 'json') {
      try {
        toSave = JSON.parse(jsonText);
        setValue(toSave);
      } catch {
        setJsonError('Invalid JSON — fix it before saving.');
        setSaving(false);
        return;
      }
    }
    const res = await fetch(`/api/admin/content/${contentKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: toSave }),
    });
    const data = await res.json();
    setSaving(false);
    setStatus(data.ok ? 'Saved ✓ — changes are now live on the site.' : data.error || 'Save failed');
  }

  async function reset() {
    if (!confirm('Reset this section to its original content? Your edits will be lost.')) return;
    const res = await fetch(`/api/admin/content/${contentKey}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.ok) {
      setValue(data.value);
      setJsonText(JSON.stringify(data.value, null, 2));
      setStatus('Reset to original ✓');
    }
  }

  function switchMode(next) {
    if (next === 'json') {
      setJsonText(JSON.stringify(value, null, 2));
      setJsonError('');
    } else {
      // Coming back from JSON — try to adopt any edits made there.
      try {
        setValue(JSON.parse(jsonText));
        setJsonError('');
      } catch {
        setJsonError('Invalid JSON — cannot switch to form view.');
        return;
      }
    }
    setMode(next);
  }

  return (
    <div>
      <Link href="/admin" className="mb-4 inline-block text-sm text-gray-500 hover:text-gray-800">
        ← All sections
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{label}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-300 p-0.5 text-sm">
            <button
              onClick={() => switchMode('form')}
              className={`rounded-md px-3 py-1 ${mode === 'form' ? 'bg-amber-600 text-white' : 'text-gray-600'}`}
            >
              Form
            </button>
            <button
              onClick={() => switchMode('json')}
              className={`rounded-md px-3 py-1 ${mode === 'json' ? 'bg-amber-600 text-white' : 'text-gray-600'}`}
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {mode === 'form' ? (
          <AdminField label={label} value={value} onChange={setValue} fieldKey={contentKey} />
        ) : (
          <div>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              spellCheck={false}
              className="h-[60vh] w-full rounded-lg border border-gray-300 p-3 font-mono text-xs"
            />
            {jsonError && <p className="mt-2 text-sm text-red-600">{jsonError}</p>}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 mt-6 flex items-center justify-between gap-4 border-t border-gray-200 bg-gray-100 py-4">
        <div className="text-sm text-gray-600">{status}</div>
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200"
          >
            Reset to original
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-amber-600 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
