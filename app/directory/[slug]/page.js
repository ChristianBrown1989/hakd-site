import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

const EVIDENCE_LABELS = ['', 'Anecdotal', 'Limited Evidence', 'Moderate Evidence', 'Strong Evidence', 'Gold Standard'];
const EVIDENCE_COLORS = ['', 'var(--red)', 'var(--gold)', 'var(--gold)', 'var(--green)', 'var(--teal)'];

const CATEGORY_NAMES = {
  'nervous-system': 'Nervous System',
  'recovery': 'Recovery',
  'training-science': 'Training Science',
  'nutrition': 'Nutrition',
  'wearables-hrv': 'Wearables & HRV',
  'mental-performance': 'Mental Performance',
  'longevity': 'Longevity',
};

const CATEGORY_COLORS = {
  'nervous-system': 'var(--cat-ns)',
  'recovery': 'var(--cat-recovery)',
  'training-science': 'var(--cat-training)',
  'nutrition': 'var(--cat-nutrition)',
  'wearables-hrv': 'var(--cat-wearables)',
  'mental-performance': 'var(--cat-mental)',
  'longevity': 'var(--cat-longevity)',
};

export async function generateMetadata({ params }) {
  const { data } = await supabase
    .from('hakd_listings')
    .select('name, description, slug, category')
    .eq('slug', params.slug)
    .single();
  if (!data) return { title: 'HAKD Directory' };
  return {
    title: `${data.name} — HAKD Directory`,
    description: data.description || `${data.name} listing in the HAKD Human Optimization Directory.`,
    alternates: { canonical: `https://hakd.app/directory/${data.slug}` },
    openGraph: {
      title: `${data.name} — HAKD Directory`,
      description: data.description || '',
      url: `https://hakd.app/directory/${data.slug}`,
      siteName: 'HAKD',
    },
  };
}

