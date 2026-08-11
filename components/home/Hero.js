'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/Button';
import SmartImage from '@/components/SmartImage';
import { useAppointmentModal } from '@/components/AppointmentModal';
import { homeBanner as defaultBanner } from '@/data/homeBanner';

export default function HomeHero({ banner }) {
  const { open: openAppointment } = useAppointmentModal();
  // Every field falls back to the built-in default, so clearing one in the
  // admin panel can never leave the banner half-rendered.
  const b = { ...defaultBanner, ...(banner || {}) };
  const trustBadges = Array.isArray(b.trustBadges) ? b.trustBadges : defaultBanner.trustBadges;

  return (
    // The navbar is fixed and already leaves a 4rem spacer above this section,
    // so only desktop gets the extra breathing room — on phones that stacked up
    // into a large empty band between the logo and the headline.
    <section className="relative flex items-center justify-center overflow-hidden mandala-bg pb-12 pt-4 sm:pt-8 md:min-h-[calc(100vh-4rem)] md:pb-16 md:pt-6">
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
        {/* items-start on desktop: centring the shorter text column against the
            tall portrait pushed the headline a long way down the page. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center md:items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-5 md:space-y-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold uppercase tracking-wide">
                {b.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-5xl sm:text-6xl font-bold text-foreground leading-tight"
            >
              {b.heading}{' '}
              <span className="bg-gradient-to-r from-primary via-gold-light to-accent bg-clip-text text-transparent">
                {b.headingHighlight}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              {b.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              {b.primaryButtonLabel && (
                <Link href={b.primaryButtonHref || '/services'}>
                  <Button variant="primary" size="lg">
                    {b.primaryButtonLabel}
                  </Button>
                </Link>
              )}
              {b.secondaryButtonLabel && (
                <Button variant="outline" size="lg" onClick={openAppointment}>
                  {b.secondaryButtonLabel}
                </Button>
              )}
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground"
            >
              {trustBadges.map((badge, i) => (
                <div key={`${badge.value}-${i}`} className="flex items-center gap-2">
                  <span className="text-2xl text-primary font-bold">{badge.value}</span>
                  <span className="text-xs">{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
          

          {/* Right Visual Element - Bhawna Upadhyay Banner */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden ring-1 ring-accent/40 shadow-[0_20px_60px_rgba(212,175,55,0.3)]">
              <SmartImage
                src={b.image}
                alt={b.altText || b.captionName || ''}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="font-serif text-2xl font-bold drop-shadow">{b.captionName}</p>
                <p className="text-sm text-white/90 drop-shadow">{b.captionLine}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-muted-foreground md:block"
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
