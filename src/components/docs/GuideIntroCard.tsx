// components/docs/GuideIntroCard.tsx
import { ReactNode } from "react";

interface GuideIntroCardProps {
  title: string;
  icon?: string; // emoji or small icon character
  children: ReactNode; // typically a LinkCardStack or LinkCards
}

/**
 * GuideIntroCard
 *
 * Large hero-style card used at the top of docs pages to highlight
 * a primary guide with one or more actions (LinkCards).
 *
 * Example:
 * <GuideIntroCard title="Maintaining Your ScrewFast Tools" icon="✅">
 *   <LinkCardStack>
 *     <LinkCard ... />
 *     <LinkCard ... />
 *   </LinkCardStack>
 * </GuideIntroCard>
 */
export function GuideIntroCard({ title, icon = "✅", children }: GuideIntroCardProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
      <header className="mb-4 flex items-center gap-3">
        <span
          className="
            inline-flex h-10 w-10 items-center justify-center
            rounded-xl bg-amber-100 text-amber-600 text-xl
          "
          aria-hidden="true"
        >
          {icon}
        </span>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </header>

      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

