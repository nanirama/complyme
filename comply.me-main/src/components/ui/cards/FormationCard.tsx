import Link from 'next/link';
import { ReactNode } from 'react';

interface FormationCardProps {
  title: string;
  icon: ReactNode;
  href: string;
}

/**
 * FormationCard Component
 * 
 * Optimized for:
 * - Core Web Vitals (LCP, CLS, FID, INP)
 * - W3C Validation
 * - WCAG 2.1 AA Accessibility
 * - Technical SEO
 * - Fully Responsive Design
 */
export default function FormationCard({ title, icon, href }: FormationCardProps) {
  return (
    <li className="w-full">
      <Link
        href={href}
        className="
          group flex items-center gap-4
          w-full p-6
          bg-white rounded-lg
          border border-gray-200
          transition-all duration-200 ease-in-out
          hover:shadow-lg hover:border-amber-300 hover:-translate-y-1
          focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
        "
        aria-label={`${title} - Learn more`}
      >
        {/* Icon */}
        <div 
          className="
            flex-shrink-0
            w-12 h-12
            text-gray-400
            transition-colors duration-200
            group-hover:text-amber-600
          "
          aria-hidden="true"
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="
          flex-1
          text-lg font-bold text-gray-900
          transition-colors duration-200
          group-hover:text-amber-600
        ">
          {title}
        </h3>
      </Link>
    </li>
  );
}
