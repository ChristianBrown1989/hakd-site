import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata = {
  title: 'Articles — HAKD Performance Intelligence',
  description: 'Evidence-based protocols for HRV optimization, nervous system training, recovery architecture, and longevity. New articles every Monday and Thursday.',
  alternates: { canonical: 'https://hakd.app/articles' },
  openGraph: {
    title: 'Articles — HAKD Performance Intelligence',
    description: 'Evidence-based protocols for HRV optimization, nervous system training, recovery architecture, and longevity.',
    url: 'https://hakd.app/articles',
    siteName: 'HAKD',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Articles — HAKD', description: 'Evidence-based performance protocols.' },
};

const CATEGORIES = [
  { name: 'Nervous System', key: 'nervous-system', color: 'var(--cat-ns)' },
  { name: 'Recovery', key: 'recovery', color: 'var(--cat-recovery)' },
  { name: 'Training Science', key: 'training-science', color: 'var(--cat-training)' },
  { name: 'Nutrition', key: 'nutrition', color: 'var(--cat-nutrition)' },
  { name: 'Wearables & HRV', key: 'wearables-hrv', color: 'var(--cat-wearables)' },
  { name: 'Mental Performance', key: 'mental-performance', color: 'var(--cat-mental)' },
  { name: 'Longevity', key: 'longevity', color: 'var(--cat-longevity)' },
];

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function ArticlesPage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, meta_description, published_at, category')
    .order('published_at', { ascending: false })
    .limit(50);

  const list = articles || [];

  const itemListSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'HAKD Performance Intelligence Articles',
    description: 'Evidence-based protocols for high-performing professionals.',
    url: 'https://hakd.app/articles',
    numberOfItems: list.length,
    itemListElement: list.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://hakd.app/articles/${a.slug}`,
      name: a.title,
    })),
  });

  const breadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hakd.app' },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://hakd.app/articles' },
    ],
  });

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />

      <section className="hero" style={{ paddingBottom: '2rem' }}>
        <div className="hero-left">
          <div className="hero-eyebrow">Performance Intelligence</div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>All Articles</h1>
          <p className="hero-sub">
            Evidence-based protocols for high-performing professionals. New articles every Monday and Thursday.
          </p>
        </div>
      </section>

      {/* Category nav */}
      <div style={{ padding: '0 1.5rem 2rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.key}
            href={`/articles/category/${cat.key}`}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              border: '1px solid var(--border)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: cat.color,
              background: 'var(--surface)',
              textDecoration: 'none',
            }}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        {list.length === 0 ? (
          <div className="empty">
            <div className="empty-title">Articles publishing soon</div>
            <p>New content every Monday and Thursday.</p>
          </div>
        ) : (
          <div className="articles-grid">
            {list.map((a) => (
              <Link href={`/articles/${a.slug}`} key={a.slug}>
                <div className="article-card">
                  <div className="article-card-top">
                    <span className="article-cat">
                      {CATEGORIES.find((c) => c.key === a.category)?.name || 'Performance Intelligence'}
                    </span>
                    <span className="article-read-time">6 min</span>
                  </div>
                  <div className="article-title">{a.title}</div>
                  {a.meta_description && (
                    <div className="article-desc">{a.meta_description}</div>
                  )}
                  <div className="article-meta">
                    <span>{formatDate(a.published_at)}</span>
                    <span className="article-arrow">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="emm-banner">
        <div className="emm-banner-left">
          <div className="emm-banner-eyebrow">Not sure where to start?</div>
          <div className="emm-banner-title">Find your specific performance gap first.</div>
          <div className="emm-banner-sub">
            17 adaptive questions. 7-dimension profile. Get your EMM score and know exactly which articles apply to your situation.
          </div>
        </div>
        <a className="emm-banner-btn" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
          Take the Assessment →
        </a>
      </div>
    </main>
  );
}
