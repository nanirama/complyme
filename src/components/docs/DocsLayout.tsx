import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TableOfContents } from './TableOfContents';
import { DocMetadata } from '@/lib/types';
import { generateSidebar } from '@/lib/docs';

interface DocsLayoutProps {
  doc: DocMetadata;
  locale: string;
  children: ReactNode;
}

export async function DocsLayout({ doc, locale, children }: DocsLayoutProps) {
  const sidebar = generateSidebar(locale);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      {/* Header */}
      {/* <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16" aria-label="Documentation header">
            <div className="flex items-center gap-4">
              <Link 
                href="/docs" 
                className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
              >
                Docs
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Search />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header> */}

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Layout: stack on mobile, 3-column on desktop */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Sidebar */}
          <aside
            className="hidden lg:block w-64 flex-shrink-0 pt-6"
            aria-label="Documentation navigation"
          >
            <Sidebar items={sidebar} currentPath={`/docs/${doc.slug}`} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 pt-6 pb-10 lg:pt-8 lg:pb-16">
            <article 
              className="w-full max-w-3xl mx-auto" 
              itemScope 
              itemType="https://schema.org/Article"
            >
              <header>
                <h1 
                  id={doc.slug}
                  className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100"
                  itemProp="headline"
                >
                  {doc.frontmatter.title}
                </h1>
                {doc.frontmatter.description && (
                  <p 
                    className="text-base text-gray-600 dark:text-gray-400 mb-8"
                    itemProp="description"
                  >
                    {doc.frontmatter.description}
                  </p>
                )}
              </header>
              <div
                className="prose prose-base sm:prose-lg dark:prose-invert max-w-none"
                itemProp="articleBody"
              >
                {children}
              </div>
            </article>
          </main>

          {/* Desktop TOC on the right */}
          <aside
            className="hidden xl:block w-64 flex-shrink-0 pt-8"
            aria-label="Table of contents"
          >
            <TableOfContents
              headings={doc.headings}
              title={doc.frontmatter.description}
              fallbackId={doc.slug}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
