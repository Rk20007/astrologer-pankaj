import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Astrology Consultation Services',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="py-16 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-5xl font-bold text-foreground mb-8">Privacy Policy</h1>

            <div className="space-y-8 text-foreground">
              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At Astrology Consultation Services, we are committed to protecting your privacy and ensuring you have a positive experience on our website and in our services.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">2. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may collect the following information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Name, email address, and phone number</li>
                  <li>Birth date, time, and place (for astrological analysis)</li>
                  <li>Payment information for consultations</li>
                  <li>Communication history with our consultants</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Provide astrology consultation services</li>
                  <li>Process payments and send receipts</li>
                  <li>Communicate with you about your bookings</li>
                  <li>Improve our services</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">5. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this privacy policy, please contact us at contact@astrology-consultation.com
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
