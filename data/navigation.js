import { youtubeChannelUrl } from './podcasts';

// Contact details live in data/site.js — re-exported so existing imports keep working.
export { contactInfo } from './site';

export const navLinks = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
  },
  {
    id: 'services',
    label: 'Services',
    href: '/services',
  },
  {
    id: 'appointments',
    label: 'Appointments',
    href: '/appointments',
  },
  {
    id: 'pricing',
    label: 'Pricing',
    href: '/pricing',
  },
  {
    id: 'puja',
    label: 'Puja & Anushthan',
    href: '/puja',
  },
  {
    id: 'podcast',
    label: 'Podcast',
    href: '/podcast',
  },
  {
    id: 'faq',
    label: 'FAQ',
    href: '/faq',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '/contact',
  },
];

export const footerLinks = [
  {
    title: 'Consultations',
    links: [
      { label: 'Book an Appointment', href: '/appointments' },
      { label: 'Consultation Charges', href: '/pricing' },
      { label: 'Vastu Consultation', href: '/pricing#bhawna' },
      { label: 'Detailed Kundali PDF', href: '/appointments#kundali-pdf' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'About Bhawna Upadhyay', href: '/about' },
      { label: 'Puja & Anushthan', href: '/puja' },
      { label: 'Podcast Appearances', href: '/podcast' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Cancellation Policy', href: '/cancellation' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export const socialLinks = [
  {
    platform: 'youtube',
    url: youtubeChannelUrl,
    label: 'YouTube',
  },
  {
    platform: 'instagram',
    url: 'https://instagram.com',
    label: 'Instagram',
  },
  {
    platform: 'facebook',
    url: 'https://facebook.com',
    label: 'Facebook',
  },
];
