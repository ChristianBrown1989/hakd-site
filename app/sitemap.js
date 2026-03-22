import { supabase } from '../lib/supabase';

const BASE_URL = 'https://hakd.app';

const STATIC_ROUTES = [
  { url: BASE_URL, priority: 1.0, changefreq: 'daily' },
  { url: `${BASE_URL}/articles`, priority: 0.9, changefreq: 'daily' },
  { url: `${BASE_URL}/directory`, priority: 0.8, changefreq: 'daily' },
  { url: `${BASE_URL}/about`, priority: 0.7, changefreq: 'monthly' },
];

const CATEGORY_ROUTES = [
  'nervous-system', 'recovery', 'training-science',
  'nutrition', 'wearables-hrv', 'mental-performance', 'longevity'
].map(slug => ({
  url: `${BASE_URL}/articles/category/${slug}`,
  priority: 0.8,
  changefreq: 'weekly',
}));

export default async function sitemap() {
  const [{ data: articles }, { data: listings }] = await Promise.all([
    supabase.from('articles').select('slug, published_at, updated_at').order('published_at', { ascending: false }),
    supabase.from('hakd_listings').select('slug, last_verified').order('created_at', { ascending: false }),
  ]);

  const articleRoutes = (articles || []).map(article => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: article.updated_at || article.published_at,
    priority: 0.85,
    changeFrequency: 'monthly',
  }));

  const listingRoutes = (listings || []).map(listing => ({
    url: `${BASE_URL}/directory/${listing.slug}`,
    lastModified: listing.last_verified,
    priority: 0.8,
    changeFrequency: 'weekly',
  }));

  const directoryCategoryRoutes = [
    'nervous-system', 'recovery', 'training-science',
    'nutrition', 'wearables-hrv', 'mental-performance', 'longevity'
  ].map(slug => ({
    url: `${BASE_URL}/directory/category/${slug}`,
    priority: 0.8,
    changeFrequency: 'weekly',
  }));

  return [
    ...STATIC_ROUTES.map(r => ({ url: r.url, priority: r.priority, changeFrequency: r.changefreq })),
    ...CATEGORY_ROUTES.map(r => ({ url: r.url, priority: r.priority, changeFrequency: r.changefreq })),
    ...directoryCategoryRoutes,
    ...articleRoutes,
    ...listingRoutes,
  ];
}
