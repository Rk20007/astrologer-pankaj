import { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import ContactForm from './ContactForm';
import { contactInfo, normaliseContacts } from '@/data/site';
import { getContent } from '@/lib/content';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

// The WhatsApp lines are editable in the admin panel, so render per request.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact & Booking | Bhawna Upadhyay',
  description:
    'Send a booking request or ask a question about consultations, puja and anushthan, Vastu, or gemstone guidance.',
};

const details = [
  { icon: Mail, label: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
  { icon: MapPin, label: 'Location', value: contactInfo.address },
  { icon: Clock, label: 'Hours', value: contactInfo.hours },
];

export default async function ContactPage() {
  const contacts = normaliseContacts(await getContent('whatsappContacts'));

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="bg-gradient-to-b from-primary/10 via-transparent to-transparent py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary">
              Contact
            </span>
            <h1 className="mb-4 font-serif text-5xl font-bold text-foreground sm:text-6xl">
              Book or Ask
            </h1>
            <p className="max-w-3xl text-xl text-muted-foreground">
              Send your request and you will receive a reply with the available slots and payment
              details. Nothing is charged until your booking is confirmed.
            </p>
          </div>
        </section>

        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Contact details */}
              <div className="space-y-6">
                {/* Call / WhatsApp lines — the team answers on all three. */}
                <div className="rounded-3xl border border-border bg-card p-6">
                  <p className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                    <Phone className="h-4 w-4 text-primary" /> Call or WhatsApp
                  </p>
                  <ul className="space-y-3">
                    {contacts.map((contact) => (
                      <li
                        key={contact.id}
                        className="rounded-2xl border border-border bg-background/60 p-4"
                      >
                        <p className="font-semibold text-foreground">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.role}</p>
                        <p className="mt-1.5 font-mono text-sm font-bold text-primary">
                          {contact.phone}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <a
                            href={contact.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                          >
                            <MessageCircle className="h-4 w-4" /> WhatsApp
                          </a>
                          <a
                            href={contact.tel}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                          >
                            <Phone className="h-4 w-4" /> Call
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-border bg-card p-6">
                  {details.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="mb-7 flex items-start gap-4 last:mb-0">
                      <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="mb-1 font-semibold text-foreground">{label}</p>
                        {href ? (
                          <a
                            href={href}
                            className="break-words text-primary transition-colors hover:text-accent"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl border border-accent/40 bg-primary/5 p-6">
                  <p className="font-semibold text-foreground">Already been quoted a price?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pay by scanning our UPI QR code and submit the transaction reference for
                    verification.
                  </p>
                  <Link
                    href="/payment"
                    className="mt-4 block w-full rounded-lg bg-primary py-3 text-center font-semibold text-white transition-colors hover:bg-accent hover:text-foreground"
                  >
                    Make a Payment
                  </Link>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                {/* useSearchParams needs a Suspense boundary to keep this page static. */}
                <Suspense
                  fallback={
                    <div className="h-[640px] animate-pulse rounded-3xl border border-border bg-card" />
                  }
                >
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
