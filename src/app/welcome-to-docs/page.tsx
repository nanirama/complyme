// app/docs/page.tsx  (or pages/docs/index.tsx for Pages Router)
import Link from "next/link";
import { DocCardGrid } from "@/components/docs/DocCard";

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#fdf9ec] px-6 py-16 sm:px-12">
      <div className="mx-auto max-w-4xl">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Documentation Hub
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-500">
            Your central hub for streamlined tool guidance, detailed service
            docs, and project support.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/docs/guides/getting-started"
              className="
                inline-flex items-center gap-2 rounded-full bg-orange-500
                px-6 py-2.5 text-sm font-semibold text-white shadow
                transition hover:bg-orange-600 active:scale-95
              "
            >
              Get started →
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 text-sm font-medium text-gray-700
                underline-offset-2 hover:underline
              "
            >
              View on GitHub ↗
            </Link>
          </div>
        </section>

        {/* ── Cards ────────────────────────────────────────────────── */}
        <DocCardGrid />

      </div>
    </main>
  );
}
