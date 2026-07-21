import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { listImages, saveImage } from '@/lib/images';

export const runtime = 'nodejs';

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB per image
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  const images = await listImages();
  return NextResponse.json({ ok: true, images });
}

export async function POST(request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ ok: false, error: 'No file uploaded.' }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: 'Unsupported file type. Use JPG, PNG, WEBP, GIF or SVG.' },
      { status: 400 }
    );
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: 'Image is too large (max 6 MB).' },
      { status: 400 }
    );
  }

  const saved = await saveImage({
    buffer,
    contentType: file.type,
    filename: file.name,
  });
  return NextResponse.json({ ok: true, image: saved });
}
