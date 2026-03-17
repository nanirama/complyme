// ─── How to wire MDX + custom components in Next.js ──────────────────────────
//
// 1. Install dependencies:
//    npm install next-mdx-remote
//
// 2. Place all components in:
//    /components/docs/ToolCard.tsx
//    /components/docs/Steps.tsx
//    /components/docs/Aside.tsx
//    /components/docs/LinkCard.tsx
//
// 3. Create the MDX provider map (this file):
//    /components/docs/MDXComponents.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { ToolCard, ToolCardGrid } from "./ToolCard";
import { Card } from "./Card";
import { CardGrid } from "./CardGrid";
import { ChecklistCard, ChecklistCardGrid, ChecklistItem } from "./ChecklistCard";
import { Steps, Step } from "./Steps";
import { Aside } from "./Aside";
import { LinkCard, LinkCardStack } from "./LinkCard";
import { LinkCardGridItem, LinkCardGrid } from "./LinkCardGrid";
import { Tabs, TabItem } from "./Tabs";
import { GuideIntroCard } from "./GuideIntroCard";
import { MDXComponents } from "mdx/types";
import { ReactNode } from "react";

// Map component names used inside .mdx files → React components
const slugify = (children: ReactNode): string =>
  String(children)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

export const docComponents: MDXComponents = {
  // ── Doc-specific components ──────────────────────────────────────
  ToolCard,             // icon + title + description + Learn More btn
  ToolCardGrid,         // 2-col grid wrapper for ToolCards

  Card,                 // generic content card
  CardGrid,             // responsive grid wrapper for Card

  ChecklistCard,        // card wrapper with title
  ChecklistItem,        // individual bullet item — use as child of ChecklistCard (no link button)
  ChecklistCardGrid,    // up to 3-col grid wrapper for ChecklistCards

  Steps,                // numbered steps wrapper
  Step,                 // individual step — use as child of Steps
  Aside,                // tip / note / caution / danger banner
  GuideIntroCard,       // hero-style intro card with icon + title + actions

  LinkCard,             // full-width row: title + description + arrow
  LinkCardStack,        // vertical stack wrapper for LinkCards

  LinkCardGridItem,     // grid variant of LinkCard
  LinkCardGrid,         // 2-3 col responsive grid for LinkCardGridItems

  Tabs,                 // tabbed content wrapper
  TabItem,              // individual tab — use as child of Tabs

  // Override default HTML elements for consistent styling
  // Ensure ids match toc/extractHeadings slug logic
  h1: ({ children, id, ...props }) => {
    const headingId = id || slugify(children);
    return (
      <h1
        id={headingId}
        className="text-4xl font-black tracking-tight text-gray-900 pb-4 border-b border-gray-200 mb-6"
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2: ({ children, id, ...props }) => {
    const headingId = id || slugify(children);
    return (
      <h2
        id={headingId}
        className="mt-10 mb-4 text-2xl font-bold text-gray-900"
        {...props}
      >
        {children}
      </h2>
    );
  },
  p: ({ children }) => (
    <p className="mb-4 text-base leading-relaxed text-gray-600">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="space-y-2 pt-0 py-4 text-base leading-relaxed text-gray-600 ">
      {children}
    </ul>
  ),
  li: ({ children }) => (
    <li className="text-base leading-relaxed"><span className="text-organge-500">•</span> {children}</li>
  ),
};


// ─── Example: app/docs/[slug]/page.tsx ───────────────────────────────────────
//
// import { MDXRemote } from "next-mdx-remote/rsc";
// import { docComponents } from "@/components/docs/MDXComponents";
// import fs from "fs";
// import path from "path";
//
// export default async function DocPage({ params }: { params: { slug: string } }) {
//   const filePath = path.join(process.cwd(), "content/docs", `${params.slug}.mdx`);
//   const source = fs.readFileSync(filePath, "utf8");
//
//   return (
//     <main className="mx-auto max-w-3xl px-6 py-12">
//       <MDXRemote source={source} components={docComponents} />
//     </main>
//   );
// }
