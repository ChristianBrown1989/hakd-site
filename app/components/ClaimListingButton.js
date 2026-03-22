'use client';

import { useState } from 'react';

export default function ClaimListingButton({ listingSlug, listingName }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function handleClaim(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_slug: listingSlug, listing_name: listingName, email }),
      });
      const { url, error } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        console.error('[Claim]', error);
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.1rem' }}>
      <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
        Is this your listing?
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--t2)', lineHeight: 1.6, marginBottom: '0.85rem' }}>
        Claim it to access lead reports, add booking links, and get featured placement. <strong style={{ color: 'var(--text)' }}>$99/mo</strong>
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
        >
          Claim This Listing →
        </button>
      ) : (
        <form onSubmit={handleClaim} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '6px', padding: '0.6rem 0.75rem',
              fontSize: '0.82rem', color: 'var(--text)', outline: 'none',
              width: '100%', boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Redirecting...' : 'Continue to Payment →'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            style={{ background: 'none', border: 'none', fontSize: '0.7rem', color: 'var(--t3)', cursor: 'pointer', padding: '0.2rem' }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
