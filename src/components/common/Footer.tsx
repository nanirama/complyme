import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';

/**
 * Footer Component
 * Matches the design from https://smb.comply.me/
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Social media icon mapping
  const getSocialIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('facebook')) {
      return (
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    if (lowerName.includes('twitter')) {
      return (
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      );
    }
    if (lowerName.includes('linkedin')) {
      return (
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return null;
  };

  return (
    <footer
      role="contentinfo"
      className="w-full bg-white border-t border-gray-200"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div className="space-y-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 rounded-md"
              aria-label={`${siteConfig.name} — Go to homepage`}
            >
              <div className="relative flex-shrink-0">
              <Image
              src={`/images/logo.webp`}
              alt={`${siteConfig.name} logo`}
              width={150}
              height={45}
              priority
              fetchPriority="high"
              className="w-[150px] h-[45px] object-contain"
            />
              </div>
            </Link>

            {/* Copyright */}
            {/* <p className="text-sm text-gray-400">
              © {currentYear}, All Rights Reserved.
            </p> */}

            {/* Designed by LOCRON */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-gray-400">Designed by</span>
              <a
                href="https://locron.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 rounded-md"
                aria-label="LOCRON - Visit website"
              >
                <div className="relative h-6 w-6 flex-shrink-0">
                  <Image
                    src="/assets/locron-logo.svg"
                    alt="LOCRON Logo"
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-gray-900">LOCRON</span>
              </a>
            </div>
          </div>
          
          {/* Business Services Column */}
          {siteConfig.footerMenu[0] && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                {siteConfig.footerMenu[0].title}
              </h3>
              <nav aria-label={siteConfig.footerMenu[0].title}>
                <ul className="space-y-2" role="list">
                  {siteConfig.footerMenu[0].items.map((item) => {
                    const isExternal = item.slug.startsWith('http');
                    return (
                      <li key={item.slug}>
                        {isExternal ? (
                          <a
                            href={item.slug}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-inter text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded-md transition-colors duration-150"
                          >
                            {item.name}
                          </a>
                        ) : (
                          <Link
                            href={item.slug}
                            className="text-sm font-inter text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded-md transition-colors duration-150"
                          >
                            {item.name}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          )}

          {/* Additional Info Column */}
          {siteConfig.footerMenu[1] && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                {siteConfig.footerMenu[1].title}
              </h3>
              <nav aria-label={siteConfig.footerMenu[1].title}>
                <ul className="space-y-2" role="list">
                  {siteConfig.footerMenu[1].items.map((item) => {
                    const isExternal = item.slug.startsWith('http');
                    return (
                      <li key={item.slug}>
                        {isExternal ? (
                          <a
                            href={item.slug}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-inter text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded-md transition-colors duration-150"
                          >
                            {item.name}
                          </a>
                        ) : (
                          <Link
                            href={item.slug}
                            className="text-sm font-inter text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded-md transition-colors duration-150"
                          >
                            {item.name}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          )}

          {/* Social Media Column */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Social Media
            </h3>
            <nav aria-label="Social media links">
              <ul className="space-y-2" role="list">
                {siteConfig.social.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-inter text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded-md transition-colors duration-150"
                      aria-label={`${social.name} - Open in new window`}
                    >
                      <span className="text-gray-600">
                        {getSocialIcon(social.name)}
                      </span>
                      <span className="lowercase">{social.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm font-medium text-gray-900">
              {siteConfig.title}
            </p>
            <p className="text-sm text-gray-600 font-inter">
              © {currentYear}, All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
