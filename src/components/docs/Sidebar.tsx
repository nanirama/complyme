'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarItem } from '@/lib/types';

interface SidebarProps {
  items: SidebarItem[];
  currentPath: string;
}

function FolderItem({ item, isActive, isFolderActive }: { item: SidebarItem; isActive: (link: string) => boolean; isFolderActive: boolean }) {
  const hasChildren = item.children && item.children.length > 0;
  
  if (!hasChildren) {
    return (
      <Link
        href={item.link}
        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
          isActive(item.link)
            ? 'bg-blue-100 text-blue-900'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-current={isActive(item.link) ? 'page' : undefined}
      >
        {item.label}
      </Link>
    );
  }
  
  return (
    <>
      <button
        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
          isFolderActive
            ? 'text-gray-700 hover:bg-gray-100'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-expanded={true}
        aria-controls={`folder-${item.link.replace(/\//g, '-')}`}
      >
        <span>{item.label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
</svg>
      </button>
      {(
        <ul 
          id={`folder-${item.link.replace(/\//g, '-')}`}
          className="ml-4 mt-1 space-y-1 pl-1"
          role="list"
        >
          {item.children!.map((child) => (
            <li key={child.link}>
              <Link
                href={child.link}
                className={`block px-3 py-1 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  isActive(child.link)
                    ? 'bg-orange-500 text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-current={isActive(child.link) ? 'page' : undefined}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function Sidebar({ items, currentPath }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (link: string) => pathname === link || pathname?.startsWith(link + '/');
  const isFolderActive = (item: SidebarItem) => {
    if (isActive(item.link)) return true;
    return item.children?.some(child => isActive(child.link)) ?? false;
  };
  
  return (
    <nav 
      className="sticky top-20 space-y-1"
      aria-label="Documentation navigation"
    >
      {items.map((item, index) => (
        <div key={`${item.link}-${index}`} className="mb-2">
          <FolderItem 
            item={item} 
            isActive={isActive}
            isFolderActive={isFolderActive(item)}
          />
        </div>
      ))}
    </nav>
  );
}
