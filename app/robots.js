export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // Allow AI crawlers explicitly — critical for Perplexity, ChatGPT, Claude citations
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
    ],
    sitemap: 'https://hakd.co/sitemap.xml',
    host: 'https://hakd.co',
  };
}
