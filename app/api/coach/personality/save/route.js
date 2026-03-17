import { cookies } from 'next/headers';
import { supabaseAdmin } from '../../../../../lib/supabase-server';

const COACH_PASSWORD = process.env.COACH_PASSWORD || 'emm2024';

export async function POST(req) {
  const cookieStore = cookies();
  const authed = cookieStore.get('coach_auth')?.value === COACH_PASSWORD;
  if (!authed) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { examples, personality_document } = await req.json();
  const db = supabaseAdmin();

  // Deactivate all old versions
  await db.from('coach_personality').update({ active: false }).eq('active', true);

  // Get latest version number
  const { data: latest } = await db
    .from('coach_personality')
    .select('version')
    .order('version', { ascending: false })
    .limit(1)
    .single();

  const version = (latest?.version || 0) + 1;

  const { error } = await db.from('coach_personality').insert({
    personality_document,
    example_messages: examples,
    version,
    active: true,
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true, version });
}
