/**
 * Puja & Anushthan offerings, grouped by tradition.
 * Source of truth for both the /puja page and the "Online Pooja" appointment card.
 */

export const pujaGroups = [
  {
    id: 'trimbakeshwar',
    name: 'Trimbakeshwar Jyotirlinga',
    location: 'Nashik, Maharashtra',
    description:
      'One of the twelve Jyotirlingas, and the only place where Tripindi Shraddh and Narayan Nagbali are traditionally performed. Rituals are conducted by temple-appointed priests.',
    items: [
      {
        id: 'tripindi-shraddh',
        name: 'Tripindi Shraddh',
        price: 11000,
        description:
          'Performed to bring peace to ancestors whose last rites remained incomplete, and to relieve Pitru Dosha across three generations.',
      },
      {
        id: 'narayan-nagbali',
        name: 'Narayan Nagbali',
        price: 11000,
        description:
          'A three-day ritual for Pitru Dosha and Naag Dosha — traditionally performed to release ancestral debts and unfulfilled desires of departed souls.',
      },
      {
        id: 'kaal-sarp-shanti',
        name: 'Kaal-Sarp Shanti Puja',
        price: 21000,
        description:
          'For those with Kaal Sarp Yoga in the birth chart, to ease its effect on career, health and family life.',
      },
      {
        id: 'grah-mantra-jaap',
        name: 'Grah Mantra Jaap',
        detail: '18,000 mantra',
        price: 11000,
        description:
          'Dedicated mantra chanting for the planet afflicting your chart, completed to the prescribed count of 18,000.',
      },
      {
        id: 'navgrah-shanti-havan',
        name: 'Navgrah Shanti Havan',
        price: 21000,
        description:
          'A havan invoking all nine planets together, to settle overall planetary disturbance and restore balance.',
      },
    ],
  },
  {
    id: 'mahamrityunjai',
    name: 'Mahamrityunjai Anushthan',
    subtitle: '7 Sidh Bali Bhramanu Dwara',
    description:
      'The Mahamrityunjaya mantra anushthan, performed by seven accomplished brahmins, is traditionally undertaken for health, longevity and protection from grave difficulty.',
    items: [
      {
        id: 'mahamrityunjai-21000',
        name: '21,000 Chants',
        price: 210000,
        description: 'Anushthan completed to 21,000 chants by 7 Sidh Bali Bhramanu.',
      },
      {
        id: 'mahamrityunjai-51000',
        name: '51,000 Chants',
        price: 51000,
        description: 'Anushthan completed to 51,000 chants by 7 Sidh Bali Bhramanu.',
      },
    ],
  },
  {
    id: 'baglamukhi',
    name: 'Maa Baglamukhi Pooja',
    description:
      'Maa Baglamukhi is invoked for victory over opposition, protection from ill intent, and stability at home and in business. Meetha and Kadwa havan serve different intentions.',
    items: [
      {
        id: 'baglamukhi-meetha',
        name: 'Ghar ki Shanti',
        detail: 'Meetha Havan',
        price: 11000,
        description: 'For peace at home, harmony in the family and a settled household atmosphere.',
      },
      {
        id: 'baglamukhi-kadwa',
        name: 'Karobar Faeda',
        detail: 'Kadwa Havan',
        price: 15000,
        description: 'For business growth, removing obstruction in trade and recovering stuck work.',
      },
      {
        id: 'baglamukhi-both',
        name: 'Kadwa + Meetha Havan',
        price: 18000,
        description: 'Both havans performed together, covering home peace and business benefit.',
      },
      {
        id: 'baglamukhi-tantra',
        name: 'Tantra Havan',
        detail: 'Court Case, Shatru Vinash, Buri Nazar, Tantra Mantra Nivaran',
        price: 41000,
        description:
          'The most intensive of the Baglamukhi rituals — undertaken for court matters, persistent opposition, and removal of buri nazar and tantric affliction.',
      },
    ],
  },
];

/** Flat list of every puja, handy for lookups and the appointment card. */
export const allPujas = pujaGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, groupId: group.id, groupName: group.name }))
);
