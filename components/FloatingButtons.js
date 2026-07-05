'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';

export default function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    // Show floating buttons after component mounts
    setIsVisible(true);

    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919876543210', '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+919876543210';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
          {/* WhatsApp Button */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWhatsApp}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>

          {/* Call Button */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCall}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-gold text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            title="Call Now"
          >
            <Phone className="w-6 h-6" />
          </motion.button>

          {/* Scroll to Top Button */}
          {showTopButton && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-dark-red text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
              title="Back to Top"
            >
              <ArrowUp className="w-6 h-6" />
            </motion.button>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
