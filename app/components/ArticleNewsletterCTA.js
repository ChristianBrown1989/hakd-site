'use client';

import { useState } from 'react';

export default function ArticleNewsletterCTA({ source }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        margin: '2.5rem 0',
        background: 'var(--s2)',
        border: '1px solid var(--border2)',
        borderRadius: '12px',
        padding: '1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--green)', fontWeight: 600 }}>✓ You&apos;re in.</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--t3)', marginTop: '0.3rem' }}>Next issue hits Monday.</div>
      </div>
    );
  }

  return (
    <div style={{
      margin: '2.5rem 0',
      background: 'var(--s2)',
      border: '1px solid var(--border2)',
      borderRadius: '12px',
      padding: '1.5rem 1.75rem',
    }}>
      <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
        The HAKD Intelligence Brief
      </div>
      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem', lineHeight: 1.4 }}>
        Performance science delivered twice a week.
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--t3)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Monday + Thursday — one mechanism, one protocol, no fluff.
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={status === 'loading'}
          required
          style={{
            flex: '1 1 200px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '6px', padding: '0.6rem 0.85rem',
            fontSize: '0.82rem', color: 'var(--text)', outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary"
          style={{ whiteSpace: 'nowrap', opacity: status === 'loading' ? 0.6 : 1 }}
        >
          {status === 'loading' ? '...' : 'Subscribe →'}
        </button>
      </form>
      {status === 'error' && (
        <div style={{ fontSize: '0.7rem', color: 'var(--red)', marginTop: '0.5rem' }}>Something went wrong. Try again.</div>
      )}
    </div>
  );
}
