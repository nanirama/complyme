'use client';

import { useState, useMemo, useCallback, KeyboardEvent } from 'react';
import Link from 'next/link';

interface SearchResult {
  slug: string;
  title: string;
  description?: string;
}

// Mock search results - in production, use a proper search service
const mockResults: SearchResult[] = [];

export function Search() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    // Implement search logic here
    return mockResults.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  }, []);

  return (
    <div className="relative">
      <label htmlFor="docs-search" className="sr-only">
        Search documentation
      </label>
      <input
        id="docs-search"
        type="search"
        placeholder="Search docs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onKeyDown={handleKeyDown}
        className="w-64 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        aria-label="Search documentation"
        aria-expanded={isOpen && results.length > 0}
        aria-controls="search-results"
      />
      {isOpen && results.length > 0 && (
        <div 
          id="search-results"
          className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
          role="listbox"
          aria-label="Search results"
        >
          {results.map((result) => (
            <Link
              key={result.slug}
              href={`/docs/${result.slug}`}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              role="option"
            >
              <div className="font-medium">{result.title}</div>
              {result.description && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {result.description}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
