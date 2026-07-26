import { ExternalLink } from 'lucide-react';
import { reels as defaultReels, reelEmbedUrl, reelWatchUrl } from '@/data/reels';

/**
 * Instagram reels, embedded through Instagram's own /embed player. The iframe
 * is lazy-loaded so a page full of reels doesn't cost anything until it is
 * scrolled to.
 */
function ReelCard({ reel }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-accent/60 bg-card shadow-sm transition-shadow hover:shadow-lg">
      {/* Instagram's embed stacks a header, the video and a caption bar, so it
          needs noticeably more height than the 9:16 video alone. */}
      <div className="relative aspect-[9/16] min-h-[560px] bg-muted">
        <iframe
          src={reelEmbedUrl(reel.id)}
          title={reel.title || 'Instagram reel'}
          loading="lazy"
          scrolling="no"
          allow="encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        {reel.title && (
          <h3 className="mb-2 font-serif text-xl font-bold text-foreground">{reel.title}</h3>
        )}
        {reel.description && (
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{reel.description}</p>
        )}
        <a
          href={reelWatchUrl(reel.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
        >
          Watch on Instagram
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

export default function ReelsGrid({ items, limit }) {
  const source = Array.isArray(items) && items.length > 0 ? items : defaultReels;
  const list = (limit ? source.slice(0, limit) : source).filter((r) => r?.id);

  if (list.length === 0) return null;

  // One reel shouldn't stretch across the full width — cap the track instead.
  const columns =
    list.length === 1
      ? 'mx-auto max-w-sm'
      : list.length === 2
        ? 'mx-auto max-w-3xl sm:grid-cols-2'
        : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid gap-8 ${columns}`}>
      {list.map((reel) => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  );
}
