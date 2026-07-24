import { z } from 'zod';

// Languages offered for the written report. Shared by the form <select> and the
// server-side validation so the two never drift apart.
export const LANGUAGES = [
  'Hindi',
  'English',
  'Marathi',
  'Gujarati',
  'Bengali',
  'Tamil',
  'Telugu',
  'Kannada',
  'Punjabi',
  'Other',
];

const phoneRegex = /^[\d\s+()-]{7,}$/;

// Single source of truth for validating a Kundali PDF request — used by React
// Hook Form (zodResolver) on the client and re-checked on the server.
export const kundaliRequestSchema = z
  .object({
    name: z.string().trim().min(2, 'Please enter your full name.').max(120),
    email: z.string().trim().email('Please enter a valid email address.').max(200),
    phone: z
      .string()
      .trim()
      .min(7, 'Please enter a valid mobile number.')
      .max(32)
      .regex(phoneRegex, 'Please enter a valid mobile number.'),
    dob: z.string().min(1, 'Please enter your date of birth.'),
    unknownBirthTime: z.boolean().default(false),
    birthTime: z.string().trim().max(5).optional().default(''),
    birthPlace: z.string().trim().min(2, 'Please enter your place of birth.').max(160),
    language: z.enum(LANGUAGES, { errorMap: () => ({ message: 'Please choose a language.' }) }),
    questions: z.string().trim().max(4000).optional().default(''),
    // Honeypot — must stay empty.
    website: z.string().optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (!data.unknownBirthTime && !data.birthTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['birthTime'],
        message: 'Enter your time of birth, or tick “I don’t know my exact birth time”.',
      });
    }
    if (data.dob) {
      const today = new Date().toISOString().slice(0, 10);
      if (data.dob > today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['dob'],
          message: 'Date of birth cannot be in the future.',
        });
      }
    }
  });

export const kundaliDefaultValues = {
  name: '',
  email: '',
  phone: '',
  dob: '',
  unknownBirthTime: false,
  birthTime: '',
  birthPlace: '',
  language: '',
  questions: '',
  website: '',
};
