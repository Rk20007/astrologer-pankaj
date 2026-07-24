import Link from 'next/link';
import { Inbox, CalendarClock, CheckCircle2, Clock, ArrowRight, FileText, ImageIcon } from 'lucide-react';
import { getLeadStats, listLeads } from '@/lib/leads';

export const dynamic = 'force-dynamic';

const KIND_LABEL = { consultation: 'Consultation', contact: 'Enquiry', puja: 'Puja' };

const STATUS_STYLE = {
  new: 'bg-amber-100 text-amber-800',
  contacted: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

function formatWhen(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

async function loadData() {
  try {
    const [stats, recent] = await Promise.all([getLeadStats(), listLeads({ limit: 6 })]);
    return { stats, recent, error: false };
  } catch {
    return {
      stats: { total: 0, new: 0, upcoming: 0, statusCounts: {} },
      recent: [],
      error: true,
    };
  }
}

function StatCard({ icon: Icon, label, value, accent, tint }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className={`mt-4 text-3xl font-bold ${accent}`}>{value}</p>
      <p className="mt-0.5 text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  const { stats, recent, error } = await loadData();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          An overview of bookings and enquiries coming in from the website.
        </p>
      </div>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Could not reach the database. Check the connection and refresh.
        </p>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Inbox} label="Total leads" value={stats.total} accent="text-gray-900" tint="bg-gray-100 text-gray-600" />
        <StatCard icon={Clock} label="New / unread" value={stats.new} accent="text-amber-600" tint="bg-amber-100 text-amber-700" />
        <StatCard icon={CalendarClock} label="Upcoming appointments" value={stats.upcoming} accent="text-emerald-600" tint="bg-emerald-100 text-emerald-700" />
        <StatCard icon={CheckCircle2} label="Confirmed" value={stats.statusCounts?.confirmed || 0} accent="text-blue-600" tint="bg-blue-100 text-blue-700" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent leads */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent leads</h2>
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {recent.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Inbox className="mx-auto mb-3 h-9 w-9 text-gray-300" />
                <p className="text-sm text-gray-500">No leads yet. New bookings will show up here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recent.map((lead) => (
                  <li key={lead.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-gray-900">{lead.name}</p>
                        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                          {KIND_LABEL[lead.kind] || lead.kind}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-gray-500">
                        {lead.service || lead.phone}
                        {lead.date ? ` · ${lead.date} ${lead.slot || ''}` : ''}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLE[lead.status] || 'bg-gray-100 text-gray-700'}`}>
                        {lead.status}
                      </span>
                      <span className="text-[11px] text-gray-400">{formatWhen(lead.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900">Quick actions</h2>
          <div className="mt-3 space-y-3">
            <Link href="/admin/leads" className="group flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-md">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700"><Inbox className="h-5 w-5" /></span>
              <span>
                <span className="block font-semibold text-gray-900 group-hover:text-amber-700">Leads &amp; Bookings</span>
                <span className="block text-sm text-gray-500">See and manage every enquiry.</span>
              </span>
            </Link>
            <Link href="/admin/availability" className="group flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-md">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><CalendarClock className="h-5 w-5" /></span>
              <span>
                <span className="block font-semibold text-gray-900 group-hover:text-amber-700">Availability</span>
                <span className="block text-sm text-gray-500">Set working hours &amp; days off.</span>
              </span>
            </Link>
            <Link href="/admin/content" className="group flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-md">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700"><FileText className="h-5 w-5" /></span>
              <span>
                <span className="block font-semibold text-gray-900 group-hover:text-amber-700">Website Content</span>
                <span className="block text-sm text-gray-500">Edit the text and images on the site.</span>
              </span>
            </Link>
            <Link href="/admin/images" className="group flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-md">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700"><ImageIcon className="h-5 w-5" /></span>
              <span>
                <span className="block font-semibold text-gray-900 group-hover:text-amber-700">Images</span>
                <span className="block text-sm text-gray-500">Upload and manage photos.</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
