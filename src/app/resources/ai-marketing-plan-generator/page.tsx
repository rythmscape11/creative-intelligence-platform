import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import {
  Sparkles,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Download,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Marketing Plan Generator - Create Complete Marketing Strategies in Minutes | Aureon One',
  description: 'Generate comprehensive, data-driven marketing plans instantly with AI. Get full-funnel strategies, budget allocation, KPIs, and export to PPT/Word/Excel. Free to start.',
  keywords: 'AI marketing plan generator, marketing strategy tool, automated marketing planning, AI marketing strategy, marketing plan template, digital marketing planner',
  alternates: {
    canonical: '/resources/ai-marketing-plan-generator',
  },
  openGraph: {
    title: 'AI Marketing Plan Generator - Create Complete Marketing Strategies in Minutes',
    description: 'Generate comprehensive, data-driven marketing plans instantly with AI. Get full-funnel strategies, budget allocation, KPIs, and export to PPT/Word/Excel.',
    type: 'article',
    url: 'https://aureonone.in/resources/ai-marketing-plan-generator',
  },
};

// Article Schema for SEO
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'AI Marketing Plan Generator - Create Complete Marketing Strategies in Minutes',
  description: 'Comprehensive guide to using AI for marketing plan generation, including benefits, features, and best practices.',
  image: 'https://www.aureonone.in/images/resources/ai-marketing-plan-generator.jpg',
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
    '@id': 'https://www.aureonone.in/resources/ai-marketing-plan-generator',
  },
};

