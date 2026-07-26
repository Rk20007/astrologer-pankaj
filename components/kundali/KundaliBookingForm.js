'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { CheckCircle2, AlertCircle, User, Star, MessageSquareText, ArrowRight, Home, ClipboardList, Download } from 'lucide-react';
import { kundaliRequestSchema, kundaliDefaultValues, LANGUAGES } from '@/lib/kundaliSchema';
import PaymentPanel from '@/components/PaymentPanel';
import { SERVICE_NAME } from '@/lib/kundaliStatusMeta';

function Field({ label, required, error, hint, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-foreground">
        {label} {required && <span className="text-secondary">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="mt-1.5 text-sm text-destructive">{error.message}</p>}
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-background px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 ${
    hasError ? 'border-destructive focus:border-destructive' : 'border-border focus:border-accent'
  }`;

export default function KundaliBookingForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(kundaliRequestSchema),
    defaultValues: kundaliDefaultValues,
    mode: 'onTouched',
  });

  const [serverError, setServerError] = useState('');
  const [result, setResult] = useState(null);
  const unknownBirthTime = watch('unknownBirthTime');

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const res = await fetch('/api/kundali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, message]) =>
            setError(field, { type: 'server', message })
          );
          setServerError('Please correct the highlighted fields.');
        } else {
          setServerError(data.error || 'Something went wrong. Please try again.');
        }
        return;
      }

      // Keep the contact details so the payment step doesn't ask for them again.
      setResult({
        code: data.code,
        id: data.id,
        name: values.name,
        phone: values.phone,
        email: values.email,
      });
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setServerError('Could not reach the server. Please check your connection and try again.');
    }
  };

  if (result) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
      <div className="mx-auto max-w-xl rounded-3xl border border-accent/40 bg-card p-8 text-center shadow-sm sm:p-12">
        <CheckCircle2 className="mx-auto mb-5 h-16 w-16 text-primary" />
        <h2 className="mb-3 font-serif text-3xl font-bold text-foreground">Request received</h2>
        <p className="mx-auto mb-6 max-w-md leading-relaxed text-muted-foreground">
          Thank you! Your Detailed Kundali PDF request has been received. Complete the payment below
          to confirm it — our astrologer begins the reading once the payment is verified.
        </p>
        {result.code && (
          <p className="mb-6 inline-block rounded-full bg-muted px-4 py-2 text-sm font-semibold text-foreground">
            Request ID: <span className="text-primary">{result.code}</span>
          </p>
        )}

        {result.id && (
          <div className="mb-8">
            <a
              href={`/api/kundali/requests/${result.id}/summary`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-[#3A1C0C] transition-all hover:bg-primary hover:text-white active:scale-95"
            >
              <Download className="h-4 w-4" /> Download Summary PDF
            </a>
            <p className="mt-2 text-xs text-muted-foreground">
              Your detailed written report will be added here once the astrologer prepares it.
            </p>
          </div>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary px-6 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <Link
            href="/kundali/requests"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-accent hover:text-foreground"
          >
            <ClipboardList className="h-4 w-4" /> View My Requests
          </Link>
        </div>
      </div>

        {/* Payment — the report is prepared once the fee is received and verified. */}
        <PaymentPanel
          kind="kundali"
          service={SERVICE_NAME}
          refId={result.id}
          refCode={result.code}
          defaults={{ name: result.name, phone: result.phone, email: result.email }}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-8">
      {/* Personal details */}
      <fieldset className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <legend className="flex items-center gap-2 px-2 font-serif text-xl font-bold text-foreground">
          <User className="h-5 w-5 text-primary" /> Personal Details
        </legend>

        <Field label="Full Name" required error={errors.name}>
          <input {...register('name')} className={inputClass(errors.name)} placeholder="Your full name" autoComplete="name" />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Email Address" required error={errors.email}>
            <input {...register('email')} type="email" className={inputClass(errors.email)} placeholder="your@email.com" autoComplete="email" />
          </Field>
          <Field label="Mobile Number" required error={errors.phone}>
            <input {...register('phone')} type="tel" className={inputClass(errors.phone)} placeholder="+91 00000 00000" autoComplete="tel" />
          </Field>
        </div>
      </fieldset>

      {/* Birth details */}
      <fieldset className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <legend className="flex items-center gap-2 px-2 font-serif text-xl font-bold text-foreground">
          <Star className="h-5 w-5 text-primary" /> Birth Details
        </legend>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Date of Birth" required error={errors.dob}>
            <input {...register('dob')} type="date" className={inputClass(errors.dob)} max="9999-12-31" />
          </Field>
          <Field
            label="Time of Birth"
            required={!unknownBirthTime}
            error={errors.birthTime}
            hint="As exact as possible — it changes the chart."
          >
            <input
              {...register('birthTime')}
              type="time"
              disabled={unknownBirthTime}
              className={`${inputClass(errors.birthTime)} disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground`}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2.5 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            {...register('unknownBirthTime')}
            onChange={(e) => {
              setValue('unknownBirthTime', e.target.checked);
              if (e.target.checked) setValue('birthTime', '', { shouldValidate: true });
            }}
            className="h-4 w-4 accent-primary"
          />
          I don&apos;t know my exact birth time.
        </label>

        <Field label="Place of Birth" required error={errors.birthPlace}>
          <input {...register('birthPlace')} className={inputClass(errors.birthPlace)} placeholder="City, State, Country" />
        </Field>
      </fieldset>

      {/* Additional information */}
      <fieldset className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <legend className="flex items-center gap-2 px-2 font-serif text-xl font-bold text-foreground">
          <MessageSquareText className="h-5 w-5 text-primary" /> Additional Information
        </legend>

        <Field label="Preferred Language" required error={errors.language}>
          <select {...register('language')} className={inputClass(errors.language)} defaultValue="">
            <option value="" disabled>
              Select a language…
            </option>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Questions or Special Requirements" error={errors.questions} hint="Optional — anything specific you'd like the report to focus on.">
          <textarea
            {...register('questions')}
            rows="4"
            className={`${inputClass(errors.questions)} resize-none`}
            placeholder="E.g. career direction, marriage timing, a specific concern…"
          />
        </Field>
      </fieldset>

      {/* Honeypot */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {serverError && (
        <p className="flex items-start gap-2 rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-base font-bold text-white shadow-[0_10px_30px_rgba(199,107,0,0.3)] transition-all hover:bg-accent hover:text-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting…' : 'Submit Request'}
        {!isSubmitting && <ArrowRight className="h-5 w-5" />}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Payment details are shown on the next step. Your information is kept confidential and used
        only to prepare your report.
      </p>
    </form>
  );
}
