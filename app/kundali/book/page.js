import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import KundaliBookingForm from '@/components/kundali/KundaliBookingForm';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Request Your Detailed Kundali PDF',
  description:
    'Share your birth details to request a personalized written Kundali PDF report. No online payment required.',
};

export default function KundaliBookPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background pt-16">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/kundali"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> Detailed Kundali PDF
            </Link>
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              Written Report • On Request
            </span>
            <h1 className="mb-3 font-serif text-4xl font-bold text-foreground sm:text-5xl">
              Request Your Kundali PDF
            </h1>
            <p className="mb-10 max-w-xl text-muted-foreground">
              Fill in your birth details below. Our astrologer will review them and prepare your
              personalized report — no payment is taken online.
            </p>

            <KundaliBookingForm />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
