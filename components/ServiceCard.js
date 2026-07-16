'use client';

import { motion } from 'framer-motion';
import { Clock, Check } from 'lucide-react';
import Button from './Button';
import ServicePrice from '@/components/ServicePrice';
import { useAppointmentModal } from '@/components/AppointmentModal';

export default function ServiceCard({ service, showBooking = true }) {
  const { open: openAppointment } = useAppointmentModal();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="h-full bg-card border border-accent rounded-2xl overflow-hidden hover:shadow-[0_12px_36px_rgba(199,107,0,0.15)] transition-all duration-300 group relative temple-glow"
    >
      {/* Decorative Top Accent */}
      <div className="h-1.5 bg-primary" />

      <div className="p-8 flex flex-col h-full relative z-10">
        {/* Service Info */}
        <div className="mb-6">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-serif font-bold text-2xl text-foreground mb-3 bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent"
          >
            {service.name}
          </motion.h3>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            {service.description}
          </p>
        </div>

        {/* Service Details */}
        <div className="space-y-3 mb-6 bg-muted/40 rounded-xl p-4 border border-accent/30">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
            >
              <Clock className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase">Duration</p>
              <span className="text-foreground font-bold">{service.duration}</span>
            </div>
          </div>

          {/* Premium Pricing Display */}
          <div className="border-t border-accent/20 pt-3">
            <ServicePrice service={service} />
          </div>
        </div>

        {/* Benefits */}
        <div className="flex-1 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Includes</span>
            <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent" />
          </div>
          <ul className="space-y-2.5">
            {service.benefits.slice(0, 3).map((benefit, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 text-sm text-foreground"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                  className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-0.5"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
                <span className="font-medium">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Premium CTA Button */}
        {showBooking && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="primary"
              size="md"
              className="w-full text-base font-bold"
              onClick={openAppointment}
            >
              Book Consultation
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
