'use client';

import { useState } from 'react';
import ImagePicker from './ImagePicker';

const IMAGE_KEY = /(image|img|photo|thumbnail|thumb|avatar|picture|icon|logo|src|cover|banner)/i;

function looksLikeImage(key, value) {
  if (typeof value !== 'string') return false;
  if (IMAGE_KEY.test(key)) return true;
  return /^\/.*\.(jpe?g|png|webp|gif|svg)$/i.test(value) || value.startsWith('/api/images/');
}

function labelFor(key) {
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

// Best-effort blank clone so "Add item" produces a same-shaped entry.
function blankLike(sample) {
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(sample)) out[k] = blankLike(v);
    return out;
  }
  if (typeof sample === 'number') return 0;
  if (typeof sample === 'boolean') return false;
  return '';
}

function ImageField({ label, value, onChange }) {
  const [picking, setPicking] = useState(false);
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg border border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400">
            none
          </div>
        )}
        <div className="flex-1">
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/path-or-image-url"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="mt-1 text-xs font-semibold text-amber-700 hover:underline"
          >
            Choose from library →
          </button>
        </div>
      </div>
      {picking && (
        <ImagePicker
          onClose={() => setPicking(false)}
          onSelect={(url) => {
            onChange(url);
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}

/**
 * Recursively renders an editable form for any JSON value.
 * `path` is only used for stable React keys.
 */
export default function AdminField({ label, value, onChange, fieldKey = '', depth = 0 }) {
  // Image string
  if (looksLikeImage(fieldKey, value)) {
    return <ImageField label={label} value={value} onChange={onChange} />;
  }

  // Primitive: string
  if (typeof value === 'string') {
    const multiline = value.length > 60 || value.includes('\n');
    return (
      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">{label}</label>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={Math.min(8, Math.max(2, Math.ceil(value.length / 60)))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        )}
      </div>
    );
  }

  // Primitive: number
  if (typeof value === 'number') {
    return (
      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">{label}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
    );
  }

  // Primitive: boolean
  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    );
  }

  // Array
  if (Array.isArray(value)) {
    const addItem = () => {
      const sample = value[0];
      onChange([...value, sample !== undefined ? blankLike(sample) : '']);
    };
    const updateItem = (i, v) => {
      const next = value.slice();
      next[i] = v;
      onChange(next);
    };
    const removeItem = (i) => onChange(value.filter((_, idx) => idx !== i));
    const move = (i, dir) => {
      const j = i + dir;
      if (j < 0 || j >= value.length) return;
      const next = value.slice();
      [next[i], next[j]] = [next[j], next[i]];
      onChange(next);
    };

    return (
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-bold text-gray-800">
            {label} <span className="font-normal text-gray-400">({value.length})</span>
          </label>
          <button
            type="button"
            onClick={addItem}
            className="rounded-md bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700"
          >
            + Add
          </button>
        </div>
        <div className="space-y-3">
          {value.map((item, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-gray-400">
                  Item {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => move(i, -1)} className="rounded px-1.5 text-gray-500 hover:bg-gray-200" title="Move up">↑</button>
                  <button type="button" onClick={() => move(i, 1)} className="rounded px-1.5 text-gray-500 hover:bg-gray-200" title="Move down">↓</button>
                  <button type="button" onClick={() => removeItem(i)} className="rounded px-2 text-xs font-semibold text-red-600 hover:bg-red-50">Remove</button>
                </div>
              </div>
              <AdminField
                label={`Item ${i + 1}`}
                value={item}
                fieldKey={fieldKey}
                depth={depth + 1}
                onChange={(v) => updateItem(i, v)}
                hideLabel
              />
            </div>
          ))}
          {value.length === 0 && (
            <p className="rounded-lg border border-dashed border-gray-300 p-3 text-center text-xs text-gray-400">
              Empty — click “+ Add”.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Object
  if (value && typeof value === 'object') {
    const updateKey = (k, v) => onChange({ ...value, [k]: v });
    return (
      <div className={depth > 0 ? 'space-y-4' : 'space-y-5'}>
        {Object.entries(value).map(([k, v]) => (
          <AdminField
            key={k}
            label={labelFor(k)}
            value={v}
            fieldKey={k}
            depth={depth + 1}
            onChange={(nv) => updateKey(k, nv)}
          />
        ))}
      </div>
    );
  }

  // null / undefined → treat as editable string
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-700">{label}</label>
      <input
        type="text"
        value=""
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
