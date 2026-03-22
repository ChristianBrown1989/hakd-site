import Stripe from 'stripe';
import { supabase } from '../../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error('[Webhook] Signature verification failed:', e.message);
    return new Response('Webhook signature error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { listing_slug, listing_name } = session.metadata || {};

    if (listing_slug) {
      await supabase
        .from('hakd_listings')
        .update({
          claimed: true,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          subscription_status: 'active',
          contact_email: session.customer_details?.email || null,
        })
        .eq('slug', listing_slug);

      console.log(`[Webhook] Listing claimed: ${listing_slug}`);

      // Notify via Telegram
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      if (token && chatId) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `💰 *New Listing Claimed!*\n\n📋 ${listing_name || listing_slug}\n💵 $99/mo subscription started\n👤 ${session.customer_details?.email || 'unknown'}`,
            parse_mode: 'Markdown',
          }),
        });
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    await supabase
      .from('hakd_listings')
      .update({ subscription_status: 'cancelled', claimed: false })
      .eq('stripe_subscription_id', sub.id);
  }

  return new Response('OK', { status: 200 });
}
