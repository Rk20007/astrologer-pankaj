import Link from 'next/link';
import PodcastGrid from '@/components/PodcastGrid';
import Button from '@/components/Button';

export default function HomePodcasts() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            Top YouTube Podcasts
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Seen &amp; Heard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bhawna Upadhyay in conversation on India&apos;s leading podcasts — astrology, remedies
            and the questions people actually ask.
          </p>
        </div>

        <PodcastGrid limit={3} />

        <div className="text-center mt-12">
          <Link href="/podcast">
            <Button variant="outline" size="lg">
              View All Podcasts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
