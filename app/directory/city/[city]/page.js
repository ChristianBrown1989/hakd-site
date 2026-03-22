import { supabase } from '../../../../lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 86400;

// Top cities for programmatic SEO — expand as directory grows
const CITIES = [
  { slug: 'austin', name: 'Austin', state: 'TX' },
  { slug: 'new-york', name: 'New York', state: 'NY' },
  { slug: 'los-angeles', name: 'Los Angeles', state: 'CA' },
  { slug: 'miami', name: 'Miami', state: 'FL' },
  { slug: 'denver', name: 'Denver', state: 'CO' },
  { slug: 'san-francisco', name: 'San Francisco', state: 'CA' },
  { slug: 'chicago', name: 'Chicago', state: 'IL' },
  { slug: 'seattle', name: 'Seattle', state: 'WA' },
  { slug: 'boston', name: 'Boston', state: 'MA' },
  { slug: 'dallas', name: 'Dallas', state: 'TX' },
  { slug: 'phoenix', name: 'Phoenix', state: 'AZ' },
  { slug: 'nashville', name: 'Nashville', state: 'TN' },
  { slug: 'san-diego', name: 'San Diego', state: 'CA' },
  { slug: 'atlanta', name: 'Atlanta', state: 'GA' },
  { slug: 'portland', name: 'Portland', state: 'OR' },
  { slug: 'minneapolis', name: 'Minneapolis', state: 'MN' },
  { slug: 'charlotte', name: 'Charlotte', state: 'NC' },
  { slug: 'washington-dc', name: 'Washington DC', state: 'DC' },
];

const CATEGORIES = {
  'nervous-system': { name: 'Nervous System', icon: '⚡', color: 'var(--cat-ns)', entity: 'Nervous System Optimization' },
  'recovery': { name: 'Recovery', icon: '🔄', color: 'var(--cat-recovery)', entity: 'Recovery Protocols' },
  'training-science': { name: 'Training Science', icon: '🏋️', color: 'var(--cat-training)', entity: 'Training Science' },
  'nutrition': { name: 'Nutrition', icon: '🥩', color: 'var(--cat-nutrition)', entity: 'Performance Nutrition' },
  'wearables-hrv': { name: 'Wearables & HRV', icon: '⌚', color: 'var(--cat-wearables)', entity: 'HRV and Wearables' },
  'mental-performance': { name: 'Mental Performance', icon: '🧠', color: 'var(--cat-mental)', entity: 'Mental Performance' },
  'longevity': { name: 'Longevity', icon: '🔬', color: 'var(--cat-longevity)', entity: 'Longevity Science' },
};

const EVIDENCE_LABELS = ['', 'Anecdotal', 'Limited', 'Moderate', 'Strong', 'Gold Standard'];
const EVIDENCE_COLORS = ['', 'var(--red)', 'var(--gold)', 'var(--gold)', 'var(--green)', 'var(--teal)'];
const TYPE_LABELS = { coach: 'Coach', expert: 'Expert', practitioner: 'Practitioner', tool: 'Tool', brand: 'Brand', protocol: 'Protocol' };

export async function generateStaticParams() {
  const params = [];
  for (const city of CITIES) {
    params.push({ city: city.slug });
  }
  return params;
}

export async function generateMetadata({ params }) {
  const city = CITIES.find(c => c.slug === params.city);
  if (!city) return { title: 'HAKD Directory' };

  const title = `Best Performance Coaches & Practitioners in ${city.name} — HAKD Directory`;
  const description = `Find top-rated performance coaches, recovery specialists, and optimization practitioners in ${city.name}, ${city.state}. Evidence-rated listings across nervous system, training science, longevity, and more.`;

  return {
    title,
    description,
    alternates: { canonical: `https://hakd.app/directory/city/${city.slug}` },
    openGraph: { title, description, url: `https://hakd.app/directory/city/${city.slug}`, siteName: 'HAKD' },
  };
}

