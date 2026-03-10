import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { getPostBySlug, getAllPosts, getPostsByCategory, getPostImagePath, isLogoFallback } from '@/lib/posts';
import { getAllCategories } from '@/lib/categories';
import { extractHeadings } from '@/lib/toc';
import SocialShare from '@/components/common/SocialShare';
import { generateSeoMetadata } from '@/components/common/Seo';
import { ReactNode } from 'react';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * Render bold text (**text**)
 */
function renderBold(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    // Add the bold text
    parts.push(
      <strong key={key++} className="font-bold">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * Render links [text](url)
 */
function renderLinks(text: string): ReactNode[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  const processed: ReactNode[] = [];

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      processed.push(...renderBold(text.substring(lastIndex, match.index)));
    }
    // Add the link
    processed.push(
      <a
        key={key++}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-600 hover:text-amber-700 underline"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    processed.push(...renderBold(text.substring(lastIndex)));
  }

  return processed.length > 0 ? processed : renderBold(text);
}

/**
 * Render markdown content properly
 */
function renderMarkdown(content: string, headings: Heading[]): ReactNode[] {
  const lines = content.split('\n');
  const elements: ReactNode[] = [];
  let currentList: { type: 'ordered' | 'unordered'; items: string[] } | null = null;
  let currentParagraph: string[] = [];
  let key = 0;

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      const paragraphText = currentParagraph.join(' ').trim();
      if (paragraphText) {
        // Check for iframe
        const iframeMatch = paragraphText.match(/<iframe[^>]*><\/iframe>/);
        if (iframeMatch) {
          const widthMatch = paragraphText.match(/width=["'](\d+)["']/);
          const heightMatch = paragraphText.match(/height=["'](\d+)["']/);
          const width = widthMatch ? parseInt(widthMatch[1]) : 16;
          const height = heightMatch ? parseInt(heightMatch[1]) : 9;
          const aspectRatio = (height / width) * 100;
          const styledIframe = paragraphText
            .replace(/width=["'][^"']*["']/g, '')
            .replace(/height=["'][^"']*["']/g, '')
            .replace(
              /<iframe([^>]*)>/,
              '<iframe$1 style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;">'
            );
          elements.push(
            <div
              key={key++}
              className="my-6"
              style={{
                maxWidth: '100%',
                position: 'relative',
                paddingBottom: `${aspectRatio}%`,
                height: 0,
                overflow: 'hidden'
              }}
              dangerouslySetInnerHTML={{ __html: styledIframe }}
            />
          );
        } else {
          elements.push(
            <p key={key++} className="mb-4 text-gray-700 font-inter text-base leading-relaxed">
              {renderLinks(paragraphText)}
            </p>
          );
        }
      }
      currentParagraph = [];
    }
  }

  function flushList() {
    if (currentList) {
      if (currentList.type === 'ordered') {
        elements.push(
          <ol key={key++} className="mb-4 ml-6 list-decimal list-inside space-y-2">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="text-gray-700 text-base  leading-relaxed">
                {renderLinks(item.trim())}
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={key++} className="mb-4 ml-6 list-disc space-y-3 list-inside">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="text-gray-700 text-base font-inter leading-relaxed">
                {renderLinks(item.trim())}
              </li>
            ))}
          </ul>
        );
      }
      currentList = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line - flush current paragraph or list
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    // Check for headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const heading = headings.find(h => h.text === text);
      const className = 
        level === 1 ? 'text-3xl font-bold mt-8 mb-4 text-gray-900' :
        level === 2 ? 'text-2xl font-bold mt-6 mb-3 text-gray-900' :
        level === 3 ? 'text-xl font-bold mt-4 mb-2 text-gray-900' :
        'text-lg font-bold mt-3 mb-2 text-gray-900';
      
      if (level === 1) {
        elements.push(
          <h1 key={key++} id={heading?.id} className={className}>
            {text}
          </h1>
        );
      } else if (level === 2) {
        elements.push(
          <h2 key={key++} id={heading?.id} className={className}>
            {text}
          </h2>
        );
      } else if (level === 3) {
        elements.push(
          <h3 key={key++} id={heading?.id} className={className}>
            {text}
          </h3>
        );
      } else if (level === 4) {
        elements.push(
          <h4 key={key++} id={heading?.id} className={className}>
            {text}
          </h4>
        );
      } else if (level === 5) {
        elements.push(
          <h5 key={key++} id={heading?.id} className={className}>
            {text}
          </h5>
        );
      } else {
        elements.push(
          <h6 key={key++} id={heading?.id} className={className}>
            {text}
          </h6>
        );
      }
      continue;
    }

    // Check for ordered list (1. item)
    const orderedListMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (orderedListMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ordered') {
        flushList();
        currentList = { type: 'ordered', items: [] };
      }
      currentList.items.push(orderedListMatch[2]);
      continue;
    }

    // Check for unordered list (- item or * item)
    const unorderedListMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (unorderedListMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'unordered') {
        flushList();
        currentList = { type: 'unordered', items: [] };
      }
      currentList.items.push(unorderedListMatch[1]);
      continue;
    }

    // Check for nested list item (indented with spaces)
    const nestedListMatch = trimmed.match(/^(\s+)([-*]|\d+\.)\s+(.+)$/);
    if (nestedListMatch) {
      flushParagraph();
      const indent = nestedListMatch[1].length;
      const content = nestedListMatch[3];
      
      // For nested items, we'll add them to the current list with indentation
      if (currentList) {
        // Add nested item with indentation styling
        const lastItem = currentList.items[currentList.items.length - 1];
        if (lastItem && indent > 0) {
          // This is a nested item, append to last item
          currentList.items[currentList.items.length - 1] = lastItem + (
            currentList.type === 'ordered' 
              ? `\n  - ${content}`
              : `\n  - ${content}`
          );
        } else {
          currentList.items.push(content);
        }
      } else {
        // Start new unordered list for nested items
        currentList = { type: 'unordered', items: [content] };
      }
      continue;
    }

    // Regular paragraph line
    flushList();
    currentParagraph.push(trimmed);
  }

  // Flush any remaining content
  flushParagraph();
  flushList();

  return elements;
}

