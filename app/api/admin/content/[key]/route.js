import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { getContent, setContent, resetContent } from '@/lib/content';
import { contentRegistry, isValidKey } from '@/lib/contentRegistry';

export const runtime = 'nodejs';

export async function GET(_request, { params }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { key } = await params;
  if (!isValidKey(key)) {
    return NextResponse.json({ ok: false, error: 'Unknown section' }, { status: 404 });
  }
  const value = await getContent(key);
  return NextResponse.json({ ok: true, key, meta: metaOf(key), value });
}

export async function PUT(request, { params }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { key } = await params;
  if (!isValidKey(key)) {
    return NextResponse.json({ ok: false, error: 'Unknown section' }, { status: 404 });
  }
  const body = await request.json().catch(() => null);
  if (!body || !('value' in body)) {
    return NextResponse.json({ ok: false, error: 'Missing value' }, { status: 400 });
  }
  const value = await setContent(key, body.value);
  return NextResponse.json({ ok: true, key, value });
}

// DELETE resets the section back to the original default from the data files.
export async function DELETE(_request, { params }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { key } = await params;
  if (!isValidKey(key)) {
    return NextResponse.json({ ok: false, error: 'Unknown section' }, { status: 404 });
  }
  const value = await resetContent(key);
  return NextResponse.json({ ok: true, key, value });
}

function metaOf(key) {
  const m = contentRegistry[key];
  return { label: m.label, description: m.description, group: m.group };
}
