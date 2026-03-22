import { supabase } from '../../../../lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

const CATEGORIES = {
  'nervous-system': {
    name: 'Nervous System',
    title: 'Nervous System Optimization — HAKD',
    description: 'Evidence-based protocols for HRV training, sympathetic regulation, and parasympathetic restoration. Build a nervous system that performs under pressure and recovers fast.',
    keyword: 'nervous system',
    entity: 'Nervous System Optimization',
  },
  'recovery': {
    name: 'Recovery',
    title: 'Recovery Protocols — HAKD',
    description: 'Cold therapy, sleep architecture, breathwork, and the biology of restoration. Evidence-based recovery protocols for high-performing professionals.',
    keyword: 'recovery',
    entity: 'Recovery Protocols',
  },
  'training-science': {
    name: 'Training Science',
    title: 'Training Science — HAKD',
    description: 'RPE-based programming, progressive overload, and adaptive training frameworks. Science-backed approaches to strength, conditioning, and athletic performance.',
    keyword: 'training',
    entity: 'Training Science',
  },
  'nutrition': {
    name: 'Nutrition',
    title: 'Performance Nutrition — HAKD',
    description: 'Macro-optimization, nutrient timing, supplementation protocols, and food quality frameworks for high-performing professionals.',
    keyword: 'nutrition',
    entity: 'Performance Nutrition',
  },
  'wearables-hrv': {
    name: 'Wearables & HRV',
    title: 'Wearables & HRV Tracking — HAKD',
    description: 'How to use Oura Ring, WHOOP, CGMs, and HRV data to make smarter training and recovery decisions. Evidence-based wearable protocols.',
    keyword: 'wearables',
    entity: 'HRV and Wearables',
  },
  'mental-performance': {
    name: 'Mental Performance',
    title: 'Mental Performance — HAKD',
    description: 'Cognitive enhancement, stress resilience, psychological optimization, and focus protocols for high-achieving professionals.',
    keyword: 'mental',
    entity: 'Mental Performance',
  },
  'longevity': {
    name: 'Longevity',
    title: 'Longevity Protocols — HAKD',
    description: 'Biomarker testing, VO2 max training, grip strength, healthspan protocols, and the metrics that actually predict how long and how well you live.',
    keyword: 'longevity',
    entity: 'Longevity Science',
  },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map(category => ({ category }));
}

export async function generateMetadata({ params }) {
  const cat = CATEGORIES[params.category];
  if (!cat) return { title: 'HAKD' };
  return {
    title: cat.title,
    description: cat.description,
    alternates: { canonical: `https://hakd.app/articles/category/${params.category}` },
    openGraph: { title: cat.title, description: cat.description, url: `https://hakd.app/articles/category/${params.category}`, siteName: 'HAKD' },
  };
}

export default async function CategoryPage({ params }) {
  const cat = CATEGORIES[params.category];
  if (!cat) notFound();

  // Primary: filter by category column (set by content pipeline)
  // Fallback: keyword match in content for older articles without category tag
  let { data: articles } = await supabase
    .from('articles')
    .select('title, slug, meta_description, published_at')
    .eq('category', params.category)
    .order('published_at', { ascending: false })
    .limit(20);

  if (!articles || articles.length === 0) {
    const { data: fallback } = await supabase
      .from('articles')
      .select('title, slug, meta_description, published_at')
      .ilike('content', `%${cat.keyword}%`)
      .order('published_at', { ascending: false })
      .limit(20);
    articles = fallback;
  }

  // JSON-LD: CollectionPage schema — signals topic authority to AI crawlers
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cat.name,
    description: cat.description,
    url: `https://hakd.app/articles/category/${params.category}`,
    about: { '@type': 'Thing', name: cat.entity },
    publisher: { '@type': 'Organization', name: 'HAKD', url: 'https://hakd.app' },
    hasPart: (articles || []).map(a => ({
      '@type': 'Article',
      headline: a.title,
      url: `https://hakd.app/articles/${a.slug}`,
      datePublished: a.published_at,
    })),
  });

  const breadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hakd.app' },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://hakd.app/articles' },
      { '@type': 'ListItem', position: 3, name: cat.name, item: `https://hakd.app/articles/category/${params.category}` },
    ],
  });

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />

      <section className="hero" style={{ paddingBottom: '2rem' }}>
        <div className="hero-left">
          <div className="hero-eyebrow">
            <Link href="/articles" style={{ color: 'inherit' }}>Articles</Link> → {cat.name}
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>{cat.name}</h1>
          <p className="hero-sub">{cat.description}</p>
        </div>
      </section>

      <section className="section">
        {!articles || articles.length === 0 ? (
          <div className="empty">
            <div className="empty-title">Articles publishing soon</div>
            <p>The HAKD content machine publishes in this category every week. Check back shortly.</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((a, i) => (
              <Link href={`/articles/${a.slug}`} key={a.slug}>
                <div className="article-card">
                  <div className="article-card-top">
                    <span className="article-cat">{cat.name}</span>
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
            The EMM Assessment identifies your biggest bottleneck across 7 dimensions — so you know exactly which {cat.name.toLowerCase()} protocols apply to your situation.
          </div>
        </div>
        <a className="emm-banner-btn" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
          Take the Assessment →
        </a>
      </div>
    </main>
  );
}
