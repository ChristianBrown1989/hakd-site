import { supabase } from '../../../lib/supabase';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function notifyTelegram(message) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'Markdown' }),
    });
  } catch {}
}

export async function POST(request) {
  try {
    const { name, email, message, listing_slug, listing_name } = await request.json();

    if (!name || !email || !listing_slug) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!email.includes('@')) {
      return Response.json({ error: 'Invalid email' }, { status: 400 });
    }

    const { error } = await supabase.from('hakd_leads').insert({
      listing_slug,
      listing_name,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message?.trim() || null,
    });

    if (error) {
      console.error('[Lead] Supabase error:', error);
      return Response.json({ error: 'Failed to save' }, { status: 500 });
    }

    // Check total leads for this listing — alert at every 5
    const { count } = await supabase
      .from('hakd_leads')
      .select('*', { count: 'exact', head: true })
      .eq('listing_slug', listing_slug);

    const alert = count > 0 && count % 5 === 0
      ? `\n\n🔥 *${count} total leads for this listing* — time to reach out about claiming.`
      : '';

    await notifyTelegram(
      `*New HAKD Lead*\n\n📋 Listing: ${listing_name || listing_slug}\n👤 ${name}\n📧 ${email}${message ? `\n💬 "${message.slice(0, 120)}"` : ''}${alert}`
    );

    return Response.json({ success: true });
  } catch (e) {
    console.error('[Lead] Error:', e);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
