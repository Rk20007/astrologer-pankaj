'use client';

import { motion } from 'framer-motion';
import { services } from '@/data/services';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';
import Button from '@/components/Button';

export default function HomeServices() {
  // Show featured services (first 6)
  const featuredServices = services.slice(0, 6);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
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

        {/* Consultants Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex gap-4 justify-center mb-12 flex-wrap"
        >
          <span className="text-sm font-semibold text-muted-foreground">Featured:</span>
          <Link href="/services">
            <Button variant="outline" size="sm">
              View All Services
            </Button>
          </Link>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>

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
