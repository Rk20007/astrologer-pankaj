'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import Button from '@/components/Button';

const EMPTY = { name: '', email: '', phone: '', message: '', website: '' };

export default function ContactForm() {
  const searchParams = useSearchParams();

  // Booking links arrive as /contact?service=<id>&label=<human readable>.
  const initialService = searchParams.get('label') || '';
  const [service, setService] = useState(initialService);

  const [formData, setFormData] = useState(EMPTY);
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
        body: JSON.stringify({ ...formData, service }),
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

      setStatus('sent');
      setFormData(EMPTY);
    } catch {
      setStatus('error');
      setFeedback('Could not reach the server. Please check your connection and try again.');
    }
  };

  const fieldClass = (name) =>
    `w-full rounded-lg border bg-background px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
      errors[name] ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
    }`;

  if (status === 'sent') {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-primary" />
        <h2 className="mb-3 font-serif text-3xl font-bold text-foreground">Request received</h2>
        <p className="mx-auto mb-8 max-w-md leading-relaxed text-muted-foreground">
          Thank you. Your request has been sent and you will receive a reply with the available
          slots and payment details. Please allow up to 24 hours for a response.
        </p>
        <Button variant="outline" size="md" onClick={() => setStatus('idle')}>
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-border bg-card p-8">
      {service && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Selected service
            </p>
            <p className="mt-1 font-semibold text-foreground">{service}</p>
          </div>
          <button
            type="button"
            onClick={() => setService('')}
            aria-label="Clear selected service"
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-foreground">
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          className={fieldClass('name')}
          placeholder="Your name"
        />
        {errors.name && <p className="mt-1.5 text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-foreground">
            Email *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={fieldClass('email')}
            placeholder="your@email.com"
          />
          {errors.email && <p className="mt-1.5 text-sm text-destructive">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-foreground">
            Phone / WhatsApp *
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            className={fieldClass('phone')}
            placeholder="+91 00000 00000"
          />
          {errors.phone && <p className="mt-1.5 text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-semibold text-foreground">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="6"
          aria-invalid={Boolean(errors.message)}
          className={`${fieldClass('message')} resize-none`}
          placeholder="Please include your date of birth, exact time of birth and place of birth, along with what you would like guidance on."
        />
        {errors.message && <p className="mt-1.5 text-sm text-destructive">{errors.message}</p>}
        <p className="mt-2 text-xs text-muted-foreground">
          For any kundli reading, your date, exact time and place of birth are needed to prepare the
          chart before the consultation.
        </p>
      </div>

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

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        type="submit"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending…' : 'Send Request'}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Your details are kept confidential. You will receive a reply within 24 hours.
      </p>
    </form>
  );
}
