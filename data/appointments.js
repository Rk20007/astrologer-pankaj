import { consultants } from './pricing';
import { pujaGroups } from './puja';

const byId = (id) => consultants.find((c) => c.id === id);

/**
 * Turns a pricing plan into a bookable option for the appointment cards.
 * Vastu plans carry `tiers` instead of a flat price, so they expand into
 * one option per region.
 */
function planToOptions(plan) {
  if (plan.tiers) {
    return plan.tiers.map((tier) => ({
      id: `${plan.id}-${tier.label.toLowerCase().replace(/\s+/g, '-')}`,
      label: `${plan.name} — ${tier.label}`,
      price: tier.price,
      from: tier.from,
      suffix: tier.suffix,
      meta: [plan.mode].filter(Boolean),
      detail: plan.includes,
    }));
  }

  return [
    {
      id: plan.id,
      label: plan.mode ? `${plan.name} (${plan.mode})` : plan.name,
      price: plan.price,
      meta: [plan.duration, plan.applicableFor, plan.waiting].filter(Boolean),
      detail: plan.includes,
      urgentPrice: plan.urgentPrice,
      urgentNote: plan.urgentNote,
      popular: plan.popular,
    },
  ];
}

const pujaOptions = pujaGroups.flatMap((group) =>
  group.items.map((item) => ({
    id: item.id,
    label: item.detail ? `${item.name} — ${item.detail}` : item.name,
    price: item.price,
    meta: [group.name],
    detail: item.description,
  }))
);

export const appointmentCards = [
  {
    id: 'bhawna-upadhyay',
    title: 'Book Appointment – Bhawna Upadhyay',
    subtitle: 'TEDx Speaker • Vedic Astrologer • Spiritual Guide',
    image: '/bhawna-15.jpg',
    description: byId('bhawna').blurb,
    options: byId('bhawna').plans.flatMap(planToOptions),
  },
  {
    id: 'pankaj-ji',
    title: 'Book Appointment – Pankaj Ji',
    subtitle: 'Vedic Astrologer & Numerologist',
    // TODO(launch): swap in a real photograph of Pankaj Sir when one is supplied.
    image: '/art/consultant-pankaj.svg',
    description: byId('pankaj').blurb,
    options: byId('pankaj').plans.flatMap(planToOptions),
  },
  {
    id: 'online-pooja',
    title: 'Online Pooja',
    subtitle: 'Puja & Anushthan',
    image: '/art/pooja.svg',
    description:
      'Have a puja or anushthan performed on your behalf at Trimbakeshwar and other sacred sites, with the sankalp taken in your name.',
    options: pujaOptions,
    footerLink: { label: 'Read about each puja', href: '/puja' },
  },
  {
    id: 'gemstone',
    title: 'Gemstone',
    subtitle: 'Recommendation & Guidance',
    image: '/art/gemstone.svg',
    description:
      'Find out which gemstone suits your chart, the weight and metal to set it in, and the right day to begin wearing it.',
    // No price was supplied for gemstone guidance — quoted after the chart is reviewed.
    options: [
      {
        id: 'gemstone-recommendation',
        label: 'Gemstone Recommendation',
        priceLabel: 'On request',
        meta: ['Based on your birth chart'],
        detail:
          'Share your birth details and you will receive the recommended stone, its weight, the metal, and the muhurat to wear it. The fee is confirmed before payment.',
      },
    ],
  },
  {
    id: 'kundali-pdf',
    title: 'Detailed Kundali PDF',
    subtitle: 'Written Report',
    image: '/art/kundali.svg',
    description:
      'A written kundali report covering planetary positions, dashas, doshas and the remedies indicated for your chart — delivered as a PDF.',
    // No price was supplied for the Kundali PDF — quoted on enquiry.
    options: [
      {
        id: 'kundali-pdf-report',
        label: 'Detailed Kundali PDF',
        priceLabel: 'On request',
        meta: ['Delivered by email'],
        detail:
          'Send your date, exact time and place of birth. The fee and delivery time are confirmed before payment.',
      },
    ],
  },
];
