/**
 * Instagram reels featured on the site.
 *
 * `id` is the reel's shortcode — the bit between /reel/ and the next slash in
 * its URL. From https://www.instagram.com/reel/DbKbYK0IF4M/?igsh=… the
 * shortcode is DbKbYK0IF4M. It drives both the embed and the "watch" link, so
 * paste only the shortcode, never the whole URL with its tracking parameters.
 */
export const reels = [
  {
    id: 'DbKbYK0IF4M',
    title: 'Divine Vastu by Bhawna Upadhyay',
    description:
      'Practical Vastu and astrology guidance, straight from Bhawna Upadhyay’s Instagram.',
  },
];

export const instagramProfileUrl =
  'https://www.instagram.com/divinevastubybhawnaupadhyay';

/**
 * Instagram serves a self-contained player at /embed — no SDK script, no
 * cookies until the visitor interacts, and it works inside a plain iframe.
 */
export const reelEmbedUrl = (id) => `https://www.instagram.com/reel/${id}/embed/`;
export const reelWatchUrl = (id) => `https://www.instagram.com/reel/${id}/`;
