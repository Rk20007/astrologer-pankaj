'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { services, consultants } from '@/data/services';
import SmartImage from '@/components/SmartImage';
import Link from 'next/link';
import Button from '@/components/Button';
import ServicePrice from '@/components/ServicePrice';
import { Clock, X } from 'lucide-react';

// Modal that lets the visitor pick one of a consultant's services and book it.
function ServicePickerModal({ consultant, services: list, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Book with ${consultant.name}`}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-accent/50 bg-card shadow-2xl outline-none sm:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-border p-6">
          <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-accent/40">
            <SmartImage src={consultant.image} alt="" className="h-full w-full object-cover object-top" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              {consultant.title}
            </p>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Choose a service to book
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Service list */}
        <div className="space-y-4 overflow-y-auto p-6">
          {list.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl border border-border bg-background/70 p-4 transition-all hover:border-primary/60"
            >
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-bold text-foreground">{service.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {service.duration}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-end">
                <ServicePrice service={service} />
                <Link
                  href={`/contact?service=${encodeURIComponent(service.id)}&label=${encodeURIComponent(
                    service.name
                  )}&from=${encodeURIComponent(consultant.id)}`}
                  onClick={onClose}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(199,107,0,0.25)] transition-all hover:bg-accent"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// One consultant's intro card, with a Book Now button opening the picker.
function ConsultantCard({ consultant, services: list, reverse }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-5 gap-8 items-center ${
        reverse ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      <div className="md:col-span-2 relative rounded-2xl overflow-hidden ring-1 ring-border shadow-lg aspect-[4/5] bg-muted">
        <SmartImage
          src={consultant.image}
          alt={consultant.name}
          className="w-full h-full object-cover object-top"
        />
        {consultant.featured && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold uppercase tracking-wide shadow">
            Featured
          </span>
        )}
      </div>

      <div className="md:col-span-3">
        <h3 className="font-serif text-3xl font-bold text-foreground mb-1">{consultant.name}</h3>
        <p className="text-primary font-semibold mb-4">
          {consultant.title} • {consultant.experience} Experience
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">{consultant.bio}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {consultant.specialization.split(',').map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-muted rounded-full text-sm text-foreground border border-border"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
        <Button
          variant="primary"
          size="lg"
          className="font-bold"
          onClick={() => setOpen(true)}
        >
          Book Now
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <ServicePickerModal
            consultant={consultant}
            services={list}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomeServices() {
  // Show each consultant with their own set of services.
  const cards = consultants
    .map((consultant) => ({
      consultant,
      list: services.filter((s) => s.consultantId === consultant.id),
    }))
    .filter((c) => c.list.length > 0);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 uppercase tracking-wide">
            Our Services
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Expert Consultation Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive astrology, numerology, and Vastu services tailored to your unique needs.
          </p>
        </motion.div>

        {/* Consultant cards */}
        <div className="space-y-16">
          {cards.map(({ consultant, list }, idx) => (
            <motion.div
              key={consultant.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ConsultantCard consultant={consultant} services={list} reverse={idx % 2 === 1} />
            </motion.div>
          ))}
        </div>

        {/* CTA to Services Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/services">
            <Button variant="primary" size="lg">
              Explore All Services
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
