'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CoachLogin() {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/coach/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      router.push('/coach');
    } else {
      setError('Incorrect password.');
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '2.5rem', width: '100%', maxWidth: '360px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '0.5rem' }}>EMM</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>Coach Dashboard</div>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            style={{ width: '100%', background: 'var(--s2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text)', outline: 'none', marginBottom: '1rem', fontFamily: 'inherit' }}
            required
          />
          {error && <div style={{ fontSize: '0.78rem', color: '#f87171', marginBottom: '0.75rem' }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#c9a84c', color: '#0a0a0a', border: 'none', borderRadius: '8px', padding: '0.85rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {loading ? 'Entering...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
