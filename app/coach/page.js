import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '../../lib/supabase-server';
import CoachDashboard from './CoachDashboard';

export const revalidate = 0;

const COACH_PASSWORD = process.env.COACH_PASSWORD || 'emm2024';

export default async function CoachPage({ searchParams }) {
  // Simple password gate
  const cookieStore = cookies();
  const authed = cookieStore.get('coach_auth')?.value === COACH_PASSWORD;
  if (!authed) redirect('/coach/login');

  const db = supabaseAdmin();

  // Get all active clients
  const { data: clients } = await db
    .from('clients')
    .select('*')
    .eq('active', true)
    .order('name');

  // Get check-ins from last 4 weeks
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const { data: allCheckIns } = await db
    .from('check_ins')
    .select('*')
    .gte('submitted_at', fourWeeksAgo.toISOString())
    .order('submitted_at', { ascending: false });

  // Get this week's Monday
  const thisWeek = getWeekStart();

  return (
    <CoachDashboard
      clients={clients || []}
      allCheckIns={allCheckIns || []}
      thisWeek={thisWeek}
    />
  );
}

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}
