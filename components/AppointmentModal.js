'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Zap, ArrowLeft } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import { appointmentCards } from '@/data/appointments';
import { formatINR } from '@/data/site';

const AppointmentModalContext = createContext(null);

export function useAppointmentModal() {
  const context = useContext(AppointmentModalContext);
  if (!context) {
    throw new Error('useAppointmentModal must be used inside <AppointmentModalProvider>');
  }
  return context;
}

function PriceTag({ option }) {
  if (option.priceLabel) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-3 py-1.5 text-sm font-semibold text-foreground">
        {option.priceLabel}
      </span>
    );
  }

  return (
    <span className="flex flex-col items-start gap-0.5 sm:items-end">
      <span className="inline-flex items-baseline gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
        {option.from && <span className="text-[9px] font-semibold uppercase">from</span>}
        {formatINR(option.price)}
      </span>
      {option.suffix && <span className="text-[11px] text-muted-foreground">{option.suffix}</span>}
    </span>
  );
}

function OptionRow({ option, cardId, onNavigate }) {
  // Online Pooja options map to real puja ids → dedicated Sankalp booking flow.
  const href =
    cardId === 'online-pooja'
      ? `/puja/book/${option.id}`
      : `/contact?service=${encodeURIComponent(option.id)}&label=${encodeURIComponent(
          option.label
        )}&from=${encodeURIComponent(cardId)}`;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block rounded-2xl border border-border bg-background/70 p-4 transition-all hover:border-primary/60 hover:bg-primary/5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{option.label}</p>
          {option.meta?.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">{option.meta.join(' • ')}</p>
          )}
          {option.urgentPrice && (
            <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-secondary">
              <Zap className="h-3 w-3" />
              Urgent {formatINR(option.urgentPrice)} ({option.urgentNote})
            </p>
          )}
        </div>
        <div className="shrink-0">
          <PriceTag option={option} />
        </div>
      </div>
    </Link>
  );
}

function ModalBody({ onClose }) {
  const [activeId, setActiveId] = useState(null);
  const active = appointmentCards.find((card) => card.id === activeId);

  if (active) {
    return (
      <>
        <div className="flex items-start gap-4 border-b border-border p-6">
          <button
            type="button"
            onClick={() => setActiveId(null)}
            className="mt-0.5 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Back to all services"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              {active.subtitle}
            </p>
            <h2 className="font-serif text-2xl font-bold text-foreground">{active.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto p-6">
          {active.options.map((option) => (
            <OptionRow key={option.id} option={option} cardId={active.id} onNavigate={onClose} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-border p-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Appointment
          </p>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            What would you like to book?
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto p-6">
        {appointmentCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setActiveId(card.id)}
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-background/70 p-4 text-left transition-all hover:border-primary/60 hover:bg-primary/5"
          >
            <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-accent/40">
              <SmartImage
                src={card.image}
                alt=""
                className="h-full w-full object-cover object-top"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-foreground">{card.title}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {card.options.length === 1
                  ? '1 option'
                  : `${card.options.length} options`}{' '}
                • {card.subtitle}
              </span>
            </span>
            <ChevronDown className="h-5 w-5 shrink-0 -rotate-90 text-primary" />
          </button>
        ))}

        <Link
          href="/appointments"
          onClick={onClose}
          className="block pt-2 text-center text-sm font-semibold text-primary transition-colors hover:text-accent"
        >
          See the full appointments page →
        </Link>
      </div>
    </>
  );
}

export function AppointmentModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const lastFocused = useRef(null);

  const open = useCallback(() => {
    lastFocused.current = document.activeElement;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Send focus back where it came from, so keyboard users are not dumped at the top.
    lastFocused.current?.focus?.();
  }, []);

  // Escape to close, and hold the page still while the modal is up.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close]);

  return (
    <AppointmentModalContext.Provider value={{ isOpen, open, close }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            />

            <motion.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Book an appointment"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-accent/50 bg-card shadow-2xl outline-none sm:rounded-3xl"
            >
              <ModalBody onClose={close} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppointmentModalContext.Provider>
  );
}
