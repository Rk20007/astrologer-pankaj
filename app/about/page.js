import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import SmartImage from '@/components/SmartImage';
import AboutBhawna from '@/components/AboutBhawna';
import Button from '@/components/Button';

export const metadata = {
  title: 'About Bhawna Upadhyay',
  description:
    'Bhawna Upadhyay — TEDx Speaker, Vedic astrologer and spiritual guide, known worldwide for insightful consultations and highly effective astrological remedies.',
};

const bhawnaGallery = [
  { src: '/bhawna-15.jpg', caption: 'TEDx: “Shift Your Energies”' },
  { src: '/bhawna-13.jpg', caption: 'On the TEDx stage' },
  { src: '/bhawna-14.jpg', caption: 'TEDx talk' },
  { src: '/bhawna-05.jpg', caption: 'At Kamakhya Temple' },
  { src: '/bhawna-04.jpg', caption: 'Ceremony & blessings' },
  { src: '/bhawna-12.jpg', caption: 'Honoured at the temple' },
  { src: '/bhawna-010.jpg', caption: 'With spiritual leaders' },
  { src: '/bhawna-09.jpg', caption: 'At a spiritual gathering' },
  { src: '/bhawna-11.jpg', caption: 'Meeting devotees' },
  { src: '/bhawna-07.jpg', caption: 'With clients' },
  { src: '/bhawna-06.jpg', caption: 'With clients' },
  { src: '/bhawna-01.jpg', caption: 'With clients' },
];

const values = [
  {
    title: 'Integrity',
    body: 'You are told what the chart shows, not what you want to hear. A remedy is recommended only when it is genuinely indicated.',
  },
  {
    title: 'Compassion',
    body: 'People arrive at astrology in difficult moments. Every consultation begins by listening, without judgement.',
  },
  {
    title: 'Confidentiality',
    body: 'Everything shared in a consultation stays in the consultation. Your details are never discussed or passed on.',
  },
  {
    title: 'Practicality',
    body: 'Remedies you can actually keep up with, fitted into the life you already lead — not rituals that demand you rearrange it.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Header */}
        <section className="bg-gradient-to-b from-primary/10 via-transparent to-transparent py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary">
              {/* About */}
            </span>
            <h1 className="mb-4 font-serif text-5xl font-bold text-foreground sm:text-6xl">
              Bhawna Upadhyay
            </h1>
            <p className="max-w-3xl text-xl text-muted-foreground">
              TEDx Speaker, Vedic astrologer and spiritual guide — recognised globally for
              insightful consultations and highly effective astrological remedies.
            </p>
          </div>
        </section>

        {/* Portrait intro */}
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted shadow-lg ring-1 ring-accent/40">
                <SmartImage
                  src="/bhawna-05.jpg"
                  alt="Bhawna Upadhyay — Vedic astrologer and Vastu consultant"
                  className="h-full w-full object-cover object-top"
                />
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
                  TEDx Speaker
                </span>
              </div>

              <div>
                <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary">
                  Meet Your Guide
                </span>
                <h2 className="mb-4 font-serif text-4xl font-bold text-foreground">
                  Bhawna Upadhyay
                </h2>
                <p className="mb-6 font-semibold text-primary">
                  Vedic Astrologer &amp; Vastu Consultant • TEDx Speaker
                </p>
                <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                  Bhawna Upadhyay combines traditional Vedic astrology and Vastu Shastra with a
                  clear, practical reading of the life in front of her — helping people shift their
                  energies and move forward in their personal and professional lives.
                </p>
                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  From temple ceremonies across India to the TEDx stage, the mission stays the same:
                  compassionate guidance rooted in ancient wisdom, made usable today.
                </p>
                <Link href="/appointments">
                  <Button variant="primary" size="lg">
                    Book an Appointment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Full write-up */}
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <AboutBhawna />
          </div>
        </section>

        {/* Gallery */}
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-center font-serif text-4xl font-bold text-foreground">
              Gallery
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Moments from Bhawna Upadhyay&apos;s journey — talks, temple visits, and consultations.
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {bhawnaGallery.map((photo) => (
                <figure
                  key={photo.src}
                  className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-muted ring-1 ring-border"
                >
                  <SmartImage
                    src={photo.src}
                    alt={photo.caption}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 font-serif text-3xl font-bold text-foreground">How I Work</h2>
            <div className="space-y-4">
              {values.map((value) => (
                <div key={value.title} className="flex gap-4">
                  <div className="w-1 shrink-0 rounded-full bg-gradient-to-b from-primary to-gold" />
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">{value.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{value.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-background py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 font-serif text-3xl font-bold text-foreground">
              Guidance for your own chart
            </h2>
            <p className="mb-8 text-muted-foreground">
              Every consultation is personalised, confidential, and focused on clarity and practical
              solutions.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/appointments">
                <Button variant="primary" size="lg">
                  Book an Appointment
                </Button>
              </Link>
              <Link href="/podcast">
                <Button variant="outline" size="lg">
                  Watch the Podcasts
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
