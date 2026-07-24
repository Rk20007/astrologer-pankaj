import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { attachPdf, getRequest, getStatusLogs } from '@/lib/kundali';

export const runtime = 'nodejs';

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

// Uploads the finished Kundali PDF for a request (advances it to "PDF Ready").
export async function POST(request, { params }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ ok: false, error: 'No file uploaded.' }, { status: 400 });
  }
  if (file.type !== 'application/pdf' && !file.name?.toLowerCase().endsWith('.pdf')) {
    return NextResponse.json({ ok: false, error: 'Please upload a PDF file.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length === 0) {
    return NextResponse.json({ ok: false, error: 'The file is empty.' }, { status: 400 });
  }
  if (buffer.length > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: 'PDF is too large (max 15 MB).' }, { status: 400 });
  }

  const ok = await attachPdf(id, {
    buffer,
    contentType: 'application/pdf',
    filename: file.name || 'kundali.pdf',
  });
  if (!ok) return NextResponse.json({ ok: false, error: 'Request not found.' }, { status: 404 });

  const req = await getRequest(id);
  const logs = await getStatusLogs(id);
  return NextResponse.json({ ok: true, request: req, logs });
}
