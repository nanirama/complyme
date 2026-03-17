// components/DocCard.tsx
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DocCardProps {
  icon: string;          // emoji or any string icon
  iconBg: string;        // tailwind bg class e.g. "bg-amber-100"
  iconColor?: string;    // optional tailwind text color for the icon wrapper border/ring
  title: string;
  description: string;
  href: string;
}

// ─── Single Card ─────────────────────────────────────────────────────────────

export function DocCard({ icon, iconBg, title, description, href }: DocCardProps) {
  return (
    <Link
      href={href}
      className="
        group flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white
        p-6 shadow-sm transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
      "
    >
      {/* Icon badge */}
      <span
        className={`
          inline-flex h-10 w-10 items-center justify-center
          rounded-xl text-xl ${iconBg}
        `}
      >
        {icon}
      </span>

      {/* Text content */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-500">{description}</p>
      </div>
    </Link>
  );
}

// ─── Card Grid ────────────────────────────────────────────────────────────────

const CARDS: DocCardProps[] = [
  {
    icon: "📄",
    iconBg: "bg-amber-100",
    title: "Quick Start Guides",
    description:
      "Get up and running swiftly with our straightforward and concise guides, tailored for new users and seasoned experts alike.",
    href: "/docs/guides/getting-started/",
  },
  {
    icon: "⚙️",
    iconBg: "bg-purple-100",
    title: "Tools & Equipment",
    description:
      "Discover the complete lineup of superior quality tools and equipment. Each subsection offers detailed specifications, usage instructions, and maintenance tips.",
    href: "/docs/tools/tool-guides/",
  },
  {
    icon: "🔧",
    iconBg: "bg-green-100",
    title: "Construction Services",
    description:
      "Discover the complete lineup of superior quality tools and equipment. Each subsection offers detailed specifications, usage instructions, and maintenance tips.",
    href: "/docs/construction/service-overview/",
  },
  {
    icon: "🚀",
    iconBg: "bg-pink-100",
    title: "Advanced Topics",
    description:
      "Discover the complete lineup of superior quality tools and equipment. Each subsection offers detailed specifications, usage instructions, and maintenance tips.",
    href: "/docs/advanced/technical-specifications/",
  },
];

export function DocCardGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {CARDS.map((card) => (
        <DocCard key={card.href} {...card} />
      ))}
    </div>
  );
}
