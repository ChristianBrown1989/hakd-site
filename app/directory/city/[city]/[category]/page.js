import { supabase } from '../../../../../lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 86400;

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
  'nervous-system': { name: 'Nervous System', icon: '⚡', color: 'var(--cat-ns)', description: 'HRV training, sympathetic regulation, and parasympathetic restoration specialists.' },
  'recovery': { name: 'Recovery', icon: '🔄', color: 'var(--cat-recovery)', description: 'Cold therapy, sleep architecture, breathwork, and recovery protocol specialists.' },
  'training-science': { name: 'Training Science', icon: '🏋️', color: 'var(--cat-training)', description: 'Evidence-based coaches for RPE programming, adaptive training, and athletic performance.' },
  'nutrition': { name: 'Nutrition', icon: '🥩', color: 'var(--cat-nutrition)', description: 'Performance nutrition specialists, macro-optimization, and supplement protocol experts.' },
  'wearables-hrv': { name: 'Wearables & HRV', icon: '⌚', color: 'var(--cat-wearables)', description: 'HRV tracking, wearable technology, and biometric performance monitoring specialists.' },
  'mental-performance': { name: 'Mental Performance', icon: '🧠', color: 'var(--cat-mental)', description: 'Cognitive enhancement, stress resilience, and psychological optimization practitioners.' },
  'longevity': { name: 'Longevity', icon: '🔬', color: 'var(--cat-longevity)', description: 'Biomarker testing, VO2 max training, and healthspan optimization specialists.' },
};

const EVIDENCE_LABELS = ['', 'Anecdotal', 'Limited', 'Moderate', 'Strong', 'Gold Standard'];
const EVIDENCE_COLORS = ['', 'var(--red)', 'var(--gold)', 'var(--gold)', 'var(--green)', 'var(--teal)'];
const TYPE_LABELS = { coach: 'Coach', expert: 'Expert', practitioner: 'Practitioner', tool: 'Tool', brand: 'Brand', protocol: 'Protocol' };

export async function generateStaticParams() {
  const params = [];
  for (const city of CITIES) {
    for (const catKey of Object.keys(CATEGORIES)) {
      params.push({ city: city.slug, category: catKey });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const city = CITIES.find(c => c.slug === params.city);
  const cat = CATEGORIES[params.category];
  if (!city || !cat) return { title: 'HAKD Directory' };

  const title = `Best ${cat.name} Coaches in ${city.name} — HAKD Directory`;
  const description = `Find top-rated ${cat.name.toLowerCase()} coaches and practitioners in ${city.name}, ${city.state}. Evidence-rated listings reviewed for credentials and real-world results.`;

  return {
    title,
    description,
    alternates: { canonical: `https://hakd.app/directory/city/${city.slug}/${params.category}` },
    openGraph: { title, description, url: `https://hakd.app/directory/city/${city.slug}/${params.category}`, siteName: 'HAKD' },
  };
}

export default async function CityCategoryPage({ params }) {
  const city = CITIES.find(c => c.slug === params.city);
  const cat = CATEGORIES[params.category];
  if (!city || !cat) notFound();

  const { data: listings } = await supabase
    .from('hakd_listings')
    .select('*')
    .eq('category', params.category)
    .or(`city.ilike.%${city.name}%,remote.eq.true`)
    .order('evidence_rating', { ascending: false })
    .order('name', { ascending: true });

  const all = listings || [];

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.name} Coaches in ${city.name}`,
    description: `Evidence-rated ${cat.name.toLowerCase()} coaches and practitioners in ${city.name}, ${city.state}.`,
    url: `https://hakd.app/directory/city/${city.slug}/${params.category}`,
    about: { '@type': 'Thing', name: `${cat.name} in ${city.name}` },
    publisher: { '@type': 'Organization', name: 'HAKD', url: 'https://hakd.app' },
    hasPart: all.map(l => ({ '@type': 'ListItem', name: l.name, url: `https://hakd.app/directory/${l.slug}` })),
  });

  const breadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hakd.app' },
      { '@type': 'ListItem', position: 2, name: 'Directory', item: 'https://hakd.app/directory' },
      { '@type': 'ListItem', position: 3, name: city.name, item: `https://hakd.app/directory/city/${city.slug}` },
      { '@type': 'ListItem', position: 4, name: cat.name, item: `https://hakd.app/directory/city/${city.slug}/${params.category}` },
    ],
  });

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />

      <section className="hero" style={{ paddingBottom: '2rem' }}>
        <div className="hero-left">
          <div className="hero-eyebrow">
            <Link href="/directory" style={{ color: 'inherit' }}>Directory</Link>
            {' → '}
            <Link href={`/directory/city/${city.slug}`} style={{ color: 'inherit' }}>{city.name}</Link>
            {' → '}
            <span style={{ color: cat.color }}>{cat.name}</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
            {cat.icon} {cat.name} in {city.name}
          </h1>
          <p className="hero-sub">{cat.description} Serving {city.name}, {city.state}.</p>
          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--t3)' }}>
            {all.length} evidence-rated listing{all.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        {all.length === 0 ? (
          <div className="empty">
            <div className="empty-title">Listings publishing soon</div>
            <p>We&apos;re curating top {cat.name.toLowerCase()} resources in {city.name}. Check back shortly.</p>
            <Link href={`/directory/category/${params.category}`} style={{ color: 'var(--gold)', fontSize: '0.85rem', marginTop: '1rem', display: 'inline-block' }}>
              Browse all {cat.name} listings →
            </Link>
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
        )}
      </section>

      {/* OTHER CATEGORIES IN THIS CITY */}
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="section-header" style={{ marginBottom: '1rem' }}>
          <div className="section-label">Other Specialties in {city.name}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Object.entries(CATEGORIES).filter(([k]) => k !== params.category).map(([key, c]) => (
            <Link key={key} href={`/directory/city/${city.slug}/${key}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '0.5rem 0.85rem',
              fontSize: '0.78rem', color: c.color, fontWeight: 600, textDecoration: 'none',
            }}>
              <span>{c.icon}</span><span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="emm-banner">
        <div className="emm-banner-left">
          <div className="emm-banner-eyebrow">Not sure which {cat.name.toLowerCase()} approach fits you?</div>
          <div className="emm-banner-title">Find your specific performance gap first.</div>
          <div className="emm-banner-sub">
            The EMM Assessment identifies your biggest bottleneck — so you know exactly which {cat.name.toLowerCase()} specialist in {city.name} applies to your situation.
          </div>
        </div>
        <a className="emm-banner-btn" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
          Take the Assessment →
        </a>
      </div>
    </main>
  );
}
