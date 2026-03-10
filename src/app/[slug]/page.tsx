import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { generateSeoMetadata } from '@/components/common/Seo';
import statesData from '@/data/states.json';
import { getPostBySlug, getPostSlugs } from '@/lib/sheets';

interface StateRegulationsPageProps {
  params: Promise<{ slug: string }>;
}

interface State {
  title: string;
  code: string;
}

/**
 * Extract state code from slug and validate it
 * Example: 'al-state-regulations-small-business-requirements' -> 'AL'
 */
function getStateFromSlug(slug: string): State | null {
  // Extract first two characters and convert to uppercase
  const stateCode = slug.substring(0, 2).toUpperCase();
  
  // Find state in states.json
  const state = (statesData as State[]).find(
    (s) => s.code.toUpperCase() === stateCode
  );
  
  return state || null;
}

/**
 * Check if slug matches the state regulations pattern
 */

/**
 * Generate static params for all states and posts
 * Pre-warms the cache during build to avoid quota issues
 */
export async function generateStaticParams() {
  // Use lightweight function that only fetches slugs
  // This avoids the 75MB body limit by not fetching full post data
  const slugs = await getPostSlugs().catch(() => []);

  return slugs.map((slug) => ({
    slug,
  }));
}

/**
 * Generate metadata for SEO
 */
// export async function generateMetadata(
//   { params }: StateRegulationsPageProps
// ): Promise<Metadata> {
//   const { slug } = await params;
  
//   // First check if this is a post from sheets
//   const post = await getPostBySlug(slug);
//   if (post) {
//     const description = post.excerpt || post.description || post.content?.substring(0, 160) || `Read ${post.title}`;
    
//     return generateSeoMetadata({
//       title: post.title,
//       description,
//       keywords: post.keywords?.split(',').map(k => k.trim()) || [post.title],
//       url: `/${slug}`,
//       type: 'article',
//       image: post.thumbnail || '/images/logo.webp',
//       siteName: siteConfig.name,
//       siteUrl: siteConfig.siteUrl,
//     });
//   }

//   return {
//     title: 'Page Not Found',
//   };
// }

/**
 * Dynamic Page Handler
 * 
 * Handles both posts from sheets and state-specific regulations
 * URL patterns:
 * - Posts: /{post-slug}
 * - State regulations: /{stateCode}-state-regulations-small-business-requirements
 * 
 * Optimized for:
 * - Core Web Vitals (LCP, CLS, FID, INP)
 * - W3C Validation
 * - WCAG 2.1 AA Accessibility
 * - Technical SEO
 */
/**
 * Dynamic Page Handler with ISR (Incremental Static Regeneration)
 * Revalidates every hour to keep content fresh without full rebuilds
 */
export const revalidate = 3600; // Revalidate every hour

