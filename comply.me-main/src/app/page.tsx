import type { Metadata } from 'next';
import { generateSeoMetadata } from '@/components/common/Seo';
import { siteConfig } from '@/config/site';
import HeroSection from '@/components/Home/HeroSection';
import ComplianceSolutions from '@/components/Home/ComplianceSolutions';
import HomeCategories from '@/components/Home/HomeCategories';
import CategoryGrid from '@/components/shared/CategoryGrid';
import { getCategoryBySlug } from '@/lib/categories';
import { getPostsByCategory } from '@/lib/posts';

export const metadata: Metadata = generateSeoMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: ['small business', 'business services', 'compliance', 'business formation', 'business funding'],
  url: '/',
  type: 'website',
  siteName: siteConfig.name,
  siteUrl: siteConfig.siteUrl,
});

// Category slugs to display on homepage
const categorySlugs = [
  'business-taxes',
  'compliance',
  'hr-compliance',
  'small-business-news',
  'outsourcing-hr',
  'small-business-guidelines',
  'small-business-payroll',
];

export default function Home() {
  // Get posts for each category
  const categoryGrids = categorySlugs.map((slug) => {
    const category = getCategoryBySlug(slug);
    if (!category) return null;

    const posts = getPostsByCategory(category.name, category.slug).slice(0, 6);
    
    return {
      title: category.name,
      slug: category.slug,
      posts,
      color: category.color,
    };
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ComplianceSolutions />
      <HomeCategories />
      
      {/* Category Grids */}
      {categoryGrids.map((categoryGrid) => (
        categoryGrid && categoryGrid.posts.length > 0 && (
          <CategoryGrid
            key={categoryGrid.slug}
            title={categoryGrid.title}
            categorySlug={categoryGrid.slug}
            posts={categoryGrid.posts}
            categoryColor={categoryGrid.color}
          />
        )
      ))}
    </div>
  );
}
