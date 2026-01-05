import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import {
  Sparkles,
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  TrendingUp,
  Target,
  Rocket
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI for Agencies: How to Automate Strategy Workflows | Aureon One',
  description: 'Learn how marketing agencies can use AI to automate strategy creation, save 20+ hours per client, and scale without hiring. Complete guide with tools and workflows.',
  keywords: 'AI for marketing agencies, marketing automation for agencies, AI strategy tools, agency workflow automation, marketing agency AI tools, scale marketing agency',
  alternates: {
    canonical: '/resources/ai-for-agencies',
  },
  openGraph: {
    title: 'AI for Agencies: How to Automate Strategy Workflows',
    description: 'Learn how marketing agencies can use AI to automate strategy creation, save 20+ hours per client, and scale without hiring.',
    type: 'article',
    url: 'https://aureonone.in/resources/ai-for-agencies',
  },
};

// HowTo Schema for SEO
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Automate Marketing Strategy Workflows with AI',
  description: 'Step-by-step guide for marketing agencies to implement AI automation in their strategy workflows.',
  image: 'https://www.aureonone.in/images/resources/ai-for-agencies.jpg',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Audit Current Workflows',
      text: 'Identify repetitive tasks in your strategy creation process that can be automated with AI.',
    },
    {
      '@type': 'HowToStep',
      name: 'Choose AI Tools',
      text: 'Select AI tools that integrate with your existing tech stack and address your specific needs.',
    },
    {
      '@type': 'HowToStep',
      name: 'Create Templates',
      text: 'Build standardized templates and frameworks that AI can populate with client-specific data.',
    },
    {
      '@type': 'HowToStep',
      name: 'Train Your Team',
      text: 'Ensure your team knows how to use AI tools effectively and when to apply human expertise.',
    },
    {
      '@type': 'HowToStep',
      name: 'Implement & Iterate',
      text: 'Roll out AI automation gradually, measure results, and continuously optimize your workflows.',
    },
  ],
};

