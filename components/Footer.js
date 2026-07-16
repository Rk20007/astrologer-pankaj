'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { footerLinks, socialLinks } from '@/data/navigation';
import { site, contactInfo, phoneDigits } from '@/data/site';
import { Mail, Phone, MapPin } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from '@/components/SocialIcons';

const socialIcons = {
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

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

        {/* Contact strip */}
        <div className="grid grid-cols-1 gap-6 border-y border-accent/20 py-12 md:grid-cols-3">
          <div className="rounded-xl border border-accent/30 bg-background/40 p-4 transition-all hover:border-accent/50">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-background/60">
                  Phone
                </p>
                <a
                  href={`tel:${phoneDigits}`}
                  className="font-bold text-primary transition-colors hover:text-accent"
                >
                  {contactInfo.phone}
                </a>
              </div>
            </div>
          </div>

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
