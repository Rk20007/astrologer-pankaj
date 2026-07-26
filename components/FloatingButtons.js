'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, ArrowUp, X } from 'lucide-react';
import { useSiteConfig } from '@/components/useSiteConfig';

export default function FloatingButtons() {
  // Numbers are edited in Admin → Website Content → WhatsApp Numbers.
  const { contacts } = useSiteConfig();
  const primaryContact = contacts[0];
  const [isVisible, setIsVisible] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  // The team answers on three lines, so tapping WhatsApp opens a chooser
  // rather than guessing which one the visitor wants.
  const [showContacts, setShowContacts] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the chooser on Escape or a click anywhere outside it.
  useEffect(() => {
    if (!showContacts) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setShowContacts(false);
    };
    const onPointerDown = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setShowContacts(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [showContacts]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div ref={wrapperRef} className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
          {/* WhatsApp number chooser */}
          <AnimatePresence>
            {showContacts && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="w-72 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
              >
                <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
                  <p className="text-sm font-bold text-foreground">Chat on WhatsApp</p>
                  <button
                    type="button"
                    onClick={() => setShowContacts(false)}
                    aria-label="Close"
                    className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-2">
                  {contacts.map((contact) => (
                    <a
                      key={contact.id}
                      href={contact.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowContacts(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-green-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <MessageCircle className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {contact.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {contact.phone} · {contact.role}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={() => setShowContacts((v) => !v)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg transition-shadow hover:shadow-xl"
            aria-label="Chat on WhatsApp"
            aria-expanded={showContacts}
            title="Chat on WhatsApp"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>

          <motion.a
            href={primaryContact.tel}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-gold text-white shadow-lg transition-shadow hover:shadow-xl"
            aria-label="Call now"
            title={`Call ${primaryContact.phone}`}
          >
            <Phone className="h-6 w-6" />
          </motion.a>

          {showTopButton && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-dark-red text-white shadow-lg transition-shadow hover:shadow-xl"
              aria-label="Back to top"
              title="Back to Top"
            >
              <ArrowUp className="h-6 w-6" />
            </motion.button>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
