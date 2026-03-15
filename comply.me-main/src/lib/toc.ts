export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Generate a slug from text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Extract headings from markdown content for table of contents
 */
export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}

/**
 * Process markdown content and add IDs to headings
 */
export function processMarkdownContent(content: string, headings: TocItem[]): string {
  let processed = content;
  
  headings.forEach((heading) => {
    const regex = new RegExp(`^(#{${heading.level}})\\s+${heading.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'gm');
    processed = processed.replace(regex, `$1 <span id="${heading.id}"></span>${heading.text}`);
  });

  return processed;
}
