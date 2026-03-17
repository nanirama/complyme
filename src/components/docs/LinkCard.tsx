// components/docs/LinkCard.tsx
import Link from "next/link";

interface LinkCardProps {
  title: string;
  description?: string;
  href: string;
}

export function LinkCard({ title, description, href }: LinkCardProps) {
  return (
    <Link
      href={href}
      className="
        group flex items-center justify-between gap-4
        rounded-2xl border border-gray-200 bg-white px-5 py-4
        transition-all duration-150 hover:border-gray-300 hover:shadow-sm
      "
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
          {title}
        </span>
        {description && (
          <span className="text-base text-gray-500">{description}</span>
        )}
      </div>
      <span className="shrink-0 text-gray-600 transition-transform group-hover:translate-x-0.5">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
</svg>
      </span>
    </Link>
  );
}

// ─── Stack wrapper for multiple LinkCards ────────────────────────────────────

interface LinkCardStackProps {
  children: React.ReactNode;
}

export function LinkCardStack({ children }: LinkCardStackProps) {
  return <div className="flex flex-col gap-3">{children}</div>;
}
