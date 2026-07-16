'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Zap } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import Button from '@/components/Button';
import { appointmentCards } from '@/data/appointments';
import { formatINR } from '@/data/site';

/** Renders a price as "₹11,000", "Starting from ₹75,000 + Travel + Stay", or "On request". */
function PriceTag({ option }) {
  if (option.priceLabel) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-4 py-2 font-semibold text-foreground">
        {option.priceLabel}
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col items-start gap-0.5 sm:items-end">
      <span className="inline-flex items-baseline gap-1.5 rounded-full bg-primary/10 px-4 py-2 font-bold text-primary">
        {option.from && <span className="text-[10px] font-semibold uppercase">from</span>}
        {formatINR(option.price)}
      </span>
      {option.suffix && (
        <span className="text-xs text-muted-foreground">{option.suffix}</span>
      )}
    </span>
  );
}

function OptionRow({ option, cardId }) {
  // Online Pooja options map to real puja ids, so send them into the dedicated
  // Sankalp booking flow; everything else uses the general contact form.
  const bookingHref =
    cardId === 'online-pooja'
      ? `/puja/book/${option.id}`
      : `/contact?service=${encodeURIComponent(option.id)}&label=${encodeURIComponent(
          option.label
        )}&from=${encodeURIComponent(cardId)}`;

  return (
    <div className="rounded-2xl border border-border p-5 bg-background/80">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-base mb-1.5">
            {option.label}
            {option.popular && (
              <span className="ml-2 align-middle rounded-full bg-accent/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground">
                Popular
              </span>
            )}
          </p>

          {option.meta?.length > 0 && (
            <p className="text-xs text-muted-foreground mb-2">{option.meta.join(' • ')}</p>
          )}

          {option.detail && (
            <p className="text-sm text-muted-foreground leading-relaxed">{option.detail}</p>
          )}

          {option.urgentPrice && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
              <Zap className="w-3.5 h-3.5" />
              Urgent: {formatINR(option.urgentPrice)} ({option.urgentNote})
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end shrink-0">
          <PriceTag option={option} />
          <Link
            href={bookingHref}
            className="text-sm font-semibold text-primary hover:text-accent transition-colors whitespace-nowrap"
          >
            Continue to book →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentCards() {
  const [openCard, setOpenCard] = useState(null);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {appointmentCards.map((card) => {
        const isOpen = openCard === card.id;

        return (
          <article
            key={card.id}
            id={card.id}
            className="bg-card border border-accent rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col scroll-mt-24"
          >
            <div className="relative">
              <SmartImage
                src={card.image}
                alt={card.title}
                className="w-full h-64 object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-white/85 mb-1.5">
                  {card.subtitle}
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold">
                  {card.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 flex flex-col flex-1">
              <p className="text-muted-foreground leading-relaxed">{card.description}</p>

              <Button
                variant="primary"
                size="md"
                className="w-full"
                aria-expanded={isOpen}
                aria-controls={`${card.id}-options`}
                onClick={() => setOpenCard(isOpen ? null : card.id)}
              >
                {isOpen ? 'Hide Options' : 'Book Now'}
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>

              {!isOpen && (
                <p className="text-sm text-muted-foreground text-center -mt-2">
                  {card.options.length === 1
                    ? 'Tap Book Now to see the details.'
                    : `Tap Book Now to see all ${card.options.length} options and prices.`}
                </p>
              )}

              {isOpen && (
                <div id={`${card.id}-options`} className="space-y-4">
                  {card.options.map((option) => (
                    <OptionRow key={option.id} option={option} cardId={card.id} />
                  ))}

                  {card.footerLink && (
                    <Link
                      href={card.footerLink.href}
                      className="block text-center text-sm font-semibold text-primary hover:text-accent transition-colors pt-1"
                    >
                      {card.footerLink.label} →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
