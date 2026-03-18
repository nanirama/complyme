'use client';

import { useRef, useState, useMemo, useCallback, KeyboardEvent } from 'react';
import Link from 'next/link';

interface SearchIndexItem {
  slug: string;
  title: string;
  description?: string;
}

interface SearchProps {
  locale?: string;
}

export function Search({ locale = 'en' }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<SearchIndexItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const didLoadRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  
  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase().trim();
    return items
      .filter((result) =>
        result.title.toLowerCase().includes(q) ||
        result.description?.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [items, query]);

  const ensureIndexLoaded = useCallback(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setLoadError(null);

    fetch(`/api/docs/search-index?locale=${encodeURIComponent(locale)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load search index (${res.status})`);
        const data = (await res.json()) as { items: SearchIndexItem[] };
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load search index');
        setItems([]);
        didLoadRef.current = false;
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
  }, [locale]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  }, []);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
    ensureIndexLoaded();
  }, [ensureIndexLoaded]);

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
        onFocus={handleFocus}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onKeyDown={handleKeyDown}
        className="w-64 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        aria-label="Search documentation"
        aria-controls="search-results"
      />
      {isOpen && (isLoading || loadError || results.length > 0) && (
        <div 
          id="search-results"
          className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
          role="listbox"
          aria-label="Search results"
        >
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-600">
              Loading…
            </div>
          )}
          {!isLoading && loadError && (
            <div className="px-4 py-3 text-sm text-red-600">
              {loadError}
            </div>
          )}
          {!isLoading && !loadError && results.map((result) => (
            <Link
              key={result.slug}
              href={`/docs/${result.slug}`}
              className="block px-4 py-2 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              role="option"
              onClick={() => setIsOpen(false)}
            >
              <div className="font-medium">{result.title}</div>
              {result.description && (
                <div className="text-sm text-gray-600">
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

export default Search;
