import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '../../../lib/supabase-server';
import PersonalityBuilder from './PersonalityBuilder';

const COACH_PASSWORD = process.env.COACH_PASSWORD || 'emm2024';

export const revalidate = 0;

export default async function PersonalityPage() {
  const cookieStore = cookies();
  const authed = cookieStore.get('coach_auth')?.value === COACH_PASSWORD;
  if (!authed) redirect('/coach/login');

  const db = supabaseAdmin();
  const { data } = await db
    .from('coach_personality')
    .select('*')
    .eq('active', true)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  return <PersonalityBuilder existing={data} />;
}
