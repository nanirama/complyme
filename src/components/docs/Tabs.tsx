// components/docs/Tabs.tsx
// Uses: npm install react-tabs
// Styles: import "react-tabs/style/react-tabs.css" is NOT used — fully custom Tailwind styling

"use client";

import { useState, ReactNode } from "react";

// ─── Single Tab panel ─────────────────────────────────────────────────────────

interface TabItemProps {
  label: string;
  children: ReactNode;
}

// TabItem is a data-carrier only — Tabs parent reads its props
export function TabItem({ children }: TabItemProps) {
  return <>{children}</>;
}

// ─── Tabs wrapper ─────────────────────────────────────────────────────────────

interface TabsProps {
  children: ReactNode;
}

export function Tabs({ children }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Extract all <TabItem> children and their labels
  const items = (
    Array.isArray(children) ? children : [children]
  ).filter(Boolean) as React.ReactElement<TabItemProps>[];

  const activeContent = items[activeIndex]?.props?.children;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Tab bar */}
      <div className="flex justify-between gap-0 border-b border-gray-300">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                relative px-4 py-2 text-sm font-medium transition-colors
                focus-visible:outline-none
                ${
                  isActive
                    ? " border-b border-red-700 text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500"
                    : " border-b border-gray-300 text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {item.props.label}
            </button>
          );
        })}
      </div>

      {/* Active panel content */}
      <div className="w-full pt-5 my-4 text-sm leading-relaxed text-gray-800">
        {activeContent}
      </div>
    </div>
  );
}
