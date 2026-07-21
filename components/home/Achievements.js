'use client';

import { motion } from 'framer-motion';
import SmartImage from '@/components/SmartImage';
import { achievements as achievementsDefault } from '@/data/achievements';
import { Award } from 'lucide-react';

// `data` is passed from the server (DB-backed content); falls back to the
// static default so the component also works if rendered on its own.
export default function HomeAchievements({ data }) {
  const achievements = data || achievementsDefault;
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
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 uppercase tracking-wide">
            <Award className="h-4 w-4" />
            Achievements
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {achievements.heading}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {achievements.subheading}
          </p>
        </motion.div>

        {/* Achievement cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(199,107,0,0.08)] transition-shadow hover:shadow-[0_18px_45px_rgba(199,107,0,0.18)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <SmartImage
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-70" />
                <span className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow">
                  <Award className="h-4 w-4" />
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold text-foreground mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
