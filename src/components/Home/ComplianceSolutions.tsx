import Link from 'next/link';

/**
 * ComplianceSolutions Component
 * 
 * Displays compliance solutions with feature cards and CTA
 * Optimized for:
 * - Core Web Vitals (LCP, CLS, FID, INP)
 * - W3C Validation
 * - WCAG 2.1 AA Accessibility
 * - Technical SEO
 * - Fully Responsive Design
 */

// SVG Icons as components for better performance
const GlobalPayrollIcon = () => (
  <svg
    className="w-full h-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    {/* Factory building base */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 20h16v-12H4v12z"
    />
    {/* Windows */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 14h2v-2H6v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18h2v-2H6v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2z"
    />
    {/* Smokestack */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 8h2v-4h-2v4z"
    />
    {/* Smoke waves */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 4c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 2c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 1c0 .5-.5 1-1 1s-1-.5-1-1 .5-1 1-1 1 .5 1 1z"
    />
  </svg>
);

const OutsourcingHRIcon = () => (
  <svg
    className="w-full h-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    {/* Multi-story building */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 20h16V6H4v14z"
    />
    {/* Building floors/windows */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 10h2v-2H6v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 14h2v-2H6v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18h2v-2H6v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2z"
    />
    {/* Cross symbol on top */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4v4M10 6h4"
      strokeWidth={2}
    />
  </svg>
);

const MaintainComplianceIcon = () => (
  <svg
    className="w-full h-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    {/* Delivery truck body */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16h10v-6H3v6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 10h6v-4h-6v4z"
    />
    {/* Truck cabin */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 10h4v-2h-4v2z"
    />
    {/* Wheels */}
    <circle
      cx="6"
      cy="16"
      r="2.5"
      fill="none"
    />
    <circle
      cx="16"
      cy="16"
      r="2.5"
      fill="none"
    />
    {/* Radar/signal waves above */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 4c0 2-2 4-4 4M14 4c0 2 2 4 4 4"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 2c0 1-1 2-2 2M12 2c0 1 1 2 2 2"
    />
    <circle
      cx="12"
      cy="3"
      r="1"
      fill="none"
    />
  </svg>
);

const features = [
  {
    id: 1,
    title: 'Global Payroll',
    icon: <GlobalPayrollIcon />,
    href: '/category/small-business-payroll/',
  },
  {
    id: 2,
    title: 'Outsourcing HR',
    icon: <OutsourcingHRIcon />,
    href: '/category/outsourcing-hr/',
  },
  {
    id: 3,
    title: 'Maintain Compliance',
    icon: <MaintainComplianceIcon />,
    href: '/category/hr-compliance/',
  },
];

export default function ComplianceSolutions() {
  return (
    <section
      className="
        relative w-full py-16 md:py-24 lg:py-32
        bg-gradient-to-br from-gray-50 via-white to-gray-50
        overflow-hidden
      "
      aria-labelledby="compliance-solutions-heading"
    >
      {/* Background Pattern */}
      <div
        className="
          absolute inset-0
          opacity-20
          pointer-events-none
        "
        aria-hidden="true"
      >
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)]
            bg-[size:40px_40px]
          "
        />
        <div
          className="
            absolute top-0 left-0 w-64 h-64
            bg-blue-200 rounded-full
            mix-blend-multiply filter blur-xl
            opacity-10
            -translate-x-1/2 -translate-y-1/2
          "
        />
        <div
          className="
            absolute top-0 right-0 w-64 h-64
            bg-purple-200 rounded-full
            mix-blend-multiply filter blur-xl
            opacity-10
            translate-x-1/2 -translate-y-1/2
          "
        />
        <div
          className="
            absolute bottom-0 left-1/2 w-64 h-64
            bg-amber-200 rounded-full
            mix-blend-multiply filter blur-xl
            opacity-10
            -translate-x-1/2 translate-y-1/2
          "
        />
      </div>

      {/* Content Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <header className="text-center mb-12 md:mb-16">
          <h2
            id="compliance-solutions-heading"
            className="
              text-2xl
              font-extrabold text-[#718096]
              mb-6
              leading-tight
            "
          >
            Let&apos;s find federal, state and local labor compliance solutions
          </h2>
        </header>

        {/* Feature Cards */}
        <div className="
          grid grid-cols-1 md:grid-cols-3
          gap-6 md:gap-8
          mb-12 md:mb-16
        ">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="
                group 
                  flex items-center gap-4   w-full p-6   bg-white rounded-lg   border border-gray-200   transition-all duration-200 ease-in-out   hover:shadow-lg hover:border-amber-300 hover:-translate-y-1   focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2   
              "
              aria-label={`${feature.title} - Learn more`}
            >
              {/* Icon */}
              <div
                className="
                    flex-shrink-0   w-12 h-12   text-gray-400   transition-colors duration-200   group-hover:text-amber-600   
                "
                aria-hidden="true"
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="
                  flex-1   text-lg font-bold text-gray-900   transition-colors duration-200   group-hover:text-amber-600   
              ">
                {feature.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/registracia/"
            className="
              inline-flex items-center justify-center gap-2
              px-8 py-4
              text-base font-semibold text-white
              bg-amber-500 rounded-lg
              transition-all duration-200 ease-in-out
              hover:bg-amber-600 hover:shadow-lg hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
              active:scale-95
            "
            aria-label="Get expert advice for compliance solutions"
          >
            <span aria-hidden="true">→</span>
            <span>Get Expert Advice</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
