import { getImage } from '@/lib/images';

export const runtime = 'nodejs';

// Publicly serves an uploaded image by id. Cached aggressively — the id is
// unique per upload, so the bytes never change.
export async function GET(_request, { params }) {
  const { id } = await params;
  const image = await getImage(id);
  if (!image) {
    return new Response('Not found', { status: 404 });
  }
  return new Response(image.data, {
    status: 200,
    headers: {
      'Content-Type': image.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
