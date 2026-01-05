import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import {
  BarChart3,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Eye,
  MousePointerClick,
  Mail
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Marketing KPI Dashboard Examples - Track the Metrics That Matter | Aureon One',
  description: 'Free marketing KPI dashboard templates and examples. Learn which metrics to track for SEO, paid ads, social media, email, and content marketing. Download free templates.',
  keywords: 'marketing KPI dashboard, marketing metrics, KPI examples, marketing analytics dashboard, marketing performance metrics, digital marketing KPIs',
  alternates: {
    canonical: '/resources/marketing-kpi-dashboard',
  },
  openGraph: {
    title: 'Marketing KPI Dashboard Examples - Track the Metrics That Matter',
    description: 'Free marketing KPI dashboard templates and examples. Learn which metrics to track for SEO, paid ads, social media, email, and content marketing.',
    type: 'article',
    url: 'https://mediaplanpro.com/resources/marketing-kpi-dashboard',
  },
};

// Article Schema for SEO
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Marketing KPI Dashboard Examples - Essential Metrics for Every Channel',
  description: 'Comprehensive guide to marketing KPIs, dashboard design, and performance tracking across all marketing channels.',
  image: 'https://www.mediaplanpro.com/images/resources/marketing-kpi-dashboard.jpg',
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
    '@id': 'https://www.aureonone.in/resources/marketing-kpi-dashboard',
  },
};

