import { supabase } from '../lib/supabase';
import Link from 'next/link';
import NewsletterForm from './components/NewsletterForm';

export const revalidate = 3600;

const CATEGORIES = [
  { name: 'Nervous System', color: 'var(--cat-ns)', key: 'nervous-system' },
  { name: 'Recovery', color: 'var(--cat-recovery)', key: 'recovery' },
  { name: 'Training Science', color: 'var(--cat-training)', key: 'training' },
  { name: 'Nutrition', color: 'var(--cat-nutrition)', key: 'nutrition' },
  { name: 'Wearables & HRV', color: 'var(--cat-wearables)', key: 'wearables' },
  { name: 'Mental Performance', color: 'var(--cat-mental)', key: 'mental' },
  { name: 'Longevity', color: 'var(--cat-longevity)', key: 'longevity' },
];

async function getArticles() {
  const { data } = await supabase
    .from('articles')
    .select('title, slug, meta_description, published_at, topic_source')
    .order('published_at', { ascending: false })
    .limit(9);
  return data || [];
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function readTime(desc) {
  return '6 min read';
}

function getCategoryColor(index) {
  return CATEGORIES[index % CATEGORIES.length].color;
}

function getCategoryName(index) {
  return CATEGORIES[index % CATEGORIES.length].name;
}

export default async function HomePage() {
  const articles = await getArticles();
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">Performance Intelligence Hub</div>
          <h1 className="hero-title">
            Train Smarter.<br />
            Recover <em>Deeper.</em><br />
            Perform Longer.
          </h1>
          <p className="hero-sub">
            Evidence-based protocols for high-performing professionals. Nervous system optimization, adaptive training, and recovery architecture — built for people who run at full capacity.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
              Free EMM Assessment →
            </a>
            <a className="btn-ghost" href="/articles">
              Read Articles
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">7</div>
              <div className="hero-stat-label">Dimensions Tracked</div>
            </div>
            <div>
              <div className="hero-stat-num">2x</div>
              <div className="hero-stat-label">Weekly Articles</div>
            </div>
            <div>
              <div className="hero-stat-num">100</div>
              <div className="hero-stat-label">Point Score System</div>
            </div>
          </div>
        </div>

        {/* Featured articles panel */}
        <div className="hero-right">
          <div className="hero-featured-label">Latest Intelligence</div>
          {featured ? (
            <Link href={`/articles/${featured.slug}`} className="hero-feature-card">
              <div className="hero-feature-cat" style={{ color: getCategoryColor(0) }}>
                {getCategoryName(0)}
              </div>
              <div className="hero-feature-title">{featured.title}</div>
              {featured.meta_description && (
                <div className="hero-feature-desc">{featured.meta_description}</div>
              )}
              <div className="hero-feature-meta">
                <span>{formatDate(featured.published_at)}</span>
                <span>·</span>
                <span>6 min read</span>
              </div>
            </Link>
          ) : (
            <div className="hero-feature-card">
              <div className="hero-feature-cat" style={{ color: getCategoryColor(0) }}>Nervous System</div>
              <div className="hero-feature-title">How HRV Tracking Can Predict Performance Drops Before You Feel Them</div>
              <div className="hero-feature-desc">The nervous system responds to stress before conscious perception catches up — HRV captures that gap.</div>
              <div className="hero-feature-meta"><span>Publishing soon</span></div>
            </div>
          )}

          {rest.length >= 2 && (
            <div className="hero-small-cards">
              {rest.slice(0, 2).map((a, i) => (
                <Link href={`/articles/${a.slug}`} key={a.slug} className="hero-small-card">
                  <div className="hero-small-cat" style={{ color: getCategoryColor(i + 1) }}>
                    {getCategoryName(i + 1)}
                  </div>
                  <div className="hero-small-title">{a.title}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CATEGORY NAV */}
      <div className="cat-nav">
        <div className="cat-nav-inner">
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="cat-nav-item">
              <span className="cat-nav-dot" style={{ background: cat.color }} />
              {cat.name}
            </div>
          ))}
        </div>
      </div>

      {/* ARTICLES */}
      <section className="section">
        <div className="section-header">
          <div className="section-label">Latest Intelligence</div>
          <a href="/articles" className="section-link">View all →</a>
        </div>
        <div className="articles-grid">
          {articles.length === 0 ? (
            <div className="empty">
              <div className="empty-title">Articles publishing Monday</div>
              <p>The HAKD content machine runs every Monday and Thursday. Check back soon.</p>
            </div>
          ) : (
            articles.map((a, i) => (
              <Link href={`/articles/${a.slug}`} key={a.slug}>
                <div className="article-card">
                  <div className="article-card-top">
                    <span className="article-cat" style={{ color: getCategoryColor(i) }}>
                      {getCategoryName(i)}
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
            ))
          )}
        </div>
      </section>

      {/* EMM ASSESSMENT BANNER */}
      <div className="emm-banner" style={{ marginTop: 0, marginBottom: '1px' }}>
        <div className="emm-banner-left">
          <div className="emm-banner-eyebrow">EMM Performance Assessment — Free</div>
          <div className="emm-banner-title">Find your specific performance gap in 10 minutes.</div>
          <div className="emm-banner-sub">
            17 adaptive questions across 7 dimensions: nervous system, recovery, training, identity, energy, awareness, and accountability. Get your score, archetype, and the exact missing link in your system.
          </div>
        </div>
        <div className="emm-banner-right">
          <div className="emm-banner-score">100</div>
          <div className="emm-banner-score-label">Point scoring system</div>
          <a className="emm-banner-btn" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
            Take the Assessment →
          </a>
        </div>
      </div>

      {/* NEWSLETTER */}
      <section className="newsletter-section" id="newsletter">
        <div className="newsletter-inner">
          <div className="newsletter-eyebrow">The HAKD Intelligence Brief</div>
          <h2 className="newsletter-title">Performance science delivered twice a week.</h2>
          <p className="newsletter-sub">
            Every Monday and Thursday — one evidence-based protocol, one actionable insight. No fluff. Built for professionals who are already doing the work and want the edge.
          </p>
          <NewsletterForm />
          <p className="newsletter-privacy">No spam. Unsubscribe any time.</p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-strip">
        <div>
          <div className="about-eyebrow">What is HAKD</div>
          <h2 className="about-title">Performance intelligence built for people who run at full capacity.</h2>
          <p className="about-body">
            HAKD is a performance research hub for high-achieving professionals who already know the basics and want the frameworks that actually work under real-world pressure, travel, and stress load.
          </p>
          <p className="about-body">
            Every article explains the physiological mechanism — not just what to do, but why it works and how to apply it when your schedule fights back.
          </p>
          <a className="btn-primary" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener" style={{ display: 'inline-flex' }}>
            Start with the assessment →
          </a>
        </div>
        <div className="about-pillars">
          {[
            { icon: '⚡', title: 'Nervous System Science', desc: 'HRV, sympathetic load, recovery signaling, and parasympathetic restoration protocols.' },
            { icon: '🔄', title: 'Adaptive Training', desc: 'RPE-based programming that adjusts to your actual readiness — not a static plan.' },
            { icon: '🧬', title: 'Recovery Architecture', desc: 'Sleep quality, breathwork protocols, and the biology of restoration.' },
            { icon: '📊', title: 'Data-Driven Decisions', desc: 'How to use wearable data to make smarter training and recovery choices.' },
            { icon: '🏆', title: 'Longevity Protocols', desc: 'Biomarkers, VO2 max, grip strength, and the metrics that actually predict healthspan.' },
          ].map((p) => (
            <div className="about-pillar" key={p.title}>
              <div className="about-pillar-icon">{p.icon}</div>
              <div>
                <div className="about-pillar-title">{p.title}</div>
                <div className="about-pillar-desc">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIRECTORY */}
      <div className="directory-section">
        <div className="directory-inner">
          <div className="directory-header">
            <div>
              <div className="directory-badge">Coming Soon</div>
              <div className="directory-title">The Human Optimization Directory</div>
              <div className="directory-sub">
                A curated, vetted resource hub. Every listing reviewed for evidence quality and real-world application.
              </div>
            </div>
          </div>
          <div className="directory-grid">
            {[
              { icon: '👤', title: 'Coaches & Practitioners', desc: 'Vetted performance coaches, sports medicine, and optimization specialists.' },
              { icon: '🧊', title: 'Recovery Tools', desc: 'Cold therapy, compression, breathwork devices, and recovery technology.' },
              { icon: '⌚', title: 'Wearables & Tracking', desc: 'HRV monitors, sleep trackers, glucose monitors, and performance wearables.' },
              { icon: '🥩', title: 'Nutrition Protocols', desc: 'Evidence-based nutrition frameworks, fasting protocols, and supplementation guides.' },
              { icon: '🧠', title: 'Mental Performance', desc: 'Cognitive enhancement, stress resilience, and psychological optimization.' },
              { icon: '🔬', title: 'Longevity Research', desc: 'Biomarker testing, healthspan protocols, and cutting-edge longevity science.' },
            ].map((cat) => (
              <div className="dir-card" key={cat.title}>
                <div className="dir-card-icon">{cat.icon}</div>
                <div className="dir-card-title">{cat.title}</div>
                <div className="dir-card-desc">{cat.desc}</div>
                <div className="dir-card-count">Coming soon</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
