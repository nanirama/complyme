import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { generateSeoMetadata } from '@/components/common/Seo';
import { getPostsByCategory } from '@/lib/sheets';

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
 */
export default async function BusinessFundingPage() {
  // Get business funding posts
  const posts = await getPostsByCategory('business-funding');

  return (
    <main id="main-content" className="min-h-screen bg-gray-50">
      <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <h1 className="
            text-3xl md:text-4xl lg:text-5xl
            font-bold text-gray-900
            mb-4
            leading-tight
          ">
            Business Funding
          </h1>
          <p className="
            text-base 
            font-normal text-gray-600
            leading-relaxed
          ">
            Find small business programs and financing options
          </p>
        </header>

        {/* Posts Grid */}
        <div className="
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          gap-4 md:gap-6
        ">
          {posts.map((post) => {
            return (
              <Link
                key={post.slug}
                href={`/${post.slug}/`}
                className="
                  group
                  bg-white rounded-lg
                  p-4 md:p-6
                  shadow-sm
                  hover:shadow-md
                  transition-all duration-200
                  flex items-start gap-3
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                "
                aria-label={`${post.title} - Learn more`}
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 relative" aria-hidden="true">
                  <Image
                    src="/images/shop-iconV2.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="w-full h-full"
                  />
                </div>
                
                {/* Post Title */}
                <span className="
                  text-base 
                  font-normal text-gray-900
                  leading-tight
                  group-hover:text-blue-600
                  transition-colors duration-200
                  flex-1
                ">
                  {post.title}
                </span>
              </Link>
            );
          })}
        </div>
      </article>
    </main>
  );
}
