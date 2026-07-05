'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navLinks } from '@/data/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/90 backdrop-blur-lg shadow-[0_4px_20px_rgba(199,107,0,0.12)] border-b border-accent/30'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-serif font-bold text-2xl group-hover:shadow-[0_4px_16px_rgba(199,107,0,0.35)] transition-all duration-300 border border-primary/40"
              >
                ॐ
              </motion.div>
              <span className="font-serif font-bold text-2xl text-primary hidden sm:inline">
                Astrology
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 relative group rounded-lg hover:bg-muted"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-4 w-0 h-0.5 bg-primary group-hover:w-[calc(100%-2rem)] transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* CTA Button and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="hidden sm:inline-block px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-accent hover:text-foreground hover:shadow-[0_8px_20px_rgba(199,107,0,0.3)] transition-all duration-300 border border-primary"
                >
                  Book Now
                </Link>
              </motion.div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isOpen ? 1 : 0,
            height: isOpen ? 'auto' : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-background border-t border-border overflow-hidden"
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block px-4 py-2 bg-gradient-to-r from-primary to-gold text-white rounded-lg font-medium text-center mt-4"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </motion.div>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