export default async function CityPage({ params }) {
  const city = CITIES.find(c => c.slug === params.city);
  if (!city) notFound();

  // Pull all listings that have this city listed (city field in DB)
  const { data: listings } = await supabase
    .from('hakd_listings')
    .select('*')
    .or(`city.ilike.%${city.name}%,remote.eq.true`)
    .order('evidence_rating', { ascending: false })
    .order('name', { ascending: true });

  const all = listings || [];

  // Group by category for organized display
  const byCategory = {};
  for (const listing of all) {
    if (!byCategory[listing.category]) byCategory[listing.category] = [];
    byCategory[listing.category].push(listing);
  }

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Performance Coaches in ${city.name} — HAKD Directory`,
    description: `Evidence-rated performance coaches, recovery specialists, and optimization practitioners in ${city.name}.`,
    url: `https://hakd.app/directory/city/${city.slug}`,
    about: { '@type': 'Thing', name: `Human Performance Optimization in ${city.name}` },
    publisher: { '@type': 'Organization', name: 'HAKD', url: 'https://hakd.app' },
    hasPart: all.map(l => ({
      '@type': 'ListItem',
      name: l.name,
      url: `https://hakd.app/directory/${l.slug}`,
    })),
  });

  const breadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hakd.app' },
      { '@type': 'ListItem', position: 2, name: 'Directory', item: 'https://hakd.app/directory' },
      { '@type': 'ListItem', position: 3, name: `${city.name} Coaches`, item: `https://hakd.app/directory/city/${city.slug}` },
    ],
  });

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />

      <section className="hero" style={{ paddingBottom: '2rem' }}>
        <div className="hero-left">
          <div className="hero-eyebrow">
            <Link href="/directory" style={{ color: 'inherit' }}>Directory</Link> → {city.name}
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Performance Coaches in {city.name}
          </h1>
          <p className="hero-sub">
            Evidence-rated coaches, practitioners, and optimization specialists in {city.name}, {city.state}. Every listing reviewed for credentials, approach quality, and real-world results.
          </p>
          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--t3)' }}>
            {all.length} listing{all.length !== 1 ? 's' : ''} · {city.name}, {city.state}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        {all.length === 0 ? (
          <div className="empty">
            <div className="empty-title">Listings publishing soon</div>
            <p>We&apos;re curating top performance practitioners in {city.name}. Check back shortly.</p>
            <Link href="/directory" style={{ color: 'var(--gold)', fontSize: '0.85rem', marginTop: '1rem', display: 'inline-block' }}>
              Browse all listings →
            </Link>
          </div>
        ) : (
          Object.keys(byCategory).length > 1 ? (
            // Show grouped by category when multiple categories
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {Object.entries(byCategory).map(([catKey, catListings]) => {
                const cat = CATEGORIES[catKey];
                if (!cat) return null;
                return (
                  <div key={catKey}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span>{cat.icon}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: cat.color }}>
                        {cat.name}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                      {catListings.map(listing => {
                        let tags = [];
                        try { tags = JSON.parse(listing.specialty_tags || '[]'); } catch {}
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
                                  <div style={{ fontSize: '0.65rem', color: 'var(--t3)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    {TYPE_LABELS[listing.type] || listing.type}
                                    {listing.city ? ` · ${listing.city}` : listing.remote ? ' · Remote' : ''}
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
                                  {listing.description.slice(0, 130)}{listing.description.length > 130 ? '...' : ''}
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
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {all.map(listing => {
                let tags = [];
                try { tags = JSON.parse(listing.specialty_tags || '[]'); } catch {}
                return (
                  <Link href={`/directory/${listing.slug}`} key={listing.slug}>
                    <div style={{
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: '12px', padding: '1.25rem', height: '100%',
                      display: 'flex', flexDirection: 'column', gap: '0.75rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{listing.name}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--t3)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            {TYPE_LABELS[listing.type] || listing.type}
                            {listing.city ? ` · ${listing.city}` : listing.remote ? ' · Remote' : ''}
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
                          {listing.description.slice(0, 130)}{listing.description.length > 130 ? '...' : ''}
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
          )
        )}
      </section>

      {/* BROWSE BY CATEGORY */}
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="section-header" style={{ marginBottom: '1rem' }}>
          <div className="section-label">Browse by Specialty in {city.name}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <Link
              key={key}
              href={`/directory/category/${key}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '0.5rem 0.85rem',
                fontSize: '0.78rem', color: cat.color,
                fontWeight: 600, textDecoration: 'none',
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* OTHER CITIES */}
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="section-header" style={{ marginBottom: '1rem' }}>
          <div className="section-label">Other Cities</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {CITIES.filter(c => c.slug !== params.city).map(c => (
            <Link
              key={c.slug}
              href={`/directory/city/${c.slug}`}
              style={{
                fontSize: '0.75rem', color: 'var(--t2)',
                background: 'var(--s2)', border: '1px solid var(--border)',
                borderRadius: '6px', padding: '0.35rem 0.65rem',
                textDecoration: 'none',
              }}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <div className="emm-banner">
        <div className="emm-banner-left">
          <div className="emm-banner-eyebrow">Not sure which practitioner fits you?</div>
          <div className="emm-banner-title">Find your specific performance gap first.</div>
          <div className="emm-banner-sub">
            The EMM Assessment identifies your biggest bottleneck — so you know exactly which specialist in {city.name} applies to your situation right now.
          </div>
        </div>
        <a className="emm-banner-btn" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
          Take the Assessment →
        </a>
      </div>
    </main>
  );
}