export default function AIForAgenciesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />


      <main className="py-12 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="max-w-4xl mx-auto mb-8">
          <BreadcrumbSchema
            items={[
              { name: 'Home', url: '/' },
              { name: 'Resources', url: '/resources' },
              { name: 'AI for Agencies', url: '/resources/ai-for-agencies' }
            ]}
          />
        </div>

        {/* Hero Section */}
        <article className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-sm font-semibold text-[#F59E0B]">Agency Automation Guide</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              AI for Agencies: Automate Strategy Workflows & Scale Faster
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover how marketing agencies are using AI to create client strategies in minutes instead of days, increase profit margins by 40%, and scale without hiring more strategists.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-colors font-bold text-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
              >
                <Rocket className="w-5 h-5" />
                Try AI Strategy Builder Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>200+ agencies use Aureon One</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Save 20+ hours per client</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>White-label ready</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">The Agency Scaling Problem</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Marketing agencies face a fundamental challenge: growth requires more strategists, but hiring is expensive and slow. Creating comprehensive marketing strategies for clients takes 20-40 hours per project, limiting how many clients you can serve and capping your revenue.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                AI changes this equation. By automating the repetitive, time-consuming parts of strategy creation, agencies can:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <Clock className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Save 20-30 Hours Per Client</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Reduce strategy creation time from 20-40 hours to 2-4 hours. AI handles research, data analysis, and initial strategy drafts while your team focuses on customization and client relationships.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Increase Profit Margins 30-40%</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Deliver the same quality strategies in a fraction of the time. Your hourly rate effectively doubles or triples, dramatically improving profitability without raising prices.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <Users className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Scale Without Hiring</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Serve 3-5x more clients with your existing team. AI acts as a force multiplier, allowing each strategist to handle more accounts without sacrificing quality.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <Target className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Improve Consistency</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Ensure every client gets the same high-quality, comprehensive strategy. AI eliminates variability and ensures best practices are applied consistently.
                  </p>
                </div>
              </div>
            </section>

            {/* What to Automate */}
            <section className="mb-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-white">What Agency Workflows Can Be Automated with AI?</h2>
              <p className="text-gray-300 mb-6">
                Not everything should be automated, but these workflows are perfect for AI:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#F59E0B]" />
                    1. Marketing Strategy Creation
                  </h3>
                  <p className="text-gray-300 ml-9 mb-3">
                    <strong>Time Saved: 15-25 hours per client</strong>
                  </p>
                  <p className="text-gray-300 ml-9 mb-3">
                    AI can generate comprehensive marketing strategies including target audience analysis, channel recommendations, budget allocation, KPIs, and implementation timelines. Your team reviews, customizes, and adds strategic insights.
                  </p>
                  <p className="text-gray-400 text-sm ml-9">
                    <strong>Tool:</strong> Use <Link href="/resources/ai-marketing-plan-generator" className="text-[#F59E0B] hover:underline">Aureon One's AI Marketing Plan Generator</Link> to create client strategies in minutes.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#F59E0B]" />
                    2. Competitive Analysis & Market Research
                  </h3>
                  <p className="text-gray-300 ml-9 mb-3">
                    <strong>Time Saved: 5-10 hours per client</strong>
                  </p>
                  <p className="text-gray-300 ml-9 mb-3">
                    AI tools can analyze competitors' websites, social media, ad campaigns, and content strategies. They identify gaps, opportunities, and best practices faster than manual research.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#F59E0B]" />
                    3. Buyer Persona Development
                  </h3>
                  <p className="text-gray-300 ml-9 mb-3">
                    <strong>Time Saved: 3-5 hours per client</strong>
                  </p>
                  <p className="text-gray-300 ml-9 mb-3">
                    AI analyzes customer data, industry trends, and demographic information to create detailed buyer personas with pain points, goals, behaviors, and preferred channels.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#F59E0B]" />
                    4. Content Strategy & Calendar Planning
                  </h3>
                  <p className="text-gray-300 ml-9 mb-3">
                    <strong>Time Saved: 4-8 hours per client</strong>
                  </p>
                  <p className="text-gray-300 ml-9 mb-3">
                    AI generates content themes, topics, formats, and publishing schedules based on audience interests, SEO opportunities, and seasonal trends.
                  </p>
                  <p className="text-gray-400 text-sm ml-9">
                    <strong>Tool:</strong> Try our <Link href="/tools/content/content-calendar-generator-enhanced" className="text-[#F59E0B] hover:underline">Content Calendar Generator</Link> for automated planning.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#F59E0B]" />
                    5. Budget Allocation & ROI Projections
                  </h3>
                  <p className="text-gray-300 ml-9 mb-3">
                    <strong>Time Saved: 2-4 hours per client</strong>
                  </p>
                  <p className="text-gray-300 ml-9 mb-3">
                    AI optimizes budget distribution across channels based on goals, industry benchmarks, and expected ROI. It creates detailed budget breakdowns and projections.
                  </p>
                  <p className="text-gray-400 text-sm ml-9">
                    <strong>Tool:</strong> Use our <Link href="/tools/advertising/budget-allocator-enhanced" className="text-[#F59E0B] hover:underline">Budget Allocator</Link> for smart budget optimization.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#F59E0B]" />
                    6. Reporting & Performance Analysis
                  </h3>
                  <p className="text-gray-300 ml-9 mb-3">
                    <strong>Time Saved: 3-6 hours per client per month</strong>
                  </p>
                  <p className="text-gray-300 ml-9 mb-3">
                    AI automatically pulls data from multiple platforms, identifies trends, generates insights, and creates client-ready reports with visualizations and recommendations.
                  </p>
                </div>
              </div>
            </section>

            {/* Implementation Guide */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">How to Implement AI in Your Agency (5-Step Framework)</h2>

              <div className="space-y-6">
                <div className="flex gap-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xl">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Audit Your Current Workflows</h3>
                    <p className="text-gray-300 mb-3">
                      Map out your entire strategy creation process. Identify which tasks are:
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>• <strong>Repetitive:</strong> Same process for every client (perfect for AI)</li>
                      <li>• <strong>Time-consuming:</strong> Take hours but don't require deep expertise</li>
                      <li>• <strong>Data-driven:</strong> Involve research, analysis, or calculations</li>
                      <li>• <strong>Template-based:</strong> Follow a standard framework or structure</li>
                    </ul>
                    <p className="text-gray-300 mt-3 text-sm">
                      These are your best candidates for AI automation.
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
                    <h3 className="text-xl font-bold mb-3 text-white">Choose the Right AI Tools</h3>
                    <p className="text-gray-300 mb-3">
                      Select tools that integrate with your existing tech stack and address your specific needs:
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>• <strong>Strategy Creation:</strong> Aureon One for marketing plans and strategies</li>
                      <li>• <strong>Content Writing:</strong> ChatGPT, Jasper, or Copy.ai for content drafts</li>
                      <li>• <strong>Design:</strong> Canva AI or Midjourney for visual assets</li>
                      <li>• <strong>Analytics:</strong> Google Analytics 4 with AI insights</li>
                      <li>• <strong>Reporting:</strong> Looker Studio or Tableau with AI features</li>
                    </ul>
                    <p className="text-gray-300 mt-3 text-sm">
                      Start with 1-2 tools and expand as you see results.
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
                    <h3 className="text-xl font-bold mb-3 text-white">Create Standardized Templates & Frameworks</h3>
                    <p className="text-gray-300 mb-3">
                      AI works best with structure. Develop templates for:
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>• Client intake questionnaires (what info you need from clients)</li>
                      <li>• Strategy document structure (sections, format, deliverables)</li>
                      <li>• Reporting formats (metrics to track, visualization styles)</li>
                      <li>• Presentation decks (slide layouts, branding guidelines)</li>
                    </ul>
                    <p className="text-gray-300 mt-3 text-sm">
                      Use our <Link href="/resources/marketing-strategy-template" className="text-[#F59E0B] hover:underline">free strategy templates</Link> as a starting point.
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
                    <h3 className="text-xl font-bold mb-3 text-white">Train Your Team on AI Tools</h3>
                    <p className="text-gray-300 mb-3">
                      Your team needs to understand:
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>• <strong>How to use AI tools:</strong> Hands-on training with each tool</li>
                      <li>• <strong>When to use AI:</strong> Which tasks to automate vs. do manually</li>
                      <li>• <strong>How to review AI output:</strong> What to check, edit, and customize</li>
                      <li>• <strong>Where to add human expertise:</strong> Strategic insights AI can't provide</li>
                    </ul>
                    <p className="text-gray-300 mt-3 text-sm">
                      AI augments your team's expertise—it doesn't replace it.
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
                    <h3 className="text-xl font-bold mb-3 text-white">Implement Gradually & Measure Results</h3>
                    <p className="text-gray-300 mb-3">
                      Don't try to automate everything at once:
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>• <strong>Week 1-2:</strong> Pilot AI with 1-2 clients, gather feedback</li>
                      <li>• <strong>Week 3-4:</strong> Refine process based on learnings</li>
                      <li>• <strong>Month 2:</strong> Roll out to 25% of clients</li>
                      <li>• <strong>Month 3:</strong> Scale to all clients if results are positive</li>
                    </ul>
                    <p className="text-gray-300 mt-3 text-sm">
                      Track time saved, client satisfaction, and quality metrics throughout.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section className="mb-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-white">Best Practices for AI in Agency Workflows</h2>

              <div className="space-y-4">
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">✅ DO: Use AI for First Drafts</h3>
                  <p className="text-gray-300 text-sm">
                    Let AI create the initial strategy, research, or content. Your team reviews, customizes, and adds strategic insights. This is 10x faster than starting from scratch.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">✅ DO: Maintain Quality Control</h3>
                  <p className="text-gray-300 text-sm">
                    Always have a senior strategist review AI-generated work before client delivery. AI is a tool, not a replacement for expertise.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">✅ DO: Be Transparent with Clients</h3>
                  <p className="text-gray-300 text-sm">
                    You don't need to hide that you use AI—position it as a competitive advantage. "We use AI to accelerate research and analysis, allowing our strategists to focus on what matters most: your unique business challenges."
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">❌ DON'T: Send AI Output Directly to Clients</h3>
                  <p className="text-gray-300 text-sm">
                    AI-generated content needs human review and customization. Generic strategies won't impress clients—they want insights specific to their business.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">❌ DON'T: Automate Client Relationships</h3>
                  <p className="text-gray-300 text-sm">
                    Use AI for strategy creation, not client communication. Personal relationships, strategic discussions, and consultative selling still require human touch.
                  </p>
                </div>
              </div>
            </section>

            {/* Related Resources */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white">Related Resources for Agencies</h2>

              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  href="/resources/ai-marketing-plan-generator"
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">AI Marketing Plan Generator</h3>
                  <p className="text-sm text-gray-400">Create client strategies in minutes</p>
                </Link>

                <Link
                  href="/resources/marketing-strategy-template"
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">Free Strategy Templates</h3>
                  <p className="text-sm text-gray-400">Professional PPT, Word, Excel templates</p>
                </Link>

                <Link
                  href="/resources/marketing-kpi-dashboard"
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#F59E0B] transition-colors group"
                >
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#F59E0B]">KPI Dashboard Examples</h3>
                  <p className="text-sm text-gray-400">Track client performance metrics</p>
                </Link>
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Frequently Asked Questions</h2>

              <div className="space-y-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Will clients know we're using AI?</h3>
                  <p className="text-gray-300">
                    Only if you tell them. AI-generated strategies are reviewed and customized by your team, so the final deliverable is indistinguishable from manually created work. Many agencies position AI as a competitive advantage that allows them to deliver faster and more comprehensive strategies.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">How much time can we realistically save?</h3>
                  <p className="text-gray-300">
                    Most agencies save 20-30 hours per client on strategy creation. If you currently spend 30 hours creating a marketing strategy, AI can reduce that to 4-6 hours (including review and customization time).
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Can we white-label AI-generated strategies?</h3>
                  <p className="text-gray-300">
                    Yes! Aureon One's Pro and Team plans allow you to remove our branding and add your own logo, colors, and branding to all exports. The strategies become your agency's deliverables.
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">What if AI makes mistakes?</h3>
                  <p className="text-gray-300">
                    This is why human review is essential. AI provides a strong foundation, but your strategists should always review, fact-check, and customize the output before client delivery. Think of AI as a junior strategist that needs supervision.
                  </p>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <div className="my-12 bg-gradient-to-r from-[#F59E0B]/10 to-[#D97706]/10 border border-[#F59E0B]/30 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">Start Automating Your Agency Workflows Today</h3>
              <p className="text-gray-300 mb-6">
                Join 200+ agencies using Aureon One to scale faster and increase profitability
              </p>
              <Link
                href="/strategy"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-colors font-bold text-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Try Free - No Credit Card Required
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-400 mt-4">
                Free plan available • White-label ready • 200+ agencies trust us
              </p>
            </div>
          </div>
        </article>
      </main>

    </div>
  );
}
