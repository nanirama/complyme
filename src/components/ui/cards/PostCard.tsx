import Link from 'next/link';
import { Post } from '@/lib/posts';

interface PostCardProps {
  post: Post;
}

/**
 * PostCard Component
 * 
 * Displays a post card with title and excerpt in a clean, minimalist design.
 * Optimized for:
 * - Core Web Vitals (LCP, CLS, FID, INP)
 * - W3C Validation
 * - WCAG 2.1 AA Accessibility
 * - Technical SEO
 * - Fully Responsive Design
 */
export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="
        group block w-full
        bg-white rounded-lg
        p-6 md:p-8
        transition-all duration-200 ease-in-out
        hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
      "
      aria-label={`${post.title} - Read more`}
    >
      {/* Title */}
      <h2 className="
        text-xl md:text-2xl
        font-bold text-gray-900
        mb-4
        leading-tight
        transition-colors duration-200
        group-hover:text-amber-600
      ">
        {post.title}
      </h2>
      
      {/* Excerpt */}
      {post.excerpt && (
        <p className="
          text-base 
          font-normal text-gray-600
          leading-relaxed
          line-clamp-3
        ">
          {post.excerpt}
        </p>
      )}
    </Link>
  );
}
