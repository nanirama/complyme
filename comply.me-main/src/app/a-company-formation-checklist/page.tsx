import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { generateSeoMetadata } from '@/components/common/Seo';
import SocialShare from '@/components/common/SocialShare';

export const metadata: Metadata = generateSeoMetadata({
  title: 'A Company formation Checklist',
  description: 'When embarking on the process of forming a company, it\'s crucial to ensure legal compliance at every step. Here\'s a legal checklist to guide you through the process.',
  keywords: ['company formation', 'business formation', 'checklist', 'legal compliance', 'business structure'],
  url: '/a-company-formation-checklist',
  type: 'article',
  image: '/images/logo.webp',
  siteName: siteConfig.name,
  siteUrl: siteConfig.siteUrl,
});

/**
 * A Company formation Checklist Page
 * 
 * Optimized for:
 * - Core Web Vitals (LCP, CLS, FID, INP)
 * - W3C Validation
 * - WCAG 2.1 AA Accessibility
 * - Technical SEO
 */
export default function CompanyFormationChecklistPage() {
  const pageUrl = `${siteConfig.siteUrl}/a-company-formation-checklist`;
  const pageTitle = 'A Company formation Checklist';
  const pageDescription = 'When embarking on the process of forming a company, it\'s crucial to ensure legal compliance at every step. Here\'s a legal checklist to guide you through the process.';

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
              href="/category/business-formation/"
              className="text-base font-normal text-gray-600 hover:text-blue-600 transition-colors"
            >
              Business Formation
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
          {/* Introductory Paragraph */}
          <p className="
            text-base 
            font-normal text-gray-700
            leading-relaxed
            mb-8
          ">
            {pageDescription}
          </p>

          {/* Choose a Business Structure Section */}
          <section className="mb-8">
            <h2 className="
              text-lg md:text-xl
              font-bold text-gray-900
              mb-4
            ">
              Choose a Business Structure:
            </h2>
            <ul className="space-y-3 ml-4">
              <li className="
                text-base 
                font-normal text-gray-700
                leading-relaxed
              ">
                Research and select the most suitable legal structure for your business (e.g., sole proprietorship, partnership, LLC, corporation).
              </li>
              <li className="
                text-base
                font-normal text-gray-700
                leading-relaxed
              ">
                Consider factors such as liability protection, tax implications, and management structure.
              </li>
            </ul>
          </section>

          {/* Check Business Name Availability Section */}
          <section className="mb-8">
            <h2 className="
              text-lg md:text-xl
              font-bold text-gray-900
              mb-4
            ">
              Check Business Name Availability:
            </h2>
            <ul className="space-y-3 ml-4">
              <li className="
                text-base
                font-normal text-gray-700
                leading-relaxed
              ">
                Verify that your chosen business name is available and complies with the naming regulations of your jurisdiction.
              </li>
              <li className="
                text-base
                font-normal text-gray-700
                leading-relaxed
              ">
                Ensure it doesn&apos;t infringe on trademarks or existing business names.
              </li>
            </ul>
          </section>

          {/* Register the Company Section */}
          <section className="mb-8">
            <h2 className="
              text-lg md:text-xl
              font-bold text-gray-900
              mb-4
            ">
              Register the Company:
            </h2>
            <ul className="space-y-3 ml-4">
              <li className="
                text-base
                font-normal text-gray-700
                leading-relaxed
              ">
                File the necessary paperwork with the appropriate government authority (e.g., Secretary of State, Companies House).
              </li>
              <li className="
                text-base
                font-normal text-gray-700
                leading-relaxed
              ">
                Prepare and submit articles of incorporation (for corporations) or articles of organization (for LLCs).
              </li>
            </ul>
          </section>

          {/* Obtain Necessary Permits and Licenses Section */}
          <section className="mb-8">
            <h2 className="
              text-lg md:text-xl
              font-bold text-gray-900
              mb-4
            ">
              Obtain Necessary Permits and Licenses:
            </h2>
            <ul className="space-y-3 ml-4">
              <li className="
                text-base 
                font-normal text-gray-700
                leading-relaxed
              ">
                Identify and obtain any required business licenses and permits at the federal, state/provincial, and local levels.
              </li>
              <li className="
                text-base
                font-normal text-gray-700
                leading-relaxed
              ">
                Ensure compliance with regulations specific to your industry.
              </li>
            </ul>
          </section>

          {/* Draft Foundational Documents Section */}
          <section className="mb-8">
            <h2 className="
              text-lg md:text-xl
              font-bold text-gray-900
              mb-4
            ">
              Draft Foundational Documents:
            </h2>
            <ul className="space-y-3 ml-4">
              <li className="
                text-base 
                font-normal text-gray-700
                leading-relaxed
              ">
                Prepare bylaws (for corporations) or an operating agreement (for LLCs) outlining the internal governance structure and operational procedures.
              </li>
            </ul>
          </section>

          {/* Create shareholder agreements */}
          <p className="
            text-base 
            font-normal text-gray-700
            leading-relaxed
            mb-8
          ">
            Create shareholder agreements or partnership agreements if applicable.
          </p>

          {/* Appoint Directors/Officers/Managers Section */}
          <section className="mb-8">
            <h2 className="
              text-lg md:text-xl
              font-bold text-gray-900
              mb-4
            ">
              Appoint Directors/Officers/Managers:
            </h2>
            <ul className="space-y-3 ml-4">
              <li className="
                text-base 
                font-normal text-gray-700
                leading-relaxed
              ">
                Select individuals to serve as directors, officers, or managers depending on your business structure.
              </li>
              <li className="
                text-base
                font-normal text-gray-700
                leading-relaxed
              ">
                Ensure they understand their roles, responsibilities, and fiduciary duties.
              </li>
            </ul>
          </section>

          {/* Obtain an Employer Identification Number (EIN) Section */}
          <section className="mb-8">
            <h2 className="
              text-lg md:text-xl
              font-bold text-gray-900
              mb-4
            ">
              Obtain an Employer Identification Number (EIN):
            </h2>
            <ul className="space-y-3 ml-4">
              <li className="
                text-base 
                font-normal text-gray-700
                leading-relaxed
              ">
                Apply for an EIN from the IRS (for U.S. businesses) or the relevant tax authority in your country.
              </li>
              <li className="
                text-base
                font-normal text-gray-700
                leading-relaxed
              ">
                This unique identifier is necessary for tax purposes and hiring employees.
              </li>
            </ul>
          </section>

          {/* Comply with Tax Obligations Section */}
          <section className="mb-8">
            <h2 className="
              text-lg md:text-xl
              font-bold text-gray-900
              mb-4
            ">
              Comply with Tax Obligations:
            </h2>
            <ul className="space-y-3 ml-4">
              <li className="
                text-base
                font-normal text-gray-700
                leading-relaxed
              ">
                Register for federal, state/provincial, and local taxes applicable to your business.
              </li>
              <li className="
                text-base
                font-normal text-gray-700
                leading-relaxed
              ">
                Understand your tax obligations regarding income tax, sales tax, payroll tax, etc.
              </li>
            </ul>
          </section>

          {/* Establish Corporate Records Section */}
          <section className="mb-8">
            <h2 className="
              text-lg md:text-xl
              font-bold text-gray-900
              mb-4
            ">
              Establish Corporate Records:
            </h2>
            <p className="
              text-base 
              font-normal text-gray-700
              leading-relaxed
              mb-4
            ">
              Maintain accurate and up-to-date corporate records, including meeting minutes, resolutions, and ownership certificates.
            </p>
            <p className="
              text-base
              font-normal text-gray-700
              leading-relaxed
            ">
              Keep these records in a secure location as they may be required for legal or regulatory purposes.
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
