import { supabase } from '../../../lib/supabase';
import { notFound } from 'next/navigation';
import ClientDashboard from './ClientDashboard';

export const revalidate = 0;

export default async function ClientPage({ params }) {
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('token', params.token)
    .eq('active', true)
    .single();

  if (!client) notFound();

  // Last 8 check-ins
  const { data: checkIns } = await supabase
    .from('check_ins')
    .select('*')
    .eq('client_id', client.id)
    .order('submitted_at', { ascending: false })
    .limit(8);

  // Check if already checked in this week
  const weekStart = getWeekStart();
  const alreadyCheckedIn = checkIns?.some(
    (c) => c.week_of === weekStart
  );

  return (
    <ClientDashboard
      client={client}
      checkIns={checkIns || []}
      alreadyCheckedIn={alreadyCheckedIn}
      weekStart={weekStart}
    />
  );
}

function getWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}
