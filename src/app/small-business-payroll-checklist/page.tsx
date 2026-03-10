import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { generateSeoMetadata } from '@/components/common/Seo';
import SocialShare from '@/components/common/SocialShare';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Small Business Payroll Checklist',
  description: 'Payroll is one of the most important aspects of running a small business. It involves paying employees, withholding and remitting taxes, and complying with various labor laws and regulations.',
  keywords: ['payroll', 'small business payroll', 'checklist', 'payroll compliance', 'payroll tax', 'employee payments'],
  url: '/small-business-payroll-checklist',
  type: 'article',
  image: '/images/logo.webp',
  siteName: siteConfig.name,
  siteUrl: siteConfig.siteUrl,
});

/**
 * Small Business Payroll Checklist Page
 * 
 * Optimized for:
 * - Core Web Vitals (LCP, CLS, FID, INP)
 * - W3C Validation
 * - WCAG 2.1 AA Accessibility
 * - Technical SEO
 */
export default function SmallBusinessPayrollChecklistPage() {
  const pageUrl = `${siteConfig.siteUrl}/small-business-payroll-checklist`;
  const pageTitle = 'Small Business Payroll Checklist';
  const pageDescription = 'Payroll is one of the most important aspects of running a small business. It involves paying employees, withholding and remitting taxes, and complying with various labor laws and regulations.';

  return (
    <main id="main-content" className="min-h-screen bg-gray-50">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="
            text-3xl md:text-4xl lg:text-5xl
            font-bold text-gray-900
            mb-4
            leading-tight
          ">
            {pageTitle}
          </h1>
          
          {/* Category Label */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-base text-gray-500">Category:</span>
            <Link
              href="/category/small-business-payroll/"
              className="text-base font-normal text-gray-600 hover:text-blue-600 transition-colors"
            >
              Small Business Payroll
            </Link>
          </div>
        </header>

        {/* Content Card */}
        <div className="
          bg-white rounded-lg
          p-6 md:p-8 lg:p-10
          shadow-sm
          mb-8
        ">
          {/* Introductory Paragraphs */}
          <p className="
            text-base 
            font-normal text-gray-700
            leading-relaxed
            mb-4
          ">
            Payroll is one of the most important aspects of running a small business.
            It involves paying employees, withholding and remitting taxes, and complying
            with various labor laws and regulations. However, payroll can also be complex
            and time-consuming if you do not have the proper tools or processes in place.
          </p>

          <p className="
            text-base 
            font-normal text-gray-700
            leading-relaxed
            mb-8
          ">
            To simplify payroll tasks and avoid costly mistakes, this payroll checklist
            helps small business owners follow essential steps before, during, and after
            each payroll cycle.
          </p>

          {/* Before Payroll Section */}
          <section className="mb-8">
            <h2 className="
              text-xl md:text-2xl
              font-bold text-gray-900
              mb-4
            ">
              Before Payroll
            </h2>
            <ul className="space-y-6 list-none ml-0">
              <li>
                <p className="
                  text-base 
                  font-normal text-gray-700
                  leading-relaxed
                ">
                  <strong className="font-bold text-gray-900">Get an Employer Identification Number (EIN).</strong>
                  {' '}Apply for an official employer identification number from the IRS.
                  This number uniquely identifies your business for tax purposes.
                </p>
              </li>

              <li>
                <p className="
                  text-base 
                  font-normal text-gray-700
                  leading-relaxed
                ">
                  <strong className="font-bold text-gray-900">Open payroll tax accounts.</strong>
                  {' '}Create withholding accounts for federal, state, and local taxes so
                  you can deposit taxes withheld from employee wages.
                </p>
              </li>

              <li>
                <p className="
                  text-base 
                  font-normal text-gray-700
                  leading-relaxed
                ">
                  <strong className="font-bold text-gray-900">Select payroll software or a payroll service.</strong>
                  {' '}Payroll software helps automate wage calculations, deductions, tax
                  filings, and reports. Payroll service providers can manage part or
                  all of your payroll operations for a fee.
                </p>
              </li>
            </ul>
          </section>

          {/* During Payroll Section */}
          <section className="mb-8">
            <h2 className="
              text-xl md:text-2xl
              font-bold text-gray-900
              mb-4
            ">
              During Payroll
            </h2>
            <ul className="space-y-6 list-none ml-0">
              <li>
                <p className="
                  text-base 
                  font-normal text-gray-700
                  leading-relaxed
                ">
                  <strong className="font-bold text-gray-900">Collect employee time and attendance data.</strong>
                  {' '}Ensure that hours worked, overtime, and leave records are accurate
                  before processing payroll.
                </p>
              </li>

              <li>
                <p className="
                  text-base 
                  font-normal text-gray-700
                  leading-relaxed
                ">
                  <strong className="font-bold text-gray-900">Calculate wages and deductions.</strong>
                  {' '}Determine each employee&apos;s gross pay, subtract taxes and benefits,
                  and calculate the final net pay.
                </p>
              </li>

              <li>
                <p className="
                  text-base 
                  font-normal text-gray-700
                  leading-relaxed
                ">
                  <strong className="font-bold text-gray-900">Process employee payments.</strong>
                  {' '}Pay employees using direct deposit, checks, or other approved payment
                  methods according to your payroll schedule.
                </p>
              </li>
            </ul>
          </section>

          {/* After Payroll Section */}
          <section className="mb-8">
            <h2 className="
              text-xl md:text-2xl
              font-bold text-gray-900
              mb-4
            ">
              After Payroll
            </h2>
            <ul className="space-y-6 list-none ml-0">
              <li>
                <p className="
                  text-base 
                  font-normal text-gray-700
                  leading-relaxed
                ">
                  <strong className="font-bold text-gray-900">Deposit payroll taxes.</strong>
                  {' '}Submit withheld taxes to the appropriate federal, state, and local
                  tax agencies within required deadlines.
                </p>
              </li>

              <li>
                <p className="
                  text-base 
                  font-normal text-gray-700
                  leading-relaxed
                ">
                  <strong className="font-bold text-gray-900">Maintain payroll records.</strong>
                  {' '}Keep records of employee wages, tax filings, and payroll reports
                  for compliance and auditing purposes.
                </p>
              </li>

              <li>
                <p className="
                  text-base 
                  font-normal text-gray-700
                  leading-relaxed
                ">
                  <strong className="font-bold text-gray-900">File payroll reports.</strong>
                  {' '}Submit required payroll tax forms and reports to government agencies
                  according to the filing schedule.
                </p>
              </li>
            </ul>
          </section>

          {/* Conclusion Section */}
          <section className="mb-8">
            <h2 className="
              text-xl md:text-2xl
              font-bold text-gray-900
              mb-4
            ">
              Conclusion
            </h2>
            <p className="
              text-base 
              font-normal text-gray-700
              leading-relaxed
            ">
              Payroll management can feel overwhelming for small business owners,
              but following a clear checklist can streamline the process. With the
              right systems and tools in place, you can process payroll efficiently,
              remain compliant with regulations, and avoid common payroll mistakes.
            </p>
          </section>
        </div>

        {/* Social Share */}
        <SocialShare
          url={pageUrl}
          title={pageTitle}
          description={pageDescription}
        />
      </article>
    </main>
  );
}
