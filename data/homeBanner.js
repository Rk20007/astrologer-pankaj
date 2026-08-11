/**
 * The hero banner at the top of the home page.
 *
 * This is the default shown until it is edited in the admin panel
 * (Website Content → Home — Banner), which is why every piece of the banner —
 * the badge, headline, photo and the small trust figures — is data rather than
 * markup.
 */
export const homeBanner = {
  badge: 'Bhawna Upadhyay • TEDx Speaker',
  heading: 'Shift Your Aura with',
  // Rendered in the gold gradient at the end of the headline.
  headingHighlight: 'Bhawna Upadhyay',
  description:
    'A TEDx speaker, astrologer, and Vastu consultant with 15+ years of experience, Bhawna Upadhyay blends ancient Vedic wisdom with modern insight — offering personalised astrology, Kundli, and Vastu guidance to transform your life.',
  primaryButtonLabel: 'Explore Services',
  primaryButtonHref: '/services',
  // Opens the appointment picker, so it needs no link.
  secondaryButtonLabel: 'Book Consultation',
  trustBadges: [
    { value: '20+', label: 'Years of Experience' },
    { value: '5000+', label: 'Happy Clients' },
    { value: '100%', label: 'Satisfaction Guaranteed' },
  ],
  image: '/bhawana-012.jpeg',
  // Written over the bottom of the photo. Named without the word "image" so the
  // admin form renders them as text rather than as image pickers.
  captionName: 'Bhawna Upadhyay',
  captionLine: 'Astrologer & Vastu Consultant • TEDx Speaker',
  altText: 'Bhawna Upadhyay — Astrologer & Vastu Consultant',
};