export default function AIMarketingPlanGeneratorPage() {
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
              { name: 'AI Marketing Plan Generator', url: '/resources/ai-marketing-plan-generator' }
            ]}
          />
        </div>

        {/* Hero Section */}
        <article className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-sm font-semibold text-[#F59E0B]">AI-Powered Marketing Planning</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              AI Marketing Plan Generator: Create Complete Strategies in Minutes
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Transform your marketing planning process with AI. Generate comprehensive, data-driven marketing plans that would normally take days to create—in just minutes.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-colors font-bold text-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Try AI Plan Generator Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-[#F59E0B] text-[#F59E0B] rounded-lg hover:bg-[#F59E0B]/10 transition-colors font-bold text-lg"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>5,000+ marketers trust us</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Export to PPT/Word/Excel</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">What is an AI Marketing Plan Generator?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                An AI marketing plan generator is a sophisticated tool that uses artificial intelligence and machine learning to create comprehensive marketing strategies automatically. Instead of spending days or weeks manually researching, planning, and documenting your marketing approach, an AI-powered tool can generate a complete, customized marketing plan in minutes.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Aureon One's AI Marketing Plan Generator goes beyond simple templates. It analyzes your business goals, target audience, budget, and competitive landscape to create a data-driven, full-funnel marketing strategy that includes:
              </p>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span><strong>Target Audience Analysis</strong> - Detailed buyer personas and segmentation strategies</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span><strong>Channel Strategy</strong> - Recommended marketing channels based on your audience and goals</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span><strong>Budget Allocation</strong> - Smart budget distribution across channels and campaigns</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span><strong>KPIs & Metrics</strong> - Measurable goals and success metrics for each funnel stage</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span><strong>Content Strategy</strong> - Content themes, formats, and distribution plans</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span><strong>Timeline & Milestones</strong> - Phased implementation roadmap with key milestones</span>
                </li>
              </ul>
            </section>

            {/* Why Use AI for Marketing Planning */}
            <section className="mb-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-white">Why Use AI for Marketing Planning?</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <Clock className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Save 95% of Planning Time</h3>
                  </div>
                  <p className="text-gray-300">
                    Traditional marketing planning takes 2-4 weeks. AI generates comprehensive plans in 5-10 minutes, freeing you to focus on execution.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <Target className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Data-Driven Decisions</h3>
                  </div>
                  <p className="text-gray-300">
                    AI analyzes thousands of successful marketing campaigns to recommend strategies proven to work for businesses like yours.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Eliminate Guesswork</h3>
                  </div>
                  <p className="text-gray-300">
                    No more wondering which channels to prioritize or how to allocate budget. AI provides clear, actionable recommendations.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <Users className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Professional Quality</h3>
                  </div>
                  <p className="text-gray-300">
                    Get agency-level marketing plans without the agency price tag. Perfect for startups, SMBs, and solo marketers.
                  </p>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">How the AI Marketing Plan Generator Works</h2>
              <p className="text-gray-300 leading-relaxed mb-8">
                Creating a comprehensive marketing plan with Aureon One is incredibly simple. Our AI guides you through a streamlined process that takes just 5-10 minutes:
              </p>

              <div className="space-y-6">
                <div className="flex gap-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xl">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Answer 5 Simple Questions</h3>
                    <p className="text-gray-300 mb-3">
                      Tell us about your business, goals, target audience, budget, and timeline. Our AI uses this information to understand your unique situation.
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>• What are your business goals?</li>
                      <li>• Who is your target audience?</li>
                      <li>• What's your marketing budget?</li>
                      <li>• What's your timeline?</li>
                      <li>• What challenges are you facing?</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xl">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">AI Builds Your Custom Plan</h3>
                    <p className="text-gray-300 mb-3">
                      Our AI analyzes your inputs and generates a comprehensive marketing plan tailored to your specific needs. This includes:
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>• Full-funnel strategy (Awareness → Conversion → Retention)</li>
                      <li>• Channel recommendations with budget allocation</li>
                      <li>• Detailed buyer personas and targeting strategies</li>
                      <li>• KPIs and success metrics for each stage</li>
                      <li>• Content strategy and campaign ideas</li>
                      <li>• Implementation timeline with milestones</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xl">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Export & Share Instantly</h3>
                    <p className="text-gray-300 mb-3">
                      Download your marketing plan in your preferred format and share it with your team or clients immediately:
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>• <strong>PowerPoint (PPTX)</strong> - Professional presentation format</li>
                      <li>• <strong>Word (DOCX)</strong> - Editable document format</li>
                      <li>• <strong>Excel (XLSX)</strong> - Spreadsheet with budget breakdowns</li>
                      <li>• <strong>PDF</strong> - Print-ready format for proposals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Key Features */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Key Features of Aureon One's AI Marketing Plan Generator</h2>

              <div className="space-y-6">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <Zap className="w-6 h-6 text-[#F59E0B]" />
                    Full-Funnel Strategy
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Unlike basic marketing plan templates, our AI creates a complete funnel strategy covering every stage of the customer journey:
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• <strong>Awareness Stage:</strong> Brand building, content marketing, SEO, social media</li>
                    <li>• <strong>Consideration Stage:</strong> Lead nurturing, email campaigns, retargeting</li>
                    <li>• <strong>Conversion Stage:</strong> Landing pages, CTAs, conversion optimization</li>
                    <li>• <strong>Retention Stage:</strong> Customer loyalty, upselling, referral programs</li>
                  </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <Target className="w-6 h-6 text-[#F59E0B]" />
                    Smart Budget Allocation
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Our AI automatically distributes your budget across channels based on your goals, industry benchmarks, and expected ROI:
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Channel-specific budget recommendations</li>
                    <li>• Expected ROI and CAC (Customer Acquisition Cost) estimates</li>
                    <li>• Budget pacing and monthly allocation</li>
                    <li>• Contingency planning for budget adjustments</li>
                  </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-[#F59E0B]" />
                    Measurable KPIs & Metrics
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Every marketing plan includes specific, measurable KPIs for tracking success:
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Traffic and engagement metrics (visits, page views, time on site)</li>
                    <li>• Lead generation metrics (MQLs, SQLs, conversion rates)</li>
                    <li>• Revenue metrics (CAC, LTV, ROI, ROAS)</li>
                    <li>• Channel-specific KPIs (CTR, CPC, engagement rate)</li>
                  </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <Download className="w-6 h-6 text-[#F59E0B]" />
                    Professional Export Formats
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Export your marketing plan in multiple professional formats, ready to present to stakeholders:
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• <strong>PowerPoint:</strong> Beautifully designed slides with charts and visuals</li>
                    <li>• <strong>Word:</strong> Detailed document with executive summary and appendices</li>
                    <li>• <strong>Excel:</strong> Budget spreadsheets with formulas and projections</li>
                    <li>• <strong>PDF:</strong> Print-ready format for proposals and reports</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Who Should Use This */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Who Should Use an AI Marketing Plan Generator?</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Aureon One's AI Marketing Plan Generator is perfect for:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 text-white">Marketing Agencies</h3>
                  <p className="text-gray-300 text-sm">
                    Create professional marketing plans for clients in minutes instead of days. Impress clients with data-driven strategies and beautiful presentations.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 text-white">Startups & SMBs</h3>
                  <p className="text-gray-300 text-sm">
                    Get enterprise-level marketing strategies without hiring expensive consultants. Perfect for lean teams that need to move fast.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 text-white">Solo Marketers</h3>
                  <p className="text-gray-300 text-sm">
                    Stop reinventing the wheel. Get proven marketing frameworks and strategies that you can customize and execute immediately.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 text-white">Consultants & Freelancers</h3>
                  <p className="text-gray-300 text-sm">
                    Deliver more value to clients faster. Use AI to handle the heavy lifting while you focus on strategy and execution.
                  </p>
                </div>
              </div>
            </section>

            {/* Related Tools */}
            <section className="mb-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">Related Free Marketing Tools</h2>
              <p className="text-gray-300 mb-6">
                Enhance your marketing planning with these free tools from Aureon One:
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  href="/tools/advertising/budget-allocator-enhanced"
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">Budget Allocator</h3>
                  <p className="text-sm text-gray-400">Optimize your marketing budget across channels</p>
                </Link>

                <Link
                  href="/tools/advertising/roi-calculator-enhanced"
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">ROI Calculator</h3>
                  <p className="text-sm text-gray-400">Calculate expected ROI for your campaigns</p>
                </Link>

                <Link
                  href="/tools/content/content-calendar-generator-enhanced"
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">Content Calendar</h3>
                  <p className="text-sm text-gray-400">Plan your content strategy for the year</p>
                </Link>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Frequently Asked Questions</h2>

              <div className="space-y-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">How long does it take to generate a marketing plan?</h3>
                  <p className="text-gray-300">
                    The AI generates a comprehensive marketing plan in 5-10 minutes. You'll answer 5 simple questions about your business, and the AI does the rest.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Can I customize the generated plan?</h3>
                  <p className="text-gray-300">
                    Yes! The AI-generated plan is fully customizable. You can edit any section, adjust budgets, modify timelines, and add your own insights before exporting.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">What export formats are available?</h3>
                  <p className="text-gray-300">
                    You can export your marketing plan in PowerPoint (PPTX), Word (DOCX), Excel (XLSX), and PDF formats. Pro users get access to all formats.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Is there a free version?</h3>
                  <p className="text-gray-300">
                    Yes! The free plan allows you to create 1 marketing plan per month with PDF export. Upgrade to Pro for unlimited plans and premium export formats (PPTX, DOCX, XLSX).
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">How accurate are the AI recommendations?</h3>
                  <p className="text-gray-300">
                    Our AI is trained on thousands of successful marketing campaigns and industry benchmarks. While no tool can guarantee results, our recommendations are based on proven strategies and data-driven insights.
                  </p>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <div className="my-12 bg-gradient-to-r from-[#F59E0B]/10 to-[#D97706]/10 border border-[#F59E0B]/30 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">Ready to Create Your AI-Powered Marketing Plan?</h3>
              <p className="text-gray-300 mb-6">
                Join 5,000+ marketers who've transformed their planning process with Aureon One
              </p>
              <Link
                href="/strategy"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-colors font-bold text-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Start Free - No Credit Card Required
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-400 mt-4">
                No credit card required • 5-minute setup • Export to PPT/Word/Excel
              </p>
            </div>
          </div>
        </article>
      </main>

    </div>
  );
}
