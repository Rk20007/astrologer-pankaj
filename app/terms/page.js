import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for Astrology Consultation Services',
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="py-16 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-5xl font-bold text-foreground mb-8">Terms & Conditions</h1>

            <div className="space-y-8 text-foreground">
              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">1. Service Agreement</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By booking a consultation with us, you agree to these terms and conditions. Our consultants provide guidance based on astrology, numerology, and Vastu Shastra.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">2. Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The information provided during consultations is for guidance purposes only and should not be considered as professional medical, legal, or financial advice. We recommend consulting appropriate professionals for such matters.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">3. Payment Terms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Payment is required at the time of booking. We accept credit cards, debit cards, UPI, and bank transfers. All prices are in Indian Rupees (INR).
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">4. Appointment Cancellation</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Cancellations made 48 hours before the appointment are eligible for a full refund. Cancellations within 24 hours will incur a 25% fee. No-shows are non-refundable.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">5. Confidentiality</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All information shared during consultations is kept strictly confidential. We do not share client information with third parties without explicit consent.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">6. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these terms, please contact us at contact@astrology-consultation.com
                </p>
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
