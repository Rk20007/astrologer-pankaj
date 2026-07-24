import { NextResponse } from 'next/server';
import { getRequest, getPdf } from '@/lib/kundali';
import { getUserId } from '@/lib/userSession';
import { isAuthenticated } from '@/lib/auth';

export const runtime = 'nodejs';

// Serves the finished PDF. Only the owner (matching signed cookie) or a logged-in
// admin may download it, so reports are never exposed by guessing an id.
export async function GET(request, { params }) {
  const { id } = await params;

  const req = await getRequest(id);
  if (!req) return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });

  const [uid, admin] = await Promise.all([getUserId(), isAuthenticated()]);
  const isOwner = uid && req.userId && uid === req.userId;
  if (!isOwner && !admin) {
    return NextResponse.json({ ok: false, error: 'Not authorised.' }, { status: 403 });
  }

  const pdf = await getPdf(id);
  if (!pdf) return NextResponse.json({ ok: false, error: 'PDF not available yet.' }, { status: 404 });

  const filename = (pdf.filename || `kundali-${req.code}.pdf`).replace(/[^\w.\-]+/g, '_');
  return new NextResponse(pdf.data, {
    status: 200,
    headers: {
      'Content-Type': pdf.contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(pdf.data.length),
      'Cache-Control': 'private, no-store',
    },
  });
}
