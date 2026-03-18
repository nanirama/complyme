interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

/**
 * SocialShare Component
 * 
 * Displays social media share buttons
 * Optimized for accessibility and SEO
 */
export default function SocialShare({ url, title, description }: SocialShareProps) {
  const shareTitle = title;
  const shareDescription = description || title;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedSummary = encodeURIComponent(shareDescription);

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Share:
        </span>
        <div className="flex items-center gap-3">
          <a
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-110"
            aria-label="Share on Facebook (opens in a new tab)"
            title="Share on Facebook"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.27 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.92 3.77-3.92 1.09 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.77l-.44 2.91h-2.33V22C18.34 21.27 22 17.08 22 12.06z" />
            </svg>
          </a>

          <a
            href={twitterHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-transform hover:scale-110"
            aria-label="Share on X (opens in a new tab)"
            title="Share on X"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.5l-5.1-6.7L5.9 22H2.7l7.3-8.4L.7 2h6.7l4.6 6.1L18.9 2zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20z" />
            </svg>
          </a>

          <a
            href={linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-transform hover:scale-110"
            aria-label="Share on LinkedIn (opens in a new tab)"
            title="Share on LinkedIn"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
