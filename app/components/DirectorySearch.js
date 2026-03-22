'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const EVIDENCE_LABELS = ['', 'Anecdotal', 'Limited', 'Moderate', 'Strong', 'Gold Standard'];
const EVIDENCE_COLORS = ['', 'var(--red)', 'var(--gold)', 'var(--gold)', 'var(--green)', 'var(--teal)'];
const TYPE_LABELS = { coach: 'Coach', expert: 'Expert', practitioner: 'Practitioner', tool: 'Tool', brand: 'Brand', protocol: 'Protocol' };

const CATEGORIES = [
  { key: 'nervous-system', name: 'Nervous System', color: 'var(--cat-ns)' },
  { key: 'recovery', name: 'Recovery', color: 'var(--cat-recovery)' },
  { key: 'training-science', name: 'Training Science', color: 'var(--cat-training)' },
  { key: 'nutrition', name: 'Nutrition', color: 'var(--cat-nutrition)' },
  { key: 'wearables-hrv', name: 'Wearables & HRV', color: 'var(--cat-wearables)' },
  { key: 'mental-performance', name: 'Mental Performance', color: 'var(--cat-mental)' },
  { key: 'longevity', name: 'Longevity', color: 'var(--cat-longevity)' },
];

export default function DirectorySearch({ listings }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const filtered = useMemo(() => {
    let results = listings;
    if (activeCategory) {
      results = results.filter(l => l.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(l => {
        const tags = (() => { try { return JSON.parse(l.specialty_tags || '[]').join(' '); } catch { return ''; } })();
        return (
          l.name?.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q) ||
          tags.toLowerCase().includes(q)
        );
      });
    }
    return results;
  }, [listings, query, activeCategory]);

  return (
    <div>
      {/* Search bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="Search listings, tools, practitioners..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '0.75rem 1rem',
            fontSize: '0.9rem', color: 'var(--text)', outline: 'none',
          }}
        />
      </div>

      {/* Category filter pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveCategory('')}
          style={{
            background: !activeCategory ? 'var(--gold)' : 'var(--surface)',
            border: `1px solid ${!activeCategory ? 'var(--gold)' : 'var(--border)'}`,
            borderRadius: '20px', padding: '0.3rem 0.85rem',
            fontSize: '0.72rem', fontWeight: 600,
            color: !activeCategory ? 'var(--bg)' : 'var(--t2)',
            cursor: 'pointer',
          }}
        >
          All ({listings.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = listings.filter(l => l.category === cat.key).length;
          if (!count) return null;
          const active = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(active ? '' : cat.key)}
              style={{
                background: active ? cat.color : 'var(--surface)',
                border: `1px solid ${active ? cat.color : 'var(--border)'}`,
                borderRadius: '20px', padding: '0.3rem 0.85rem',
                fontSize: '0.72rem', fontWeight: 600,
                color: active ? 'var(--bg)' : cat.color,
                cursor: 'pointer',
              }}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Results count */}
      {(query || activeCategory) && (
        <div style={{ fontSize: '0.72rem', color: 'var(--t3)', marginBottom: '1rem' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          {query ? ` for "${query}"` : ''}
        </div>
      )}

      {/* Listings grid */}
      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-title">No listings found</div>
          <p>Try a different search term or category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filtered.map(listing => {
            let tags = [];
            try { tags = JSON.parse(listing.specialty_tags || '[]'); } catch {}
            const cat = CATEGORIES.find(c => c.key === listing.category);
            return (
              <Link href={`/directory/${listing.slug}`} key={listing.slug}>
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '1.25rem', height: '100%',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  transition: 'border-color 0.15s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{listing.name}</div>
                      <div style={{ fontSize: '0.65rem', color: cat?.color || 'var(--t3)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {TYPE_LABELS[listing.type] || listing.type} · {cat?.name || listing.category}
                      </div>
                    </div>
                    {listing.evidence_rating > 0 && (
                      <span style={{
                        fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: EVIDENCE_COLORS[listing.evidence_rating],
                        border: `1px solid ${EVIDENCE_COLORS[listing.evidence_rating]}`,
                        borderRadius: '4px', padding: '0.15rem 0.45rem', flexShrink: 0,
                      }}>
                        {EVIDENCE_LABELS[listing.evidence_rating]}
                      </span>
                    )}
                  </div>
                  {listing.description && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--t2)', lineHeight: 1.6 }}>
                      {listing.description.slice(0, 120)}{listing.description.length > 120 ? '...' : ''}
                    </p>
                  )}
                  {tags.slice(0, 3).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{
                          fontSize: '0.62rem', background: 'var(--s2)', border: '1px solid var(--border)',
                          borderRadius: '4px', padding: '0.15rem 0.45rem', color: 'var(--t3)',
                        }}>{tag}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--t3)' }}>{listing.price_range || ''}</span>
                    <span style={{ color: 'var(--gold)', opacity: 0.7 }}>→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
