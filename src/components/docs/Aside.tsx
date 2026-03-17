// components/docs/Aside.tsx
import { ReactNode } from "react";

type AsideType = "tip" | "note" | "caution" | "danger";

interface AsideProps {
  type?: AsideType;
  children: ReactNode;
}

const ASIDE_CONFIG: Record<
  AsideType,
  { label: string; icon: string; gradient: string; textColor: string }
> = {
  tip: {
    label: "Tip",
    icon: "✈️",
    gradient: "bg-gradient-to-r from-orange-400 to-amber-400",
    textColor: "text-white",
  },
  note: {
    label: "Note",
    icon: "📝",
    gradient: "bg-gradient-to-r from-blue-400 to-cyan-400",
    textColor: "text-white",
  },
  caution: {
    label: "Caution",
    icon: "⚠️",
    gradient: "bg-gradient-to-r from-yellow-400 to-amber-300",
    textColor: "text-gray-900",
  },
  danger: {
    label: "Danger",
    icon: "🚨",
    gradient: "bg-gradient-to-r from-red-500 to-rose-400",
    textColor: "text-white",
  },
};

export function Aside({ type = "tip", children }: AsideProps) {
  const config = ASIDE_CONFIG[type];

  return (
    <div className={`rounded-2xl px-6 py-5 ${config.gradient}`}>
      {/* Label row */}
      <div className={`mb-2 flex items-center gap-2 font-semibold ${config.textColor}`}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </div>
      {/* Body */}
      <div className={`text-sm leading-relaxed ${config.textColor} opacity-95`}>
        {children}
      </div>
    </div>
  );
}
