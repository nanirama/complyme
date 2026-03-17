// components/docs/Steps.tsx
import { Children, ReactNode } from "react";

// ─── Single step item ─────────────────────────────────────────────────────────

interface StepProps {
  children: ReactNode;
}

export function Step({ children }: StepProps) {
  // Rendering is handled by Steps parent — this is a data carrier only.
  // The Steps wrapper reads children and injects the number badge.
  return <>{children}</>;
}

// ─── Steps wrapper ────────────────────────────────────────────────────────────

interface StepsProps {
  children: ReactNode;
}

export function Steps({ children }: StepsProps) {
  const items = Children.toArray(children);

  return (
    <ol className="flex flex-col">
      {items.map((child, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={index} className="flex gap-5">
            {/* Left: number badge + vertical connector line */}
            <div className="flex flex-col items-center">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-600">
                {index + 1}
              </span>
              {!isLast && (
                <div className="mt-1 w-px flex-1 bg-gray-200" />
              )}
            </div>

            {/* Right: content from <Step> child */}
            <div className={`pt-1 text-sm leading-relaxed text-gray-600 ${isLast ? "pb-0" : "pb-8"}`}>
              {child}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
