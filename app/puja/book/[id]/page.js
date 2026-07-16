import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import PujaBookingForm from '@/components/PujaBookingForm';
import { allPujas } from '@/data/puja';
import { formatINR } from '@/data/site';
import { ArrowLeft, MapPin } from 'lucide-react';

const getPuja = (id) => allPujas.find((p) => p.id === id);

/** Full human-readable label, e.g. "Trimbakeshwar Jyotirlinga: Tripindi Shraddh". */
function pujaLabel(puja) {
  const name = puja.detail ? `${puja.name} — ${puja.detail}` : puja.name;
  return `${puja.groupName}: ${name}`;
}

// Pre-render one page per puja at build time.
export function generateStaticParams() {
  return allPujas.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const puja = getPuja(id);
  if (!puja) return { title: 'Book a Puja | Bhawna Upadhyay' };
  return {
    title: `Book ${puja.name} | Bhawna Upadhyay`,
    description: `Book ${puja.name} online — enter your Sankalp and contact details and the ritual will be performed in your name.`,
  };
}

export default async function PujaBookingPage({ params }) {
  const { id } = await params;
  const puja = getPuja(id);
  if (!puja) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="bg-gradient-to-b from-secondary/10 via-transparent to-transparent py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/puja"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all pujas
            </Link>
            <span className="mb-3 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary">
              Online Puja Booking
            </span>
            <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">{puja.name}</h1>
            {puja.detail && (
              <p className="mt-1.5 text-lg font-semibold text-secondary">{puja.detail}</p>
            )}
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4 text-secondary" />
              {puja.groupName}
            </p>
          </div>
        </section>

        <section className="bg-background pb-20">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
            {/* Form */}
            <div className="lg:order-1">
              <PujaBookingForm
                puja={{ name: puja.name, service: pujaLabel(puja), price: puja.price }}
              />
            </div>

            {/* Summary — sticky on desktop, on top on mobile */}
            <aside className="lg:order-2">
              <div className="rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                  Puja summary
                </p>
                <h2 className="mt-2 font-serif text-xl font-bold text-foreground">{puja.name}</h2>
                {puja.detail && (
                  <p className="mt-0.5 text-sm font-semibold text-secondary">{puja.detail}</p>
                )}
                <p className="mt-4 text-3xl font-bold text-foreground">{formatINR(puja.price)}</p>
                {puja.description && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {puja.description}
                  </p>
                )}
                <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
                  Performed by temple-appointed priests with the Sankalp taken in your name. You may
                  attend in person or have it performed on your behalf.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
