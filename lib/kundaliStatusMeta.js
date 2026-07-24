// Client-safe status metadata (no server imports), shared by the server data
// layer, the user dashboard and the admin panel so labels/colours never drift.

export const SERVICE_NAME = 'Detailed Kundali PDF';

export const KUNDALI_STATUSES = [
  { key: 'pending_review', label: 'Pending Review' },
  { key: 'under_analysis', label: 'Under Analysis' },
  { key: 'pdf_ready', label: 'PDF Ready' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

export const STATUS_KEYS = KUNDALI_STATUSES.map((s) => s.key);
export const STATUS_LABEL = Object.fromEntries(KUNDALI_STATUSES.map((s) => [s.key, s.label]));

// Tailwind classes for a status pill, tuned for the cream/gold theme.
export const STATUS_STYLE = {
  pending_review: 'bg-amber-100 text-amber-800 border-amber-200',
  under_analysis: 'bg-blue-100 text-blue-800 border-blue-200',
  pdf_ready: 'bg-violet-100 text-violet-800 border-violet-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};
