import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { generateSeoMetadata } from '@/components/common/Seo';

export const metadata: Metadata = generateSeoMetadata({
  title: 'About Us - Small Business Compliance',
  description: 'Start and manage your business with ease. We offer business tax filings, company formation, and regulatory alerts.',
  keywords: ['about us', 'business compliance', 'company formation', 'business services', 'small business'],
  url: '/about',
  type: 'website',
  siteName: siteConfig.name,
  siteUrl: siteConfig.siteUrl,
});

/**
 * About Page
 * 
 * Optimized for:
 * - Core Web Vitals (LCP, CLS, FID, INP)
 * - W3C Validation
 * - WCAG 2.1 AA Accessibility
 * - Technical SEO
 */
export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Heading */}
            <header className="space-y-4">
              <h1 className="
                text-4xl md:text-5xl lg:text-6xl
                font-bold text-gray-900
                leading-tight
              ">
                Small business compliance?
              </h1>
              <p className="
                text-lg md:text-xl
                font-normal text-gray-700
                leading-relaxed
              ">
                Start and manage your business with ease
              </p>
            </header>

            {/* Service Cards */}
            <div className="space-y-6">
              {/* First Service Card */}
              <div className="
                bg-white rounded-lg
                p-6 md:p-8
                shadow-sm
                border border-gray-100
              ">
                <h2 className="
                  text-lg md:text-xl
                  font-normal text-gray-900
                  mb-4
                ">
                  We offer:
                </h2>
                <ul className="space-y-2">
                  <li className="
                    text-base 
                    font-normal text-gray-700
                    flex items-start
                  ">
                    <span className="mr-2">-</span>
                    <span>Business Tax Fillings</span>
                  </li>
                  <li className="
                    text-base 
                    font-normal text-gray-700
                    flex items-start
                  ">
                    <span className="mr-2">-</span>
                    <span>Company Formation</span>
                  </li>
                  <li className="
                    text-base 
                    font-normal text-gray-700
                    flex items-start
                  ">
                    <span className="mr-2">-</span>
                    <span>Regulatory alerts</span>
                  </li>
                </ul>
              </div>

              {/* Second Service Card */}
              <div className="
                bg-white rounded-lg
                p-6 md:p-8
                shadow-sm
                border border-gray-100
              ">
                <ul className="space-y-2">
                  <li className="
                    text-base 
                    font-normal text-gray-700
                    flex items-start
                  ">
                    <span className="mr-2">-</span>
                    <span>Company Formation with Expedited processing</span>
                  </li>
                  <li className="
                    text-base 
                    font-normal text-gray-700
                    flex items-start
                  ">
                    <span className="mr-2">-</span>
                    <span>Annual State filings</span>
                  </li>
                  <li className="
                    text-base 
                    font-normal text-gray-700
                    flex items-start
                  ">
                    <span className="mr-2">-</span>
                    <span>IRS Tax filings</span>
                  </li>
                  <li className="
                    text-base 
                    font-normal text-gray-700
                    flex items-start
                  ">
                    <span className="mr-2">-</span>
                    <span>Regulatory reminders</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Our Commitment Section */}
            <section aria-labelledby="commitment-heading">
              <h2
                id="commitment-heading"
                className="
                  text-2xl md:text-3xl
                  font-bold text-gray-900
                  mb-6
                ">
                Our Commitment
              </h2>
              <div className="
                bg-white rounded-lg
                p-6 md:p-8
                shadow-sm
                border border-gray-100
              ">
                <p className="
                  text-base 
                  font-normal text-gray-700
                  leading-relaxed
                ">
                  We take our commitment to our users seriously. If you need our help with your project, have questions about how to use the site or are experiencing any technical difficulties, please do not hesitate to contact us.
                </p>
              </div>
            </section>

            {/* Contact Us Section */}
            <section aria-labelledby="contact-heading">
              <h2
                id="contact-heading"
                className="
                  text-2xl md:text-3xl
                  font-bold text-gray-900
                  mb-6
                ">
                Contact Us
              </h2>
              <div className="
                bg-white rounded-lg
                p-6 md:p-8
                shadow-sm
                border border-gray-100
              ">
                <div className="space-y-4">
                  <p className="
                    text-base 
                    font-normal text-gray-700
                    leading-relaxed
                  ">
                    Manage your business from anywhere
                  </p>
                  <p className="
                    text-base 
                    font-normal text-gray-700
                    leading-relaxed
                  ">
                    Get tailored tax filling and regulatory alerts
                  </p>
                  
                  {/* Contact Information */}
                  <div className="pt-4 space-y-3 border-t border-gray-100">
                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <a
                        href="mailto:contact@comply.me"
                        className="
                          text-base 
                          font-normal text-gray-700
                          hover:text-amber-600
                          transition-colors duration-200
                        "
                      >
                        contact@comply.me
                      </a>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="
                        text-base 
                        font-normal text-gray-700
                      ">
                        New York, NY
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
