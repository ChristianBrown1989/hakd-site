import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import DirectorySearch from '../components/DirectorySearch';

export const revalidate = 3600;

export const metadata = {
  title: 'Human Optimization Directory — HAKD',
  description: 'A curated, evidence-rated resource hub for high performers. Coaches, recovery tools, wearables, nutrition protocols, and longevity practitioners — all reviewed for evidence quality.',
  alternates: { canonical: 'https://hakd.app/directory' },
  openGraph: {
    title: 'Human Optimization Directory — HAKD',
    description: 'Curated performance resources reviewed for evidence quality and real-world application.',
    url: 'https://hakd.app/directory',
    siteName: 'HAKD',
  },
};

const CATEGORIES = [
  { key: 'nervous-system', label: 'Nervous System', color: 'var(--cat-ns)', icon: '⚡' },
  { key: 'recovery', label: 'Recovery', color: 'var(--cat-recovery)', icon: '🔄' },
  { key: 'training-science', label: 'Training Science', color: 'var(--cat-training)', icon: '🏋️' },
  { key: 'nutrition', label: 'Nutrition', color: 'var(--cat-nutrition)', icon: '🥩' },
  { key: 'wearables-hrv', label: 'Wearables & HRV', color: 'var(--cat-wearables)', icon: '⌚' },
  { key: 'mental-performance', label: 'Mental Performance', color: 'var(--cat-mental)', icon: '🧠' },
  { key: 'longevity', label: 'Longevity', color: 'var(--cat-longevity)', icon: '🔬' },
];

const EVIDENCE_LABELS = ['', 'Anecdotal', 'Limited', 'Moderate', 'Strong', 'Gold Standard'];
const EVIDENCE_COLORS = ['', 'var(--red)', 'var(--gold)', 'var(--gold)', 'var(--green)', 'var(--teal)'];

const TYPE_LABELS = {
  coach: 'Coach',
  expert: 'Expert',
  practitioner: 'Practitioner',
  tool: 'Tool',
  brand: 'Brand',
  protocol: 'Protocol',
};

function EvidenceBadge({ rating }) {
  if (!rating) return null;
  return (
    <span style={{
      fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: EVIDENCE_COLORS[rating] || 'var(--t3)',
      border: `1px solid ${EVIDENCE_COLORS[rating] || 'var(--border)'}`,
      borderRadius: '4px', padding: '0.15rem 0.45rem',
    }}>
      {EVIDENCE_LABELS[rating] || ''} Evidence
    </span>
  );
}

export default async function DirectoryPage() {
  const { data: listings } = await supabase
    .from('hakd_listings')
    .select('*')
    .order('evidence_rating', { ascending: false })
    .order('name', { ascending: true });

  const all = listings || [];

  // Group by category
  const byCategory = {};
  for (const cat of CATEGORIES) {
    byCategory[cat.key] = all.filter(l => l.category === cat.key);
  }

  const totalListings = all.length;

  const directorySchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'HAKD Human Optimization Directory',
    description: 'Curated, evidence-rated directory of performance coaches, practitioners, tools, and brands.',
    url: 'https://hakd.app/directory',
    numberOfItems: totalListings,
    itemListElement: all.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: l.name,
      url: `https://hakd.app/directory/${l.slug}`,
    })),
  });

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: directorySchema }} />

      {/* HERO */}
      <section className="hero" style={{ paddingBottom: '2.5rem' }}>
        <div className="hero-left">
          <div className="hero-eyebrow">Evidence-Rated Resource Hub</div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
            Human Optimization<br /><em>Directory</em>
          </h1>
          <p className="hero-sub">
            Every listing reviewed for evidence quality and real-world application. No pay-to-play. No affiliate noise. Curated for high performers who want to know what actually works.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold)' }}>{totalListings}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--t3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Listings</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold)' }}>7</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--t3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Categories</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold)' }}>5★</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--t3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Evidence Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTER */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <DirectorySearch listings={all} />
      </div>

      {/* LISTINGS BY CATEGORY — below search */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        {totalListings === 0 ? (
          <div className="empty">
            <div className="empty-title">Building the directory now</div>
            <p>Listings are being added weekly. Check back soon.</p>
          </div>
        ) : (
          CATEGORIES.map(cat => {
            const items = byCategory[cat.key] || [];
            if (items.length === 0) return null;
            return (
              <div key={cat.key} style={{ marginBottom: '3.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: cat.color, letterSpacing: '-0.01em' }}>{cat.label}</h2>
                    <span style={{ fontSize: '0.7rem', color: 'var(--t3)' }}>{items.length} listings</span>
                  </div>
                  <Link href={`/directory/category/${cat.key}`} style={{ fontSize: '0.72rem', color: 'var(--gold)', opacity: 0.7 }}>
                    View all →
                  </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                  {items.slice(0, 6).map(listing => (
                    <Link href={`/directory/${listing.slug}`} key={listing.slug}>
                      <div style={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: '12px', padding: '1.25rem', height: '100%',
                        transition: 'border-color 0.15s',
                        display: 'flex', flexDirection: 'column', gap: '0.65rem',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{listing.name}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--t3)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              {TYPE_LABELS[listing.type] || listing.type}
                            </div>
                          </div>
                          {listing.evidence_rating && <EvidenceBadge rating={listing.evidence_rating} />}
                        </div>
                        {listing.description && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--t2)', lineHeight: 1.6 }}>
                            {listing.description.slice(0, 120)}{listing.description.length > 120 ? '...' : ''}
                          </p>
                        )}
                        {listing.best_for && (
                          <div style={{ fontSize: '0.68rem', color: 'var(--t3)' }}>
                            <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Best for: </span>{listing.best_for.slice(0, 80)}
                          </div>
                        )}
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--t3)' }}>{listing.price_range || ''}</span>
                          <span style={{ color: 'var(--gold)', opacity: 0.7, fontSize: '0.9rem' }}>→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* EMM BANNER */}
      <div className="emm-banner">
        <div className="emm-banner-left">
          <div className="emm-banner-eyebrow">Not sure where to start?</div>
          <div className="emm-banner-title">Find your specific performance gap first.</div>
          <div className="emm-banner-sub">
            The EMM Assessment identifies your biggest bottleneck across 7 dimensions — so you know exactly which part of the directory applies to your situation right now.
          </div>
        </div>
        <a className="emm-banner-btn" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
          Take the Assessment →
        </a>
      </div>
    </main>
  );
}
