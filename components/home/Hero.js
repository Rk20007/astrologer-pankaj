'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/Button';
import SmartImage from '@/components/SmartImage';

export default function HomeHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden mandala-bg pt-20">
      {/* Golden Light Rays */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-gradient-to-b from-primary/20 via-transparent to-transparent blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/8 to-accent/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-secondary/6 to-primary/4 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold uppercase tracking-wide">
                Bhawna Upadhyay • TEDx Speaker
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-5xl sm:text-6xl font-bold text-foreground leading-tight"
            >
              Shift Your Energies with{' '}
              <span className="bg-gradient-to-r from-primary via-gold-light to-accent bg-clip-text text-transparent">
                Bhawna Upadhyay
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              A TEDx speaker, astrologer, and Vastu consultant with 15+ years of experience, Bhawna Upadhyay blends ancient Vedic wisdom with modern insight — offering personalised astrology, Kundli, and Vastu guidance to transform your life.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/services">
                <Button variant="primary" size="lg">
                  Explore Services
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Book Consultation
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-6 pt-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl text-primary font-bold">20+</span>
                <span className="text-xs">Years of<br />Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl text-primary font-bold">5000+</span>
                <span className="text-xs">Happy<br />Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl text-primary font-bold">100%</span>
                <span className="text-xs">Satisfaction<br />Guaranteed</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual Element - Bhawna Upadhyay Banner */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden ring-1 ring-accent/40 shadow-[0_20px_60px_rgba(212,175,55,0.3)]">
              <SmartImage
                src="/bhawna-15.jpg"
                alt="Bhawna Upadhyay — Astrologer & Vastu Consultant"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="font-serif text-2xl font-bold drop-shadow">Bhawna Upadhyay</p>
                <p className="text-sm text-white/90 drop-shadow">Astrologer &amp; Vastu Consultant • TEDx Speaker</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
}
