import ReelsGrid from '@/components/ReelsGrid';
import { instagramProfileUrl } from '@/data/reels';
import { InstagramIcon } from '@/components/SocialIcons';

export default function HomeReels({ reels }) {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary">
            Instagram Reels
          </span>
          <h2 className="mb-4 font-serif text-4xl font-bold text-foreground sm:text-5xl">
            Watch the Latest Reels
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Short, practical Vastu and astrology guidance from Bhawna Upadhyay — straight from
            Instagram.
          </p>
        </div>

        <ReelsGrid items={reels} limit={3} />

        <div className="mt-12 text-center">
          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-primary px-6 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white"
          >
            <InstagramIcon className="h-5 w-5" />
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
