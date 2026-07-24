'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, CalendarDays, Loader2 } from 'lucide-react';
import Button from '@/components/Button';

const BookingModalContext = createContext(null);

// Kept in sync with lib/availability (which is server-only and must not be
// imported into this client bundle). Maps every id a page might use for a
// consultant to a canonical key; anything else is a simple enquiry.
const CONSULTANT_ALIASES = {
  bhawna: 'bhawna',
  'bhawna-upadhyay': 'bhawna',
  pankaj: 'pankaj',
  'pankaj-ji': 'pankaj',
  'pankaj-sir': 'pankaj',
};

function resolveConsultant(id) {
  return CONSULTANT_ALIASES[id] || null;
}

export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx) throw new Error('useBookingModal must be used inside <BookingModalProvider>');
  return ctx;
}

/** "10:00" → "10:00 AM" */
function formatSlot(time) {
  const [h, m] = time.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function todayStr() {
  const now = new Date();
  const off = now.getTimezoneOffset();
  return new Date(now.getTime() - off * 60_000).toISOString().slice(0, 10);
}

const EMPTY = { name: '', email: '', phone: '', message: '', website: '' };

function BookingForm({ booking, onClose }) {
  const { option, cardTitle } = booking;
  // A booking either targets a consultant (→ pick a slot) or is a plain enquiry.
  const consultant = resolveConsultant(booking.consultant);
  const needsSlot = Boolean(consultant);

  const [formData, setFormData] = useState(EMPTY);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [slotState, setSlotState] = useState({ loading: false, closed: false, reason: null, slots: [] });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [feedback, setFeedback] = useState('');

  const minDate = useMemo(todayStr, []);

  // Load slots whenever the chosen date changes.
  useEffect(() => {
    if (!needsSlot || !date) {
      setSlotState({ loading: false, closed: false, reason: null, slots: [] });
      return;
    }
    let cancelled = false;
    setSlot('');
    setSlotState((s) => ({ ...s, loading: true }));

    fetch(`/api/availability?date=${date}&consultant=${encodeURIComponent(consultant)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.ok) {
          setSlotState({ loading: false, closed: true, reason: 'error', slots: [] });
          return;
        }
        setSlotState({ loading: false, closed: data.closed, reason: data.reason, slots: data.slots });
      })
      .catch(() => {
        if (!cancelled) setSlotState({ loading: false, closed: true, reason: 'error', slots: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [date, consultant, needsSlot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (needsSlot && !slot) {
      setErrors((prev) => ({ ...prev, slot: 'Please choose a time slot.' }));
      return;
    }

    setStatus('sending');
    setErrors({});
    setFeedback('');

    const payload = needsSlot
      ? {
          kind: 'consultation',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          website: formData.website,
          cardId: consultant,
          serviceId: option.id,
          service: option.label,
          date,
          slot,
        }
      : {
          kind: 'contact',
          ...formData,
          serviceId: option.id,
          service: option.label,
        };

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          setFeedback('Please correct the highlighted fields.');
          // A slot that was taken between load and submit: refresh the grid.
          if (data.errors.slot && needsSlot && date) {
            setSlot('');
            fetch(`/api/availability?date=${date}&consultant=${encodeURIComponent(consultant)}`)
              .then((r) => r.json())
              .then((d) => d.ok && setSlotState({ loading: false, closed: d.closed, reason: d.reason, slots: d.slots }))
              .catch(() => {});
          }
        } else {
          setFeedback(data.error || 'Something went wrong. Please try again.');
        }
        setStatus('error');
        return;
      }

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

  if (status === 'sent') {
    return (
      <div className="p-8 text-center sm:p-10">
        <CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-primary" />
        <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">
          {needsSlot ? 'Appointment requested' : 'Request received'}
        </h2>
        <p className="mx-auto mb-8 max-w-md leading-relaxed text-muted-foreground">
          {needsSlot ? (
            <>
              Thank you. Your appointment for <span className="font-semibold">{option.label}</span> on{' '}
              <span className="font-semibold">{date}</span> at{' '}
              <span className="font-semibold">{formatSlot(slot)}</span> has been received. You will be
              contacted to confirm and share payment details. Please allow up to 24 hours.
            </>
          ) : (
            <>
              Thank you. Your request has been received and you will get a reply with the available
              options and payment details within 24 hours.
            </>
          )}
        </p>
        <Button variant="outline" size="md" onClick={onClose}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-h-[88vh] flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-border p-6">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {cardTitle}
          </p>
          <h2 className="font-serif text-xl font-bold text-foreground sm:text-2xl">{option.label}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-5 overflow-y-auto p-6">
        {needsSlot && (
          <div className="space-y-4 rounded-2xl border border-primary/25 bg-primary/5 p-4">
            <div>
              <label htmlFor="booking-date" className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                Choose a date *
              </label>
              <input
                id="booking-date"
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={fieldClass('date')}
              />
              {errors.date && <p className="mt-1.5 text-sm text-destructive">{errors.date}</p>}
            </div>

            {date && (
              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">Available time slots *</p>

                {slotState.loading && (
                  <p className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading available times…
                  </p>
                )}

                {!slotState.loading && slotState.closed && (
                  <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                    {slotState.reason === 'error'
                      ? 'Could not load times. Please try again.'
                      : 'No appointments are available on this date. Please pick another day.'}
                  </p>
                )}

                {!slotState.loading && !slotState.closed && slotState.slots.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slotState.slots.map((s) => (
                      <button
                        key={s.time}
                        type="button"
                        disabled={!s.available}
                        onClick={() => {
                          setSlot(s.time);
                          setErrors((prev) => (prev.slot ? { ...prev, slot: undefined } : prev));
                        }}
                        className={`rounded-lg border px-2 py-2 text-sm font-medium transition-all ${
                          !s.available
                            ? 'cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through'
                            : slot === s.time
                              ? 'border-primary bg-primary text-white shadow-sm'
                              : 'border-border bg-background text-foreground hover:border-primary/60 hover:bg-primary/5'
                        }`}
                        title={s.available ? '' : 'Already booked'}
                      >
                        {formatSlot(s.time)}
                      </button>
                    ))}
                  </div>
                )}

                {!slotState.loading && !slotState.closed && slotState.slots.length === 0 && (
                  <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                    No time slots are set for this day.
                  </p>
                )}

                {errors.slot && <p className="mt-2 text-sm text-destructive">{errors.slot}</p>}
              </div>
            )}
          </div>
        )}

        <div>
          <label htmlFor="booking-name" className="mb-2 block text-sm font-semibold text-foreground">
            Full Name *
          </label>
          <input
            id="booking-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            className={fieldClass('name')}
            placeholder="Your name"
          />
          {errors.name && <p className="mt-1.5 text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="booking-email" className="mb-2 block text-sm font-semibold text-foreground">
              Email *
            </label>
            <input
              id="booking-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className={fieldClass('email')}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1.5 text-sm text-destructive">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="booking-phone" className="mb-2 block text-sm font-semibold text-foreground">
              Phone / WhatsApp *
            </label>
            <input
              id="booking-phone"
              type="tel"
              name="phone"
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
          <label htmlFor="booking-message" className="mb-2 block text-sm font-semibold text-foreground">
            Message {needsSlot ? '(optional)' : '*'}
          </label>
          <textarea
            id="booking-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required={!needsSlot}
            rows="4"
            className={`${fieldClass('message')} resize-none`}
            placeholder="Please include your date of birth, exact time of birth and place of birth, and what you would like guidance on."
          />
          {errors.message && <p className="mt-1.5 text-sm text-destructive">{errors.message}</p>}
        </div>

        {/* Honeypot */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="booking-website">Website</label>
          <input
            id="booking-website"
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
      </div>

      <div className="border-t border-border p-6">
        <Button variant="primary" size="lg" type="submit" className="w-full" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : needsSlot ? 'Request Appointment' : 'Send Request'}
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          No payment is taken online. Your details are kept confidential and you will be contacted
          within 24 hours.
        </p>
      </div>
    </form>
  );
}

export function BookingModalProvider({ children }) {
  const [booking, setBooking] = useState(null);
  const panelRef = useRef(null);
  const lastFocused = useRef(null);

  const openBooking = useCallback((next) => {
    lastFocused.current = document.activeElement;
    setBooking(next);
  }, []);

  const close = useCallback(() => {
    setBooking(null);
    lastFocused.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!booking) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [booking, close]);

  return (
    <BookingModalContext.Provider value={{ openBooking }}>
      {children}

      <AnimatePresence>
        {booking && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            />
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Book an appointment"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-accent/50 bg-card shadow-2xl outline-none sm:rounded-3xl"
            >
              {/* key resets all form state each time a new service is opened */}
              <BookingForm key={booking.option.id} booking={booking} onClose={close} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </BookingModalContext.Provider>
  );
}
