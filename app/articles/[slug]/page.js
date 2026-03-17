import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { data } = await supabase
    .from('articles')
    .select('title, meta_description')
    .eq('slug', params.slug)
    .single();

  if (!data) return { title: 'HAKD' };
  return {
    title: `${data.title} — HAKD`,
    description: data.meta_description,
  };
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

  return (
    <main>
      <article className="article-page">
        <Link href="/" className="article-page-back">← Back to HAKD</Link>
        <div className="article-page-tag">Performance Intelligence</div>
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        <div className="article-page-meta" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', paddingBottom: 0, marginBottom: 0 }}>
          Published {formatDate(article.published_at)}
        </div>
      </article>

      {/* EMM BANNER */}
      <div className="emm-banner">
        <div className="emm-banner-left">
          <div className="emm-banner-eyebrow">EMM Performance Assessment</div>
          <div className="emm-banner-title">Find your specific performance gap — free.</div>
          <div className="emm-banner-sub">
            17 adaptive questions. 7-dimension profile. Get your EMM score and the exact missing link in your system.
          </div>
        </div>
        <a className="emm-banner-btn" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
          Take the Assessment →
        </a>
      </div>
    </main>
  );
}
