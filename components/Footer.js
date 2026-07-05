'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { footerLinks, contactInfo, socialLinks } from '@/data/navigation';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-foreground text-background pt-16 pb-8 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.1)_0%,transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Temple Divider Top */}
        <div className="temple-divider-ornate mb-12" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-serif font-bold text-xl border border-primary/40"
              >
                ॐ
              </motion.div>
              <span className="font-serif font-bold text-2xl text-accent">Astrology</span>
            </div>
            <p className="text-background/80 text-sm leading-relaxed font-medium">
              Premium astrology consultation services with expert guidance from experienced astrologers. Transform your life with ancient wisdom and modern insights.
            </p>
          </motion.div>

          {/* Links Sections */}
          {footerLinks.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (idx + 1) * 0.1 }}
            >
              <h3 className="font-serif font-bold text-lg mb-6 text-accent relative inline-block">
                {section.title}
                <motion.span
                  layoutId="underline"
                  className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ delay: 0.3 }}
                />
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-background/70 hover:text-accent transition-all duration-300 text-sm font-medium group flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 border-t border-accent/20 border-b border-accent/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="group bg-background/40 rounded-xl p-4 border border-accent/30 hover:border-accent/50 transition-all"
          >
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
              >
                <Phone className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <p className="text-background/60 text-xs font-bold uppercase tracking-wide">Phone</p>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-primary font-bold text-lg hover:text-accent transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group bg-background/40 rounded-xl p-4 border border-accent/30 hover:border-accent/50 transition-all"
          >
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
              >
                <Mail className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <p className="text-background/60 text-xs font-bold uppercase tracking-wide">Email</p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-accent font-bold text-lg hover:text-primary transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group bg-background/40 rounded-xl p-4 border border-accent/30 hover:border-accent/50 transition-all"
          >
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
              >
                <MapPin className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <p className="text-background/60 text-xs font-bold uppercase tracking-wide">Location</p>
                <p className="text-accent font-bold">{contactInfo.address}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center items-center space-x-4 py-12">
          {socialLinks.map((social, idx) => (
            <motion.a
              key={social.platform}
              href={social.url}
              aria-label={social.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-primary hover:bg-accent border border-primary/40 transition-all flex items-center justify-center text-white font-bold text-lg hover:shadow-[0_4px_16px_rgba(199,107,0,0.3)]"
            >
              <span className="text-white text-sm font-bold">
                {social.platform === 'instagram' && '📱'}
                {social.platform === 'facebook' && 'f'}
                {social.platform === 'youtube' && '▶'}
                {social.platform === 'twitter' && 'X'}
              </span>
            </motion.a>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-accent/20 pt-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center text-background/70 text-xs font-medium uppercase tracking-wide"
          >
            © {currentYear} Astrology Consultation Services. All rights reserved. |{' '}
            <Link href="/privacy" className="text-primary hover:text-accent transition-colors font-semibold">
              Privacy
            </Link>
            {' | '}
            <Link href="/terms" className="text-primary hover:text-accent transition-colors font-semibold">
              Terms
            </Link>
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
