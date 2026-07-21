import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { getAllContent } from '@/lib/content';
import { contentRegistry } from '@/lib/contentRegistry';

export const runtime = 'nodejs';

// Returns every section's current value plus its label/group metadata, so the
// dashboard can list them without a second request.
export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  const values = await getAllContent();
  const sections = Object.entries(contentRegistry).map(([key, meta]) => ({
    key,
    label: meta.label,
    description: meta.description,
    group: meta.group,
    value: values[key],
  }));
  return NextResponse.json({ ok: true, sections });
}
