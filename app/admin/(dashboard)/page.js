import Link from 'next/link';
import { contentRegistry } from '@/lib/contentRegistry';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  // Group sections for a tidy dashboard.
  const groups = {};
  for (const [key, meta] of Object.entries(contentRegistry)) {
    (groups[meta.group] ||= []).push({ key, ...meta });
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Manage Content</h1>
      <p className="mb-8 text-sm text-gray-500">
        Pick a section to edit its text and images. Changes go live on the website immediately.
      </p>

      <div className="space-y-8">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              {group}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <Link
                  key={item.key}
                  href={`/admin/content/${item.key}`}
                  className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-md"
                >
                  <p className="font-semibold text-gray-900 group-hover:text-amber-700">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-gray-200 bg-white p-4">
        <p className="font-semibold text-gray-900">Images</p>
        <p className="mt-0.5 text-sm text-gray-500">
          Upload and manage all photos used across the site.
        </p>
        <Link
          href="/admin/images"
          className="mt-2 inline-block text-sm font-semibold text-amber-700 hover:underline"
        >
          Open image library →
        </Link>
      </div>
    </div>
  );
}
