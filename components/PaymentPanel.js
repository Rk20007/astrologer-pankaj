'use client';

import { useEffect, useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MessageCircle,
  Landmark,
  Loader2,
} from 'lucide-react';
import { paymentConfig as defaultPaymentConfig } from '@/data/payment';
import { formatINR, normaliseContacts, whatsappLink } from '@/data/site';
import { useSiteConfig } from '@/components/useSiteConfig';

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard is blocked (insecure origin / permission) — the value is
      // already on screen, so the user can still select it by hand.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
      aria-label={`Copy ${label}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

/** One line of the bank account block. Hidden entirely when it has no value. */
function BankRow({ label, value, copyable = false, mono = false }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 pt-0.5 text-xs text-muted-foreground">{label}</dt>
      <dd className="flex min-w-0 items-center gap-2">
        <span
          className={`break-all text-right text-sm font-bold text-foreground ${
            mono ? 'font-mono tracking-wide' : ''
          }`}
        >
          {value}
        </span>
        {copyable && <CopyButton value={value} label={label} />}
      </dd>
    </div>
  );
}

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  amount: '',
  utr: '',
  method: 'upi',
  paidAt: '',
  note: '',
  website: '',
};

/**
 * The manual payment step: shows the UPI QR, then takes the UTR the client got
 * from their UPI app. Submitting only records the claim — an admin verifies it
 * against the bank statement and approves it, which is when the booking is
 * actually confirmed. Razorpay will replace this panel later; the submitted
 * payments stay in the same collection either way.
 *
 * @param kind     what the payment is for: kundali | consultation | puja | other
 * @param service  human label for the service, shown to the admin
 * @param refId    id of the booking / request this pays for (optional)
 * @param refCode  its public code, e.g. KND-1A2B3C (optional)
 * @param amount   expected amount in rupees — prefills the field (optional)
 * @param defaults { name, phone, email } already collected by the booking form
 * @param config   payment config, when the page already has it (server-rendered).
 *                 Left out, the panel reads the admin-editable version itself.
 * @param contactList  WhatsApp lines, likewise optional.
 */
export default function PaymentPanel({
  kind = 'other',
  service = '',
  refId = '',
  refCode = '',
  amount,
  defaults = {},
  config,
  contactList,
  className = '',
}) {
  // Pages that render server-side can pass these in; everything else (modals,
  // booking forms) reads the admin-editable copy from the shared hook, which
  // falls back to the bundled defaults so the QR shows either way.
  const live = useSiteConfig();
  const cfg = { ...defaultPaymentConfig, ...(config || live.payment || {}) };
  const bank = cfg.bankAccount || {};
  const contacts = contactList?.length ? normaliseContacts(contactList) : live.contacts;

  // A broken image is worth saying out loud rather than showing as a torn icon.
  // Reset the flag if the QR URL changes — the fetched config may point at a
  // different (working) image than the bundled default we started with.
  const [qrFailed, setQrFailed] = useState(false);
  useEffect(() => {
    setQrFailed(false);
  }, [cfg.qrImage]);

  const [formData, setFormData] = useState({
    ...EMPTY,
    name: defaults.name || '',
    phone: defaults.phone || '',
    email: defaults.email || '',
    amount: amount ? String(amount) : '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [feedback, setFeedback] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrors({});
    setFeedback('');

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, kind, service, refId, refCode }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          setFeedback('Please correct the highlighted fields.');
        } else {
          setFeedback(data.error || 'Something went wrong. Please try again.');
        }
        setStatus('error');
        return;
      }

      setResult({ code: data.code });
      setStatus('sent');
    } catch {
      setStatus('error');
      setFeedback('Could not reach the server. Please check your connection and try again.');
    }
  };

  const fieldClass = (name) =>
    `w-full rounded-lg border bg-background px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
      errors[name] ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
    }`;

  const waMessage = `Namaste 🙏 I have paid${amount ? ` ${formatINR(amount)}` : ''} for ${
    service || 'my booking'
  }${refCode ? ` (${refCode})` : ''}. Sharing the payment screenshot.`;

  if (status === 'sent') {
    return (
      <div className={`rounded-3xl border border-emerald-200 bg-emerald-50/60 p-8 text-center ${className}`}>
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-600" />
        <h3 className="mb-2 font-serif text-2xl font-bold text-foreground">
          Payment details submitted
        </h3>
        <p className="mx-auto mb-5 max-w-md leading-relaxed text-muted-foreground">
          Thank you. Your transaction reference has been recorded and is now with our team for
          verification. Once it is approved your booking is confirmed and you will hear from us on
          WhatsApp — usually within 24 hours.
        </p>
        {result?.code && (
          <p className="mb-6 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
            Payment ID: <span className="text-primary">{result.code}</span>
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          {contacts.map((contact) => (
            <a
              key={contact.id}
              href={whatsappLink(contact, waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4" /> Send screenshot to {contact.name}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-3xl border border-accent/40 bg-card shadow-sm ${className}`}>
      {/* Header */}
      <div className="border-b border-border bg-primary/5 p-6 sm:p-8">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <QrCode className="h-4 w-4" /> Step 2 — Payment
        </p>
        <h3 className="mt-1 font-serif text-2xl font-bold text-foreground">
          Pay by UPI or bank transfer, then confirm below
        </h3>
        {service && (
          <p className="mt-1 text-sm text-muted-foreground">
            {service}
            {refCode && <> · Reference <span className="font-semibold text-foreground">{refCode}</span></>}
            {amount ? (
              <>
                {' '}· Amount <span className="font-bold text-primary">{formatINR(amount)}</span>
              </>
            ) : null}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-2">
        {/* QR + instructions */}
        <div>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{cfg.note}</p>

          <div className="mx-auto max-w-xs overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm">
            {qrFailed ? (
              // The QR file hasn't been added yet (or the URL is wrong) — say so
              // plainly instead of showing a broken image.
              <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/60 px-4 py-10 text-center">
                <QrCode className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">QR code unavailable</p>
                <p className="text-xs text-muted-foreground">
                  Please use the bank details below, or message us on WhatsApp.
                </p>
              </div>
            ) : (
              <img
                src={cfg.qrImage}
                alt="Scan this UPI QR code to pay"
                onError={() => setQrFailed(true)}
                className="mx-auto h-auto w-full rounded-lg"
              />
            )}
            {cfg.bankLabel && !qrFailed && (
              <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
                {cfg.bankLabel}
              </p>
            )}
          </div>

          {cfg.upiId && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  UPI ID
                </p>
                <p className="truncate font-mono text-sm font-bold text-foreground">{cfg.upiId}</p>
              </div>
              <CopyButton value={cfg.upiId} label="UPI ID" />
            </div>
          )}

          {/* Bank transfer, for anyone who would rather do NEFT / IMPS. */}
          {bank.accountNumber && (
            <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-4">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <Landmark className="h-4 w-4 text-primary" /> Or pay by bank transfer
              </p>
              <dl className="space-y-2.5">
                <BankRow label="Account Holder" value={bank.accountHolder} />
                <BankRow label="Account Number" value={bank.accountNumber} copyable mono />
                <BankRow label="IFSC Code" value={bank.ifsc} copyable mono />
                <BankRow label="Bank" value={bank.bank} />
                <BankRow label="Branch" value={bank.branch} />
                <BankRow label="Account Type" value={bank.accountType} />
              </dl>
            </div>
          )}

          <ol className="mt-5 space-y-2.5">
            {cfg.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          {/* Payment help on WhatsApp */}
          <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Any trouble paying? Message us
            </p>
            <div className="flex flex-col gap-2">
              {contacts.map((contact) => (
                <a
                  key={contact.id}
                  href={whatsappLink(contact, waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors hover:border-green-500 hover:bg-green-50"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-foreground">{contact.name}</span>
                    <span className="block text-xs text-muted-foreground">{contact.phone}</span>
                  </span>
                  <MessageCircle className="h-4 w-4 shrink-0 text-green-600" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* UTR form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h4 className="font-serif text-lg font-bold text-foreground">
              Submit your transaction details
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              After paying, enter the UTR / reference number from your payment receipt. Our team
              verifies it and approves your booking.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="pay-name" className="mb-2 block text-sm font-semibold text-foreground">
                Name <span className="text-destructive">*</span>
              </label>
              <input
                id="pay-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className={fieldClass('name')}
                placeholder="Name used for the booking"
              />
              {errors.name && <p className="mt-1.5 text-sm text-destructive">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="pay-phone" className="mb-2 block text-sm font-semibold text-foreground">
                WhatsApp Number <span className="text-destructive">*</span>
              </label>
              <input
                id="pay-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
                className={fieldClass('phone')}
                placeholder="+91 00000 00000"
              />
              {errors.phone && <p className="mt-1.5 text-sm text-destructive">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="pay-email" className="mb-2 block text-sm font-semibold text-foreground">
              Email <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="pay-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className={fieldClass('email')}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1.5 text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="pay-amount" className="mb-2 block text-sm font-semibold text-foreground">
                Amount Paid (₹) <span className="text-destructive">*</span>
              </label>
              <input
                id="pay-amount"
                name="amount"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={formData.amount}
                onChange={handleChange}
                required
                className={fieldClass('amount')}
                placeholder="e.g. 11000"
              />
              {errors.amount && <p className="mt-1.5 text-sm text-destructive">{errors.amount}</p>}
            </div>

            <div>
              <label htmlFor="pay-paidAt" className="mb-2 block text-sm font-semibold text-foreground">
                Date of Payment
              </label>
              <input
                id="pay-paidAt"
                name="paidAt"
                type="date"
                value={formData.paidAt}
                onChange={handleChange}
                max="9999-12-31"
                className={fieldClass('paidAt')}
              />
              {errors.paidAt && <p className="mt-1.5 text-sm text-destructive">{errors.paidAt}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="pay-utr" className="mb-2 block text-sm font-semibold text-foreground">
              UTR / Transaction Reference Number <span className="text-destructive">*</span>
            </label>
            <input
              id="pay-utr"
              name="utr"
              value={formData.utr}
              onChange={handleChange}
              required
              autoComplete="off"
              className={`${fieldClass('utr')} font-mono uppercase tracking-wide`}
              placeholder="e.g. 412345678901"
            />
            {errors.utr ? (
              <p className="mt-1.5 text-sm text-destructive">{errors.utr}</p>
            ) : (
              <p className="mt-1.5 text-xs text-muted-foreground">
                GPay: tap the payment → “UPI transaction ID”. PhonePe / Paytm: “UTR” on the receipt.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="pay-method" className="mb-2 block text-sm font-semibold text-foreground">
              Paid Using
            </label>
            <select
              id="pay-method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              className={fieldClass('method')}
            >
              <option value="upi">UPI / QR Scan</option>
              <option value="bank">Bank transfer (NEFT / IMPS)</option>
            </select>
          </div>

          <div>
            <label htmlFor="pay-note" className="mb-2 block text-sm font-semibold text-foreground">
              Note <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="pay-note"
              name="note"
              rows="3"
              value={formData.note}
              onChange={handleChange}
              className={`${fieldClass('note')} resize-none`}
              placeholder="Anything our team should know about this payment."
            />
          </div>

          {/* Honeypot — hidden from people, tempting to bots. */}
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <label htmlFor="pay-website">Website</label>
            <input
              id="pay-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          {status === 'error' && feedback && (
            <p className="flex items-start gap-2 rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {feedback}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-base font-bold text-white shadow-[0_10px_30px_rgba(199,107,0,0.3)] transition-all hover:bg-accent hover:text-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" /> Submit Payment Details
              </>
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Your booking is confirmed once our team verifies the payment. Keep the receipt until you
            receive the confirmation.
          </p>
        </form>
      </div>
    </div>
  );
}
