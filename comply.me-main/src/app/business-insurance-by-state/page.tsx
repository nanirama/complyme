import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { generateSeoMetadata } from '@/components/common/Seo';
import { getStateCategoryPosts } from '@/lib/sheets';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Business insurance by state',
  description: 'Tailored solutions for your business',
  keywords: ['business insurance', 'insurance by state', 'business coverage', 'commercial insurance'],
  url: '/business-insurance-by-state',
  type: 'article',
  image: '/images/logo.webp',
  siteName: siteConfig.name,
  siteUrl: siteConfig.siteUrl,
});

/**
 * Business Insurance by State Page
 * 
 * Optimized for:
 * - Core Web Vitals (LCP, CLS, FID, INP)
 * - W3C Validation
 * - WCAG 2.1 AA Accessibility
 * - Technical SEO
 */
export default async function BusinessInsuranceByStatePage() {
  // Get state insurance posts
  const statePosts = await getStateCategoryPosts('business-insurance');

  return (
    <main id="main-content" className="min-h-screen bg-gray-50">
      <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="
            text-3xl md:text-4xl lg:text-5xl
            font-bold text-gray-900
            mb-4
            leading-tight
          ">
            Insurance by state
          </h1>
        </header>

        {/* Posts List */}
        <div className="
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          gap-4 md:gap-6
        ">
          {statePosts.map((post) => {
            return (
              <Link
                key={post.slug}
                href={`/${post.slug}/`}
                className="
                  group flex items-center gap-2
                  p-3 md:p-4
                  text-base 
                  font-normal text-gray-700
                  hover:text-blue-600
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded
                "
                aria-label={`${post.title} - Read more`}
              >
                {/* Arrow Icon */}
                <span className="text-gray-400 group-hover:text-blue-600 transition-colors" aria-hidden="true">
                  →
                </span>
                
                {/* Post Title */}
                <span>
                  {post.title?.replace(/\bstate\b/gi, '').trim().replace(/\s+/g, ' ') || post.title}
                </span>
              </Link>
            );
          })}
        </div>
      </article>
    </main>
  );
}
