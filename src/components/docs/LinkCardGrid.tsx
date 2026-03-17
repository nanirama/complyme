// components/docs/LinkCardGrid.tsx
// Use this when you want LinkCards in a responsive grid (vs LinkCardStack which is vertical)
import Link from "next/link";
import { ReactNode } from "react";

interface LinkCardGridItemProps {
  title: string;
  description?: string;
  href: string;
}

export function LinkCardGridItem({ title, description, href }: LinkCardGridItemProps) {
  return (
    <Link
      href={href}
      className="
        group flex flex-col justify-between gap-3
        rounded-2xl border border-gray-200 bg-white px-5 py-4
        transition-all duration-150 hover:border-gray-300 hover:shadow-sm
      "
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
        <span className="text-base font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
          {title}
        </span>
        <span className="shrink-0 text-gray-600 transition-transform group-hover:translate-x-0.5">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
</svg>
      </span>
        </div>
        {description && (
          <span className="text-base leading-relaxed text-gray-500">{description}</span>
        )}
         
      </div>
     
    </Link>
  );
}

interface LinkCardGridProps {
  children: ReactNode;
}

export function LinkCardGrid({ children }: LinkCardGridProps) {
  return (
    <section className="flex flex-col gap-4 my-6">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {children}
    </div>
    </section>
  );
}
