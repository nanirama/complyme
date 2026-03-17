import { notFound, redirect } from 'next/navigation';
import { getDocBySlug, getAllDocs } from '@/lib/docs';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { generateSeoMetadata } from '@/components/common/Seo';
import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';
import { docComponents } from "@/components/docs/MDXComponents";
import { MDXRemote } from "next-mdx-remote/rsc";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const docs = getAllDocs('en');
  
  const params = docs.map((doc) => {
    if (doc.slug === 'welcome-to-docs') {
      return { slug: [] };
    }
    return { slug: doc.slug.split('/') };
  });
  
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugString = slug && slug.length > 0 ? slug.join('/') : 'welcome-to-docs';
  const doc = getDocBySlug(slugString, 'en');
  
  if (!doc) {
    return {};
  }
  
  return generateSeoMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description || 'Documentation page',
    keywords: [doc.frontmatter.title, 'documentation', 'guide'],
    url: `/docs/${slugString}`,
    type: 'article',
    siteName: siteConfig.name,
    siteUrl: siteConfig.siteUrl,
  });
}

// Force dynamic rendering for docs pages
export const dynamic = 'force-dynamic';

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Handle root /docs route - redirect to welcome page
  if (!slug || slug.length === 0) {
    redirect('/docs/welcome-to-docs');
  }
  
  const slugString = slug.join('/');
  
  // First try to get the doc directly
  const doc = getDocBySlug(slugString, 'en');
  
  // If not found, check if this is a folder route (e.g., /docs/guides/)
  // If so, find the first file in that folder and redirect to it
  if (!doc) {
    const allDocs = getAllDocs('en');
    const folderDocs = allDocs.filter(d => {
      const docParts = d.slug.split('/');
      // Check if slug matches a folder (e.g., "guides" matches "guides/getting-started")
      return docParts.length > 1 && docParts[0] === slugString;
    });
    
    if (folderDocs.length > 0) {
      // This is a folder route, redirect to first file
      const firstDoc = folderDocs.sort((a, b) => 
        (a.frontmatter.sidebar?.order ?? 999) - (b.frontmatter.sidebar?.order ?? 999)
      )[0];
      redirect(`/docs/${firstDoc.slug}`);
    }
  }
  
  // If still no doc found, show 404
  if (!doc) {
    notFound();
  }
  
  return (
    <DocsLayout doc={doc} locale="en">
      <MDXRemote source={doc.content} components={docComponents} />
    </DocsLayout>
  );
}
