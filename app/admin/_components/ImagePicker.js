'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * A modal that lists uploaded images, lets you upload new ones, and calls
 * onSelect(url) with the chosen image's public URL. Also used standalone on
 * the Images page (with no onSelect — just management).
 */
export default function ImagePicker({ onSelect, onClose, selectable = true, inline = false }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/images');
    const data = await res.json();
    setImages(data.images || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    for (const file of files) {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/images', { method: 'POST', body: form });
      const data = await res.json();
      if (!data.ok) setError(data.error || 'Upload failed');
    }
    setUploading(false);
    e.target.value = '';
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this image? Any page using it will fall back to a placeholder.')) return;
    await fetch(`/api/admin/images/${id}`, { method: 'DELETE' });
    load();
  }

  const panel = (
    <div
      className={
        inline
          ? 'flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white'
          : 'relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl'
      }
    >
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h3 className="text-lg font-bold text-gray-900">Image Library</h3>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
            {uploading ? 'Uploading…' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {!inline && (
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
              Close
            </button>
          )}
        </div>
      </div>

      {error && <p className="bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      <div className="overflow-y-auto p-4">
          {loading ? (
            <p className="py-10 text-center text-gray-500">Loading…</p>
          ) : images.length === 0 ? (
            <p className="py-10 text-center text-gray-500">
              No images yet. Click Upload to add some.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group relative overflow-hidden rounded-lg border border-gray-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.filename} className="h-28 w-full object-cover" />
                  <div className="flex items-center justify-between gap-1 p-1.5">
                    <span className="truncate text-[10px] text-gray-500" title={img.filename}>
                      {img.filename}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    {selectable && onSelect && (
                      <button
                        onClick={() => onSelect(img.url)}
                        className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
                      >
                        Use
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );

  if (inline) return panel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-3xl">{panel}</div>
    </div>
  );
}
