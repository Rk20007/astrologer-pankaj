'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/Button';
import { useAppointmentModal } from '@/components/AppointmentModal';

export default function HomeCTA() {
  const { open: openAppointment } = useAppointmentModal();

  return (
    <section className="py-20 bg-gradient-to-r from-dark to-secondary relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        className="absolute inset-0 opacity-10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-gold to-primary" />
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-white space-y-6"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold">
            Ready to Transform Your Life?
          </h2>

          <p className="text-lg text-gold-light/90 max-w-2xl mx-auto leading-relaxed">
            Book a consultation with Bhawna Upadhyay and receive a reading of your own chart, with personalised remedies you can actually put into practice.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button
              variant="primary"
              size="lg"
              className="bg-white text-dark hover:bg-gold-light"
              onClick={openAppointment}
            >
              Book Your Consultation
            </Button>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                View Pricing
              </Button>
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex gap-6 justify-center pt-8 text-sm text-gold-light/80 flex-wrap"
          >
            <span>✓ Same-day Appointments Available</span>
            <span>✓ Secure & Confidential</span>
            <span>✓ Money-back Guarantee</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
