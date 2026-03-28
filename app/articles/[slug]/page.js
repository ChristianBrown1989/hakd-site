import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import ArticleNewsletterCTA from '../../components/ArticleNewsletterCTA';

// Configure marked for clean output
marked.setOptions({ breaks: true, gfm: true });

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { data } = await supabase
    .from('articles')
    .select('title, meta_description, published_at, slug')
    .eq('slug', params.slug)
    .single();
  if (!data) return { title: 'HAKD' };
  return {
    title: `${data.title} — HAKD`,
    description: data.meta_description,
    alternates: { canonical: `https://hakd.app/articles/${data.slug}` },
    openGraph: {
      title: data.title,
      description: data.meta_description,
      type: 'article',
      url: `https://hakd.app/articles/${data.slug}`,
      siteName: 'HAKD',
      publishedTime: data.published_at,
      authors: ['Christian Brown'],
    },
    twitter: { card: 'summary_large_image', title: data.title, description: data.meta_description },
  };
}

async function getRelated(currentSlug) {
  const { data } = await supabase
    .from('articles')
    .select('title, slug, meta_description, published_at')
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(3);
  return data || [];
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default async function ArticlePage({ params }) {
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!article) notFound();

  const related = await getRelated(params.slug);

  // Article JSON-LD — what AI search engines use to cite and summarize this content
  const CATEGORY_MAP = {
    'nervous-system': 'Nervous System',
    'recovery': 'Recovery',
    'training-science': 'Training Science',
    'nutrition': 'Nutrition',
    'wearables-hrv': 'Wearables & HRV',
    'mental-performance': 'Mental Performance',
    'longevity': 'Longevity',
  };
  const categoryLabel = CATEGORY_MAP[article.category] || 'Performance Intelligence';

  const wordCount = article.content ? article.content.replace(/<[^>]+>/g, '').split(/\s+/).length : 800;
  const readMins = Math.max(4, Math.round(wordCount / 200));

  const articleSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.meta_description || '',
    url: `https://hakd.app/articles/${article.slug}`,
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: { '@type': 'Person', name: 'Christian Brown', url: 'https://hakd.app' },
    publisher: { '@type': 'Organization', name: 'HAKD', url: 'https://hakd.app' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://hakd.app/articles/${article.slug}` },
    wordCount,
    timeRequired: `PT${readMins}M`,
    inLanguage: 'en-US',
    about: { '@type': 'Thing', name: 'Performance Optimization' },
    keywords: [article.category, 'biohacking', 'HRV', 'nervous system', 'recovery', 'performance optimization', 'longevity'].filter(Boolean).join(', '),
  });

  const breadcrumbSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hakd.app' },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://hakd.app/articles' },
      { '@type': 'ListItem', position: 3, name: article.title, item: `https://hakd.app/articles/${article.slug}` },
    ],
  });

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      {article.faq_schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: article.faq_schema }} />
      )}
      <div className="article-wrap">
        {/* MAIN CONTENT */}
        <article className="article-main">
          <Link href="/" className="article-back">← Back to HAKD</Link>

          <header className="article-header">
            <div className="article-header-cat">{categoryLabel}</div>
            <div dangerouslySetInnerHTML={{ __html: `<h1>${article.title}</h1>` }} />
            <div className="article-header-meta">
              <span>📅 {formatDate(article.published_at)}</span>
              <span>⏱ {readMins} min read</span>
              <span>✍️ Christian Brown</span>
            </div>
          </header>

          {(() => {
            const html = marked(article.content || '');
            // Split after ~3rd paragraph for mid-article CTA
            const splitPoint = html.indexOf('</p>', html.indexOf('</p>', html.indexOf('</p>') + 1) + 1) + 4;
            if (splitPoint > 4) {
              return (
                <>
                  <div className="article-content" dangerouslySetInnerHTML={{ __html: html.slice(0, splitPoint) }} />
                  <ArticleNewsletterCTA source={`article-${article.slug}`} />
                  <div className="article-content" dangerouslySetInnerHTML={{ __html: html.slice(splitPoint) }} />
                </>
              );
            }
            return <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />;
          })()}

          {/* FAQ SECTION — visible to users, also in JSON-LD for AI/search */}
          {article.faq_schema && (() => {
            try {
              const faq = JSON.parse(article.faq_schema);
              const items = faq?.mainEntity || [];
              if (!items.length) return null;
              return (
                <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '1.5rem' }}>
                    Frequently Asked
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {items.map((item, i) => (
                      <div key={i} style={{ borderLeft: '2px solid var(--border2)', paddingLeft: '1.1rem' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--t2)', lineHeight: 1.7 }}>
                          {item.acceptedAnswer?.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            } catch { return null; }
          })()}

          {/* RELATED ARTICLES */}
          {related.length > 0 && (
            <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '1.25rem' }}>
                More Intelligence
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {related.map((a) => (
                  <Link href={`/articles/${a.slug}`} key={a.slug}>
                    <div style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '1.1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      transition: 'border-color 0.15s',
                    }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.4 }}>
                        {a.title}
                      </div>
                      <span style={{ color: 'var(--gold)', opacity: 0.7, flexShrink: 0 }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* SIDEBAR */}
        <aside className="article-sidebar">
          {/* EMM CTA */}
          <div className="sidebar-card sidebar-emm">
            <div className="sidebar-label">Free Assessment</div>
            <div className="sidebar-emm-title">Find your specific performance gap</div>
            <div className="sidebar-emm-sub">
              17 adaptive questions. 7-dimension profile. Get your EMM score and archetype.
            </div>
            <a className="sidebar-emm-btn" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
              Take the Assessment →
            </a>
          </div>

          {/* COACHING */}
          <div className="sidebar-card">
            <div className="sidebar-label">EMM Coaching</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <a href="https://coach.everfit.io/package/GL583637" target="_blank" rel="noopener" style={{
                display: 'block',
                background: 'var(--s2)',
                border: '1px solid var(--border2)',
                borderRadius: '8px',
                padding: '0.9rem',
              }}>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>Full Coaching</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>EMM Monthly Coaching</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--t3)' }}>$250/month · Custom programming</div>
              </a>
              <a href="https://coach.everfit.io/package/KX912574" target="_blank" rel="noopener" style={{
                display: 'block',
                background: 'var(--s2)',
                border: '1px solid var(--border2)',
                borderRadius: '8px',
                padding: '0.9rem',
              }}>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>Self-Guided</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>EMM Monthly Training</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--t3)' }}>$80/month · Full system</div>
              </a>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="sidebar-card">
            <div className="sidebar-label">Topics</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                ['⚡', 'Nervous System', 'var(--cat-ns)', 'nervous-system'],
                ['🔄', 'Recovery', 'var(--cat-recovery)', 'recovery'],
                ['🏋️', 'Training Science', 'var(--cat-training)', 'training-science'],
                ['🧠', 'Mental Performance', 'var(--cat-mental)', 'mental-performance'],
                ['⌚', 'Wearables & HRV', 'var(--cat-wearables)', 'wearables-hrv'],
                ['🔬', 'Longevity', 'var(--cat-longevity)', 'longevity'],
              ].map(([icon, name, color, key]) => (
                <a href={`/articles/category/${key}`} key={name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  color: 'var(--t2)',
                  transition: 'background 0.15s',
                }}>
                  <span style={{ fontSize: '0.85rem' }}>{icon}</span>
                  <span style={{ color }}>{name}</span>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
