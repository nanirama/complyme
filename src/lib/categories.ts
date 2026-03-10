import fs from 'fs';
import path from 'path';

export interface Category {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}

const categoriesDirectory = path.join(process.cwd(), 'src', 'content', 'categories');

/**
 * Get all categories from JSON files
 * The filename (without .json extension) is used as the slug
 */
export function getAllCategories(): Category[] {
  try {
    const fileNames = fs.readdirSync(categoriesDirectory);
    const categories: Category[] = [];

    for (const fileName of fileNames) {
      if (fileName.endsWith('.json')) {
        const filePath = path.join(categoriesDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const category: Category = JSON.parse(fileContents);
        
        // Use filename (without .json) as slug if not provided in JSON
        const slug = category.slug || fileName.replace(/\.json$/, '');
        categories.push({
          ...category,
          slug,
        });
      }
    }

    return categories;
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}

/**
 * Get a single category by slug
 */
export function getCategoryBySlug(slug: string): Category | null {
  const categories = getAllCategories();
  return categories.find(cat => cat.slug === slug) || null;
}

/**
 * Get all category slugs for static generation
 */
export function getAllCategorySlugs(): string[] {
  const categories = getAllCategories();
  return categories.map(cat => cat.slug);
}

/**
 * Get the icon path for a category icon
 * Returns the API route path to serve icons from the categories folder
 */
export function getCategoryIconPath(iconName: string): string {
  return `/api/category-icon/${iconName}`;
}
