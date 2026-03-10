"use client";

import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: 1,
    title: "Multi-country payroll management",
    description: "Payroll Taxes and financial expertise",
  },
  {
    id: 2,
    title: "Guided Global HR Compliance",
    description: "Get control on your mandatory country specific requirements",
  },
  {
    id: 3,
    title: "Global PEO & EOR services",
    description: "Hire and expand across the globe legally",
  },
];

const STEPS = [
  {
    id: 1,
    label: "START WITH\n\"ZIP CODE\"",
    color: "#E8453C",
    borderColor: "border-[#E8453C]",
    bgColor: "bg-[#E8453C]",
    lightBg: "bg-[#fdf2f2]",
  },
  {
    id: 2,
    label: "ADJUST\nFILTERS AS\nYOU NEED",
    color: "#F59E0B",
    borderColor: "border-[#F59E0B]",
    bgColor: "bg-[#F59E0B]",
    lightBg: "bg-[#fffbf0]",
  },
  {
    id: 3,
    label: "FIND TAILORED\nLEGAL\nREQUIREMENTS",
    color: "#38BDF8",
    borderColor: "border-[#38BDF8]",
    bgColor: "bg-[#38BDF8]",
    lightBg: "bg-[#f0faff]",
  },
  {
    id: 4,
    label: "NAVIGATE\nBUSINESS\nSOLUTIONS",
    color: "#22C55E",
    borderColor: "border-[#22C55E]",
    bgColor: "bg-[#22C55E]",
    lightBg: "bg-[#f0fdf4]",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FeatureItemProps {
  id: number;
  title: string;
  description: string;
}

function FeatureItem({ id, title, description }: FeatureItemProps) {
  return (
    <li className="flex items-start gap-4">
      {/* Numbered circle */}
      <div
        aria-hidden="true"
        className="flex-shrink-0 w-[65px] h-[65px] hero_icon relative bg-white shadow-[0_0_0_7px_#edf1fe] rounded-full flex items-center justify-center"
      >
        <span className="text-[#E8453C] font-extrabold text-[30px] leading-normal italic">
          {id}
        </span>
      </div>

      {/* Text */}
      <div className="pt-1">
        <h3 className="text-[24px] font-extrabold text-gray-900 leading-snug mb-2">
          {title}
        </h3>
        <p className="text-[17px] text-[#6b6b84] font-semibold mt-0.5 leading-snug">
          {description}
        </p>
      </div>
    </li>
  );
}

interface StepCardProps {
  id: number;
  label: string;
  color: string;
  borderColor: string;
  bgColor: string;
  lightBg: string;
}

function StepCard({ id, label, color, borderColor, bgColor, lightBg }: StepCardProps) {
  const lines = label.split("\n");

  return (
    <article
      className={`relative flex flex-col flex-1 min-w-0 border-2 ${borderColor} rounded-sm overflow-visible`}
      aria-label={`Step ${id}: ${label.replace(/\n/g, " ")}`}
    >
      {/* Card body */}
      <div className={`${lightBg} px-3 py-12 flex-1 flex items-center justify-center min-h-[110px]`}>
        <p className="text-center font-normal text-[14px] leading-[1.55] tracking-wide text-gray-800 uppercase">
          {lines.map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </p>
      </div>

      {/* Arrow-shaped footer */}
      <div className={`${bgColor} relative w-[90%] flex items-center justify-center h-9 -mb-2`}>
        <span className="text-white font-bold text-[14px] tracking-widest uppercase z-10">
          STEP {id}
        </span>

        {/* Right-pointing chevron arrow (except last) */}
        {id < 5 && (
          <div
            aria-hidden="true"
            className="absolute -right-[18px] top-0 z-20 w-0 h-0"
            style={{
              borderTop: "18px solid transparent",
              borderBottom: "18px solid transparent",
              borderLeft: `18px solid ${color}`,
            }}
          />
        )}
      </div>
    </article>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HeroSection() {
  const [zipCode, setZipCode] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handler placeholder — wire to your routing logic
    console.log("ZipCode submitted:", zipCode);
  };

  return (
    <section
      className="bg-[#F2F2F2] w-full"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-[1320px] mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">

        {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Eyebrow */}
          <p className="text-[#ff5d22] font-bold text-[15px] uppercase tracking-widest font-inter">
            Global HR Compliance Solutions
          </p>

          {/* Main heading */}
          <h1
            id="hero-heading"
            className="text-xl sm:text-[24px] font-extrabold text-gray-900 leading-tight max-w-xl"
          >
            Hire internationally and pay talent anywhere
          </h1>

          {/* Sub-heading */}
          <p className="text-[#6b6b84] font-semibold text-[17px] leading-relaxed -mt-3 font-inter">
            Save money and time with instant, actionable guidance
          </p>

          {/* Feature list */}
          <ul className="flex flex-col gap-5" role="list" aria-label="Key features">
            {FEATURES.map((f) => (
              <FeatureItem key={f.id} {...f} />
            ))}
          </ul>

          {/* ZipCode CTA */}
          <form
            onSubmit={handleSubmit}
            className="flex items-stretch mt-4 max-w-lg "
            role="search"
            aria-label="Get started by entering your zip code"
          >
            <label htmlFor="zip-input" className="sr-only">
              Enter your zip code
            </label>
            <input
              id="zip-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="ZipCode"
              className="flex-1 px-4 py-4 text-[17px] text-[#221638] placeholder-gray-400 bg-[#eaeaea] border-r-0 rounded-l-[5px] outline-none focus:ring-2 focus:ring-transparent focus:ring-0"
              aria-required="true"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#ff5d22] hover:bg-[#221638] active:bg-[#ff5d22] transition-colors px-5 py-3 rounded-r-sm text-white font-semibold text-[14px] whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8453C]"
            >
              {/* Checkmark icon */}
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Get Started
            </button>
          </form>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Section heading */}
          <div className="text-center">
            <h2 className="text-[26px] sm:text-[30px] font-extrabold text-gray-900 tracking-tight">
              HOW IT WORKS
            </h2>
            <p className="text-[15px] font-bold uppercase tracking-widest py-4 text-gray-500 mt-1">
              Cut to the chase with personalized solutions
            </p>
          </div>

          {/* Step cards */}
          <div
            className="flex gap-1 items-stretch mt-2"
            role="list"
            aria-label="How it works steps"
          >
            {STEPS.map((step) => (
              <StepCard key={step.id} {...step} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}