export async function POST(request) {
  try {
    const { email, source } = await request.json();
    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Invalid email' }, { status: 400 });
    }

    const res = await fetch(
      `https://api.convertkit.com/v3/forms/9216083/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: 'unwsbthP07XOrlhfGdfrkg',
          email,
          tags: source ? [source] : [],
          fields: { source: source || 'direct' },
        }),
      }
    );

    if (res.ok) {
      return Response.json({ success: true });
    } else {
      const err = await res.text();
      console.error('[Subscribe] Kit error:', err);
      return Response.json({ error: 'Subscription failed' }, { status: 500 });
    }
  } catch (e) {
    console.error('[Subscribe] Error:', e);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
