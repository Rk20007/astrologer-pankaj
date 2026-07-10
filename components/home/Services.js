'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { services, consultants } from '@/data/services';
import SmartImage from '@/components/SmartImage';
import Link from 'next/link';
import Button from '@/components/Button';
import { Clock, IndianRupee, Check } from 'lucide-react';

// Short tab labels for each service
const TAB_LABELS = {
  'bhawna-kundli': 'Kundli Reading',
  'bhawna-video': 'Video Consultation',
  'bhawna-urgent-audio': 'Audio Consultation',
  'bhawna-marriage': 'Marriage Matching',
};

export default function HomeServices() {
  // Featured consultant (Bhawna Ma'am) + only her services
  const consultant = consultants.find((c) => c.featured) || consultants[0];
  const bhawnaServices = services.filter((s) => s.consultantId === consultant.id);

  const [activeId, setActiveId] = useState(bhawnaServices[0]?.id);
  const activeService = bhawnaServices.find((s) => s.id === activeId) || bhawnaServices[0];

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

        {/* Consultant intro with image (the one image at the start) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center mb-12">
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
            <div className="flex flex-wrap gap-2">
              {consultant.specialization.split(',').map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted rounded-full text-sm text-foreground border border-border"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Service Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {bhawnaServices.map((service) => {
            const isActive = service.id === activeId;
            return (
              <button
                key={service.id}
                onClick={() => setActiveId(service.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-[0_8px_24px_rgba(199,107,0,0.25)]'
                    : 'bg-card text-foreground border-border hover:border-primary/50'
                }`}
              >
                {TAB_LABELS[service.id] || service.name}
              </button>
            );
          })}
        </div>

        {/* Active Service Panel (no image — the start image is enough) */}
        <AnimatePresence mode="wait">
          {activeService && (
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto bg-card border border-accent rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(199,107,0,0.12)]"
            >
              <div className="h-1.5 bg-primary" />
              <div className="p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
                      {activeService.name}
                    </h3>
                    <p className="text-muted-foreground">{activeService.description}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2 border border-accent/30 flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-foreground font-bold text-sm">{activeService.duration}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Benefits */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">Includes</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent" />
                    </div>
                    <ul className="space-y-3">
                      {activeService.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </span>
                          <span className="font-medium">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing + CTA */}
                  <div className="flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      {activeService.waiting && (
                        <div className="flex items-center justify-between bg-background rounded-lg p-3 border border-accent/40">
                          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Standard Rate</span>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4 text-primary" />
                            <span className="font-bold text-primary text-lg">{activeService.waiting}</span>
                          </div>
                        </div>
                      )}
                      {activeService.urgent && (
                        <div className="flex items-center justify-between bg-secondary/5 rounded-lg p-3 border border-secondary/20">
                          <span className="text-xs font-semibold text-secondary uppercase tracking-wide">Urgent Rate</span>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4 text-secondary" />
                            <span className="font-bold text-secondary text-lg">{activeService.urgent}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <Link href="/contact" className="w-full">
                      <Button variant="primary" size="md" className="w-full text-base font-bold">
                        Book Consultation
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA to Services Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
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
