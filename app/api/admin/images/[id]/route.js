import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { deleteImage } from '@/lib/images';

export const runtime = 'nodejs';

export async function DELETE(_request, { params }) {
  const denied = await requireAuth();
  if (denied) return denied;
  const { id } = await params;
  await deleteImage(id);
  return NextResponse.json({ ok: true });
}
