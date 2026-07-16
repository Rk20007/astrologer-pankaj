import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import Button from '@/components/Button';
import { pujaGroups } from '@/data/puja';
import { formatINR } from '@/data/site';
import { MapPin } from 'lucide-react';

export const metadata = {
  title: 'Puja & Anushthan | Bhawna Upadhyay',
  description:
    'Tripindi Shraddh, Narayan Nagbali, Kaal-Sarp Shanti and Navgrah Shanti Havan at Trimbakeshwar Jyotirlinga, Mahamrityunjai Anushthan, and Maa Baglamukhi Pooja.',
};

function bookingHref(item) {
  return `/puja/book/${item.id}`;
}

export default function PujaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="bg-gradient-to-b from-secondary/10 via-transparent to-transparent py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-secondary">
              Puja &amp; Anushthan
            </span>
            <h1 className="mb-4 font-serif text-5xl font-bold text-foreground sm:text-6xl">
              Sacred Remedial Rituals
            </h1>
            <p className="max-w-3xl text-xl text-muted-foreground">
              Performed at Trimbakeshwar Jyotirlinga and other sacred sites by temple-appointed
              priests, with the sankalp taken in your name. You may attend in person or have the
              ritual performed on your behalf.
            </p>
          </div>
        </section>

        {/* Jump links */}
        <section className="sticky top-16 z-20 border-y border-border bg-background/95 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 sm:px-6 lg:px-8">
            {pujaGroups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="rounded-full bg-muted px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-white"
              >
                {group.name}
              </a>
            ))}
          </div>
        </section>

        {pujaGroups.map((group, index) => (
          <section
            key={group.id}
            id={group.id}
            className={`scroll-mt-32 py-16 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 max-w-3xl">
                <h2 className="font-serif text-4xl font-bold text-foreground">{group.name}</h2>
                {group.subtitle && (
                  <p className="mt-1.5 text-lg font-semibold text-secondary">{group.subtitle}</p>
                )}
                {group.location && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <MapPin className="h-4 w-4 text-secondary" />
                    {group.location}
                  </p>
                )}
                {group.description && (
                  <p className="mt-4 leading-relaxed text-muted-foreground">{group.description}</p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col rounded-3xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-lg"
                  >
                    <h3 className="font-serif text-2xl font-bold text-foreground">{item.name}</h3>
                    {item.detail && (
                      <p className="mt-1 text-sm font-semibold text-secondary">{item.detail}</p>
                    )}

                    <p className="mt-5 text-3xl font-bold text-foreground">
                      {formatINR(item.price)}
                    </p>

                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>

                    <Link href={bookingHref(item)} className="mt-6">
                      <Button variant="secondary" size="md" className="w-full">
                        Book This Puja
                      </Button>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="border-t border-border bg-background py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 font-serif text-3xl font-bold text-foreground">
              Not sure which puja is indicated for you?
            </h2>
            <p className="mb-8 text-muted-foreground">
              The right ritual depends on what your chart actually shows. Book a consultation first
              — the puja will be recommended only if it is genuinely called for.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/appointments">
                <Button variant="primary" size="lg">
                  Book a Consultation
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Ask a Question
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
