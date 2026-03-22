'use client';

import { useState } from 'react';

export default function LeadCaptureForm({ listingSlug, listingName }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, listing_slug: listingSlug, listing_name: listingName }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        background: 'var(--s2)', border: '1px solid rgba(74,222,128,0.2)',
        borderRadius: '10px', padding: '1.25rem', textAlign: 'center',
      }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>✓</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--green)', fontWeight: 600 }}>Request sent</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--t3)', marginTop: '0.3rem' }}>
          We&apos;ll be in touch shortly.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '1.25rem',
    }}>
      <div style={{
        fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.65rem',
      }}>
        Get an Intro
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--t2)', marginBottom: '1rem', lineHeight: 1.5 }}>
        Interested in working with {listingName}? We&apos;ll connect you.
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <input
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          disabled={status === 'loading'}
          required
          style={{
            background: 'var(--s2)', border: '1px solid var(--border)',
            borderRadius: '6px', padding: '0.6rem 0.75rem',
            fontSize: '0.82rem', color: 'var(--text)', outline: 'none',
            width: '100%', boxSizing: 'border-box',
          }}
        />
        <input
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          disabled={status === 'loading'}
          required
          style={{
            background: 'var(--s2)', border: '1px solid var(--border)',
            borderRadius: '6px', padding: '0.6rem 0.75rem',
            fontSize: '0.82rem', color: 'var(--text)', outline: 'none',
            width: '100%', boxSizing: 'border-box',
          }}
        />
        <textarea
          placeholder="What are you working on? (optional)"
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          disabled={status === 'loading'}
          rows={3}
          style={{
            background: 'var(--s2)', border: '1px solid var(--border)',
            borderRadius: '6px', padding: '0.6rem 0.75rem',
            fontSize: '0.82rem', color: 'var(--text)', outline: 'none',
            width: '100%', boxSizing: 'border-box', resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
        {status === 'error' && (
          <div style={{ fontSize: '0.72rem', color: 'var(--red)' }}>
            Something went wrong. Try again.
          </div>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', opacity: status === 'loading' ? 0.6 : 1 }}
        >
          {status === 'loading' ? 'Sending...' : 'Request Introduction →'}
        </button>
      </form>
    </div>
  );
}
