'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const stats = [
  {
    label: 'Years of Experience',
    value: 20,
    suffix: '+',
  },
  {
    label: 'Happy Clients',
    value: 5000,
    suffix: '+',
  },
  {
    label: 'Successful Consultations',
    value: 12000,
    suffix: '+',
  },
  {
    label: 'Satisfaction Rate',
    value: 98,
    suffix: '%',
  },
];

function Counter({ target, duration = 2 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();

    const animateCount = () => {
      if (!isMounted) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      setCount(Math.floor(target * progress));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);

    return () => {
      isMounted = false;
    };
  }, [target, duration]);

  return count;
}

export default function HomeStats() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-background via-white to-background overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/8 to-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-white rounded-2xl border-2 border-primary/20 shadow-[0_10px_40px_rgba(212,175,55,0.1)] group-hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] group-hover:border-primary/40 transition-all duration-300" />

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-accent/0 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300" />

              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Icon Background */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.3)]"
                >
                  <span className="text-white text-3xl font-serif font-bold">✦</span>
                </motion.div>

                {/* Counter */}
                <div className="mb-3">
                  <span className="text-6xl font-serif font-bold bg-gradient-to-r from-foreground via-primary to-primary/80 bg-clip-text text-transparent">
                    <Counter target={stat.value} />
                    {stat.suffix}
                  </span>
                </div>

                {/* Label */}
                <p className="text-foreground font-semibold text-sm uppercase tracking-wider">{stat.label}</p>

                {/* Bottom Accent Line */}
                <motion.div
                  layoutId={`underline-${index}`}
                  className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-4 w-0 group-hover:w-12 mx-auto transition-all duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
