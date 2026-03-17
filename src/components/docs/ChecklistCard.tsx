// components/docs/ChecklistCard.tsx
import { ReactNode } from "react";

// ─── Single item ──────────────────────────────────────────────────────────────

interface ChecklistItemProps {
  children: ReactNode;
}

export function ChecklistItem({ children }: ChecklistItemProps) {
  return (
    <li className="flex items-start gap-3 text-base leading-relaxed text-gray-600">
      {/* Orange dash bullet — exact match to screenshot */}
      <span className="mt-0.5 shrink-0 font-bold text-amber-500">—</span>
      {children}
    </li>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

interface ChecklistCardProps {
  title: string;
  icon: string;
  children: ReactNode;
}

export function ChecklistCard({ title, children, icon  }: ChecklistCardProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6">
      <header className="mb-4 flex items-center gap-3">
        {icon && (
          <span
          className="
            inline-flex h-10 w-10 items-center justify-center
            rounded-xl bg-amber-100 text-amber-600 text-xl
          "
          aria-hidden="true"
        >
          {icon}
        </span>
        )}
        
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </header>
      
      <ul className="flex flex-col gap-4">{children}</ul>
    </div>
  );
}

// ─── Grid wrapper ─────────────────────────────────────────────────────────────

interface ChecklistCardGridProps {
  children: ReactNode;
}

export function ChecklistCardGrid({ children }: ChecklistCardGridProps) {
  return (
    <div className="flex flex-col gap-4 my-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}
