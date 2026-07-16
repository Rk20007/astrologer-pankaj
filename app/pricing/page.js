import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import Button from '@/components/Button';
import FAQAccordion from '@/components/FAQAccordion';
import SmartImage from '@/components/SmartImage';
import { consultants, pricingFAQ } from '@/data/pricing';
import { formatINR } from '@/data/site';
import { Clock, User, CalendarClock, Zap, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Consultation Charges | Bhawna Upadhyay & Pankaj Sir',
  description:
    'Consultation charges for Bhawna Upadhyay and Pankaj Sir — kundli reading, urgent audio and video consultations, office and couple consultations, and Vastu.',
};

function bookingHref(plan, tierLabel) {
  const label = tierLabel ? `${plan.name} — ${tierLabel}` : `${plan.name} (${plan.mode})`;
  const id = tierLabel
    ? `${plan.id}-${tierLabel.toLowerCase().replace(/\s+/g, '-')}`
    : plan.id;
  return `/contact?service=${encodeURIComponent(id)}&label=${encodeURIComponent(label)}`;
}

function PlanCard({ plan }) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl border bg-card p-7 shadow-sm transition-shadow hover:shadow-lg ${
        plan.popular ? 'border-primary ring-1 ring-primary/30' : 'border-border'
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          Most Booked
        </span>
      )}
      {plan.urgent && !plan.popular && (
        <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          <Zap className="h-3 w-3" /> Priority
        </span>
      )}

      <h3 className="font-serif text-2xl font-bold text-foreground">{plan.name}</h3>
      {plan.mode && <p className="mt-1 text-sm font-semibold text-primary">{plan.mode}</p>}

      {/* Vastu: one price per region. Everything else: a single fee. */}
      {plan.tiers ? (
        <div className="mt-6 space-y-3">
          {plan.tiers.map((tier) => (
            <div key={tier.label} className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {tier.label}
              </p>
              <p className="mt-1.5 text-2xl font-bold text-foreground">
                {tier.from && (
                  <span className="mr-1 text-xs font-semibold uppercase text-muted-foreground">
                    Starting from
                  </span>
                )}
                {formatINR(tier.price)}
              </p>
              {tier.suffix && (
                <p className="mt-0.5 text-xs text-muted-foreground">{tier.suffix}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-4xl font-bold text-foreground">{formatINR(plan.price)}</p>
          {plan.urgentPrice && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
              <Zap className="h-4 w-4" />
              Urgent {formatINR(plan.urgentPrice)} · {plan.urgentNote}
            </p>
          )}
        </div>
      )}

      <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground flex-1">
        {plan.duration && (
          <li className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 shrink-0 text-primary" />
            {plan.duration}
          </li>
        )}
        {plan.applicableFor && (
          <li className="flex items-center gap-2.5">
            <User className="h-4 w-4 shrink-0 text-primary" />
            Applicable for {plan.applicableFor}
          </li>
        )}
        {plan.waiting && (
          <li className="flex items-center gap-2.5">
            <CalendarClock className="h-4 w-4 shrink-0 text-primary" />
            {plan.waiting}
          </li>
        )}
      </ul>

      {plan.includes && (
        <p className="mt-4 rounded-xl bg-accent/15 px-4 py-3 text-sm font-medium text-foreground">
          {plan.includes}
        </p>
      )}

      {plan.tiers ? (
        <div className="mt-6 grid gap-2">
          {plan.tiers.map((tier) => (
            <Link key={tier.label} href={bookingHref(plan, tier.label)}>
              <Button variant="outline" size="sm" className="w-full">
                Enquire — {tier.label}
              </Button>
            </Link>
          ))}
        </div>
      ) : (
        <Link href={bookingHref(plan)} className="mt-6">
          <Button variant={plan.popular ? 'primary' : 'outline'} size="md" className="w-full">
            Book This
          </Button>
        </Link>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="bg-gradient-to-b from-primary/10 via-transparent to-transparent py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary">
              Consultation Charges
            </span>
            <h1 className="mb-4 font-serif text-5xl font-bold text-foreground sm:text-6xl">
              Transparent Pricing
            </h1>
            <p className="max-w-3xl text-xl text-muted-foreground">
              Every fee below is the full charge for that consultation — remedies included, nothing
              added later. Each service lists its own waiting time, counted from the date of
              payment.
            </p>
          </div>
        </section>

        {consultants.map((consultant, index) => (
          <section
            key={consultant.id}
            id={consultant.id}
            className={`scroll-mt-20 py-16 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl ring-1 ring-accent/50">
                  <SmartImage
                    src={consultant.image}
                    alt={consultant.name}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    {consultant.greeting}
                  </p>
                  <h2 className="font-serif text-4xl font-bold text-foreground">
                    {consultant.name}
                  </h2>
                  <p className="mt-1 text-muted-foreground">{consultant.title}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {consultant.plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="border-t border-border bg-background py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-10 text-center font-serif text-4xl font-bold text-foreground">
              Pricing Questions
            </h2>
            <FAQAccordion faqs={pricingFAQ} />
          </div>
        </section>

        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 font-serif text-3xl font-bold text-foreground">
              Not sure which consultation you need?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Send your question and you will be pointed to the right service before you pay for
              anything.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Ask a Question
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