export default async function ListingPage({ params }) {
  const { data: listing } = await supabase
    .from('hakd_listings')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!listing) notFound();

  // Get related listings in same category
  const { data: related } = await supabase
    .from('hakd_listings')
    .select('name, slug, description, evidence_rating, type')
    .eq('category', listing.category)
    .neq('slug', params.slug)
    .order('evidence_rating', { ascending: false })
    .limit(3);

  let tags = [];
  try { tags = JSON.parse(listing.specialty_tags || '[]'); } catch {}

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': listing.type === 'tool' || listing.type === 'brand' ? 'Product' : 'Person',
    name: listing.name,
    description: listing.description || '',
    url: listing.website ? `https://${listing.website}` : `https://hakd.app/directory/${listing.slug}`,
    ...(listing.type !== 'tool' && listing.type !== 'brand' ? {
      jobTitle: listing.credentials_summary || 'Performance Specialist',
      knowsAbout: tags,
    } : {}),
  });

  const breadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hakd.app' },
      { '@type': 'ListItem', position: 2, name: 'Directory', item: 'https://hakd.app/directory' },
      { '@type': 'ListItem', position: 3, name: CATEGORY_NAMES[listing.category] || listing.category, item: `https://hakd.app/directory/category/${listing.category}` },
      { '@type': 'ListItem', position: 4, name: listing.name, item: `https://hakd.app/directory/${listing.slug}` },
    ],
  });

  const catColor = CATEGORY_COLORS[listing.category] || 'var(--gold)';
  const catName = CATEGORY_NAMES[listing.category] || listing.category;
  const evidenceRating = listing.evidence_rating || 0;

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>

        {/* BREADCRUMB */}
        <div style={{ fontSize: '0.72rem', color: 'var(--t3)', marginBottom: '2rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <Link href="/directory" style={{ color: 'var(--t3)' }}>Directory</Link>
          <span>→</span>
          <Link href={`/directory/category/${listing.category}`} style={{ color: catColor }}>{catName}</Link>
          <span>→</span>
          <span style={{ color: 'var(--t2)' }}>{listing.name}</span>
        </div>

        {/* HEADER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: catColor, border: `1px solid ${catColor}`, borderRadius: '4px', padding: '0.2rem 0.5rem',
            }}>{catName}</span>
            {evidenceRating > 0 && (
              <span style={{
                fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: EVIDENCE_COLORS[evidenceRating], border: `1px solid ${EVIDENCE_COLORS[evidenceRating]}`,
                borderRadius: '4px', padding: '0.2rem 0.5rem',
              }}>{EVIDENCE_LABELS[evidenceRating]}</span>
            )}
            {listing.claimed && (
              <span style={{
                fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--green)', border: '1px solid var(--green)', borderRadius: '4px', padding: '0.2rem 0.5rem',
              }}>✓ Verified</span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {listing.name}
          </h1>

          {listing.credentials_summary && (
            <p style={{ fontSize: '0.85rem', color: 'var(--t2)' }}>{listing.credentials_summary}</p>
          )}

          {/* TAGS */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '0.68rem', background: 'var(--s2)', border: '1px solid var(--border)',
                  borderRadius: '4px', padding: '0.2rem 0.55rem', color: 'var(--t2)',
                }}>{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* MAIN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'start' }}>

          {/* LEFT — CONTENT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {listing.description && (
              <div>
                <h2 style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '0.75rem' }}>Overview</h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--t2)', lineHeight: 1.75 }}>{listing.description}</p>
              </div>
            )}

            {listing.editorial_notes && (
              <div style={{ background: 'var(--s2)', border: '1px solid var(--border2)', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.65rem' }}>
                  HAKD Assessment
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--t2)', lineHeight: 1.7 }}>{listing.editorial_notes}</p>
              </div>
            )}

            {/* BEST FOR / NOT FOR */}
            {(listing.best_for || listing.not_for) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {listing.best_for && (
                  <div style={{ background: 'var(--s2)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '0.5rem' }}>Best For</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--t2)', lineHeight: 1.6 }}>{listing.best_for}</p>
                  </div>
                )}
                {listing.not_for && (
                  <div style={{ background: 'var(--s2)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.5rem' }}>Not For</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--t2)', lineHeight: 1.6 }}>{listing.not_for}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* CTA */}
            {(listing.website || listing.booking_url) && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {listing.booking_url && (
                  <a href={listing.booking_url} target="_blank" rel="noopener" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
                    Book / Get Started →
                  </a>
                )}
                {listing.website && (
                  <a href={`https://${listing.website}`} target="_blank" rel="noopener" className="btn-ghost" style={{ display: 'block', textAlign: 'center', fontSize: '0.8rem' }}>
                    Visit Website
                  </a>
                )}
                {listing.price_range && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--t3)', textAlign: 'center' }}>
                    Price: {listing.price_range}
                  </div>
                )}
              </div>
            )}

            {/* EVIDENCE RATING */}
            {evidenceRating > 0 && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '0.75rem' }}>Evidence Quality</div>
                <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.5rem' }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{
                      flex: 1, height: '6px', borderRadius: '3px',
                      background: i <= evidenceRating ? EVIDENCE_COLORS[evidenceRating] : 'var(--s3)',
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: '0.72rem', color: EVIDENCE_COLORS[evidenceRating], fontWeight: 600 }}>
                  {EVIDENCE_LABELS[evidenceRating]}
                </div>
              </div>
            )}

            {/* CLAIM LISTING */}
            {!listing.claimed && (
              <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--t3)', lineHeight: 1.6 }}>
                  Is this your listing? Claim it to add booking links, update your profile, and access lead reports.
                </div>
                <a href="mailto:hello@hakd.app?subject=Claim Listing" style={{ display: 'block', marginTop: '0.65rem', fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 600 }}>
                  Claim this listing →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* RELATED LISTINGS */}
        {related && related.length > 0 && (
          <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '1.25rem' }}>
              More in {catName}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {related.map(r => (
                <Link href={`/directory/${r.slug}`} key={r.slug}>
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px',
                    padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{r.name}</div>
                      {r.description && <div style={{ fontSize: '0.72rem', color: 'var(--t3)', marginTop: '0.2rem' }}>{r.description.slice(0, 80)}...</div>}
                    </div>
                    <span style={{ color: 'var(--gold)', opacity: 0.7, flexShrink: 0 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
