/**
 * Achievements shown on the home page.
 *
 * Each item points at an image in /public. These currently reuse existing
 * photos as placeholders — replace the `image` paths (and text) with the real
 * achievement / award photos, or manage them from the admin panel once wired.
 */
export const achievements = {
  heading: 'Achievements & Recognition',
  subheading:
    'Milestones, honours and moments that reflect years of trusted guidance and service.',
  items: [
    {
      id: 'tedx',
      image: '/bhawna-05.jpg',
      title: 'TEDx Speaker',
      description:
        'Invited to the TEDx stage to share the practical wisdom of Vedic astrology with a global audience.',
    },
    {
      id: 'clients',
      image: '/bhawna-11.jpg',
      title: '5000+ Clients Guided',
      description:
        'Trusted by thousands across India and abroad for kundli readings, Vastu and life guidance.',
    },
    {
      id: 'media',
      image: '/bhawna-13.jpg',
      title: 'Featured in Media',
      description:
        'Recognised across print, television and digital platforms as a leading Vedic astrologer.',
    },
    {
      id: 'awards',
      image: '/bhawna-14.jpg',
      title: 'Awards & Honours',
      description:
        'Honoured for excellence and contribution to Vedic astrology and Vastu Shastra.',
    },
  ],
};
