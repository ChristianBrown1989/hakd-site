import { supabase } from '../lib/supabase';
import Link from 'next/link';

export const revalidate = 3600; // Refresh every hour

async function getArticles() {
  const { data } = await supabase
    .from('articles')
    .select('title, slug, meta_description, published_at, topic_source')
    .order('published_at', { ascending: false })
    .limit(12);
  return data || [];
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function HomePage() {
  const articles = await getArticles();

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">Performance Intelligence Hub</div>
        <h1 className="hero-title">
          Train Smarter.<br /><em>Recover Deeper.</em><br />Perform Longer.
        </h1>
        <p className="hero-sub">
          Evidence-based protocols for high-performing professionals. Nervous system optimization, adaptive training, recovery architecture — built for people who run at full capacity.
        </p>
        <div className="hero-tags">
          <span className="hero-tag">HRV & Nervous System</span>
          <span className="hero-tag">Adaptive Training</span>
          <span className="hero-tag">Recovery Protocols</span>
          <span className="hero-tag">Biohacking</span>
          <span className="hero-tag">Performance Nutrition</span>
          <span className="hero-tag">Longevity</span>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ARTICLES */}
      <section className="section">
        <div className="section-header">
          <div className="section-title">Latest Intelligence</div>
        </div>
        {articles.length === 0 ? (
          <div className="empty">Articles publishing soon — check back Monday.</div>
        ) : (
          <div className="articles-grid">
            {articles.map((a) => (
              <Link href={`/articles/${a.slug}`} key={a.slug}>
                <div className="article-card">
                  <div className="article-card-tag">Performance</div>
                  <div className="article-card-title">{a.title}</div>
                  {a.meta_description && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--t3)', lineHeight: 1.6 }}>
                      {a.meta_description}
                    </div>
                  )}
                  <div className="article-card-meta">{formatDate(a.published_at)}</div>
                  <div className="article-card-arrow">Read →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* EMM ASSESSMENT BANNER */}
      <div className="emm-banner">
        <div className="emm-banner-left">
          <div className="emm-banner-eyebrow">EMM Performance Assessment</div>
          <div className="emm-banner-title">Find your specific performance gap — free.</div>
          <div className="emm-banner-sub">
            17 adaptive questions across 7 dimensions. Get your EMM score, performance archetype, and the exact missing link in your system.
          </div>
        </div>
        <a className="emm-banner-btn" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
          Take the Assessment →
        </a>
      </div>

      {/* DIRECTORY — COMING SOON */}
      <div className="directory-section">
        <div className="directory-badge">Coming Soon</div>
        <div className="directory-title">The Human Optimization Directory</div>
        <div className="directory-sub">
          A curated resource hub for high performers — vetted practitioners, tools, protocols, and research across every domain of performance optimization.
        </div>
        <div className="directory-categories">
          <span className="dir-cat">Coaches & Practitioners</span>
          <span className="dir-cat">Recovery Tools</span>
          <span className="dir-cat">Wearables & Tracking</span>
          <span className="dir-cat">Nutrition Protocols</span>
          <span className="dir-cat">Mental Performance</span>
          <span className="dir-cat">Longevity Research</span>
        </div>
      </div>
    </main>
  );
}
