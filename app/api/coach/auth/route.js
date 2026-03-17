import { cookies } from 'next/headers';

const COACH_PASSWORD = process.env.COACH_PASSWORD || 'emm2024';

export async function POST(req) {
  const { password } = await req.json();
  if (password !== COACH_PASSWORD) {
    return Response.json({ error: 'Invalid' }, { status: 401 });
  }
  const cookieStore = cookies();
  cookieStore.set('coach_auth', COACH_PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  return Response.json({ ok: true });
}
