import Link from 'next/link';
import { Post } from '@/lib/posts';

interface CategoryGridProps {
  title: string;
  categorySlug: string;
  posts: Post[];
  categoryColor?: string;
}

/**
 * CategoryGrid Component
 * 
 * Displays a grid of posts for a category with:
 * - First row: 3 full cards (title + excerpt)
 * - Second row: 3 title-only cards
 * 
 * Optimized for:
 * - Core Web Vitals (LCP, CLS, FID, INP)
 * - W3C Validation
 * - WCAG 2.1 AA Accessibility
 * - Technical SEO
 * - Fully Responsive Design
 */
export default function CategoryGrid({ title, categorySlug, posts, categoryColor }: CategoryGridProps) {
  // Split posts into first row (3 with descriptions) and second row (3 title only)
  const firstRowPosts = posts.slice(0, 3);
  const secondRowPosts = posts.slice(3, 6);

  return (
    <section
      className="
        relative w-full py-12 md:py-16
        bg-white
      "
      aria-labelledby={`category-${categorySlug}-heading`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2
            id={`category-${categorySlug}-heading`}
            className="
              text-2xl md:text-3xl lg:text-4xl
              font-bold text-gray-900
            "
          >
            {title}
          </h2>
          <Link
            href={`/category/${categorySlug}/`}
            className="
              inline-flex items-center
              px-4 py-2
              text-base font-semibold text-gray-700
              hover:text-blue-600
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded
            "
            aria-label={`View more ${title} posts`}
          >
            View More
            <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>

        {/* First Row - Full Cards with Descriptions */}
        {firstRowPosts.length > 0 && (
          <div className="
            grid grid-cols-1 md:grid-cols-3
            gap-6 md:gap-8
            mb-6 md:mb-8
          ">
            {firstRowPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}/`}
                className="
                  group block
                  bg-white rounded-lg
                  p-6 md:p-8
                  border border-gray-100
                  shadow-sm
                  transition-all duration-200 ease-in-out
                  hover:shadow-lg hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                "
                aria-label={`${post.title} - Read more`}
              >
                {/* Category Tag */}
                <div className="mb-4">
                  <span
                    className="
                      inline-block
                      px-3 py-1
                      text-xs font-semibold
                      rounded
                    "
                    style={{
                      backgroundColor: categoryColor || '#374151',
                    }}
                  >
                    {title}
                  </span>
                </div>

                {/* Title */}
                <h3 className="
                  text-lg md:text-xl
                  font-bold text-gray-900
                  mb-3
                  leading-tight
                  transition-colors duration-200
                  group-hover:text-blue-600
                ">
                  {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="
                    text-sm md:text-base
                    font-normal text-gray-600
                    leading-relaxed
                    line-clamp-3
                  ">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Second Row - Title Only Cards */}
        {secondRowPosts.length > 0 && (
          <div className="
            grid grid-cols-1 md:grid-cols-3
            gap-6 md:gap-8
          ">
            {secondRowPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}/`}
                className="
                  group block
                  bg-white rounded-lg
                  p-6 md:p-8
                  border border-gray-100
                  shadow-sm
                  transition-all duration-200 ease-in-out
                  hover:shadow-lg hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                "
                aria-label={`${post.title} - Read more`}
              >
                {/* Category Tag */}
                <div className="mb-4">
                <span
                    className="
                      inline-block
                      px-3 py-1
                      text-xs font-semibold
                      rounded
                    "
                    style={{
                      backgroundColor: categoryColor || '#374151',
                    }}
                  >
                    {title}
                  </span>
                </div>

                {/* Title Only */}
                <h3 className="
                  text-lg md:text-xl
                  font-bold text-gray-900
                  leading-tight
                  transition-colors duration-200
                  group-hover:text-blue-600
                ">
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
