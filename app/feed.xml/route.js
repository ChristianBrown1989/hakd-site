import { supabase } from '../../lib/supabase';

export const revalidate = 3600;

export async function GET() {
  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, meta_description, published_at, content')
    .order('published_at', { ascending: false })
    .limit(25);

  const items = (articles || []).map((a) => {
    const excerpt = a.meta_description || '';
    const pubDate = a.published_at ? new Date(a.published_at).toUTCString() : '';
    return `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>https://hakd.app/articles/${a.slug}</link>
      <guid isPermaLink="true">https://hakd.app/articles/${a.slug}</guid>
      <description><![CDATA[${excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@hakd.app (Christian Brown)</author>
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>HAKD — Performance Intelligence</title>
    <link>https://hakd.app</link>
    <description>Evidence-based protocols for high-performing professionals. HRV optimization, adaptive training, recovery architecture, and nervous system science.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://hakd.app/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>noreply@hakd.app (Christian Brown)</managingEditor>
    <webMaster>noreply@hakd.app (Christian Brown)</webMaster>
    <category>Health &amp; Fitness</category>
    <ttl>60</ttl>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
