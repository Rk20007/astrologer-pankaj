import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import PodcastGrid from '@/components/PodcastGrid';
import ReelsGrid from '@/components/ReelsGrid';
import Button from '@/components/Button';
import { youtubeChannelUrl } from '@/data/podcasts';
import { instagramProfileUrl } from '@/data/reels';
import { getContent } from '@/lib/content';

// Reels are editable in the admin panel, so render per request.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Podcast Appearances | Bhawna Upadhyay',
  description:
    'Watch Bhawna Upadhyay on top YouTube podcasts and Instagram reels — conversations on Vedic astrology, viral remedies, career timing, kundali matching and Vastu.',
};

export default async function PodcastPage() {
  const reels = await getContent('reels');
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="py-14 bg-gradient-to-b from-primary/10 via-transparent to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
              Top YouTube Podcasts
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground mb-4">
              Watch Bhawna Upadhyay
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Conversations on Vedic astrology, the viral remedies that reached millions, and
              practical guidance for career, marriage and everyday life.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PodcastGrid />
          </div>
        </section>

        <section className="border-t border-border/60 bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary">
                Instagram Reels
              </span>
              <h2 className="font-serif text-4xl font-bold text-foreground">Reels</h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Short, practical Vastu and astrology guidance — straight from{' '}
                <a
                  href={instagramProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:text-accent"
                >
                  @divinevastubybhawnaupadhyay
                </a>
                .
              </p>
            </div>
            <ReelsGrid items={reels} />
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Ready for guidance of your own?
            </h2>
            <p className="text-muted-foreground mb-8">
              Book a personal consultation and receive a reading of your own chart, with remedies
              tailored to your situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/appointments">
                <Button variant="primary" size="lg">
                  Book an Appointment
                </Button>
              </Link>
              <a href={youtubeChannelUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">
                  Visit YouTube Channel
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
