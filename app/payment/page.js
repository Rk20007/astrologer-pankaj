import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import PaymentPanel from '@/components/PaymentPanel';
import { getContent } from '@/lib/content';
import { PAYMENT_KIND_KEYS } from '@/lib/paymentMeta';
import { paymentConfig as defaultPaymentConfig } from '@/data/payment';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Make a Payment',
  description:
    'Pay for your consultation, Kundali report or puja by scanning the UPI QR code, then submit your UTR for verification.',
};

/**
 * A standalone payment page, so anyone who has been quoted a price over
 * WhatsApp can pay and submit their UTR without going through a booking form.
 * Booking flows deep-link here with ?kind=…&service=…&amount=…&ref=…
 */
export default async function PaymentPage({ searchParams }) {
  const params = (await searchParams) || {};
  const [saved, contactList] = await Promise.all([
    getContent('payment'),
    getContent('whatsappContacts'),
  ]);
  // Merge over the bundled default so a config saved before a new field existed
  // (e.g. the bank account) still renders that field.
  const config = { ...defaultPaymentConfig, ...(saved || {}) };

  const kind = PAYMENT_KIND_KEYS.includes(params.kind) ? params.kind : 'other';
  const service = typeof params.service === 'string' ? params.service.slice(0, 200) : '';
  const refCode = typeof params.ref === 'string' ? params.ref.slice(0, 64) : '';
  const refId = typeof params.refId === 'string' ? params.refId.slice(0, 64) : '';
  const parsedAmount = Number.parseInt(params.amount, 10);
  const amount = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : undefined;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary">
                Secure Payment
              </span>
              <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
                Make a Payment
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
                Scan the QR code with any UPI app — or transfer to the bank account shown — then
                submit the transaction reference below. Our team verifies every payment before your
                booking is confirmed.
              </p>
            </div>

            <PaymentPanel
              kind={kind}
              service={service}
              refId={refId}
              refCode={refCode}
              amount={amount}
              config={config}
              contactList={contactList}
            />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
