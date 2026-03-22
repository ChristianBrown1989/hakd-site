import { supabase } from '../../../../lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

const CATEGORIES = {
  'nervous-system': {
    name: 'Nervous System', icon: '⚡', color: 'var(--cat-ns)',
    title: 'Nervous System Optimization — HAKD Directory',
    description: 'Evidence-rated coaches, practitioners, and tools for HRV training, sympathetic regulation, and parasympathetic restoration.',
    entity: 'Nervous System Optimization',
  },
  'recovery': {
    name: 'Recovery', icon: '🔄', color: 'var(--cat-recovery)',
    title: 'Recovery Protocols — HAKD Directory',
    description: 'Curated recovery tools, practitioners, and protocols. Cold therapy, sleep architecture, breathwork, and the biology of restoration.',
    entity: 'Recovery Protocols',
  },
  'training-science': {
    name: 'Training Science', icon: '🏋️', color: 'var(--cat-training)',
    title: 'Training Science — HAKD Directory',
    description: 'Evidence-based coaches and tools for RPE programming, adaptive training, and athletic performance.',
    entity: 'Training Science',
  },
  'nutrition': {
    name: 'Nutrition', icon: '🥩', color: 'var(--cat-nutrition)',
    title: 'Performance Nutrition — HAKD Directory',
    description: 'Vetted nutrition protocols, supplement brands, and practitioners for macro-optimization and performance fueling.',
    entity: 'Performance Nutrition',
  },
  'wearables-hrv': {
    name: 'Wearables & HRV', icon: '⌚', color: 'var(--cat-wearables)',
    title: 'Wearables & HRV — HAKD Directory',
    description: 'Evidence-rated wearables for HRV tracking, sleep monitoring, and performance data. Oura, WHOOP, CGMs, and more.',
    entity: 'HRV and Wearables',
  },
  'mental-performance': {
    name: 'Mental Performance', icon: '🧠', color: 'var(--cat-mental)',
    title: 'Mental Performance — HAKD Directory',
    description: 'Cognitive enhancement tools, practitioners, and protocols for focus, stress resilience, and psychological optimization.',
    entity: 'Mental Performance',
  },
  'longevity': {
    name: 'Longevity', icon: '🔬', color: 'var(--cat-longevity)',
    title: 'Longevity — HAKD Directory',
    description: 'Longevity practitioners, biomarker testing, VO2 max training, and the metrics that actually predict healthspan.',
    entity: 'Longevity Science',
  },
};

const EVIDENCE_LABELS = ['', 'Anecdotal', 'Limited', 'Moderate', 'Strong', 'Gold Standard'];
const EVIDENCE_COLORS = ['', 'var(--red)', 'var(--gold)', 'var(--gold)', 'var(--green)', 'var(--teal)'];

const TYPE_LABELS = { coach: 'Coach', expert: 'Expert', practitioner: 'Practitioner', tool: 'Tool', brand: 'Brand', protocol: 'Protocol' };

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map(category => ({ category }));
}

export async function generateMetadata({ params }) {
  const cat = CATEGORIES[params.category];
  if (!cat) return { title: 'HAKD Directory' };
  return {
    title: cat.title,
    description: cat.description,
    alternates: { canonical: `https://hakd.app/directory/category/${params.category}` },
    openGraph: { title: cat.title, description: cat.description, url: `https://hakd.app/directory/category/${params.category}`, siteName: 'HAKD' },
  };
}

export default async function DirectoryCategoryPage({ params }) {
  const cat = CATEGORIES[params.category];
  if (!cat) notFound();

  const { data: listings } = await supabase
    .from('hakd_listings')
    .select('*')
    .eq('category', params.category)
    .order('evidence_rating', { ascending: false })
    .order('name', { ascending: true });

  const all = listings || [];

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.name} — HAKD Directory`,
    description: cat.description,
    url: `https://hakd.app/directory/category/${params.category}`,
    about: { '@type': 'Thing', name: cat.entity },
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
      { '@type': 'ListItem', position: 3, name: cat.name, item: `https://hakd.app/directory/category/${params.category}` },
    ],
  });

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />

      <section className="hero" style={{ paddingBottom: '2rem' }}>
        <div className="hero-left">
          <div className="hero-eyebrow">
            <Link href="/directory" style={{ color: 'inherit' }}>Directory</Link> → {cat.name}
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
            {cat.icon} {cat.name}
          </h1>
          <p className="hero-sub">{cat.description}</p>
          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--t3)' }}>
            {all.length} evidence-rated listing{all.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        {all.length === 0 ? (
          <div className="empty">
            <div className="empty-title">Listings publishing soon</div>
            <p>We're curating the best {cat.name.toLowerCase()} resources. Check back shortly.</p>
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

      <div className="emm-banner">
        <div className="emm-banner-left">
          <div className="emm-banner-eyebrow">Not sure which {cat.name.toLowerCase()} resource fits you?</div>
          <div className="emm-banner-title">Find your specific performance gap first.</div>
          <div className="emm-banner-sub">
            The EMM Assessment identifies your biggest bottleneck — so you know exactly which {cat.name.toLowerCase()} approach applies to your situation right now.
          </div>
        </div>
        <a className="emm-banner-btn" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
          Take the Assessment →
        </a>
      </div>
    </main>
  );
}
