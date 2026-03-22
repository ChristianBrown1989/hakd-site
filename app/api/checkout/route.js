import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { listing_slug, listing_name, email } = await request.json();

    if (!listing_slug) {
      return Response.json({ error: 'Missing listing_slug' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            recurring: { interval: 'month' },
            unit_amount: 9900, // $99/mo
            product_data: {
              name: `HAKD Enhanced Listing — ${listing_name || listing_slug}`,
              description: 'Claim your listing, access lead reports, add booking links, and get featured placement in the HAKD directory.',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        listing_slug,
        listing_name: listing_name || '',
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/directory/${listing_slug}?claimed=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/directory/${listing_slug}`,
    });

    return Response.json({ url: session.url });
  } catch (e) {
    console.error('[Checkout] Error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