export default async function DynamicPage({ params }: StateRegulationsPageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  console.log('slug', slug);
  
  // First check if this is a post from sheets
  // Use cache - should be pre-warmed during generateStaticParams
  const post = await getPostBySlug(slug);

  //console.log('post', post);

  return false;
  // if (post) {
  //   return (
  //     <main id="main-content" className="min-h-screen bg-gray-50">
  //       <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
  //       <header className="mb-8">
  //               <h1 className="
  //                 text-3xl md:text-4xl lg:text-5xl
  //                 font-bold text-gray-900
  //                 mb-4
  //                 leading-tight
  //               ">
  //                 {post.title}
  //               </h1>
  //               {post.category && (
  //                 <p className="text-base  font-normal text-gray-700 leading-relaxed font-inter">
  //                   Published in : {post.category}
  //                 </p>
  //               )}
  //             </header>
  //         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
  //           {/* Main Content - 8 columns */}
  //           <div className="lg:col-span-8 cat_content">
  //             {/* Page Header */}
              

  //             {/* Description Content Card */}
  //             {post.description && (
  //               <div className="
  //                 bg-white rounded-lg
  //                 p-6 md:p-8 lg:p-10
  //                 shadow-sm
  //                 mb-8
  //               ">
  //                 <div 
  //                   className="
  //                     text-base 
  //                     font-normal text-gray-700
  //                     leading-relaxed
  //                     prose prose-lg max-w-none
  //                   "
  //                   dangerouslySetInnerHTML={{ __html: post.description }}
  //                 />
  //               </div>
  //             )}

  //             {/* State Content Card */}
  //             {post.state && (
  //               <div className="
  //                 bg-white rounded-lg
  //                 p-6 md:p-8 lg:p-10
  //                 shadow-sm
  //                 mb-8
  //               ">
  //                 <div 
  //                   className="
  //                     text-base 
  //                     font-normal text-gray-700
  //                     leading-relaxed
  //                     prose prose-lg max-w-none
  //                   "
  //                   dangerouslySetInnerHTML={{ __html: post.state }}
  //                 />
  //               </div>
  //             )}

  //             {/* City Content Card */}
  //             {post.city && (
  //               <div className="
  //                 bg-white rounded-lg
  //                 p-6 md:p-8 lg:p-10
  //                 shadow-sm
  //                 mb-8
  //               ">
  //                 <div 
  //                   className="
  //                     text-base 
  //                     font-normal text-gray-700
  //                     leading-relaxed
  //                     prose prose-lg max-w-none
  //                   "
  //                   dangerouslySetInnerHTML={{ __html: post.city }}
  //                 />
  //               </div>
  //             )}
  //             {post.federal && (
  //               <div className="
  //                 bg-white rounded-lg
  //                 p-6 md:p-8 lg:p-10
  //                 shadow-sm
  //                 mb-8
  //               ">
  //                 <div 
  //                   className="
  //                     text-base 
  //                     font-normal text-gray-700
  //                     leading-relaxed
  //                     prose prose-lg max-w-none
  //                   "
  //                   dangerouslySetInnerHTML={{ __html: post.federal }}
  //                 />
  //               </div>
  //             )}
  //           </div>

  //           {/* Sidebar - 4 columns */}
  //           <aside className="lg:col-span-4">
  //             <div className="sticky top-24 space-y-8">
  //               {/* Small Business Insurance Card */}
  //               <div className="bg-[#edf2f7] rounded-lg p-6 md:p-8">
  //                 {/* Icon */}
  //                 <div className="flex justify-center mb-6">
  //                   <svg
  //                     className="w-16 h-16 text-purple-600"
  //                     fill="currentColor"
  //                     viewBox="0 0 24 24"
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     aria-hidden="true"
  //                   >
  //                     <path d="M9.14 7.5l-1.28-1.28c-.39-.39-1.02-.39-1.41 0L4.5 8.55c-.39.39-.39 1.02 0 1.41l1.28 1.28c.39.39 1.02.39 1.41 0L9.14 8.91c.39-.39.39-1.02 0-1.41zm5.72 0c-.39-.39-1.02-.39-1.41 0l-1.28 1.28c-.39.39-.39 1.02 0 1.41l1.28 1.28c.39.39 1.02.39 1.41 0l1.28-1.28c.39-.39.39-1.02 0-1.41l-1.28-1.28zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm6 4h-4v2h4v-2z"/>
  //                   </svg>
  //                 </div>

  //                 {/* Heading */}
  //                 <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center leading-tight">
  //                   Small<br />
  //                   Business<br />
  //                   Insurance
  //                 </h2>

  //                 {/* Subtitle */}
  //                 <p className="text-base text-gray-600 mb-6 text-center">
  //                   Find Tailored Plans for your business
  //                 </p>

  //                 {/* Bullet Points */}
  //                 <ul className="space-y-3 mb-6">
  //                   <li className="flex items-start gap-3">
  //                     <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
  //                     <span className="text-base text-gray-700">Cheap plans</span>
  //                   </li>
  //                   <li className="flex items-start gap-3">
  //                     <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
  //                     <span className="text-base text-gray-700">Full coverage</span>
  //                   </li>
  //                   <li className="flex items-start gap-3">
  //                     <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
  //                     <span className="text-base text-gray-700">Wide Selection</span>
  //                   </li>
  //                 </ul>

  //                 {/* Learn More Button */}
  //                 <Link
  //                   href="/business-insurance-by-state/"
  //                   className="
  //                     block w-full
  //                     bg-indigo-500 hover:bg-indigo-600
  //                     text-white
  //                     font-semibold
  //                     text-center
  //                     py-3 px-6
  //                     rounded-full
  //                     transition-colors duration-200
  //                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
  //                   "
  //                 >
  //                   Learn More
  //                 </Link>
  //               </div>
  //             </div>
  //           </aside>
  //         </div>
  //       </article>
  //     </main>
  //   );
  // }
 }
