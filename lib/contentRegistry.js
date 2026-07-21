/**
 * The single source of truth for every editable piece of content on the site.
 *
 * Each entry maps a `key` to:
 *   - label / description / group : how it shows in the admin panel
 *   - default : the value used when nothing has been saved in the database yet
 *     (imported straight from the existing /data files, so the site looks
 *      exactly the same until someone edits it)
 *
 * To make a new section editable: add an entry here, then read it on the page
 * with `getContent('<key>')` (see lib/content.js).
 */
import { achievements } from '@/data/achievements';
import { site, contactInfo } from '@/data/site';
import { navLinks, footerLinks, socialLinks } from '@/data/navigation';
import { testimonials } from '@/data/testimonials';
import { faqs } from '@/data/faq';
import { podcasts } from '@/data/podcasts';
import { consultants as pricingConsultants } from '@/data/pricing';
import { consultants as consultantProfiles } from '@/data/services';
import { pujaGroups } from '@/data/puja';

// Home page stats live in the component today; the default is defined here so
// they become editable like everything else.
export const defaultStats = [
  { label: 'Years of Experience', value: 20, suffix: '+' },
  { label: 'Happy Clients', value: 5000, suffix: '+' },
  { label: 'Successful Consultations', value: 12000, suffix: '+' },
  { label: 'Satisfaction Rate', value: 98, suffix: '%' },
];

export const contentRegistry = {
  // ---- Home page ----
  stats: {
    label: 'Home — Stats',
    description: 'The animated counters (years, clients, consultations, rate).',
    group: 'Home Page',
    default: defaultStats,
  },
  achievements: {
    label: 'Home — Achievements',
    description: 'Achievement / award cards with images and captions.',
    group: 'Home Page',
    default: achievements,
  },

  // ---- People ----
  consultantProfiles: {
    label: 'Consultants',
    description: 'Astrologer profiles — name, title, photo and bio.',
    group: 'People',
    default: consultantProfiles,
  },

  // ---- Services & pricing ----
  pricing: {
    label: 'Services & Pricing',
    description: 'Every consultation plan, its price, duration and details.',
    group: 'Services',
    default: pricingConsultants,
  },
  puja: {
    label: 'Puja & Anushthan',
    description: 'Puja groups and the items offered within each.',
    group: 'Services',
    default: pujaGroups,
  },

  // ---- Social proof ----
  testimonials: {
    label: 'Testimonials',
    description: 'Client reviews shown across the site.',
    group: 'Content',
    default: testimonials,
  },
  faqs: {
    label: 'FAQs',
    description: 'Frequently asked questions and their answers.',
    group: 'Content',
    default: faqs,
  },
  podcasts: {
    label: 'Podcasts',
    description: 'YouTube podcast videos shown on the home and podcast pages.',
    group: 'Content',
    default: podcasts,
  },

  // ---- Site-wide ----
  site: {
    label: 'Site Info',
    description: 'Site name, tagline and other global text.',
    group: 'Site-wide',
    default: site,
  },
  contact: {
    label: 'Contact Details',
    description: 'Phone, WhatsApp, email and address.',
    group: 'Site-wide',
    default: contactInfo,
  },
  navigation: {
    label: 'Navigation & Social Links',
    description: 'Header menu, footer links and social media URLs.',
    group: 'Site-wide',
    default: { navLinks, footerLinks, socialLinks },
  },
};

export const contentKeys = Object.keys(contentRegistry);

export function getDefault(key) {
  return contentRegistry[key]?.default;
}

export function isValidKey(key) {
  return Object.prototype.hasOwnProperty.call(contentRegistry, key);
}
