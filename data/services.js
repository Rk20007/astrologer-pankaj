import { consultants as pricingConsultants } from './pricing';

/**
 * Marketing copy per service. Prices, durations and waiting times are NOT
 * repeated here — they are pulled from data/pricing.js so the services page
 * and the pricing page can never disagree about what something costs.
 */
const copy = {
  'bhawna-kundli-audio': {
    description:
      'A full reading of your birth chart over an audio call, with the remedies indicated for your situation.',
    benefits: [
      'Complete birth chart interpretation',
      'Planetary positions, dasha and transit analysis',
      'Answers to the questions you bring',
      'Personalized remedies included',
    ],
  },
  'bhawna-kundli-video': {
    description:
      'The same full kundli reading, face to face over video — the most commonly booked consultation.',
    benefits: [
      'Complete birth chart interpretation',
      'Face-to-face guidance over video',
      'Career, marriage, health and finance questions',
      'Personalized remedies included',
    ],
  },
  'bhawna-urgent-audio': {
    description:
      'A priority audio slot when the matter cannot wait for the standard queue.',
    benefits: [
      'Scheduled within 2–3 days of payment',
      'Full reading, not a shortened one',
      'Direct answers on the pressing matter',
      'Personalized remedies included',
    ],
  },
  'bhawna-urgent-video': {
    description:
      'A priority video slot with the full reading, scheduled within days rather than weeks.',
    benefits: [
      'Scheduled within 2–3 days of payment',
      'Face-to-face guidance over video',
      'Full chart reading and remedies',
      'Personalized remedies included',
    ],
  },
  'bhawna-office': {
    description:
      'An in-person consultation at the office, with your chart prepared and discussed across the table.',
    benefits: [
      'In-person kundli consultation',
      'Longer 30 minute session',
      'Remedies explained and demonstrated',
      'Personalized remedies included',
    ],
  },
  'bhawna-couple': {
    description:
      'For two people together — kundali matching and practical guidance on the relationship itself.',
    benefits: [
      'Both charts read and matched',
      'Dosha assessment and remedies',
      'Relationship and marriage guidance',
      'Auspicious dates where relevant',
    ],
  },
  'bhawna-vastu': {
    description:
      'An on-site Vastu assessment of your home or workplace, with corrections you can actually carry out.',
    benefits: [
      'Full directional and layout assessment',
      'Element balancing guidance',
      'Practical, buildable corrections',
      'Follow-up support on implementation',
    ],
  },
  'pankaj-astrology': {
    description:
      'A focused Vedic astrology reading over an audio call, covering the questions that matter most to you.',
    benefits: [
      'Birth chart analysis',
      'Career and business guidance',
      'Relationship insights',
      'Remedy suggestions',
    ],
  },
  'pankaj-numerology': {
    description:
      'Numerology guidance — life path, name and business numbers, and the dates that favour you.',
    benefits: [
      'Life path number analysis',
      'Name correction guidance',
      'Business and mobile numbers',
      'Favourable dates',
    ],
  },
  'pankaj-combo': {
    description:
      'Astrology and numerology together in one longer session, for a fuller picture and combined remedies.',
    benefits: [
      'Birth chart analysis',
      'Numerology life path',
      'Combined recommendations',
      'Gemstone and remedy suggestions',
    ],
  },
  'pankaj-couple': {
    description:
      'Kundali match making and marriage guidance for couples and families considering a match.',
    benefits: [
      'Kundali matching for both charts',
      'Compatibility assessment',
      'Dosha remedies',
      'Guidance on timing',
    ],
  },
  'pankaj-vastu': {
    description:
      'On-site Vastu consultation for homes and commercial spaces, with practical corrective steps.',
    benefits: [
      'Space and directional assessment',
      'Element balancing',
      'Practical corrections',
      'Implementation guidance',
    ],
  },
};

/**
 * Flattens every consultant's plans into the shape the service cards render.
 * Price fields mirror data/pricing.js exactly.
 */
export const services = pricingConsultants.flatMap((consultant) =>
  consultant.plans.map((plan) => ({
    id: plan.id,
    consultant: consultant.name,
    consultantId: consultant.id,
    name: plan.mode ? `${plan.name} (${plan.mode})` : plan.name,
    shortName: plan.name,
    duration: plan.duration || 'On-site',
    price: plan.price ?? null,
    tiers: plan.tiers ?? null,
    urgent: plan.urgentPrice ?? null,
    urgentNote: plan.urgentNote ?? null,
    waitingText: plan.waiting ?? null,
    includes: plan.includes ?? null,
    popular: Boolean(plan.popular),
    description: copy[plan.id]?.description ?? '',
    benefits: copy[plan.id]?.benefits ?? [],
  }))
);

export const consultants = [
  {
    id: 'bhawna',
    name: 'Bhawna Upadhyay',
    title: 'Vedic Astrologer & Vastu Consultant',
    experience: '15+ years',
    specialization: 'Kundli Reading, Vastu Shastra, Relationship & Career Guidance',
    image: '/bhawana-011.jpeg',
    bio: 'A TEDx speaker and trusted astrologer, Bhawna Upadhyay combines traditional Vedic astrology and Vastu Shastra with a clear, practical reading of the life in front of her — helping people shift their energies and transform their personal and professional lives.',
    featured: true,
  },
  {
    id: 'pankaj',
    name: 'Pankaj Sir',
    title: 'Vedic Astrologer & Numerologist',
    experience: '20+ years',
    specialization: 'Vedic Astrology, Numerology, Vastu Shastra',
    image: '/pankaj2.jpeg',
    bio: 'With over two decades of experience, Pankaj Sir has guided thousands of individuals through life\'s challenges with profound astrological and numerological insight.',
  },
];
