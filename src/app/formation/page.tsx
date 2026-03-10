import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { generateSeoMetadata } from '@/components/common/Seo';
import FormationSection from '@/components/shared/FormationSection';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Business Formation',
  description: 'Start, build and maintain your business with stress-free compliance. Company formation, business taxes, and compliance services.',
  keywords: ['business formation', 'company formation', 'business taxes', 'business compliance', 'start a business'],
  url: '/formation',
  type: 'website',
  siteName: siteConfig.name,
  siteUrl: siteConfig.siteUrl,
});

/**
 * Formation Page
 * 
 * Optimized for:
 * - Core Web Vitals (LCP, CLS, FID, INP)
 * - W3C Validation
 * - WCAG 2.1 AA Accessibility
 * - Technical SEO
 */
export default function FormationPage() {
  return (
    <main id="main-content" className="min-h-screen bg-white">
      <FormationSection />
    </main>
  );
}
