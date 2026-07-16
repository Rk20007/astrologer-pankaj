/**
 * Consultation charges. This is the single source of truth for prices —
 * the pricing page and the appointment cards both read from here.
 *
 * A plan carries either a flat `price`, or a list of `tiers` when the charge
 * varies by region (Vastu). `from: true` renders as "Starting from ...".
 */

export const consultants = [
  {
    id: 'bhawna',
    name: 'Bhawna Upadhyay',
    title: 'TEDx Speaker • Vedic Astrologer & Spiritual Guide',
    greeting: 'Har Har Mahadev 🙏🏼 🕉️ 🙏🏼',
    image: '/bhawna-15.jpg',
    blurb:
      'Personal consultations with Bhawna Upadhyay — kundli analysis, life guidance and the personalised remedies she is known for worldwide.',
    plans: [
      {
        id: 'bhawna-kundli-audio',
        name: 'Kundli Reading',
        mode: 'Audio Call',
        duration: '20 Minutes',
        applicableFor: '1 Person',
        price: 11000,
        waiting: '15 days waiting after payment',
        includes: 'Includes personalized remedies.',
      },
      {
        id: 'bhawna-kundli-video',
        name: 'Kundli Reading',
        mode: 'Video Call',
        duration: '20 Minutes',
        applicableFor: '1 Person',
        price: 15000,
        waiting: '10–15 days waiting after payment',
        includes: 'Includes personalized remedies.',
        popular: true,
      },
      {
        id: 'bhawna-urgent-audio',
        name: 'Urgent Audio Consultation',
        mode: 'Audio Call',
        duration: '20 Minutes',
        applicableFor: '1 Person',
        price: 21000,
        waiting: '2–3 days waiting after payment',
        includes: 'Includes personalized remedies.',
        urgent: true,
      },
      {
        id: 'bhawna-urgent-video',
        name: 'Urgent Video Consultation',
        mode: 'Video Call',
        duration: '20 Minutes',
        applicableFor: '1 Person',
        price: 25000,
        waiting: '2–3 days waiting after payment',
        includes: 'Includes personalized remedies.',
        urgent: true,
      },
      {
        id: 'bhawna-office',
        name: 'Office Consultation',
        mode: 'In Person',
        duration: '30 Minutes',
        applicableFor: '1 Person',
        price: 31000,
        waiting: '1 week waiting after payment',
        includes: 'In-office Kundli consultation with remedies.',
      },
      {
        id: 'bhawna-couple',
        name: 'Couple Consultation',
        mode: 'Online / Video',
        duration: '45 Minutes',
        applicableFor: '2 Persons',
        price: 51000,
        waiting: '1 week waiting after payment',
        includes: 'Kundali matching and relationship solutions.',
      },
      {
        id: 'bhawna-vastu',
        name: 'Vastu Consultation',
        mode: 'On-site',
        tiers: [
          { label: 'Delhi NCR', price: 75000, from: true },
          { label: 'Pan India', price: 150000, from: true, suffix: '+ Travel + Stay' },
        ],
        includes: 'On-site Vastu assessment with corrective guidance.',
      },
    ],
  },
  {
    id: 'pankaj',
    name: 'Pankaj Sir',
    title: 'Vedic Astrologer & Numerologist',
    greeting: 'Har Har Mahadev',
    image: '/consultants/pankaj.jpg',
    blurb:
      'Astrology and numerology consultations with Pankaj Sir — practical readings for career, marriage and everyday decisions.',
    plans: [
      {
        id: 'pankaj-astrology',
        name: 'Astrology',
        mode: 'Audio Call',
        duration: '20 Minutes',
        price: 2100,
        waiting: '7 days waiting',
        urgentPrice: 7000,
        urgentNote: 'within 24 hours',
      },
      {
        id: 'pankaj-numerology',
        name: 'Numerology',
        mode: 'Audio Call',
        duration: '20 Minutes',
        price: 2100,
        waiting: '7 days waiting',
        urgentPrice: 7000,
        urgentNote: 'within 24 hours',
      },
      {
        id: 'pankaj-combo',
        name: 'Astrology + Numerology (Combo)',
        mode: 'Audio Call',
        duration: '30 Minutes',
        price: 5100,
        waiting: '7 days waiting',
        urgentPrice: 11000,
        urgentNote: 'within 24 hours',
        popular: true,
      },
      {
        id: 'pankaj-couple',
        name: 'Couple Consultation / Marriage / Kundali Match Making',
        mode: 'Audio Call',
        duration: '30 Minutes',
        price: 7100,
        waiting: '7 days waiting',
        urgentPrice: 12000,
        urgentNote: 'within 24 hours',
      },
      {
        id: 'pankaj-vastu',
        name: 'Vastu',
        mode: 'On-site',
        tiers: [
          { label: 'Delhi NCR', price: 45000, suffix: '+ Travel' },
          { label: 'Pan India', price: 65000, suffix: '+ Travel' },
        ],
      },
    ],
  },
];

export const pricingFAQ = [
  {
    question: 'How soon will I get my consultation slot?',
    answer:
      'Each service lists its own waiting time, counted from the date of payment. Standard Kundli readings with Bhawna Upadhyay have a 10–15 day waiting period; urgent audio and video consultations are scheduled within 2–3 days. Pankaj Sir\'s consultations have a 7 day waiting period, or within 24 hours on the urgent rate.',
  },
  {
    question: 'What is the difference between the standard and the urgent rate?',
    answer:
      'The urgent rate buys you a priority slot when you cannot wait. The consultation itself — the duration, the depth of the reading and the remedies — is exactly the same.',
  },
  {
    question: 'Are remedies included in the consultation fee?',
    answer:
      'Yes. Every consultation with Bhawna Upadhyay includes personalized remedies at no extra charge. Materials for any puja or anushthan you choose to have performed are charged separately.',
  },
  {
    question: 'Why is Vastu quoted as a starting price?',
    answer:
      'Vastu consultation is charged on-site and depends on the size of the property and the scope of the assessment. Delhi NCR starts at ₹75,000 with Bhawna Upadhyay and ₹45,000 with Pankaj Sir. Pan India visits are additionally charged for travel and stay. Share your property details and the final quote will be confirmed before you pay.',
  },
  {
    question: 'Can two people join the same consultation?',
    answer:
      'The Couple Consultation is designed for two people and covers kundali matching and relationship guidance. All other consultations are for one person.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Send your booking request through the form and you will receive payment details along with the confirmation. Your slot is held once payment is received.',
  },
];
