import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { generateSeoMetadata } from '@/components/common/Seo';
import { getPostsByCategory } from '@/lib/sheets';
import BusinessComplianceClient from './BusinessComplianceClient';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Business Compliance',
  description: 'Find business compliance requirements and regulations',
  keywords: ['business compliance', 'business regulations', 'compliance requirements', 'business laws', 'regulatory compliance'],
  url: '/business-compliance',
  type: 'article',
  image: '/images/logo.webp',
  siteName: siteConfig.name,
  siteUrl: siteConfig.siteUrl,
});

/**
 * Business Compliance Page
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

export default async function BusinessCompliancePage() {
  // Get business compliance posts
  const posts = await getPostsByCategory('business-compliance');

  //console.log('posts',posts)
  
  return <BusinessComplianceClient posts={posts} />;
}
