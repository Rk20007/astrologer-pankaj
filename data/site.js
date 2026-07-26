/**
 * Single source of truth for brand and contact details.
 * Every page, the navbar, footer and floating buttons read from here.
 */

export const site = {
  name: 'Bhawna Upadhyay',
  tagline: 'TEDx Speaker • Vedic Astrologer • Spiritual Guide',
  url: 'https://bhawnaupadhyay.com',
};

/**
 * The WhatsApp / calling lines the team answers on. This is the default the
 * site ships with; the live list is editable from Admin → Website Content →
 * "WhatsApp Numbers", which stores exactly this shape (no derived fields).
 * The first entry is the primary line — what a plain "Call" button uses when
 * there is no room to offer a choice.
 */
export const contactsDefault = [
  {
    id: 'bhawna-1',
    name: 'Bhawna Ma’am',
    role: 'Astrology, Kundli & Vastu',
    phone: '+91 99719 36761',
  },
  {
    id: 'bhawna-2',
    name: 'Bhawna Ma’am',
    role: 'Alternate line',
    phone: '+91 95602 94215',
  },
  {
    id: 'pankaj',
    name: 'Pankaj Sir',
    role: 'Astrology & Numerology',
    phone: '+91 88820 28574',
  },
];

/** Adds the digits-only form and the tel: / wa.me links to one contact. */
export function withLinks(contact) {
  const digits = String(contact?.phone || '').replace(/\D/g, '');
  return {
    ...contact,
    digits,
    tel: `tel:+${digits}`,
    whatsapp: `https://wa.me/${digits}`,
  };
}

/**
 * Turns whatever the CMS holds into a usable contact list. Anything empty or
 * malformed falls back to the built-in default, so the site always shows a
 * number somebody can actually ring.
 */
export function normaliseContacts(list) {
  const source =
    Array.isArray(list) && list.some((c) => c && c.phone) ? list : contactsDefault;
  return source
    .filter((c) => c && c.phone)
    .map((c, i) => withLinks({ id: c.id || `contact-${i}`, ...c }));
}

export const contacts = normaliseContacts(contactsDefault);

export const primaryContact = contacts[0];

/** Opens WhatsApp with a message already typed in. */
export function whatsappLink(contact, message) {
  const base = `https://wa.me/${contact.digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// TODO(launch): confirm the email and address before going live.
export const contactInfo = {
  phone: primaryContact.phone,
  whatsapp: primaryContact.phone,
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
