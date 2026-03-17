// components/docs/ToolCard.tsx
import Link from "next/link";
import { ReactNode } from "react";

interface ToolCardProps {
  title: string;
  icon: ReactNode;
  iconBg?: string;   // Tailwind bg class e.g. "bg-amber-100"
  href: string;
  children: ReactNode;
}

export function ToolCard({
  title,
  icon,
  iconBg = "bg-amber-100",
  href,
  children,
}: ToolCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#c2c2c2]/200 bg-white p-8">
      {/* Icon + Title row */}
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${iconBg}`}
        >
          {icon}
        </span>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-gray-500">{children}</p>

      {/* Learn More button */}
      <Link
        href={href}
        className="
          flex items-center justify-between rounded-xl border border-gray-500
          bg-white px-4 py-3 text-sm font-semibold text-gray-800
          transition hover:bg-gray-100 hover:border-gray-300
        "
      >
        <span>Learn More</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
</svg>
      </Link>
    </div>
  );
}

// ─── Card Grid wrapper ────────────────────────────────────────────────────────

interface ToolCardGridProps {
  children: ReactNode;
}

export function ToolCardGrid({ children }: ToolCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {children}
    </div>
  );
}
