import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import {
  BarChart3,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  DollarSign,
  Activity
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Marketing Mix Modeling for Small Businesses - Optimize Your Marketing Budget | Aureon One',
  description: 'Learn how small businesses can use marketing mix modeling (MMM) to optimize budget allocation, measure channel effectiveness, and maximize ROI. Simplified guide with free tools.',
  keywords: 'marketing mix modeling, MMM for small business, marketing budget optimization, channel attribution, marketing ROI, budget allocation model',
  alternates: {
    canonical: '/resources/marketing-mix-modeling',
  },
  openGraph: {
    title: 'Marketing Mix Modeling for Small Businesses - Optimize Your Marketing Budget',
    description: 'Learn how small businesses can use marketing mix modeling to optimize budget allocation, measure channel effectiveness, and maximize ROI.',
    type: 'article',
    url: 'https://aureonone.in/resources/marketing-mix-modeling',
  },
};

// Article Schema for SEO
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Marketing Mix Modeling for Small Businesses - Complete Guide',
  description: 'Comprehensive guide to marketing mix modeling for small businesses, including simplified methodologies, tools, and best practices.',
  image: 'https://www.aureonone.in/images/resources/marketing-mix-modeling.jpg',
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
    '@id': 'https://www.aureonone.in/resources/marketing-mix-modeling',
  },
};

