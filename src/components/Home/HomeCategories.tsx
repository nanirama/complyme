import Link from 'next/link';

/**
 * HomeCategories Component
 * 
 * Displays category cards in a 2x2 grid with a CTA panel
 * Optimized for:
 * - Core Web Vitals (LCP, CLS, FID, INP)
 * - W3C Validation
 * - WCAG 2.1 AA Accessibility
 * - Technical SEO
 * - Fully Responsive Design
 */

// Static category cards data
const categoryCards = [
  {
    id: 1,
    tag: 'Business Formation',
    title: 'A Company formation Checklist',
    href: '/a-company-formation-checklist',
  },
  {
    id: 2,
    tag: 'Business Taxes',
    title: 'Small Business Payroll Checklist',
    href: '/small-business-payroll-checklist',
  },
  {
    id: 3,
    tag: 'Outsourcing HR',
    title: 'HR Outsourcing for Small Business Owners',
    href: '/hr-outsourcing-for-small-business-owners',
  },
  {
    id: 4,
    tag: 'Small Business Payroll',
    title: 'Small Business Payroll Checklist',
    href: '/small-business-payroll-checklist',
  },
];

export default function HomeCategories() {

  return (
    <section
      className="
        relative w-full py-16 md:py-24 lg:py-32
        bg-gray-50
        overflow-hidden
      "
      aria-labelledby="home-categories-heading"
    >
      {/* Content Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Section - Category Cards Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryCards.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="
                    group block
                    bg-white rounded-lg
                    p-6 md:p-8
                    border-l-4 border-blue-400
                    shadow-sm
                    transition-all duration-200 ease-in-out
                    hover:shadow-lg hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  "
                  aria-label={`${card.tag} - ${card.title}`}
                >
                  {/* Tag/Label */}
                  <div className="mb-4">
                    <span className="
                      inline-block
                      px-3 py-1
                      text-xs font-semibold
                      bg-green-100 text-gray-700
                      rounded-full
                    ">
                      {card.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="
                    text-lg md:text-xl lg:text-2xl
                    font-bold text-gray-900
                    leading-tight
                    transition-colors duration-200
                    group-hover:text-blue-600
                  ">
                    {card.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section - CTA Panel */}
          <div className="lg:col-span-4">
            <div className="
              bg-blue-50 rounded-lg
              p-8 md:p-10
              shadow-sm
              h-full
              flex flex-col
            ">
              {/* Main Title */}
              <h2 className="
                text-3xl md:text-4xl
                font-bold text-gray-900
                mb-2
              ">
                Comply.Me
              </h2>

              {/* Subtitle */}
              <p className="
                text-lg md:text-xl
                font-normal text-gray-700
                mb-8
              ">
                Small Business Solutions
              </p>

              {/* Feature List */}
              <ul className="
                space-y-4
                mb-8
                flex-1
              " role="list">
                <li className="flex items-start gap-3">
                  <div className="
                    flex-shrink-0
                    w-2 h-2
                    bg-green-500
                    rounded-full
                    mt-2
                  " aria-hidden="true" />
                  <span className="
                    text-base 
                    font-normal text-gray-700
                  ">
                    Actionable
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="
                    flex-shrink-0
                    w-2 h-2
                    bg-green-500
                    rounded-full
                    mt-2
                  " aria-hidden="true" />
                  <span className="
                    text-base 
                    font-normal text-gray-700
                  ">
                    Step-by-Step
                  </span>
                </li>
              </ul>

              {/* Call to Action Button */}
              <Link
                href="/registracia/"
                className="
                  inline-flex items-center justify-center
                  w-full
                  px-6 py-4
                  text-base font-semibold text-white
                  bg-blue-600 rounded-lg
                  transition-all duration-200 ease-in-out
                  hover:bg-blue-700 hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  active:scale-95
                "
                aria-label="Get expert advice for your business"
              >
                Get Advice
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
