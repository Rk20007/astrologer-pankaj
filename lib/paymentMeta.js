// Client-safe payment metadata (no server imports), shared by the data layer,
// the public payment form and the admin panel so labels never drift apart.

export const PAYMENT_STATUSES = [
  { key: 'pending_verification', label: 'Pending Verification' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export const PAYMENT_STATUS_KEYS = PAYMENT_STATUSES.map((s) => s.key);
export const PAYMENT_STATUS_LABEL = Object.fromEntries(
  PAYMENT_STATUSES.map((s) => [s.key, s.label])
);

export const PAYMENT_STATUS_STYLE = {
  pending_verification: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

// What the payment is for. `kundali` and `consultation` carry a reference to the
// record they belong to; `other` is a standalone payment from /payment.
export const PAYMENT_KINDS = [
  { key: 'kundali', label: 'Kundali PDF' },
  { key: 'consultation', label: 'Consultation' },
  { key: 'puja', label: 'Puja & Anushthan' },
  { key: 'other', label: 'Other' },
];

export const PAYMENT_KIND_KEYS = PAYMENT_KINDS.map((k) => k.key);
export const PAYMENT_KIND_LABEL = Object.fromEntries(PAYMENT_KINDS.map((k) => [k.key, k.label]));
