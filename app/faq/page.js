import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import FAQAccordion from '@/components/FAQAccordion';
import { faqs } from '@/data/faq';

export const metadata = {
  title: 'FAQ - Astrology Consultation Services',
  description: 'Frequently asked questions about our astrology, numerology, and Vastu services.',
};

export default function FAQPage() {
  const generalFAQs = faqs.filter((f) => f.category === 'General').slice(0, 5);
  const servicesFAQs = faqs.filter((f) => f.category === 'Services');
  const bookingFAQs = faqs.filter((f) => f.category === 'Booking');

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Header */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Find answers to common questions about our astrology services, booking process, and consultation details.
            </p>
          </div>
        </section>

        {/* General FAQs */}
        <section className="py-16 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-12">General Questions</h2>
            <div className="space-y-4">
              {generalFAQs.map((faq) => (
                <div key={faq.id} className="bg-card border border-border rounded-xl p-6">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground hover:text-primary transition-colors">
                      {faq.question}
                      <span className="transition-transform group-open:rotate-180">▼</span>
                    </summary>
                    <p className="mt-4 text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services FAQs */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-12">About Services</h2>
            <FAQAccordion faqs={servicesFAQs} />
          </div>
        </section>

        {/* Booking FAQs */}
        <section className="py-16 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-12">Booking & Payments</h2>
            <FAQAccordion faqs={bookingFAQs} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-dark text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-lg text-gold-light/90 mb-8">
              Contact us directly and our team will be happy to help you.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-dark rounded-lg font-medium hover:bg-gold-light transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
