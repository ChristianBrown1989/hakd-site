import { cookies } from 'next/headers';
import { supabaseAdmin } from '../../../../lib/supabase-server';

const COACH_PASSWORD = process.env.COACH_PASSWORD || 'emm2024';

export async function POST(req) {
  const cookieStore = cookies();
  const authed = cookieStore.get('coach_auth')?.value === COACH_PASSWORD;
  if (!authed) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const db = supabaseAdmin();

  // Clean up empty strings to null
  const cleaned = Object.fromEntries(
    Object.entries(body).map(([k, v]) => [k, v === '' ? null : v])
  );

  // Convert numeric strings
  const numericFields = [
    'age', 'height_cm', 'weight_kg', 'years_training',
    'current_weekly_frequency', 'preferred_session_length',
    'hrv_baseline', 'vo2max', 'daily_stress_level',
    'avg_sleep_hours', 'sleep_quality', 'nutrition_quality', 'emm_score',
  ];
  for (const f of numericFields) {
    if (cleaned[f] !== null) cleaned[f] = Number(cleaned[f]);
  }

  const { data, error } = await db
    .from('clients')
    .insert(cleaned)
    .select('id, name, token')
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ token: data.token, name: data.name });
}
