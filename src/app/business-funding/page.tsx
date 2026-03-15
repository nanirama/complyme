import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { generateSeoMetadata } from '@/components/common/Seo';
import { getPostsByCategory } from '@/lib/sheets';
import BusinessFundingClient from './BusinessFundingClient';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Business Funding',
  description: 'Find small business programs and financing options',
  keywords: ['business funding', 'small business loans', 'business financing', 'SBA loans', 'business credit cards'],
  url: '/business-funding',
  type: 'article',
  image: '/images/logo.webp',
  siteName: siteConfig.name,
  siteUrl: siteConfig.siteUrl,
});

/**
 * Business Funding Page
 * 
 * Optimized for:
 * - Core Web Vitals (LCP, CLS, FID, INP)
 * - W3C Validation
 * - WCAG 2.1 AA Accessibility
 * - Technical SEO
 * 
 * Using dynamic rendering to avoid oversized ISR page errors
 * Data is fetched on-demand instead of at build time
 */
export const dynamic = 'force-dynamic';

export default async function BusinessFundingPage() {
  // Get business funding posts
  const posts = await getPostsByCategory('business-funding');

  return <BusinessFundingClient posts={posts} />;
}
