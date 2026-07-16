/**
 * Top YouTube podcast appearances.
 * `id` is the YouTube video id — it drives both the thumbnail and the embed.
 */
export const podcasts = [
  {
    id: '6tFzBvBrypk',
    title: 'Astrology, Karma & Life Purpose',
    description:
      'Bhawna Upadhyay on how planetary positions shape life patterns, and the remedies that actually move the needle.',
  },
  {
    id: 'OCfmY4WkfGk',
    title: 'Viral Remedies & Vedic Wisdom',
    description:
      'The remedies that reached millions — what they are, why they work, and how to practise them correctly.',
  },
  {
    id: '8loYSOG3fhU',
    title: 'Career, Money & Planetary Timing',
    description:
      'Reading dashas and transits for career moves, business decisions and financial turning points.',
  },
  {
    id: 'ofA2ZL1IUrI',
    title: 'Marriage, Relationships & Kundali Matching',
    description:
      'What kundali matching really measures, common doshas, and practical guidance for couples.',
  },
  {
    id: 'Ro48EPFiEUc',
    title: 'Spirituality, Vastu & Everyday Life',
    description:
      'Bringing Vastu and spiritual practice into daily living without upending your home or routine.',
  },
];

export const youtubeChannelUrl = 'https://www.youtube.com/@bhawnaupadhyay';

export const thumbnailUrl = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const watchUrl = (id) => `https://youtu.be/${id}`;
export const embedUrl = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
