'use client';

import { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { podcasts, thumbnailUrl, watchUrl, embedUrl } from '@/data/podcasts';
import SmartImage from '@/components/SmartImage';

/**
 * Lite YouTube embed: shows the thumbnail until clicked, then swaps in the
 * iframe. Keeps the YouTube player off the page until it is actually wanted.
 */
function PodcastCard({ podcast, featured = false }) {
  const [playing, setPlaying] = useState(false);

  return (
    <article className="group bg-card border border-accent/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
      <div className="relative aspect-video bg-muted">
        {playing ? (
          <iframe
            src={embedUrl(podcast.id)}
            title={podcast.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${podcast.title}`}
            className="absolute inset-0 w-full h-full cursor-pointer"
          >
            <SmartImage
              src={thumbnailUrl(podcast.id)}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 rounded-full bg-primary/95 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className={`p-6 flex flex-col flex-1 ${featured ? 'sm:p-8' : ''}`}>
        <h3
          className={`font-serif font-bold text-foreground mb-2 ${
            featured ? 'text-2xl' : 'text-xl'
          }`}
        >
          {podcast.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1">
          {podcast.description}
        </p>
        <a
          href={watchUrl(podcast.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors mt-5"
        >
          Watch on YouTube
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}

export default function PodcastGrid({ limit }) {
  const items = limit ? podcasts.slice(0, limit) : podcasts;

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
}
