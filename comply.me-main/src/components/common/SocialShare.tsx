'use client';

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';

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

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Share:
        </span>
        <div className="flex items-center gap-3">
          <FacebookShareButton
            url={url}
            hashtag="#mzege"
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full transition-transform hover:scale-110"
          >
            <FacebookIcon
              size={40}
              round
              className="transition-opacity hover:opacity-80"
            />
          </FacebookShareButton>

          <TwitterShareButton
            url={url}
            title={shareTitle}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 rounded-full transition-transform hover:scale-110"
          >
            <TwitterIcon
              size={40}
              round
              className="transition-opacity hover:opacity-80"
            />
          </TwitterShareButton>

          <LinkedinShareButton
            url={url}
            title={shareTitle}
            summary={shareDescription}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 rounded-full transition-transform hover:scale-110"
          >
            <LinkedinIcon
              size={40}
              round
              className="transition-opacity hover:opacity-80"
            />
          </LinkedinShareButton>
        </div>
      </div>
    </div>
  );
}
