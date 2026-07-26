import { z } from 'zod';
import { PAYMENT_KIND_KEYS } from '@/lib/paymentMeta';

const phoneRegex = /^[\d\s+()-]{7,}$/;

// A UPI UTR is 12 digits. Bank transfers (NEFT/IMPS) use longer alphanumeric
// references, so we accept 6–24 alphanumeric characters and normalise to
// uppercase — strict enough to catch typos, loose enough for every bank.
const utrRegex = /^[A-Za-z0-9]{6,24}$/;

/**
 * Validating a manually-submitted payment. Used by the public form and
 * re-checked on the server, so the two can never drift apart.
 */
export const paymentSubmissionSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(120),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a valid mobile number.')
    .max(32)
    .regex(phoneRegex, 'Please enter a valid mobile number.'),
  email: z.string().trim().email('Please enter a valid email address.').max(200).or(z.literal('')),
  amount: z.coerce
    .number({ invalid_type_error: 'Please enter the amount you paid.' })
    .int('Please enter the amount in whole rupees.')
    .min(1, 'Please enter the amount you paid.')
    .max(10_000_000, 'That amount looks too large — please check it.'),
  utr: z
    .string()
    .trim()
    .regex(utrRegex, 'Enter the UTR / reference number exactly as shown on your receipt.')
    .transform((v) => v.toUpperCase()),
  method: z.enum(['upi', 'bank']).default('upi'),
  paidAt: z.string().trim().max(10).optional().default(''),
  // What the payment is for — carried from whichever flow opened the form.
  kind: z.enum(PAYMENT_KIND_KEYS).default('other'),
  service: z.string().trim().max(200).optional().default(''),
  refId: z.string().trim().max(64).optional().default(''),
  refCode: z.string().trim().max(64).optional().default(''),
  note: z.string().trim().max(2000).optional().default(''),
  // Honeypot — must stay empty.
  website: z.string().optional().default(''),
});

export const paymentDefaultValues = {
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
