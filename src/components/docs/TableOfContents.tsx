'use client';

import Link from 'next/link';
import { Heading } from '@/lib/types';
import { useEffect, useState, useCallback } from 'react';

interface TableOfContentsProps {
  headings: Heading[];
  title?: string;
  fallbackId?: string; // id to use when no H2 headings exist (e.g. doc slug / h1)
}

export function TableOfContents({ headings, title, fallbackId }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const hasAnyHeadings = headings.length > 0;

  useEffect(() => {
    if (!hasAnyHeadings) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings, hasAnyHeadings]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without triggering scroll
      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  }, []);

  // If no headings and no fallback target, nothing to render
  if (!hasAnyHeadings && !fallbackId) return null;

  const navTitle = 'On this page';

  const itemsToRender =
    hasAnyHeadings
      ? headings
      : fallbackId
      ? [{ id: fallbackId, text: 'Overview', level: 1 } as Heading]
      : [];

  return (
    <nav 
      className="sticky top-20"
      aria-label="Table of contents"
    >
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {navTitle}
      </h2>
      <ul className="space-y-2" role="list">
        {itemsToRender.map((heading) => {
            console.log('heading', heading);
            return(
          <li key={heading.id}>
            <Link
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                heading.level === 1
                  ? 'font-medium ml-8'
                  : heading.level === 2
                  ? 'ml-8'
                  : 'ml-8'
              } ${
                activeId === heading.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              aria-current={activeId === heading.id ? 'location' : undefined}
            >
              {heading.text}
            </Link>
          </li>
        )})}
      </ul>
    </nav>
  );
}
