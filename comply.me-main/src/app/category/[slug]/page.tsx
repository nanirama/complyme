import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { getCategoryBySlug, getAllCategorySlugs, getCategoryIconPath } from '@/lib/categories';
import { getPostsByCategory } from '@/lib/posts';
import { generateSeoMetadata } from '@/components/common/Seo';
import PostCard from '@/components/ui/cards/PostCard';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all categories
 */
export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata(
  { params }: CategoryPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const title = category.name;
  const description = category.description || `${category.name} - ${siteConfig.description}`;
  const image = category.icon ? getCategoryIconPath(category.icon) : undefined;

  return generateSeoMetadata({
    title,
    description,
    keywords: [category.name, 'category'],
    url: `/category/${slug}`,
    image,
    type: 'website',
    siteName: siteConfig.name,
    siteUrl: siteConfig.siteUrl,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  console.log('category', category);

  if (!category) {
    notFound();
  }

  // Get posts by category name or slug (either one matches)
  const posts = getPostsByCategory(category.name, category.slug);

  return (
    <main id="main-content" className="min-h-screen bg-[#f8f8f8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {/* {category.icon && (
                <div className="flex-shrink-0">
                  <Image
                    src={getCategoryIconPath(category.icon)}
                    alt={category.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                </div>
              )} */}
              <div>
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold !text-[#2d3748]"
                >
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-base text-[#718096] max-w-3xl mt-2">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-12">
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">
                  No posts in this category yet
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
