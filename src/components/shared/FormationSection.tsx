import Link from 'next/link';
import FormationCard from '@/components/ui/cards/FormationCard';

/**
 * FormationSection Component
 * 
 * Displays business formation services with cards and CTA
 * Optimized for:
 * - Core Web Vitals (LCP, CLS, FID, INP)
 * - W3C Validation
 * - WCAG 2.1 AA Accessibility
 * - Technical SEO
 * - Fully Responsive Design
 */

// SVG Icons as components for better performance
const CompanyFormationIcon = () => (
  <svg
    className="w-full h-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
    />
  </svg>
);

const BusinessTaxesIcon = () => (
  <svg
    className="w-full h-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const BusinessComplianceIcon = () => (
  <svg
    className="w-full h-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-9.75c0-.621-.504-1.125-1.125-1.125H20.25M8.25 18.75h5.25m-5.25 0v-1.5m0 1.5H6m9.75-9.75H18m-9.75 0H12m-3.75 0h.008v.008H8.25V9zm0 3h.008v.008H8.25V12zm0 3h.008v.008H8.25V15z"
    />
  </svg>
);

export default function FormationSection() {
  const formationServices = [
    {
      title: 'Company Formation',
      icon: <CompanyFormationIcon />,
      href: '/category/business-formation',
    },
    {
      title: 'Business Taxes',
      icon: <BusinessTaxesIcon />,
      href: '/category/business-taxes',
    },
    {
      title: 'Business Compliance',
      icon: <BusinessComplianceIcon />,
      href: '/category/compliance',
    },
  ];

  return (
    <section
      className="
        relative
        w-full py-16 md:py-24 lg:py-32
        bg-gradient-to-br from-gray-50 via-white to-gray-50
        overflow-hidden
      "
      aria-labelledby="formation-heading"
    >
      {/* Background Pattern */}
      <div
        className="
          absolute inset-0
          opacity-30
          pointer-events-none
        "
        aria-hidden="true"
      >
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]
            bg-[size:24px_24px]
          "
        />
        <div
          className="
            absolute top-0 left-0 w-64 h-64
            bg-blue-200 rounded-full
            mix-blend-multiply filter blur-xl
            opacity-20
            -translate-x-1/2 -translate-y-1/2
          "
        />
        <div
          className="
            absolute top-0 right-0 w-64 h-64
            bg-purple-200 rounded-full
            mix-blend-multiply filter blur-xl
            opacity-20
            translate-x-1/2 -translate-y-1/2
          "
        />
        <div
          className="
            absolute bottom-0 left-1/2 w-64 h-64
            bg-yellow-200 rounded-full
            mix-blend-multiply filter blur-xl
            opacity-20
            -translate-x-1/2 translate-y-1/2
          "
        />
      </div>

      {/* Content Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <header className="text-center mb-12 md:mb-16">
          <h2
            id="formation-heading"
            className="
              text-3xl md:text-4xl lg:text-5xl
              font-bold text-gray-900
              mb-4
            "
          >
            Start, build and maintain your business with stress-free compliance
          </h2>
        </header>

        {/* Service Cards */}
        <nav aria-label="Business formation services">
          <ul
            className="
              grid grid-cols-1 md:grid-cols-3
              gap-6 md:gap-8
              mb-12 md:mb-16
            "
          >
            {formationServices.map((service) => (
              <FormationCard
                key={service.href}
                title={service.title}
                icon={service.icon}
                href={service.href}
              />
            ))}
          </ul>
        </nav>

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
            aria-label="Get expert advice for your business"
          >
            <span aria-hidden="true">→</span>
            <span>Get Expert Advice</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
