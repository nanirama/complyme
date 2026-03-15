import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getAllCategorySlugs } from '@/lib/categories';
import { getAllPosts } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.siteUrl;

  // Static routes from your site
  const staticRoutes = [
    '',
    '/raionebi',
    '/seqtorebi',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Category routes
  const categorySlugs = getAllCategorySlugs();
  const categoryRoutes = categorySlugs.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Post routes
  const allPosts = getAllPosts();
  const postRoutes = allPosts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
