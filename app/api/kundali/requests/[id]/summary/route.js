import { NextResponse } from 'next/server';
import { getRequest } from '@/lib/kundali';
import { generateSummaryPdf } from '@/lib/kundaliPdf';
import { getUserId } from '@/lib/userSession';
import { isAuthenticated } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Instant, auto-generated request-summary PDF. Built on the fly from the stored
 * request (no file storage). Restricted to the owner (signed cookie) or an admin.
 */
export async function GET(request, { params }) {
  const { id } = await params;

  const req = await getRequest(id);
  if (!req) return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });

  const [uid, admin] = await Promise.all([getUserId(), isAuthenticated()]);
  const isOwner = uid && req.userId && uid === req.userId;
  if (!isOwner && !admin) {
    return NextResponse.json({ ok: false, error: 'Not authorised.' }, { status: 403 });
  }

  try {
    const pdf = await generateSummaryPdf(req);
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="kundali-summary-${req.code}.pdf"`,
        'Content-Length': String(pdf.length),
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('[kundali] summary PDF failed:', err);
    return NextResponse.json({ ok: false, error: 'Could not generate the summary PDF.' }, { status: 500 });
  }
}