/**
 * Generate static params for all posts
 */
export async function generateStaticParams() {
  const allPosts = getAllPosts();
  
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata(
  { params }: PostPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = post.title;
  const description = post.excerpt || `${post.title} - ${siteConfig.description}`;
  const image = post.thumbnail ? getPostImagePath(post, post.thumbnail) : undefined;

  return generateSeoMetadata({
    title,
    description,
    keywords: post.keywords || [post.category],
    url: `/posts/${slug}`,
    image,
    type: 'article',
    publishedTime: post.date,
    author: post.author,
    siteName: siteConfig.name,
    siteUrl: siteConfig.siteUrl,
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  console.log('slug', slug);
  console.log('post', post);

  if (!post) {
    notFound();
  }

  // Get category info
  const allCategories = getAllCategories();
  const category = allCategories.find(
    cat => cat.name === post.category || cat.slug === post.category
  );

  // Extract headings for table of contents
  const headings = extractHeadings(post.content);

  // Get other posts from the same category (excluding current post)
  const otherPostsInCategory = category
    ? getPostsByCategory(category.name, category.slug)
        .filter(p => p.slug !== post.slug)
        .slice(0, 6)
    : [];

  // Get all posts for navigation
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex(p => p.slug === post.slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <main id="main-content" className="min-h-screen bg-white">
      <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 cat_content">
          
          {/* Main Content - 8 columns */}
          <div className="lg:col-span-8">
            {/* Post Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-black text-[#2d3748] mb-6">
                {post.title}
              </h1>
              
              {category && (
                <div className="flex items-center gap-2 mb-10">
                  <span className="text-lg text-gray-500">Category:</span>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-lg font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    {category.name}
                  </Link>
                </div>
              )}

              {/* Thumbnail */}
              {post.thumbnail && (() => {
                const imagePath = getPostImagePath(post, post.thumbnail);
                const isLogo = isLogoFallback(imagePath);
                return (
                  <div className="relative w-full h-64 md:h-[600] bg-gray-200 rounded-lg overflow-hidden mb-8">
                    <Image
                      src={imagePath}
                      alt={post.title}
                      fill
                      className={isLogo ? "object-contain rounded-2xl" : "object-cover rounded-2xl"}
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    />
                  </div>
                );
              })()}
            </header>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none">
              <div className="post-content cat_content">
                {renderMarkdown(post.content, headings)}
              </div>
            </div>

            {/* Social Share */}
            <SocialShare
              url={`${siteConfig.siteUrl}/${post.slug}`}
              title={post.title}
              description={post.excerpt}
            />

            {/* Navigation */}
            <nav className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
              {previousPost ? (
                <Link
                  href={`/posts/${previousPost.slug}`}
                  className="group flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors"
                >
                  <span className="text-sm">←</span>
                  <div>
                    <div className="text-sm text-gray-500">Previous</div>
                    <div className="font-bold text-base">{previousPost.title}</div>
                  </div>
                </Link>
              ) : (
                <div></div>
              )}
              
              {nextPost && (
                <Link
                  href={`/posts/${nextPost.slug}`}
                  className="group flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors sm:ml-auto"
                >
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Next</div>
                    <div className="font-bold text-base">{nextPost.title}</div>
                  </div>
                  <span className="text-sm">→</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Sidebar - 4 columns */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8 cat_content ">
              
              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold text-[#718096] mb-4">
                    Table of contents
                  </h2>
                  <nav aria-label="Table of contents">
                    <ol className="space-y-2">
                      {headings.map((heading, index) => (
                        <li key={heading.id}>
                          <a
                            href={`#${heading.id}`}
                            className="
                              flex items-center gap-3
                              text-sm text-gray-700
                              hover:text-amber-600
                              transition-colors duration-150 font-inter
                              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded mb-2
                            "
                            style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
                          >
                            <span className="
                              flex items-center justify-center
                              w-7 h-7 rounded-full
                              bg-indigo-100 text-indigo-600
                              text-xs font-medium
                              flex-shrink-0
                            ">
                              {index + 1}
                            </span>
                            <span className="line-clamp-2">{heading.text}</span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </div>
              )}

              {/* Other Posts in Same Category */}
              {otherPostsInCategory.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold text-[#718096] mb-4">
                    Other Posts in {category?.name || 'This Category'}
                  </h2>
                  <ul className="space-y-3">
                    {otherPostsInCategory.map((otherPost) => (
                      <li key={otherPost.slug}>
                        <Link
                          href={`/posts/${otherPost.slug}`}
                          className="
                            block
                            p-3 rounded-lg
                            bg-gray-50 hover:bg-amber-50
                            border-l-4 border-indigo-200 hover:border-amber-500
                            transition-all duration-150
                            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                          "
                        >
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">
                            {otherPost.title}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
