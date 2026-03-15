import { Metadata } from 'next';

interface SeoProps {
  title: string;
  description: string;
  keywords?: string[];
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

/**
 * SEO Component
 * 
 * This component is for reference/documentation purposes.
 * In Next.js App Router, SEO metadata should be handled via
 * the generateMetadata function or Metadata export.
 * 
 * For client-side SEO tags, use this component.
 */
export default function Seo({
  title: _title,
  description: _description,
  keywords: _keywords = [],
  url: _url,
  image: _image,
  type: _type = 'website',
  publishedTime: _publishedTime,
  modifiedTime: _modifiedTime,
  author: _author,
}: SeoProps) {
  // In Next.js App Router, we use metadata API instead
  // This component is kept for reference and potential client-side use
  return null;
}

/**
 * Helper function to generate SEO metadata object
 * Use this in generateMetadata functions
 */
export function generateSeoMetadata({
  title,
  description,
  keywords = [],
  url,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  siteName,
  siteUrl,
}: SeoProps & { siteName: string; siteUrl: string }): Metadata {
  const fullTitle = `${title} | ${siteName}`;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  
  // Ensure image URL is absolute
  let imageUrl: string | undefined = undefined;
  let isLogoImage = false;
  if (image) {
    if (image.startsWith('http://') || image.startsWith('https://')) {
      // Already absolute URL
      imageUrl = image;
      isLogoImage = image.includes('logo.webp');
    } else {
      // Relative URL - make it absolute
      // Ensure image path starts with /
      const cleanImagePath = image.startsWith('/') ? image : `/${image}`;
      // Ensure siteUrl doesn't end with / to avoid double slashes
      const cleanSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
      imageUrl = `${cleanSiteUrl}${cleanImagePath}`;
      isLogoImage = image.includes('logo.webp');
    }
  }

  // Set dimensions based on image type
  const imageWidth = isLogoImage ? 300 : 1200;
  const imageHeight = isLogoImage ? 90 : 630;
  const imageType = isLogoImage ? 'image/webp' : 'image/jpeg';

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      type,
      locale: 'ka_GE',
      siteName,
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            alt: title,
            width: imageWidth,
            height: imageHeight,
            type: imageType,
          },
        ],
      }),
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
      }),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: fullTitle,
      description,
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            alt: title,
          },
        ],
      }),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
