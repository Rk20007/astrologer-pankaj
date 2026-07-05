'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/Button';

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
                Ancient Wisdom, Modern Guidance
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-5xl sm:text-6xl font-bold text-foreground leading-tight"
            >
              Discover Your Cosmic{' '}
              <span className="bg-gradient-to-r from-primary via-gold-light to-accent bg-clip-text text-transparent">
                Destiny
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              Expert astrology, numerology, and Vastu guidance from India's most trusted consultants. Transform your life with ancient wisdom and modern insights.
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

          {/* Right Visual Element - Sacred Mandala */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-96 md:h-full flex items-center justify-center"
          >
            {/* Outer Zodiac Ring */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute w-80 h-80 rounded-full border-2 border-primary/30 shadow-[0_0_40px_rgba(212,175,55,0.2)]"
            />

            {/* Sacred Mandala Circles */}
            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute w-64 h-64 rounded-full border-2 border-accent/40 shadow-[0_0_30px_rgba(244,208,111,0.15)]"
            />

            {/* Inner Circle */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute w-48 h-48 rounded-full border-2 border-primary/60 shadow-[inset_0_0_30px_rgba(212,175,55,0.2)]"
            />

            {/* Central Element - Om Symbol */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center text-white text-7xl font-serif font-bold shadow-[0_0_40px_rgba(212,175,55,0.4)] border-2 border-accent/50"
            >
              ॐ
            </motion.div>
          </motion.div>
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
