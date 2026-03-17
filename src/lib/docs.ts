import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { DocMetadata, DocFrontmatter, Heading, SidebarItem } from './types';

const docsDirectory = path.join(process.cwd(), 'src', 'content', 'docs');

/**
 * Get all documentation files recursively
 */
export function getAllDocs(locale: string = 'en'): DocMetadata[] {
  const localePath = locale === 'en' ? docsDirectory : path.join(docsDirectory, locale);
  
  // Check if locale directory exists
  if (!fs.existsSync(localePath)) {
    return [];
  }
  
  const files = getAllFiles(localePath, localePath);
  
  return files
    .filter((file) => /\.(md|mdx)$/.test(file))
    .map((file) => {
      // file is already relative to localePath, so join directly
      const filePath = path.join(localePath, file);
      
      // Check if file exists before reading
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return null;
      }
      
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // Remove locale prefix from slug
      const relativePath = path.relative(localePath, filePath);
      const slug = relativePath
        .replace(/\.(md|mdx)$/, '')
        .replace(/\\/g, '/')
        .replace(/\/index$/, ''); // Remove /index from slug
      
      // Extract headings from content
      const headings = extractHeadings(content);
      
      return {
        slug: slug || 'welcome-to-docs',
        filePath: relativePath,
        frontmatter: data as DocFrontmatter,
        content,
        headings,
        fileContents,
      };
    })
    .filter((doc): doc is DocMetadata => doc !== null)
    .sort((a, b) => {
      const orderA = a.frontmatter.sidebar?.order ?? 999;
      const orderB = b.frontmatter.sidebar?.order ?? 999;
      return orderA - orderB;
    });
}

/**
 * Get a single document by slug
 */
export function getDocBySlug(slug: string, locale: string = 'en'): DocMetadata | null {
  const localePath = locale === 'en' ? docsDirectory : path.join(docsDirectory, locale);
  
  // Handle root slug
  if (!slug || slug === 'welcome-to-docs') {
    const rootPaths = [
      path.join(localePath, 'welcome-to-docs.mdx'),
      path.join(localePath, 'welcome-to-docs.md'),
      path.join(localePath, 'index.mdx'),
      path.join(localePath, 'index.md'),
    ];
    
    for (const filePath of rootPaths) {
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        const headings = extractHeadings(content);
        
        return {
          slug: 'welcome-to-docs',
          filePath: path.relative(localePath, filePath),
          frontmatter: data as DocFrontmatter,
          content,
          headings,
          fileContents
        };
      }
    }
  }
  
  const possiblePaths = [
    path.join(localePath, `${slug}.md`),
    path.join(localePath, `${slug}.mdx`),
    path.join(localePath, `${slug}/index.md`),
    path.join(localePath, `${slug}/index.mdx`),
  ];
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const headings = extractHeadings(content);
      
      return {
        slug,
        filePath: path.relative(localePath, filePath),
        frontmatter: data as DocFrontmatter,
        content,
        headings,
        fileContents
      };
    }
  }
  
  return null;
}

/**
 * Get all files recursively from a directory
 * Returns relative paths from the base directory
 */
function getAllFiles(dirPath: string, basePath: string = dirPath, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return [];
  
  const files = fs.readdirSync(dirPath);
  
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, basePath, arrayOfFiles);
    } else {
      // Return path relative to basePath (localePath)
      arrayOfFiles.push(path.relative(basePath, filePath));
    }
  });
  
  return arrayOfFiles;
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    headings.push({ level, text, id });
  }
  
  return headings;
}

/**
 * Generate sidebar structure from docs
 * Organizes by folders with files nested underneath
 */
export function generateSidebar(locale: string = 'en'): SidebarItem[] {
  const docs = getAllDocs(locale);
  const folderMap = new Map<string, SidebarItem>();
  const rootItems: SidebarItem[] = [];
  
  docs.forEach((doc) => {
    const parts = doc.slug.split('/');
    const isRootLevel = parts.length === 1;
    
    if (isRootLevel) {
      // Root level files (like welcome-to-docs)
      rootItems.push({
        label: doc.frontmatter.sidebar?.label || doc.frontmatter.title,
        link: `/docs/${doc.slug}`,
        order: doc.frontmatter.sidebar?.order ?? 999,
      });
    } else {
      // Files in folders
      const folderName = parts[0];
      const fileName = parts.slice(1).join('/');
      
      if (!folderMap.has(folderName)) {
        // Create folder entry
        const folderDocs = docs.filter(d => d.slug.startsWith(folderName + '/'));
        const firstDoc = folderDocs.sort((a, b) => 
          (a.frontmatter.sidebar?.order ?? 999) - (b.frontmatter.sidebar?.order ?? 999)
        )[0];
        
        folderMap.set(folderName, {
          label: folderName.charAt(0).toUpperCase() + folderName.slice(1).replace(/-/g, ' '),
          link: firstDoc ? `/docs/${firstDoc.slug}` : `/docs/${folderName}`,
          children: [],
          order: firstDoc?.frontmatter.sidebar?.order ?? 999,
        });
      }
      
      const folderItem = folderMap.get(folderName)!;
      const fileItem: SidebarItem = {
        label: doc.frontmatter.sidebar?.label || doc.frontmatter.title,
        link: `/docs/${doc.slug}`,
        order: doc.frontmatter.sidebar?.order ?? 999,
      };
      
      folderItem.children = folderItem.children || [];
      folderItem.children.push(fileItem);
    }
  });
  
  // Desired top-level folder order in the sidebar
  const folderOrder = ['guides', 'tools', 'construction', 'advanced'];

  const orderedFolders = Array.from(folderMap.entries())
    .sort(([aName], [bName]) => {
      const aIndex = folderOrder.indexOf(aName);
      const bIndex = folderOrder.indexOf(bName);
      const aWeight = aIndex === -1 ? folderOrder.length + 1 : aIndex;
      const bWeight = bIndex === -1 ? folderOrder.length + 1 : bIndex;

      if (aWeight !== bWeight) return aWeight - bWeight;
      return aName.localeCompare(bName);
    })
    .map(([, item]) => ({
      ...item,
      children: item.children?.sort((a, b) => (a.order || 999) - (b.order || 999)),
    }));

  // Combine root items and folders
  const allItems = [
    ...rootItems.sort((a, b) => (a.order || 999) - (b.order || 999)),
    ...orderedFolders,
  ];
  
  return allItems;
}
