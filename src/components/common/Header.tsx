import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

// ─── Component ────────────────────────────────────────────────────────────────
export default function Header() {
  const menuItems = siteConfig.headerMenu;

  return (
    <header
      role="banner"
      className="w-full bg-white border-b border-gray-200"
    >
      <div className="mx-auto max-w-7xl px-4 ">
        <div className="flex  py-8 items-center justify-between">
          {/* ── Logo ───────────────────────────────────────────────────── */}
          <Link
            href="/"
            aria-label={`${siteConfig.name} — Go to homepage`}
            className="flex shrink-0 items-center outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
          >
            <Image
              src="/images/logo.webp"
              alt={`${siteConfig.name} logo`}
              width={150}
              height={45}
              priority
              fetchPriority="high"
              className="w-[150px] h-[45px] object-contain"
            />
          </Link>

          {/* ── Navigation ───────────────────────────────────────────────────── */}
          <nav
            aria-label="Main navigation"
            className="flex items-center"
          >
            <ul
              role="list"
              className="flex items-center gap-6"
            >
              {menuItems.map((item) => {
                const isExternal = item.slug.startsWith('http');

                return (
                   <li key={item.slug}>
                    {isExternal ? (
                      <a
                        href={item.slug}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold text-[#718096] hover:text-[#667eea] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.slug}
                        className="text-base font-bold text-[#718096] hover:text-[#667eea] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
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
      </div>
    </header>
  );
}