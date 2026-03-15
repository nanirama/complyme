import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  categoryFolder?: string; // The folder name of the category (e.g., 'autos', 'education')
  thumbnail?: string;
  keywords?: string[];
  content: string;
  excerpt?: string;
}

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'posts');

/**
 * Convert a string to a URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, '-')         // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')              // Trim hyphens from start
    .replace(/-+$/, '');             // Trim hyphens from end
}

/**
 * Get all posts from markdown files
 * Reads posts from posts/category-name/post-slug structure
 */
export function getAllPosts(): Post[] {
  try {
    const posts: Post[] = [];

    // Get all category folders in posts directory
    const categoryFolders = fs.readdirSync(postsDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Iterate through each category folder
    for (const categoryFolder of categoryFolders) {
      const categoryPath = path.join(postsDirectory, categoryFolder);
      
      // Get all post folders within the category folder
      const postFolders = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      // Iterate through each post folder
      for (const postFolder of postFolders) {
        const postPath = path.join(categoryPath, postFolder);
        const indexPath = path.join(postPath, 'index.mdx');

        if (fs.existsSync(indexPath)) {
          const fileContents = fs.readFileSync(indexPath, 'utf8');
          const { data, content } = matter(fileContents);

          // Create slug from post folder name
          const slug = slugify(postFolder);

          posts.push({
            slug,
            title: data.title || '',
            date: data.date || '',
            author: data.author || '',
            category: data.category || categoryFolder,
            categoryFolder,
            thumbnail: data.thumbnail || undefined,
            keywords: data.keywords || [],
            content,
            excerpt: content.substring(0, 200).replace(/\n/g, ' ').trim() + '...',
          });
        }
      }
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

/**
 * Get posts by category name or slug
 * Matches posts where post.category equals either category.name or category.slug
 */
export function getPostsByCategory(categoryName: string, categorySlug: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => 
    post.category === categoryName || post.category === categorySlug
  );
}

/**
 * Get a single post by slug
 * Searches through all categories to find the post
 */
export function getPostBySlug(slug: string): Post | null {
  try {
    // Get all category folders in posts directory
    const categoryFolders = fs.readdirSync(postsDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Search through each category folder for the post
    for (const categoryFolder of categoryFolders) {
      const categoryPath = path.join(postsDirectory, categoryFolder);
      
      // Get all post folders in this category
      const postFolders = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      // Search for post folder that matches the slug (compare slugified folder names)
      for (const postFolder of postFolders) {
        if (slugify(postFolder) === slug) {
          const postPath = path.join(categoryPath, postFolder);
          const indexPath = path.join(postPath, 'index.mdx');

          if (fs.existsSync(indexPath)) {
            const fileContents = fs.readFileSync(indexPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
              slug,
              title: data.title || '',
              date: data.date || '',
              author: data.author || '',
              category: data.category || categoryFolder,
              categoryFolder,
              thumbnail: data.thumbnail || undefined,
              keywords: data.keywords || [],
              content,
              excerpt: content.substring(0, 200).replace(/\n/g, ' ').trim() + '...',
            };
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error reading post:', error);
    return null;
  }
}

/**
 * Check if an image exists in the post's folder
 */
export function postImageExists(post: Post, imageName: string): boolean {
  if (!post.categoryFolder) {
    return false;
  }
  
  try {
    const imagePath = path.join(
      postsDirectory,
      post.categoryFolder,
      post.slug,
      imageName
    );
    return fs.existsSync(imagePath);
  } catch {
    return false;
  }
}

/**
 * Get the image path for a post image
 * Returns the API route path to serve images from the post's folder
 * Falls back to logo if image doesn't exist
 */
export function getPostImagePath(post: Post, imageName: string): string {
  if (!post.categoryFolder) {
    // Fallback to old path if categoryFolder is not set
    return `/assets/images/posts/${imageName}`;
  }
  
  // Check if image exists in post folder
  if (postImageExists(post, imageName)) {
    return `/api/post-image/${post.categoryFolder}/${post.slug}/${imageName}`;
  }
  
  // Fallback to logo if image doesn't exist
  return `/assets/images/logo.png`;
}

/**
 * Check if the given image path is the logo fallback
 */
export function isLogoFallback(imagePath: string): boolean {
  return imagePath === '/assets/images/logo.png';
}
