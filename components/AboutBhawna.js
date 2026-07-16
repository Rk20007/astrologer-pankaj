import Link from 'next/link';
import Button from '@/components/Button';

export const expertise = [
  'Vedic Astrology Consultations',
  'Career & Business Guidance',
  'Marriage & Relationship Guidance',
  'Finance & Wealth Insights',
  'Health & Well-being Guidance',
  'Muhurat (Auspicious Timing)',
  'Vastu Consultation',
  'Personalized Astrological Remedies',
];

/**
 * The full "About Bhawna Upadhyay" write-up.
 * Shared by /about and /appointments so the copy only lives in one place.
 */
export default function AboutBhawna({ showCta = true }) {
  return (
    <div className="bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-sm">
      <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold uppercase tracking-wide mb-6">
        About Bhawna Upadhyay
      </span>
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
        Trusted Guidance from a Global Vedic Astrologer
      </h2>

      <div className="space-y-5 text-muted-foreground leading-relaxed">
        <p>
          Bhawna Upadhyay is a renowned TEDx Speaker, Vedic astrologer, and spiritual guide,
          recognized globally for her insightful consultations and highly effective astrological
          remedies. She has gained widespread recognition for her viral remedies, which have helped
          millions of people seek guidance, overcome challenges, and bring positive transformations
          into their lives.
        </p>
        <p>
          Known as a world-renowned celebrity astrologer, Bhawna has guided clients from across the
          globe, including public figures, business leaders, entrepreneurs, and individuals seeking
          trusted astrological advice. Her unique approach combines the timeless principles of Vedic
          astrology with practical, easy-to-follow remedies that can be incorporated into everyday
          life.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 pt-1">
          <div className="rounded-3xl bg-background/80 p-6 border border-border">
            <p className="font-semibold text-foreground mb-4">Her expertise includes:</p>
            <ul className="space-y-2">
              {expertise.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-foreground text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-background/80 p-6 border border-border">
            <p className="font-semibold text-foreground mb-4">Her philosophy</p>
            <p className="text-sm leading-relaxed">
              Bhawna Upadhyay believes that astrology is not merely about predicting the future—it is
              a powerful tool for understanding life&apos;s patterns, making informed decisions, and
              unlocking one&apos;s true potential. Every consultation is personalized, confidential,
              and focused on providing clarity, practical solutions, and spiritual guidance.
            </p>
          </div>
        </div>

        <p>
          As a TEDx Speaker, celebrated astrologer, and creator of several viral spiritual remedies,
          Bhawna Upadhyay continues to inspire millions through authentic Vedic wisdom, impactful
          content, and life-changing consultations. Her mission is to make the timeless knowledge of
          astrology accessible, practical, and transformative for people around the world.
        </p>
        <p className="text-lg font-semibold text-foreground">
          Book your appointment today and receive personalized guidance to move forward with
          confidence, clarity, and positivity.
        </p>
      </div>

      {showCta && (
        <div className="pt-8">
          <Link href="/appointments">
            <Button variant="primary" size="lg">
              Book an Appointment
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
