import OnboardForm from './OnboardForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COACH_PASSWORD = process.env.COACH_PASSWORD || 'emm2024';

export default function OnboardPage() {
  const cookieStore = cookies();
  const authed = cookieStore.get('coach_auth')?.value === COACH_PASSWORD;
  if (!authed) redirect('/coach/login');

  return <OnboardForm />;
}
