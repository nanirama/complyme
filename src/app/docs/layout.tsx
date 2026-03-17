import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: 'Documentation',
    template: '%s | Documentation',
  },
  description: 'Comprehensive documentation and guides',
  openGraph: {
    title: 'Documentation',
    description: 'Comprehensive documentation and guides',
    url: `${siteConfig.siteUrl}/docs`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation',
    description: 'Comprehensive documentation and guides',
  },
  alternates: {
    canonical: `${siteConfig.siteUrl}/docs`,
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
