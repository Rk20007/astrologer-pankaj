/**
 * Single source of truth for brand and contact details.
 * Every page, the navbar, footer and floating buttons read from here.
 */

export const site = {
  name: 'Bhawna Upadhyay',
  tagline: 'TEDx Speaker • Vedic Astrologer • Spiritual Guide',
  url: 'https://bhawnaupadhyay.com',
};

// TODO(launch): replace every value below with the real details before going live.
// These are placeholders — the phone number is not a real line.
export const contactInfo = {
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'contact@bhawnaupadhyay.com',
  address: 'New Delhi, India',
  hours: 'Monday to Sunday, 10:00 AM - 8:00 PM IST',
};

/** Digits-only form for tel: and wa.me links. */
export const phoneDigits = contactInfo.phone.replace(/\D/g, '');
export const whatsappDigits = contactInfo.whatsapp.replace(/\D/g, '');

/** Formats a rupee amount the Indian way: 210000 -> "₹2,10,000". */
export function formatINR(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}
