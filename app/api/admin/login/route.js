import { NextResponse } from 'next/server';
import { checkCredentials, createSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!checkCredentials(username, password)) {
    return NextResponse.json(
      { ok: false, error: 'Incorrect username or password.' },
      { status: 401 }
    );
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
