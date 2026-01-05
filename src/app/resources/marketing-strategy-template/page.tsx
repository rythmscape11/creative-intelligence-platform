import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import {
  Download,
  FileText,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Marketing Strategy Template (PPT) - Download Professional Templates | Aureon One',
  description: 'Download free, professional marketing strategy templates in PowerPoint, Word, and Excel. Includes budget planners, campaign calendars, and KPI dashboards. Ready to use.',
  keywords: 'marketing strategy template, marketing plan template PPT, free marketing templates, marketing strategy PowerPoint, marketing plan Word template, marketing budget template',
  alternates: {
    canonical: '/resources/marketing-strategy-template',
  },
  openGraph: {
    title: 'Free Marketing Strategy Template (PPT) - Download Professional Templates',
    description: 'Download free, professional marketing strategy templates in PowerPoint, Word, and Excel. Includes budget planners, campaign calendars, and KPI dashboards.',
    type: 'article',
    url: 'https://aureonone.in/resources/marketing-strategy-template',
  },
};

// Article Schema for SEO
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Free Marketing Strategy Template (PPT) - Professional Templates for Marketers',
  description: 'Comprehensive guide to marketing strategy templates, including what to include, how to use them, and free downloads.',
  image: 'https://www.aureonone.in/images/resources/marketing-strategy-template.jpg',
  author: {
    '@type': 'Organization',
    name: 'Aureon One',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Aureon One',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.aureonone.in/images/logos/mediaplanpro-icon.svg',
    },
  },
  datePublished: '2025-01-15',
  dateModified: '2025-01-15',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.aureonone.in/resources/marketing-strategy-template',
  },
};

export default function MarketingStrategyTemplatePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />


      <main className="py-12 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="max-w-4xl mx-auto mb-8">
          <BreadcrumbSchema
            items={[
              { name: 'Home', url: '/' },
              { name: 'Resources', url: '/resources' },
              { name: 'Marketing Strategy Template', url: '/resources/marketing-strategy-template' }
            ]}
          />
        </div>

        {/* Hero Section */}
        <article className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full mb-6">
              <Download className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-sm font-semibold text-[#F59E0B]">Free Professional Templates</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Free Marketing Strategy Template (PPT, Word, Excel)
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Download professional, ready-to-use marketing strategy templates. Save hours of work with our beautifully designed PowerPoint, Word, and Excel templates.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-colors font-bold text-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
              >
                <Download className="w-5 h-5" />
                Generate Custom Template Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No email required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Instant download</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Fully customizable</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">What's Included in Our Marketing Strategy Templates?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our free marketing strategy templates are designed by professional marketers and agencies. Each template is fully customizable and includes everything you need to create a comprehensive marketing plan:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <FileText className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">PowerPoint Template</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• 30+ professionally designed slides</li>
                    <li>• Executive summary & situation analysis</li>
                    <li>• Target audience personas</li>
                    <li>• Channel strategy & tactics</li>
                    <li>• Budget allocation charts</li>
                    <li>• Timeline & milestones</li>
                  </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <FileText className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Word Document Template</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Comprehensive written plan format</li>
                    <li>• Market research & analysis sections</li>
                    <li>• SWOT analysis framework</li>
                    <li>• Detailed strategy documentation</li>
                    <li>• Implementation checklist</li>
                    <li>• Appendices for data & research</li>
                  </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Excel Budget Planner</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Pre-built budget formulas</li>
                    <li>• Channel allocation calculator</li>
                    <li>• ROI tracking spreadsheet</li>
                    <li>• Monthly budget pacing</li>
                    <li>• Actual vs. planned comparison</li>
                    <li>• Automated charts & graphs</li>
                  </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <Calendar className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Campaign Calendar</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• 12-month campaign planner</li>
                    <li>• Content calendar template</li>
                    <li>• Launch timeline tracker</li>
                    <li>• Milestone & deadline management</li>
                    <li>• Team task assignments</li>
                    <li>• Color-coded by channel</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Why Use Templates */}
            <section className="mb-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-white">Why Use Marketing Strategy Templates?</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#F59E0B]" />
                    Save 10-20 Hours of Work
                  </h3>
                  <p className="text-gray-300 ml-9">
                    Creating a marketing strategy from scratch takes days. Our templates provide a proven framework that you can customize in hours, not weeks. Focus on strategy, not formatting.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#F59E0B]" />
                    Professional Design & Structure
                  </h3>
                  <p className="text-gray-300 ml-9">
                    Our templates are designed by professional marketers and agencies. They include all the essential sections, best practices, and visual elements that make your strategy look polished and credible.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#F59E0B]" />
                    Proven Framework for Success
                  </h3>
                  <p className="text-gray-300 ml-9">
                    Don't reinvent the wheel. Our templates are based on proven marketing frameworks used by successful companies. They ensure you don't miss critical components of a comprehensive strategy.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#F59E0B]" />
                    Easy to Customize & Brand
                  </h3>
                  <p className="text-gray-300 ml-9">
                    All templates are fully editable. Add your logo, change colors to match your brand, modify sections to fit your needs. Compatible with Microsoft Office, Google Workspace, and Apple iWork.
                  </p>
                </div>
              </div>
            </section>

            {/* What to Include */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">What to Include in Your Marketing Strategy</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                A comprehensive marketing strategy should cover these essential components. Our templates include all of these sections with guidance on what to include:
              </p>

              <div className="space-y-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">1. Executive Summary</h3>
                  <p className="text-gray-300 text-sm">
                    A high-level overview of your marketing strategy, including key objectives, target audience, budget, and expected outcomes. This should be written last but placed first in your document.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">2. Situation Analysis (SWOT)</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Analyze your current market position, including:
                  </p>
                  <ul className="space-y-1 text-gray-400 text-sm ml-4">
                    <li>• <strong>Strengths:</strong> What advantages does your business have?</li>
                    <li>• <strong>Weaknesses:</strong> What areas need improvement?</li>
                    <li>• <strong>Opportunities:</strong> What market trends can you capitalize on?</li>
                    <li>• <strong>Threats:</strong> What competitive or market challenges exist?</li>
                  </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">3. Target Audience & Buyer Personas</h3>
                  <p className="text-gray-300 text-sm">
                    Define who you're marketing to with detailed buyer personas including demographics, psychographics, pain points, goals, and buying behavior. Include 2-3 primary personas.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">4. Marketing Goals & KPIs</h3>
                  <p className="text-gray-300 text-sm">
                    Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) and define KPIs for tracking success. Examples: increase website traffic by 50%, generate 100 qualified leads per month, achieve 3:1 ROI.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">5. Channel Strategy & Tactics</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Detail which marketing channels you'll use and specific tactics for each:
                  </p>
                  <ul className="space-y-1 text-gray-400 text-sm ml-4">
                    <li>• Content Marketing (blog, video, podcasts)</li>
                    <li>• SEO & Organic Search</li>
                    <li>• Paid Advertising (Google Ads, Facebook Ads, LinkedIn)</li>
                    <li>• Social Media Marketing</li>
                    <li>• Email Marketing & Automation</li>
                    <li>• PR & Influencer Marketing</li>
                  </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">6. Budget Allocation</h3>
                  <p className="text-gray-300 text-sm">
                    Break down your marketing budget by channel, campaign, and time period. Include expected costs, ROI projections, and contingency planning. Use our <Link href="/tools/advertising/budget-allocator-enhanced" className="text-[#F59E0B] hover:underline">Budget Allocator tool</Link> for optimization.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">7. Implementation Timeline</h3>
                  <p className="text-gray-300 text-sm">
                    Create a phased rollout plan with specific milestones, deadlines, and team responsibilities. Include quick wins (0-30 days), short-term initiatives (1-3 months), and long-term strategies (3-12 months).
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">8. Measurement & Reporting</h3>
                  <p className="text-gray-300 text-sm">
                    Define how you'll track performance, what metrics you'll monitor, and how often you'll report results. Include dashboard mockups and reporting templates.
                  </p>
                </div>
              </div>
            </section>

            {/* How to Use */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">How to Use These Templates Effectively</h2>

              <div className="space-y-6">
                <div className="flex gap-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xl">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Start with Research</h3>
                    <p className="text-gray-300">
                      Before filling in the template, gather data about your market, competitors, and audience. Use tools like Google Analytics, social media insights, and customer surveys to inform your strategy.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xl">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Customize for Your Business</h3>
                    <p className="text-gray-300">
                      Don't just fill in blanks—adapt the template to your specific situation. Remove sections that don't apply, add custom sections for unique aspects of your business, and adjust the framework to match your goals.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xl">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Get Team Input</h3>
                    <p className="text-gray-300">
                      Share the template with your team, stakeholders, and even customers for feedback. The best marketing strategies are collaborative and incorporate diverse perspectives.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xl">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Review & Update Regularly</h3>
                    <p className="text-gray-300">
                      Your marketing strategy isn't set in stone. Review it quarterly, update based on performance data, and adjust tactics as market conditions change. Use the template as a living document.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Resources */}
            <section className="mb-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">Related Marketing Resources</h2>
              <p className="text-gray-300 mb-6">
                Enhance your marketing strategy with these free tools and resources:
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  href="/resources/ai-marketing-plan-generator"
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">AI Marketing Plan Generator</h3>
                  <p className="text-sm text-gray-400">Create complete marketing plans in minutes with AI</p>
                </Link>

                <Link
                  href="/tools/advertising/budget-allocator-enhanced"
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">Budget Allocator</h3>
                  <p className="text-sm text-gray-400">Optimize budget across marketing channels</p>
                </Link>

                <Link
                  href="/resources/marketing-kpi-dashboard"
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">KPI Dashboard Examples</h3>
                  <p className="text-sm text-gray-400">Track the metrics that matter most</p>
                </Link>
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Frequently Asked Questions</h2>

              <div className="space-y-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Are these templates really free?</h3>
                  <p className="text-gray-300">
                    Yes! All our templates are 100% free to download and use. No email required, no hidden fees. You can also generate custom templates with our AI tool on the free plan.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">What software do I need to use these templates?</h3>
                  <p className="text-gray-300">
                    The templates work with Microsoft Office (PowerPoint, Word, Excel), Google Workspace (Slides, Docs, Sheets), and Apple iWork (Keynote, Pages, Numbers). Most features are compatible across all platforms.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Can I use these templates for client work?</h3>
                  <p className="text-gray-300">
                    Absolutely! You can use these templates for your own business or for client projects. Customize them with your branding and present them as your own work.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">How often are the templates updated?</h3>
                  <p className="text-gray-300">
                    We update our templates quarterly to reflect the latest marketing best practices and trends. When you generate a template with our AI tool, you always get the most current version.
                  </p>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <div className="my-12 bg-gradient-to-r from-[#F59E0B]/10 to-[#D97706]/10 border border-[#F59E0B]/30 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">Ready to Create Your Marketing Strategy?</h3>
              <p className="text-gray-300 mb-6">
                Generate a custom template with AI or download our pre-made templates
              </p>
              <Link
                href="/strategy"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-colors font-bold text-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Generate Custom Template with AI
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-400 mt-4">
                No credit card required • Instant download • Fully customizable
              </p>
            </div>
          </div>
        </article>
      </main>

    </div>
  );
}
