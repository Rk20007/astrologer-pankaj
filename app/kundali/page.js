import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import {
  FileText,
  Sparkles,
  ArrowRight,
  Star,
  Orbit,
  HeartHandshake,
  Briefcase,
  Coins,
  Activity,
  ScrollText,
  ClipboardList,
} from 'lucide-react';

export const metadata = {
  title: 'Detailed Kundali PDF | Written Horoscope Report',
  description:
    'Request a personalized written Kundali (horoscope) PDF report covering planetary positions, Mahadasha, Antardasha, yogas, doshas, career, marriage, finance, health and remedies.',
};

const COVERAGE = [
  { icon: Orbit, title: 'Planetary Positions', text: 'Exact placement of every planet in your birth chart.' },
  { icon: Star, title: 'Mahadasha & Antardasha', text: 'Your running planetary periods and what they bring.' },
  { icon: Sparkles, title: 'Yogas & Doshas', text: 'The powerful yogas and doshas active in your chart.' },
  { icon: Briefcase, title: 'Career & Profession', text: 'Direction, timing and suitable fields for growth.' },
  { icon: HeartHandshake, title: 'Marriage & Relationships', text: 'Compatibility factors and timing indications.' },
  { icon: Coins, title: 'Finance & Wealth', text: 'Money, savings and sources of income in the chart.' },
  { icon: Activity, title: 'Health', text: 'Areas needing care and supportive measures.' },
  { icon: ScrollText, title: 'Suggested Remedies', text: 'Practical, authentic remedies for your chart.' },
];

const STEPS = [
  { n: 1, title: 'Share your birth details', text: 'Fill the short form with your date, time and place of birth.' },
  { n: 2, title: 'Astrologer reviews', text: 'Your chart is prepared and studied in detail — no payment online.' },
  { n: 3, title: 'Receive your PDF', text: 'Your personalized report is uploaded and ready to download.' },
];

export default function KundaliLandingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Hero + service card */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-transparent to-transparent py-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary">
                <FileText className="h-4 w-4" /> Written Report
              </span>
              <h1 className="font-serif text-5xl font-bold text-foreground sm:text-6xl">
                Detailed Kundali PDF
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                A personalized, hand-prepared written horoscope — your entire birth chart decoded and
                delivered as an elegant PDF you can keep forever. No online payment required; our
                astrologer reviews your details and contacts you.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/kundali/book"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-base font-bold text-white shadow-[0_10px_30px_rgba(199,107,0,0.3)] transition-all hover:bg-accent hover:text-foreground active:scale-95"
                >
                  Continue to Book <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/kundali/requests"
                  className="inline-flex items-center gap-2 text-base font-semibold text-primary transition-colors hover:text-accent"
                >
                  <ClipboardList className="h-5 w-5" /> View My Requests
                </Link>
              </div>
            </div>

            {/* Premium brown-gradient card */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-accent/40 to-primary/30 blur-2xl" aria-hidden="true" />
              <article className="relative overflow-hidden rounded-[2rem] border border-accent/40 bg-gradient-to-br from-[#4A2410] via-[#5C2E14] to-[#3A1C0C] p-8 text-white shadow-2xl">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-2xl" aria-hidden="true" />
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                    <FileText className="h-3.5 w-3.5" /> Written Report
                  </span>
                  <span className="rounded-full border border-accent/60 bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                    On Request
                  </span>
                </div>

                <h2 className="mt-6 font-serif text-3xl font-bold">Detailed Kundali PDF</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  Covering planetary positions, Mahadasha, Antardasha, Yogas, Doshas, career,
                  marriage, finance, health, and suggested remedies.
                </p>

                <div className="my-7 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

                <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-white/85">
                  {['Planetary Positions', 'Mahadasha', 'Yogas & Doshas', 'Career', 'Marriage', 'Remedies'].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent" />
                        {item}
                      </li>
                    )
                  )}
                </ul>

                <Link
                  href="/kundali/book"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-bold text-[#3A1C0C] transition-all hover:bg-white active:scale-95"
                >
                  Continue to Book <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* Coverage */}
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                What your report covers
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Every report is prepared individually for your exact birth chart.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {COVERAGE.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">How it works</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.n} className="relative rounded-2xl border border-border bg-card p-6 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                    {step.n}
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/kundali/book"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-base font-bold text-white shadow-[0_10px_30px_rgba(199,107,0,0.3)] transition-all hover:bg-accent hover:text-foreground active:scale-95"
              >
                Request Your Kundali PDF <ArrowRight className="h-5 w-5" />
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