export default function MarketingMixModelingPage() {
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
              { name: 'Marketing Mix Modeling', url: '/resources/marketing-mix-modeling' }
            ]}
          />
        </div>

        {/* Hero Section */}
        <article className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full mb-6">
              <BarChart3 className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-sm font-semibold text-[#F59E0B]">Budget Optimization</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Marketing Mix Modeling for Small Businesses
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover how to optimize your marketing budget using marketing mix modeling (MMM). Learn which channels drive the most revenue and how to allocate your budget for maximum ROI—without enterprise-level complexity or cost.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-colors font-bold text-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Get Your Budget Model Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No data science degree required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Works with limited data</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free tools included</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">What is Marketing Mix Modeling (MMM)?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Marketing Mix Modeling (MMM) is a statistical analysis technique that helps you understand which marketing channels and tactics drive the most revenue. It answers critical questions like:
              </p>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span>Which marketing channels generate the highest ROI?</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span>How should I allocate my budget across channels for maximum impact?</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span>What happens to sales if I increase or decrease spend in a specific channel?</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span>Are there diminishing returns in any of my marketing channels?</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <span>How do external factors (seasonality, competitors, economy) affect my marketing performance?</span>
                </li>
              </ul>

              <p className="text-gray-300 leading-relaxed mb-4">
                Traditionally, MMM was only accessible to large enterprises with big budgets and data science teams. But modern tools and simplified methodologies make it possible for small businesses to benefit from marketing mix modeling without the complexity or cost.
              </p>
            </section>

            {/* Why It Matters */}
            <section className="mb-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-white">Why Small Businesses Need Marketing Mix Modeling</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <DollarSign className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Stop Wasting Budget</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Most small businesses waste 20-30% of their marketing budget on underperforming channels. MMM identifies what's working and what's not, so you can reallocate budget to high-ROI channels.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Increase ROI by 30-50%</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    By optimizing budget allocation based on data, businesses typically see 30-50% improvement in marketing ROI within 3-6 months. Same budget, better results.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <Target className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Make Data-Driven Decisions</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Stop guessing which channels to invest in. MMM provides clear, quantitative evidence of what drives revenue, removing emotion and bias from budget decisions.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <Activity className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Understand True Attribution</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Last-click attribution is misleading. MMM shows the full customer journey and how different channels work together to drive conversions.
                  </p>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">How Marketing Mix Modeling Works (Simplified)</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Don't worry—you don't need to be a data scientist. Here's a simplified approach to MMM for small businesses:
              </p>

              <div className="space-y-6">
                <div className="flex gap-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xl">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Collect Your Data</h3>
                    <p className="text-gray-300 mb-3">
                      Gather at least 6-12 months of data on:
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>• <strong>Revenue/Sales:</strong> Weekly or monthly revenue data</li>
                      <li>• <strong>Marketing Spend:</strong> How much you spent on each channel (Google Ads, Facebook, SEO, email, etc.)</li>
                      <li>• <strong>Channel Metrics:</strong> Impressions, clicks, conversions for each channel</li>
                      <li>• <strong>External Factors:</strong> Seasonality, promotions, competitor activity (if available)</li>
                    </ul>
                    <p className="text-gray-300 mt-3 text-sm">
                      More data = better insights, but you can start with 6 months.
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
                    <h3 className="text-xl font-bold mb-3 text-white">Analyze Correlations</h3>
                    <p className="text-gray-300 mb-3">
                      Look for relationships between marketing spend and revenue:
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>• When you increased Google Ads spend, did revenue go up?</li>
                      <li>• Which channels show the strongest correlation with sales?</li>
                      <li>• Are there time lags (e.g., SEO takes 3 months to impact revenue)?</li>
                    </ul>
                    <p className="text-gray-300 mt-3 text-sm">
                      Use tools like Excel, Google Sheets, or our <Link href="/tools/advertising/roi-calculator-enhanced" className="text-[#F59E0B] hover:underline">ROI Calculator</Link> for basic analysis.
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
                    <h3 className="text-xl font-bold mb-3 text-white">Build a Simple Model</h3>
                    <p className="text-gray-300 mb-3">
                      Create a regression model that predicts revenue based on marketing spend:
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>• <strong>Revenue = Base Sales + (Channel 1 Spend × ROI) + (Channel 2 Spend × ROI) + ...</strong></li>
                      <li>• Calculate the coefficient (ROI multiplier) for each channel</li>
                      <li>• Identify which channels have the highest coefficients (best ROI)</li>
                    </ul>
                    <p className="text-gray-300 mt-3 text-sm">
                      Tools like Google Sheets, Excel (with regression add-ins), or R/Python can do this.
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
                    <h3 className="text-xl font-bold mb-3 text-white">Optimize Budget Allocation</h3>
                    <p className="text-gray-300 mb-3">
                      Use your model to simulate different budget scenarios:
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>• What if I shift $1,000 from Facebook to Google Ads?</li>
                      <li>• What if I double my SEO investment?</li>
                      <li>• What's the optimal budget split across all channels?</li>
                    </ul>
                    <p className="text-gray-300 mt-3 text-sm">
                      Use our <Link href="/tools/advertising/budget-allocator-enhanced" className="text-[#F59E0B] hover:underline">Budget Allocator tool</Link> to test different scenarios.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xl">
                      5
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Test & Refine</h3>
                    <p className="text-gray-300 mb-3">
                      Implement your optimized budget allocation and track results:
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>• Run the new budget allocation for 1-3 months</li>
                      <li>• Compare actual results to model predictions</li>
                      <li>• Refine your model based on new data</li>
                      <li>• Continuously optimize as you gather more insights</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Common Challenges */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Common Challenges & Solutions for Small Businesses</h2>

              <div className="space-y-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Challenge: "I don't have enough data"</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    <strong>Solution:</strong> You can start with as little as 6 months of data. While more data improves accuracy, even limited data can reveal valuable insights about channel performance. Focus on directional insights rather than perfect precision.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Challenge: "My data is messy and inconsistent"</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    <strong>Solution:</strong> Start by standardizing your data collection going forward. Use tools like Google Analytics, Facebook Ads Manager, and your CRM to automatically track metrics. For historical data, do your best to clean and normalize it—imperfect data is better than no data.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Challenge: "I don't know statistics or data science"</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    <strong>Solution:</strong> Use simplified tools and templates. Aureon One's AI can build basic marketing mix models for you without requiring statistical knowledge. Start simple and get more sophisticated as you learn.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Challenge: "My business has too many variables"</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    <strong>Solution:</strong> Start by modeling your top 3-5 marketing channels. You don't need to include every variable—focus on the ones that drive the most revenue. Add complexity gradually as you refine your model.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Challenge: "Results vary too much week-to-week"</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    <strong>Solution:</strong> Use monthly data instead of weekly to smooth out short-term fluctuations. MMM works best with aggregated data that shows trends over time rather than daily volatility.
                  </p>
                </div>
              </div>
            </section>

            {/* Key Metrics */}
            <section className="mb-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-white">Key Metrics to Track in Your Marketing Mix Model</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-[#F59E0B]" />
                    Return on Ad Spend (ROAS)
                  </h3>
                  <p className="text-gray-300 ml-9 mb-2">
                    <strong>Formula:</strong> Revenue Generated ÷ Ad Spend
                  </p>
                  <p className="text-gray-300 ml-9 text-sm">
                    Measures how much revenue each dollar of ad spend generates. A ROAS of 3:1 means you earn $3 for every $1 spent. Track this for each channel to identify your best performers.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <Target className="w-6 h-6 text-[#F59E0B]" />
                    Customer Acquisition Cost (CAC)
                  </h3>
                  <p className="text-gray-300 ml-9 mb-2">
                    <strong>Formula:</strong> Total Marketing Spend ÷ New Customers Acquired
                  </p>
                  <p className="text-gray-300 ml-9 text-sm">
                    Shows how much it costs to acquire a new customer through each channel. Lower CAC = more efficient channel. Compare CAC to Customer Lifetime Value (CLV) to ensure profitability.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
                    Contribution Margin
                  </h3>
                  <p className="text-gray-300 ml-9 mb-2">
                    <strong>Formula:</strong> (Revenue - Variable Costs) ÷ Revenue
                  </p>
                  <p className="text-gray-300 ml-9 text-sm">
                    Percentage of revenue that contributes to covering fixed costs and profit. Essential for understanding true profitability of each channel, not just revenue generation.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <Activity className="w-6 h-6 text-[#F59E0B]" />
                    Channel Saturation Point
                  </h3>
                  <p className="text-gray-300 ml-9 text-sm">
                    The point at which additional spend in a channel yields diminishing returns. For example, if doubling your Google Ads budget only increases revenue by 20%, you've hit saturation. MMM helps identify these points so you can reallocate budget.
                  </p>
                </div>
              </div>
            </section>

            {/* Tools & Resources */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white">Free Tools for Marketing Mix Modeling</h2>

              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  href="/tools/advertising/budget-allocator-enhanced"
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">Budget Allocator</h3>
                  <p className="text-sm text-gray-400">Optimize budget across marketing channels</p>
                </Link>

                <Link
                  href="/tools/advertising/roi-calculator-enhanced"
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">ROI Calculator</h3>
                  <p className="text-sm text-gray-400">Calculate expected ROI for each channel</p>
                </Link>

                <Link
                  href="/resources/ai-marketing-plan-generator"
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">AI Marketing Plan</h3>
                  <p className="text-sm text-gray-400">Generate complete marketing strategies with AI</p>
                </Link>
              </div>
            </section>

            {/* Best Practices */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Best Practices for Small Business MMM</h2>

              <div className="space-y-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">✅ Start Simple, Then Add Complexity</h3>
                  <p className="text-gray-300 text-sm">
                    Begin with a basic model tracking your top 3-5 channels. As you get comfortable, add more variables like seasonality, promotions, and external factors.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">✅ Update Your Model Quarterly</h3>
                  <p className="text-gray-300 text-sm">
                    Markets change, algorithms evolve, and customer behavior shifts. Refresh your model every 3 months with new data to keep insights relevant.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">✅ Test Incrementally</h3>
                  <p className="text-gray-300 text-sm">
                    Don't overhaul your entire budget at once. Make small adjustments (10-20% shifts) based on model recommendations, measure results, then iterate.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">✅ Combine with Other Attribution Methods</h3>
                  <p className="text-gray-300 text-sm">
                    MMM is powerful but not perfect. Use it alongside last-click attribution, multi-touch attribution, and qualitative feedback for a complete picture.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">✅ Account for Time Lags</h3>
                  <p className="text-gray-300 text-sm">
                    Some channels (like SEO and content marketing) take months to show results. Build time lags into your model to avoid undervaluing long-term strategies.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Frequently Asked Questions</h2>

              <div className="space-y-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">How much data do I need to start?</h3>
                  <p className="text-gray-300">
                    Ideally 12-24 months, but you can start with as little as 6 months. The more data you have, the more accurate your model will be. Focus on consistent data collection going forward.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Is MMM better than multi-touch attribution?</h3>
                  <p className="text-gray-300">
                    They serve different purposes. Multi-touch attribution tracks individual customer journeys, while MMM looks at aggregate channel performance. Use both for a complete view—MMM for budget planning, attribution for campaign optimization.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Can I do this without hiring a data scientist?</h3>
                  <p className="text-gray-300">
                    Yes! Modern tools like Aureon One make MMM accessible to non-technical users. Start with simplified models and free tools, then consider hiring expertise as you scale.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">How often should I update my model?</h3>
                  <p className="text-gray-300">
                    Quarterly is ideal for most small businesses. This gives you enough new data to refine the model while staying responsive to market changes. High-growth businesses may want to update monthly.
                  </p>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <div className="my-12 bg-gradient-to-r from-[#F59E0B]/10 to-[#D97706]/10 border border-[#F59E0B]/30 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">Get Your Marketing Mix Model</h3>
              <p className="text-gray-300 mb-6">
                Let AI analyze your marketing data and recommend optimal budget allocation
              </p>
              <Link
                href="/strategy"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-colors font-bold text-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Create Your Model Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-400 mt-4">
                No credit card required • Works with limited data • Free tools included
              </p>
            </div>
          </div>
        </article>
      </main>

    </div>
  );
}
