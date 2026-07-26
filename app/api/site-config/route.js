import { NextResponse } from 'next/server';
import { getContent } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The public, admin-editable bits that client components need but cannot read
 * from the database themselves: the WhatsApp lines and the payment details.
 * Nothing secret lives here — it is exactly what the site already prints on the
 * footer and the payment page.
 */
export async function GET() {
  try {
    const [payment, contacts] = await Promise.all([
      getContent('payment'),
      getContent('whatsappContacts'),
    ]);
    return NextResponse.json({ ok: true, payment, contacts });
  } catch (err) {
    console.error('[site-config] load failed:', err.message);
    return NextResponse.json({ ok: false, error: 'Could not load site details.' }, { status: 500 });
  }
}