export default function MarketingKPIDashboardPage() {
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
              { name: 'Marketing KPI Dashboard', url: '/resources/marketing-kpi-dashboard' }
            ]}
          />
        </div>

        {/* Hero Section */}
        <article className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full mb-6">
              <BarChart3 className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-sm font-semibold text-[#F59E0B]">Performance Tracking</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Marketing KPI Dashboard Examples: Track What Matters
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Learn which marketing KPIs to track, how to build effective dashboards, and get free templates for monitoring your marketing performance across all channels.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-colors font-bold text-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Get Your KPI Dashboard Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free templates included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>All channels covered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Easy to customize</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">What Are Marketing KPIs?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Marketing KPIs (Key Performance Indicators) are measurable values that demonstrate how effectively your marketing efforts are achieving business objectives. Unlike vanity metrics that look good but don't drive business results, KPIs are directly tied to revenue, growth, and strategic goals.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                A well-designed marketing KPI dashboard helps you:
              </p>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span><strong>Make data-driven decisions</strong> based on real performance data, not gut feelings</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span><strong>Identify what's working</strong> and double down on successful tactics</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span><strong>Spot problems early</strong> before they become major issues</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span><strong>Prove ROI</strong> to stakeholders and justify marketing spend</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span><strong>Optimize campaigns</strong> in real-time for better results</span>
                </li>
              </ul>
            </section>

            {/* Essential KPIs by Funnel Stage */}
            <section className="mb-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-white">Essential KPIs by Funnel Stage</h2>
              <p className="text-gray-300 mb-6">
                Different funnel stages require different metrics. Here's what to track at each stage:
              </p>

              <div className="space-y-6">
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <Eye className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Awareness Stage KPIs</h3>
                  </div>
                  <p className="text-gray-300 mb-4 text-sm">
                    Track how many people are discovering your brand:
                  </p>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• <strong>Website Traffic:</strong> Total visits, unique visitors, traffic sources</li>
                    <li>• <strong>Impressions:</strong> How many times your content/ads were displayed</li>
                    <li>• <strong>Reach:</strong> Number of unique people who saw your content</li>
                    <li>• <strong>Brand Search Volume:</strong> People searching for your brand name</li>
                    <li>• <strong>Social Media Followers:</strong> Audience growth across platforms</li>
                    <li>• <strong>Share of Voice:</strong> Your brand mentions vs. competitors</li>
                  </ul>
                </div>

                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <MousePointerClick className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Consideration Stage KPIs</h3>
                  </div>
                  <p className="text-gray-300 mb-4 text-sm">
                    Measure engagement and interest:
                  </p>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• <strong>Engagement Rate:</strong> Likes, comments, shares, clicks</li>
                    <li>• <strong>Time on Site:</strong> How long visitors spend on your website</li>
                    <li>• <strong>Pages per Session:</strong> Number of pages viewed per visit</li>
                    <li>• <strong>Bounce Rate:</strong> Percentage of single-page sessions</li>
                    <li>• <strong>Content Downloads:</strong> Ebooks, whitepapers, templates downloaded</li>
                    <li>• <strong>Video Completion Rate:</strong> Percentage who watch your videos fully</li>
                  </ul>
                </div>

                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <Mail className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Conversion Stage KPIs</h3>
                  </div>
                  <p className="text-gray-300 mb-4 text-sm">
                    Track lead generation and sales:
                  </p>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• <strong>Conversion Rate:</strong> Percentage of visitors who convert</li>
                    <li>• <strong>Cost Per Lead (CPL):</strong> How much you spend to acquire each lead</li>
                    <li>• <strong>Lead Quality Score:</strong> MQLs vs. SQLs ratio</li>
                    <li>• <strong>Cost Per Acquisition (CPA):</strong> Cost to acquire a customer</li>
                    <li>• <strong>Sales Qualified Leads (SQLs):</strong> Leads ready for sales team</li>
                    <li>• <strong>Revenue Attribution:</strong> Revenue generated by each channel</li>
                  </ul>
                </div>

                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Retention Stage KPIs</h3>
                  </div>
                  <p className="text-gray-300 mb-4 text-sm">
                    Measure customer loyalty and lifetime value:
                  </p>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• <strong>Customer Lifetime Value (CLV):</strong> Total revenue from a customer</li>
                    <li>• <strong>Churn Rate:</strong> Percentage of customers who stop buying</li>
                    <li>• <strong>Repeat Purchase Rate:</strong> Customers who buy again</li>
                    <li>• <strong>Net Promoter Score (NPS):</strong> Customer satisfaction and loyalty</li>
                    <li>• <strong>Customer Retention Rate:</strong> Percentage of customers retained</li>
                    <li>• <strong>Referral Rate:</strong> Customers who refer others</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Channel-Specific KPIs */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Channel-Specific KPIs to Track</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Each marketing channel has unique metrics that matter most. Here's what to track for each:
              </p>

              <div className="space-y-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 text-white">SEO & Organic Search KPIs</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• <strong>Organic Traffic:</strong> Visitors from search engines</li>
                    <li>• <strong>Keyword Rankings:</strong> Position for target keywords</li>
                    <li>• <strong>Domain Authority:</strong> Overall site authority score</li>
                    <li>• <strong>Backlinks:</strong> Number and quality of inbound links</li>
                    <li>• <strong>Click-Through Rate (CTR):</strong> Clicks vs. impressions in search results</li>
                    <li>• <strong>Pages Indexed:</strong> Number of pages in search engine index</li>
                  </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 text-white">Paid Advertising KPIs (Google Ads, Facebook Ads)</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• <strong>Click-Through Rate (CTR):</strong> Percentage of people who click your ads</li>
                    <li>• <strong>Cost Per Click (CPC):</strong> Average cost for each click</li>
                    <li>• <strong>Conversion Rate:</strong> Percentage of clicks that convert</li>
                    <li>• <strong>Cost Per Conversion:</strong> How much you spend per conversion</li>
                    <li>• <strong>Return on Ad Spend (ROAS):</strong> Revenue generated per dollar spent</li>
                    <li>• <strong>Quality Score:</strong> Google's rating of ad relevance and quality</li>
                  </ul>
                  <p className="text-gray-400 text-sm mt-3">
                    Use our <Link href="/tools/advertising/roi-calculator-enhanced" className="text-[#F59E0B] hover:underline">ROI Calculator</Link> to project your paid advertising returns.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 text-white">Social Media Marketing KPIs</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• <strong>Follower Growth Rate:</strong> New followers over time</li>
                    <li>• <strong>Engagement Rate:</strong> Likes, comments, shares per post</li>
                    <li>• <strong>Reach & Impressions:</strong> How many people see your content</li>
                    <li>• <strong>Click-Through Rate:</strong> Clicks on links in posts</li>
                    <li>• <strong>Social Share of Voice:</strong> Your mentions vs. competitors</li>
                    <li>• <strong>Sentiment Analysis:</strong> Positive vs. negative mentions</li>
                  </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 text-white">Email Marketing KPIs</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• <strong>Open Rate:</strong> Percentage of recipients who open emails</li>
                    <li>• <strong>Click-Through Rate:</strong> Percentage who click links in emails</li>
                    <li>• <strong>Conversion Rate:</strong> Email recipients who complete desired action</li>
                    <li>• <strong>Bounce Rate:</strong> Emails that couldn't be delivered</li>
                    <li>• <strong>Unsubscribe Rate:</strong> People who opt out of your list</li>
                    <li>• <strong>List Growth Rate:</strong> New subscribers vs. unsubscribes</li>
                  </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 text-white">Content Marketing KPIs</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• <strong>Page Views:</strong> Total views of your content</li>
                    <li>• <strong>Time on Page:</strong> How long people read your content</li>
                    <li>• <strong>Social Shares:</strong> How often content is shared</li>
                    <li>• <strong>Backlinks Generated:</strong> Links earned from content</li>
                    <li>• <strong>Lead Generation:</strong> Leads captured from content</li>
                    <li>• <strong>Content ROI:</strong> Revenue attributed to content efforts</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How to Build Dashboard */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">How to Build an Effective Marketing KPI Dashboard</h2>

              <div className="space-y-6">
                <div className="flex gap-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xl">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Define Your Business Goals</h3>
                    <p className="text-gray-300">
                      Start with what you want to achieve. Are you focused on brand awareness, lead generation, sales, or customer retention? Your goals determine which KPIs matter most.
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
                    <h3 className="text-xl font-bold mb-3 text-white">Choose 5-10 Primary KPIs</h3>
                    <p className="text-gray-300">
                      Don't track everything—focus on the metrics that directly impact your goals. Too many KPIs create noise and make it hard to spot trends. Quality over quantity.
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
                    <h3 className="text-xl font-bold mb-3 text-white">Set Benchmarks & Targets</h3>
                    <p className="text-gray-300">
                      Establish baseline performance and set realistic targets. Use industry benchmarks as a starting point, then adjust based on your historical data and growth goals.
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
                    <h3 className="text-xl font-bold mb-3 text-white">Choose Your Dashboard Tool</h3>
                    <p className="text-gray-300 mb-3">
                      Select a tool that integrates with your data sources and provides real-time updates:
                    </p>
                    <ul className="space-y-1 text-gray-400 text-sm">
                      <li>• <strong>Google Data Studio:</strong> Free, integrates with Google products</li>
                      <li>• <strong>Tableau:</strong> Advanced analytics and visualizations</li>
                      <li>• <strong>Power BI:</strong> Microsoft's business intelligence tool</li>
                      <li>• <strong>Klipfolio:</strong> Marketing-specific dashboard builder</li>
                      <li>• <strong>Excel/Google Sheets:</strong> Simple, customizable, manual updates</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xl">
                      5
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Design for Clarity</h3>
                    <p className="text-gray-300">
                      Use clear visualizations (line charts for trends, bar charts for comparisons, gauges for progress). Group related metrics together. Use color coding to highlight performance (green for good, red for needs attention).
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xl">
                      6
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Review & Optimize Regularly</h3>
                    <p className="text-gray-300">
                      Schedule weekly or monthly dashboard reviews. Look for trends, anomalies, and opportunities. Adjust your KPIs as your business evolves and goals change.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Tools */}
            <section className="mb-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">Related Marketing Tools</h2>
              <p className="text-gray-300 mb-6">
                Complement your KPI dashboard with these free tools:
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  href="/tools/advertising/roi-calculator-enhanced"
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">ROI Calculator</h3>
                  <p className="text-sm text-gray-400">Calculate expected ROI for campaigns</p>
                </Link>

                <Link
                  href="/tools/advertising/budget-allocator-enhanced"
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">Budget Allocator</h3>
                  <p className="text-sm text-gray-400">Optimize budget across channels</p>
                </Link>

                <Link
                  href="/resources/ai-marketing-plan-generator"
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">AI Marketing Plan</h3>
                  <p className="text-sm text-gray-400">Generate complete marketing plans with AI</p>
                </Link>
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Frequently Asked Questions</h2>

              <div className="space-y-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">How many KPIs should I track?</h3>
                  <p className="text-gray-300">
                    Focus on 5-10 primary KPIs that directly impact your business goals. You can track more secondary metrics, but your dashboard should highlight the most important ones. Too many KPIs create analysis paralysis.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">What's the difference between a KPI and a metric?</h3>
                  <p className="text-gray-300">
                    All KPIs are metrics, but not all metrics are KPIs. A metric is any measurable value (like page views). A KPI is a metric that's critical to achieving your business objectives (like conversion rate or CAC).
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">How often should I check my KPI dashboard?</h3>
                  <p className="text-gray-300">
                    It depends on your business and channels. For paid advertising, daily checks are common. For SEO and content marketing, weekly or monthly reviews are sufficient. Set a regular cadence that allows you to spot trends without obsessing over daily fluctuations.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">What tools do I need to build a KPI dashboard?</h3>
                  <p className="text-gray-300">
                    You can start with free tools like Google Data Studio or Excel/Google Sheets. As you scale, consider paid tools like Tableau, Power BI, or Klipfolio for more advanced features and integrations.
                  </p>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <div className="my-12 bg-gradient-to-r from-[#F59E0B]/10 to-[#D97706]/10 border border-[#F59E0B]/30 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">Build Your Custom KPI Dashboard</h3>
              <p className="text-gray-300 mb-6">
                Get a personalized KPI dashboard based on your business goals and channels
              </p>
              <Link
                href="/strategy"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-colors font-bold text-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Create Your Dashboard Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-400 mt-4">
                No credit card required • Instant setup • Fully customizable
              </p>
            </div>
          </div>
        </article>
      </main>

    </div>
  );
}
