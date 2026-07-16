'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * A list of expandable FAQ items. Callers supply their own section heading.
 * Items only need `question` and `answer`; `id` is optional.
 */
export default function FAQAccordion({ faqs }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const key = faq.id ?? index;
        const isOpen = expanded === key;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(index * 0.08, 0.4) }}
          >
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : key)}
              aria-expanded={isOpen}
              className="w-full text-left"
            >
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow hover:border-primary/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-foreground pr-4">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-6 h-6 text-primary" />
                  </motion.div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-muted-foreground mt-4 pt-4 border-t border-border leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
