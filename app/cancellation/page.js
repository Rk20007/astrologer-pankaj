import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

export const metadata = {
  title: 'Cancellation Policy',
  description: 'Cancellation and refund policy for Astrology Consultation Services',
};

export default function CancellationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="py-16 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-5xl font-bold text-foreground mb-8">Cancellation Policy</h1>

            <div className="space-y-8 text-foreground">
              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Cancellation & Refund Policy</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We understand that plans can change. Here is our clear cancellation and refund policy:
                </p>

                <div className="bg-card border-l-4 border-primary p-6 rounded mb-6">
                  <h3 className="font-bold text-foreground mb-4">48 Hours or More Before Appointment</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Full refund (100%) of the consultation fee. No questions asked. You can request the refund through the same payment method used for booking.
                  </p>
                </div>

                <div className="bg-card border-l-4 border-secondary p-6 rounded mb-6">
                  <h3 className="font-bold text-foreground mb-4">24 to 48 Hours Before Appointment</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    75% refund of the consultation fee. A 25% cancellation fee will be deducted. This allows us to manage our consultant schedules.
                  </p>
                </div>

                <div className="bg-card border-l-4 border-dark-red p-6 rounded mb-6">
                  <h3 className="font-bold text-foreground mb-4">Less Than 24 Hours Before Appointment</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    No refund. We understand this is strict, but it ensures our consultants can compensate for lost appointment time.
                  </p>
                </div>

                <div className="bg-card border-l-4 border-dark-red p-6 rounded mb-6">
                  <h3 className="font-bold text-foreground mb-4">No-Show</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Non-refundable. If you miss your appointment without cancellation, the full amount is forfeited.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">How to Cancel</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To cancel your appointment:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">
                  <li>Log into your account or use your booking reference</li>
                  <li>Visit the &quot;My Bookings&quot; section</li>
                  <li>Click on &quot;Cancel Appointment&quot;</li>
                  <li>Provide a reason (optional)</li>
                  <li>Confirm the cancellation</li>
                </ol>
                <p className="text-muted-foreground leading-relaxed">
                  Alternatively, you can call us at +91 98765 43210 or email contact@astrology-consultation.com
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Rescheduling</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Would you like to reschedule instead of canceling? Great! You can reschedule your appointment free of charge if:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>You reschedule at least 48 hours before your appointment</li>
                  <li>You select another available time slot</li>
                  <li>The new appointment is within 30 days of the original</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Refund Timeline</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Approved refunds are processed within 5-7 business days. Depending on your bank, it may take an additional 3-5 business days for the amount to appear in your account.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Questions?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about our cancellation policy, please reach out to us at contact@astrology-consultation.com or call +91 98765 43210.
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
