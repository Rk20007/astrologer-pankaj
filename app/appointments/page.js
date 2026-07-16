import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import AppointmentCards from './AppointmentCards';
import AboutBhawna from '@/components/AboutBhawna';

export const metadata = {
  title: 'Book an Appointment | Bhawna Upadhyay',
  description:
    'Book a consultation with Bhawna Upadhyay or Pankaj Sir — kundli reading, couple consultation, Vastu, online pooja, gemstone guidance and detailed kundali reports.',
};

export default function AppointmentsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="py-14 bg-gradient-to-b from-primary/10 via-transparent to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
              Appointments
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground mb-4">
              Book Your Consultation
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Choose from Bhawna Upadhyay, Pankaj Sir, online pooja, gemstone guidance, or a
              detailed kundali report. Tap Book Now on any card to see the available options and
              prices.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AppointmentCards />
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Already on the booking page — the CTA would just scroll back up. */}
            <AboutBhawna showCta={false} />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
