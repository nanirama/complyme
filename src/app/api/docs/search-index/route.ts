import { NextResponse } from 'next/server';
import { getAllDocs } from '@/lib/docs';

export const dynamic = 'force-dynamic';

type SearchIndexItem = {
  slug: string;
  title: string;
  description?: string;
};

// Simple per-process cache to avoid re-reading files on every request.
let cached: { locale: string; items: SearchIndexItem[] } | null = null;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';

  if (cached && cached.locale === locale) {
    return NextResponse.json({ items: cached.items });
  }

  const docs = getAllDocs(locale);
  const items = docs.map((doc) => ({
    slug: doc.slug,
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  }));

  cached = { locale, items };
  return NextResponse.json({ items });
}

