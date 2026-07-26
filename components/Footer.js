'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { footerLinks, socialLinks } from '@/data/navigation';
import { site, contactInfo } from '@/data/site';
import { useSiteConfig } from '@/components/useSiteConfig';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from '@/components/SocialIcons';

const socialIcons = {
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  // Numbers are edited in Admin → Website Content → WhatsApp Numbers.
  const { contacts } = useSiteConfig();

  return (
    <footer className="relative overflow-hidden bg-foreground pb-8 pt-16 text-background">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.1)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="temple-divider-ornate mb-12" />

        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex flex-col leading-none">
              <span className="font-serif text-2xl font-bold text-accent">{site.name}</span>
              <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-background/60">
                Vedic Astrologer
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-background/80">
              TEDx Speaker, Vedic astrologer and spiritual guide. Personalised consultations,
              authentic remedies, and puja performed at sacred sites — guidance rooted in Vedic
              wisdom and made practical for everyday life.
            </p>
          </motion.div>

          {/* Link columns */}
          {footerLinks.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx + 1) * 0.1 }}
            >
              <h3 className="mb-6 font-serif text-lg font-bold text-accent">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm font-medium text-background/70 transition-all duration-300 hover:text-accent"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/0 transition-all group-hover:bg-primary" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp lines — the fastest way to reach the team, so they get their
            own highlighted band rather than a line inside the contact strip. */}
        <div className="rounded-3xl border border-green-500/40 bg-gradient-to-br from-green-500/15 via-green-500/5 to-transparent p-6 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_6px_20px_rgba(34,197,94,0.4)]">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="font-serif text-xl font-bold text-accent">Talk to us on WhatsApp</p>
                <p className="text-sm text-background/70">
                  Tap a number to chat, or call directly — we reply within working hours.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="rounded-2xl border border-accent/30 bg-background/10 p-4 transition-all hover:border-green-400/60 hover:bg-background/20"
              >
                <p className="truncate font-bold text-accent">{contact.name}</p>
                {contact.role && (
                  <p className="truncate text-xs text-background/60">{contact.role}</p>
                )}
                <p className="mt-2 font-mono text-lg font-bold tracking-wide text-white">
                  {contact.phone}
                </p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-green-500"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <a
                    href={contact.tel}
                    aria-label={`Call ${contact.name} on ${contact.phone}`}
                    className="inline-flex items-center justify-center rounded-lg border border-accent/50 px-3 py-2 text-accent transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact strip */}
        <div className="mt-12 grid grid-cols-1 gap-6 border-y border-accent/20 py-12 md:grid-cols-2">
          <div className="rounded-xl border border-accent/30 bg-background/40 p-4 transition-all hover:border-accent/50">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-background/60">
                  Email
                </p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="break-all font-bold text-accent transition-colors hover:text-primary"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-accent/30 bg-background/40 p-4 transition-all hover:border-accent/50">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-background/60">
                  Location
                </p>
                <p className="font-bold text-accent">{contactInfo.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="flex items-center justify-center space-x-4 py-12">
          {socialLinks.map((social, idx) => {
            const Icon = socialIcons[social.platform];
            return (
              <motion.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary text-white transition-all hover:bg-accent hover:text-foreground hover:shadow-[0_4px_16px_rgba(199,107,0,0.3)]"
              >
                {Icon ? <Icon className="h-5 w-5" /> : social.label[0]}
              </motion.a>
            );
          })}
        </div>

        <div className="border-t border-accent/20 pt-8">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-background/70">
            © {currentYear} {site.name}. All rights reserved. |{' '}
            <Link
              href="/privacy"
              className="font-semibold text-primary transition-colors hover:text-accent"
            >
              Privacy
            </Link>
            {' | '}
            <Link
              href="/terms"
              className="font-semibold text-primary transition-colors hover:text-accent"
            >
              Terms
            </Link>
            {' | '}
            <Link
              href="/cancellation"
              className="font-semibold text-primary transition-colors hover:text-accent"
            >
              Cancellation
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
