'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navLinks } from '@/data/navigation';
import { site } from '@/data/site';
import { useAppointmentModal } from '@/components/AppointmentModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { open: openAppointment } = useAppointmentModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
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
          <div className="flex justify-between items-center h-16 gap-4">
            {/* Brand */}
            <Link href="/" className="flex flex-col leading-none shrink-0 group">
              <span className="font-serif font-bold text-xl sm:text-2xl text-primary whitespace-nowrap transition-colors group-hover:text-accent">
                {site.name}
              </span>
              <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mt-1">
                Vedic Astrologer
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`px-3 py-2 text-sm font-semibold transition-all duration-300 relative group rounded-lg hover:bg-muted whitespace-nowrap ${
                    isActive(link.href) ? 'text-primary' : 'text-foreground hover:text-primary'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-1 left-3 h-0.5 bg-primary transition-all duration-300 ${
                      isActive(link.href)
                        ? 'w-[calc(100%-1.5rem)]'
                        : 'w-0 group-hover:w-[calc(100%-1.5rem)]'
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <motion.button
                type="button"
                onClick={openAppointment}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:inline-block px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-accent hover:text-foreground hover:shadow-[0_8px_20px_rgba(199,107,0,0.3)] transition-all duration-300 border border-primary whitespace-nowrap"
              >
                Appointment
              </motion.button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            height: isOpen ? 'auto' : 0,
          }}
          transition={{ duration: 0.3 }}
          className="lg:hidden bg-background border-t border-border overflow-hidden"
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`block px-4 py-2.5 rounded-lg transition-colors font-medium ${
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openAppointment();
              }}
              className="block w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold text-center mt-4"
            >
              Appointment
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
