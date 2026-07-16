'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, Minus, Plus } from 'lucide-react';
import Button from '@/components/Button';
import { formatINR } from '@/data/site';

// Defined at module scope, not inside the form component — a component created
// inside render() is a new type every render, which remounts the input and
// drops focus after each keystroke.
function TextField({ id, label, required, type = 'text', autoComplete, placeholder, hint, value, onChange, error }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={id}
        type={type}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-secondary/20 ${
          error ? 'border-destructive focus:border-destructive' : 'border-border focus:border-secondary'
        }`}
        placeholder={placeholder}
      />
      {hint && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}

const EMPTY = {
  // Sankalp — in whose name the ritual is performed.
  yajmanName: '',
  gotra: '',
  fathersName: '',
  grandfathersName: '',
  ancestralPlace: '',
  // Billing — who is booking and how to reach them.
  name: '',
  phone: '',
  email: '',
  occupation: '',
  city: '',
  notes: '',
  // Honeypot.
  website: '',
};

/**
 * Two-part puja booking: Sankalp details (Yajman, gotra, ancestry) followed by
 * billing / contact details. Submits to /api/booking with kind:'puja', which
 * emails the enquiry — no payment is taken here; the team confirms and collects
 * payment after.
 */
export default function PujaBookingForm({ puja }) {
  const [formData, setFormData] = useState(EMPTY);
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [feedback, setFeedback] = useState('');

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
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'puja',
          ...formData,
          quantity,
          service: puja.service,
          pujaName: puja.service,
        }),
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
        // Bring the first error into view on mobile.
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setStatus('sent');
      setFormData(EMPTY);
      setQuantity(1);
    } catch {
      setStatus('error');
      setFeedback('Could not reach the server. Please check your connection and try again.');
    }
  };

  const fieldClass = (name) =>
    `w-full rounded-lg border bg-background px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-secondary/20 ${
      errors[name]
        ? 'border-destructive focus:border-destructive'
        : 'border-border focus:border-secondary'
    }`;

  if (status === 'sent') {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-secondary" />
        <h2 className="mb-3 font-serif text-3xl font-bold text-foreground">Booking received</h2>
        <p className="mx-auto mb-8 max-w-md leading-relaxed text-muted-foreground">
          Thank you. Your Sankalp details for <span className="font-semibold">{puja.name}</span> have
          been received. You will be contacted on WhatsApp with the muhurat, confirmation and payment
          details. Please allow up to 24 hours for a response.
        </p>
        <Button variant="outline" size="md" onClick={() => setStatus('idle')}>
          Book another puja
        </Button>
      </div>
    );
  }

  // Shared props for every text field, so each call stays short.
  const field = (id) => ({ id, value: formData[id], onChange: handleChange, error: errors[id] });

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sankalp */}
      <fieldset className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <legend className="px-2 font-serif text-xl font-bold text-foreground">
          Sankalp Details
        </legend>
        <p className="-mt-2 text-sm text-muted-foreground">
          The puja is performed in the name below. Please enter the details of the person the
          Sankalp is for.
        </p>

        <TextField {...field('yajmanName')} label="Name of Yajman" required placeholder="Full name" />
        <TextField {...field('gotra')} label="Gotra (optional)" placeholder="e.g. Kashyap" />
        <TextField {...field('fathersName')} label="Father's name" required placeholder="Father's full name" />
        <TextField
          {...field('grandfathersName')}
          label="Grandfather's name"
          placeholder="Grandfather's full name"
        />
        <TextField {...field('ancestralPlace')} label="Ancestral Place" placeholder="Village / town / district" />
      </fieldset>

      {/* Billing */}
      <fieldset className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <legend className="px-2 font-serif text-xl font-bold text-foreground">Your Details</legend>

        <TextField {...field('name')} label="Name (आपका नाम)" required autoComplete="name" placeholder="Your name" />
        <TextField
          {...field('phone')}
          label="Calling & WhatsApp Number (फ़ोन नंबर)"
          required
          type="tel"
          autoComplete="tel"
          placeholder="+91 00000 00000"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            {...field('email')}
            label="Email address"
            required
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
          />
          <TextField {...field('occupation')} label="Occupation (व्यवसाय)" placeholder="Your occupation" />
        </div>
        <TextField
          {...field('city')}
          label="Present City and State (आपका शहर और राज्य)"
          required
          placeholder="City, State"
        />

        <div>
          <label htmlFor="notes" className="mb-2 block text-sm font-semibold text-foreground">
            Order notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className={`${fieldClass('notes')} resize-none`}
            placeholder="Any special note, preferred date, or question about this puja."
          />
        </div>
      </fieldset>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
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

      {/* Quantity + submit */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-foreground">Quantity</span>
          <div className="flex items-center rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center font-semibold text-foreground">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="ml-1 text-lg font-bold text-foreground">
            {formatINR(puja.price * quantity)}
          </span>
        </div>

        <Button
          variant="secondary"
          size="lg"
          type="submit"
          className="w-full sm:w-auto"
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sending…' : 'Book Now'}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        No payment is taken online. Your details are kept confidential and you will be contacted to
        confirm the muhurat and payment.
      </p>
    </form>
  );
}
