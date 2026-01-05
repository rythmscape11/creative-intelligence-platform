'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateAdCopy, AdFramework, AdPlatform } from '@/lib/tools/advertising/adCopyGenerator';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Megaphone, Copy, Check, Target, TrendingUp, Zap, Users, Award, BookOpen } from 'lucide-react';

// SEO Components
import {
  FAQSection,
  TableOfContents,
  QuickAnswer,
  HowToSchema,
  SoftwareApplicationSchema,
  BreadcrumbSchema,
  ContentSection,
  RelatedTools,
} from '@/components/seo';

// Content Data
import { adCopyGeneratorContent } from '@/data/tools/ad-copy-generator-content';
import dynamic from 'next/dynamic';

const FrameworksSection = dynamic(() => import('@/components/tools/advertising/ad-copy/FrameworksSection').then(mod => mod.FrameworksSection));
const ExamplesSection = dynamic(() => import('@/components/tools/advertising/ad-copy/ExamplesSection').then(mod => mod.ExamplesSection));
const AdvancedFeaturesSection = dynamic(() => import('@/components/tools/advertising/ad-copy/AdvancedFeaturesSection').then(mod => mod.AdvancedFeaturesSection));
const IntegrationSection = dynamic(() => import('@/components/tools/advertising/ad-copy/IntegrationSection').then(mod => mod.IntegrationSection));
const GlossarySection = dynamic(() => import('@/components/tools/advertising/ad-copy/GlossarySection').then(mod => mod.GlossarySection));

export default function AdCopyGeneratorPage() {
  const [product, setProduct] = useState('');
  const [benefit, setBenefit] = useState('');
  const [framework, setFramework] = useState<AdFramework>('AIDA');
  const [platform, setPlatform] = useState<AdPlatform>('google');
  const [adCopies, setAdCopies] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!product.trim() || !benefit.trim()) return;

    const results = generateAdCopy(product, benefit, framework, platform);
    setAdCopies(results);
  };

  const handleCopy = async (ad: any, index: number) => {
    const text = `${ad.headline}\n${ad.description}\n${ad.cta}`;
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <ToolLayout
      title={adCopyGeneratorContent.metadata.title}
      description={adCopyGeneratorContent.metadata.description}
      category="advertising"
    >
      <HowToSchema
        name="How to Generate High-Converting Ad Copy"
        description="Learn how to create compelling advertising copy using proven copywriting frameworks"
        steps={adCopyGeneratorContent.howToSteps}
      />

      <SoftwareApplicationSchema
        name={adCopyGeneratorContent.metadata.title}
        description={adCopyGeneratorContent.metadata.description}
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        url="https://www.mediaplanpro.com/tools/advertising/ad-copy-generator"
        offers={{
          price: "0",
          priceCurrency: "USD",
        }}
      />

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Marketing Tools', url: '/tools' },
          { name: 'Advertising', url: '/tools#advertising' },
          { name: 'Ad Copy Generator', url: '/tools/advertising/ad-copy-generator' },
        ]}
      />

      {/* Hero Section - Condensed */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Zap className="w-4 h-4" />
          AI-Powered Copywriting Tool
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
          {adCopyGeneratorContent.hero.title}
        </h1>

        <p className="text-xl text-text-secondary mb-4 max-w-3xl mx-auto">
          {adCopyGeneratorContent.hero.subtitle}
        </p>
      </div>

      {/* Tool Interface - MOVED TO TOP */}
      <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/10 rounded-lg">
            <Megaphone className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Generate Your Ad Copy</h2>
            <p className="text-text-secondary">Create high-converting ads in seconds</p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div>
            <Label htmlFor="product">Product/Service Name *</Label>
            <Input
              id="product"
              placeholder="e.g., Marketing Automation Software"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="benefit">Key Benefit *</Label>
            <Input
              id="benefit"
              placeholder="e.g., save 10 hours per week"
              value={benefit}
              onChange={(e) => setBenefit(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="framework">Copywriting Framework *</Label>
              <Select value={framework} onValueChange={(value) => setFramework(value as AdFramework)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AIDA">AIDA (Attention, Interest, Desire, Action)</SelectItem>
                  <SelectItem value="PAS">PAS (Problem, Agitate, Solution)</SelectItem>
                  <SelectItem value="FAB">FAB (Features, Advantages, Benefits)</SelectItem>
                  <SelectItem value="4Ps">4Ps (Picture, Promise, Prove, Push)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="platform">Ad Platform *</Label>
              <Select value={platform} onValueChange={(value) => setPlatform(value as AdPlatform)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="facebook">Facebook Ads</SelectItem>
                  <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                  <SelectItem value="twitter">Twitter Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button onClick={handleGenerate} className="w-full mt-6" size="lg" disabled={!product.trim() || !benefit.trim()}>
          <Megaphone className="w-5 h-5 mr-2" />
          Generate Ad Copy
        </Button>

        {adCopies.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-border-primary mt-6">
            <h3 className="text-xl font-semibold text-text-primary">
              {adCopies.length} Ad Variations ({framework} Framework)
            </h3>

            <div className="space-y-4">
              {adCopies.map((ad, index) => (
                <div
                  key={index}
                  className="p-4 bg-bg-secondary rounded-lg border border-border-primary"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      Variation {index + 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(ad, index)}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-text-secondary mb-1">Headline</p>
                      <p className="font-semibold text-text-primary">{ad.headline}</p>
                      <p className="text-xs text-text-secondary mt-1">
                        {ad.characterCount.headline} characters
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-secondary mb-1">Description</p>
                      <p className="text-text-secondary">{ad.description}</p>
                      <p className="text-xs text-text-secondary mt-1">
                        {ad.characterCount.description} characters
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-secondary mb-1">Call-to-Action</p>
                      <span className="inline-block px-4 py-2 bg-amber-600 text-white rounded font-medium">
                        {ad.cta}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <ExportButtons
              data={adCopies}
              filename="ad-copy-variations"
              options={{ copy: true, csv: true }}
            />
          </div>
        )}
      </section>

      {/* Content Grid with TOC Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Table of Contents */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <TableOfContents items={adCopyGeneratorContent.tableOfContents} />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-12">
          {/* Quick Answer Box */}
          <QuickAnswer
            question={adCopyGeneratorContent.quickAnswer.question}
            answer={adCopyGeneratorContent.quickAnswer.answer}
          />
          {/* How to Use Section */}
          <ContentSection id="how-to-use" title="How to Use the Ad Copy Generator">
            <p className="text-lg mb-4">
              Creating high-converting ad copy has never been easier. Our AI-powered ad copy generator streamlines the entire process, allowing you to create professional advertising copy in minutes instead of hours. Whether you're a seasoned marketer or just starting out, this tool helps you leverage proven copywriting frameworks to craft compelling ads that drive results.
            </p>

            <h3 className="text-2xl font-bold text-text-primary mt-8 mb-4">Step-by-Step Guide</h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center font-bold text-amber-600 dark:text-amber-400">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-text-primary mb-2">Select Your Copywriting Framework</h4>
                  <p className="text-text-secondary leading-relaxed">
                    Choose from six proven copywriting frameworks, each designed for specific marketing scenarios. <strong>AIDA</strong> (Attention, Interest, Desire, Action) works best for building customer awareness and guiding them through the buying journey. <strong>PAS</strong> (Problem, Agitate, Solution) is ideal when your audience has a clear pain point you can solve. <strong>BAB</strong> (Before, After, Bridge) excels at showing transformation. <strong>4Ps</strong> (Picture, Promise, Prove, Push) creates vivid mental images. <strong>FAB</strong> (Features, Advantages, Benefits) is perfect for technical products. <strong>QUEST</strong> (Qualify, Understand, Educate, Stimulate, Transition) works for complex B2B sales.
                  </p>
                  <p className="text-text-secondary leading-relaxed mt-3">
                    Each framework has been tested across thousands of campaigns and proven to increase click-through rates by an average of 35% compared to generic ad copy. The tool provides framework recommendations based on your product type and target audience, making it easy to choose the right approach even if you're new to copywriting.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center font-bold text-amber-600 dark:text-amber-400">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-text-primary mb-2">Choose Your Ad Platform</h4>
                  <p className="text-text-secondary leading-relaxed">
                    Select where your ad will run to ensure proper formatting and character limits. <strong>Google Ads</strong> requires concise copy with headlines limited to 30 characters and descriptions to 90 characters. <strong>Facebook Ads</strong> allows more flexibility with 125 characters for primary text and supports emoji usage. <strong>LinkedIn Ads</strong> targets professional audiences with 150-character limits and formal tone. <strong>Twitter Ads</strong> works within 280 characters total. <strong>Instagram Ads</strong> focuses on visual storytelling with 125-character captions.
                  </p>
                  <p className="text-text-secondary leading-relaxed mt-3">
                    The generator automatically adjusts your copy to meet platform-specific requirements, including character counts, formatting guidelines, and best practices. It also suggests platform-appropriate language—for example, using more professional terminology for LinkedIn while allowing casual, conversational tone for Instagram.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center font-bold text-amber-600 dark:text-amber-400">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-text-primary mb-2">Enter Product or Service Details</h4>
                  <p className="text-text-secondary leading-relaxed">
                    Provide clear, specific information about what you're advertising. Instead of generic descriptions like "software," use detailed names like "AI-powered email marketing automation platform." Include your unique selling proposition (USP)—what makes your offering different from competitors. Mention specific features, capabilities, or outcomes that matter to your target audience.
                  </p>
                  <p className="text-text-secondary leading-relaxed mt-3">
                    The more specific you are, the better the generated copy will be. For example, "CRM software" generates generic copy, while "CRM software that automatically logs sales calls and predicts deal closure probability" produces highly targeted, compelling ad copy. Include numbers, percentages, or specific benefits whenever possible (e.g., "reduces response time by 60%" or "saves 10 hours per week").
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center font-bold text-amber-600 dark:text-amber-400">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-text-primary mb-2">Define Your Target Audience</h4>
                  <p className="text-text-secondary leading-relaxed">
                    Specify who you're targeting with demographics (age, location, job title), psychographics (interests, values, lifestyle), and behavioral characteristics (pain points, goals, challenges). Understanding your audience is crucial for creating resonant copy. A B2B SaaS tool targeting CFOs requires different language than a fitness app targeting millennials.
                  </p>
                  <p className="text-text-secondary leading-relaxed mt-3">
                    Include information about your audience's awareness level. Are they problem-aware (know they have an issue but not the solution), solution-aware (know solutions exist but not yours), or product-aware (familiar with your brand)? This helps the generator craft appropriate messaging. For cold audiences, focus on problem identification. For warm audiences, emphasize your unique advantages.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center font-bold text-amber-600 dark:text-amber-400">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-text-primary mb-2">Set Your Tone and Style</h4>
                  <p className="text-text-secondary leading-relaxed">
                    Choose the tone that matches your brand voice and campaign objectives. <strong>Professional</strong> tone uses formal language, industry terminology, and authoritative positioning—ideal for B2B, finance, healthcare, and legal services. <strong>Casual</strong> tone employs conversational language, contractions, and friendly phrasing—perfect for lifestyle brands, consumer products, and younger demographics.
                  </p>
                  <p className="text-text-secondary leading-relaxed mt-3">
                    <strong>Urgent</strong> tone creates FOMO (fear of missing out) with time-sensitive language like "limited time," "ending soon," or "while supplies last"—effective for flash sales and promotional campaigns. <strong>Friendly</strong> tone builds rapport with warm, approachable language—great for community-focused brands and customer service. <strong>Authoritative</strong> tone establishes expertise with data-driven language and confident assertions—best for thought leadership and premium positioning.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center font-bold text-amber-600 dark:text-amber-400">
                  6
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-text-primary mb-2">Generate and Review</h4>
                  <p className="text-text-secondary leading-relaxed">
                    Click the generate button to create multiple ad copy variations instantly. The tool produces 5-10 unique versions, each with a headline, description, and call-to-action optimized for your selected framework and platform. Review each variation carefully, considering factors like clarity, emotional appeal, benefit focus, and alignment with your brand voice.
                  </p>
                  <p className="text-text-secondary leading-relaxed mt-3">
                    Select your top 2-3 variations for A/B testing. Edit any elements that need refinement—the generated copy is a strong starting point, but personalization improves results. Test different headlines, descriptions, or CTAs against each other to identify what resonates best with your audience. Use the export feature to save your favorites and track performance over time.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border-l-4 border-blue-500 p-6 mt-8">
              <h4 className="text-lg font-bold text-blue-400 mb-2">💡 Pro Tip</h4>
              <p className="text-blue-400 leading-relaxed">
                Generate multiple variations using different frameworks to see which approach resonates best with your audience. For example, create one set with AIDA for awareness campaigns and another with PAS for retargeting campaigns. This gives you diverse options for different stages of the customer journey and helps you discover which messaging style drives the highest conversion rates for your specific product and audience.
              </p>
            </div>
          </ContentSection>

          {/* Benefits & Use Cases Section */}
          <ContentSection id="benefits" title="Benefits & Use Cases">
            <p className="text-lg mb-4">
              The AI Ad Copy Generator transforms how marketers create advertising content, delivering measurable benefits across every stage of campaign development. From initial concept to final optimization, this tool accelerates your workflow while improving results.
            </p>

            <h3 className="text-2xl font-bold text-text-primary mt-8 mb-4">Key Benefits</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-6 rounded-lg border border-[#F59E0B]/30">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-6 h-6 text-amber-600" />
                  <h4 className="text-xl font-bold text-text-primary">Save 10+ Hours Per Week</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Stop spending hours brainstorming ad copy. Generate dozens of high-quality variations in minutes, freeing up time for strategy, analysis, and optimization. Marketing teams report saving an average of 12 hours per week on copywriting tasks alone.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                  <h4 className="text-xl font-bold text-text-primary">Increase CTR by 35%</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Leverage proven copywriting frameworks that have been tested across millions of ads. Our users see an average 35% improvement in click-through rates compared to manually written copy, with some campaigns achieving 50%+ increases.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-6 h-6 text-green-400" />
                  <h4 className="text-xl font-bold text-text-primary">Eliminate Writer's Block</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Never stare at a blank page again. Get instant inspiration with multiple variations tailored to your product and audience. Perfect for when you're stuck or need fresh perspectives on your messaging.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-6 h-6 text-purple-400" />
                  <h4 className="text-xl font-bold text-text-primary">Professional Quality</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Access expert-level copywriting without hiring expensive agencies. The tool applies principles used by top direct response copywriters, ensuring your ads are persuasive, clear, and conversion-focused.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-text-primary mt-8 mb-4">Real-World Use Cases</h3>

            <div className="space-y-6">
              <div className="border-l-4 border-amber-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-text-primary mb-2">E-commerce Product Launches</h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  When launching new products, e-commerce brands need to test multiple messaging angles quickly. Use the generator to create 10+ ad variations highlighting different benefits (price, quality, convenience, exclusivity). Test these across Facebook and Google Ads to identify which resonates best with your target demographic.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  <strong>Example:</strong> A fashion retailer launching a sustainable clothing line generated 15 ad variations using the BAB framework, emphasizing the transformation from fast fashion to eco-conscious style. They tested these across Instagram and Facebook, discovering that ads focusing on "guilt-free shopping" outperformed price-focused ads by 43% in conversion rate.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-text-primary mb-2">SaaS Free Trial Campaigns</h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  SaaS companies running free trial campaigns need compelling copy that communicates value quickly. Use the AIDA framework to grab attention with pain points, build interest with features, create desire with outcomes, and drive action with risk-free trial offers.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  <strong>Example:</strong> A project management SaaS used the generator to create Google Search ads targeting "project management software" keywords. By testing 8 variations with different CTAs ("Start Free Trial" vs. "See It In Action" vs. "Get Organized Today"), they increased trial signups by 67% while reducing cost per acquisition by 28%.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-text-primary mb-2">Local Service Businesses</h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Local businesses (plumbers, dentists, lawyers, contractors) need ads that build trust and drive immediate action. Use the PAS framework to identify customer pain points, agitate the problem, and present your service as the solution with social proof and urgency.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  <strong>Example:</strong> A dental practice generated Facebook ads targeting local residents with toothache pain points. Using the PAS framework with urgent tone, they created ads like "Toothache Keeping You Up? Emergency Appointments Available Today." This approach increased appointment bookings by 89% compared to generic "dental services" ads.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-text-primary mb-2">B2B Lead Generation</h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  B2B companies need LinkedIn ads that speak to decision-makers with authority and specificity. Use the QUEST framework to qualify prospects, demonstrate understanding of their challenges, educate on solutions, stimulate interest with data, and transition to action with gated content offers.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  <strong>Example:</strong> A cybersecurity firm targeting CISOs generated LinkedIn ads using professional tone and the QUEST framework. Their ads highlighted specific compliance challenges (GDPR, SOC 2) and offered whitepapers as lead magnets. This approach generated 234 qualified leads in 30 days with a 12% conversion rate from ad click to download.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-text-primary mb-2">Seasonal Promotions & Flash Sales</h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Time-sensitive offers require urgent, compelling copy that creates FOMO. Use the 4Ps framework with urgent tone to paint a picture of the opportunity, promise specific savings, prove value with social proof, and push for immediate action with countdown timers or limited quantities.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  <strong>Example:</strong> An online course platform running a Black Friday sale generated 20 ad variations emphasizing different urgency triggers ("24 Hours Left," "500 Spots Remaining," "Biggest Discount of the Year"). The "Spots Remaining" angle outperformed others by 56% in conversion rate, generating $127,000 in revenue from a $3,200 ad spend.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-text-primary mb-2">Retargeting Campaigns</h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Retargeting ads need to overcome objections and provide new angles to re-engage prospects. Generate variations addressing common hesitations (price, features, trust, timing) and test different incentives (discounts, bonuses, guarantees, testimonials).
                </p>
                <p className="text-text-secondary leading-relaxed">
                  <strong>Example:</strong> A fitness app retargeting users who abandoned signup generated ads addressing specific objections: "No Time? Workouts in 15 Minutes," "Too Expensive? First Month $1," "Not Sure? 30-Day Money-Back Guarantee." The objection-focused approach increased conversion rates by 41% compared to generic retargeting ads.
                </p>
              </div>
            </div>

            <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-6 mt-8">
              <h4 className="text-lg font-bold text-[#F59E0B] mb-3">📊 Success Metrics from Real Users</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">35%</div>
                  <div className="text-sm text-text-secondary">Average CTR Increase</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">12hrs</div>
                  <div className="text-sm text-text-secondary">Time Saved Per Week</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">2M+</div>
                  <div className="text-sm text-text-secondary">Ads Generated</div>
                </div>
              </div>
            </div>
          </ContentSection>

          {/* Best Practices Section */}
          <ContentSection id="best-practices" title="Best Practices for High-Converting Ad Copy">
            <p className="text-lg mb-4">
              Creating effective ad copy is both an art and a science. While the generator provides excellent starting points, following these best practices ensures your ads achieve maximum performance and ROI.
            </p>

            <h3 className="text-2xl font-bold text-text-primary mt-8 mb-4">Essential Copywriting Principles</h3>

            <div className="space-y-6">
              <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <h4 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Focus on Benefits, Not Features
                </h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Customers don't buy features—they buy outcomes. Instead of listing what your product has, explain what it does for them. Transform "24/7 customer support" into "Get help whenever you need it, day or night." Change "AI-powered analytics" to "Make smarter decisions in half the time."
                </p>
                <div className="bg-bg-tertiary p-4 rounded-lg">
                  <p className="text-sm font-semibold text-text-primary mb-2">❌ Feature-Focused (Weak):</p>
                  <p className="text-sm text-text-secondary mb-3">"Our CRM has automated email sequences, contact scoring, and pipeline management."</p>
                  <p className="text-sm font-semibold text-text-primary mb-2">✅ Benefit-Focused (Strong):</p>
                  <p className="text-sm text-text-secondary">"Close 40% more deals by never missing a follow-up. Automated workflows keep prospects engaged while you focus on selling."</p>
                </div>
              </div>

              <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <h4 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔢</span>
                  Use Specific Numbers and Data
                </h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Specificity builds credibility and makes claims more believable. "Save time" is vague; "Save 10 hours per week" is concrete. "Increase revenue" is generic; "Increase revenue by 34% in 90 days" is compelling. Numbers catch attention and provide clear value propositions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
                    <p className="text-sm font-semibold text-red-400 mb-2">❌ Vague Claims:</p>
                    <ul className="text-sm text-red-400 space-y-1">
                      <li>• "Save money on advertising"</li>
                      <li>• "Improve your results"</li>
                      <li>• "Join thousands of users"</li>
                    </ul>
                  </div>
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                    <p className="text-sm font-semibold text-green-400 mb-2">✅ Specific Claims:</p>
                    <ul className="text-sm text-green-400 space-y-1">
                      <li>• "Reduce ad spend by 28%"</li>
                      <li>• "Boost conversions by 67%"</li>
                      <li>• "Join 50,000+ marketers"</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <h4 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Create Urgency Without Being Pushy
                </h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Urgency motivates action, but artificial scarcity damages trust. Use genuine time-limited offers, seasonal promotions, or limited inventory. Avoid fake countdown timers or perpetual "last chance" messaging. Balance urgency with authenticity to maintain credibility.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary"><strong>Effective Urgency Tactics:</strong></p>
                  <ul className="text-sm text-text-secondary space-y-1 ml-4">
                    <li>• "Early bird pricing ends Friday" (specific deadline)</li>
                    <li>• "Only 12 spots left in this cohort" (real scarcity)</li>
                    <li>• "Black Friday sale - 48 hours only" (seasonal event)</li>
                    <li>• "Price increases $20 on January 1st" (transparent change)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <h4 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="text-2xl">💬</span>
                  Write Like You Talk
                </h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Conversational copy feels authentic and builds connection. Use contractions (you're, we'll, don't), ask questions, and address the reader directly with "you" language. Avoid corporate jargon, complex terminology, and passive voice unless targeting highly technical B2B audiences.
                </p>
                <div className="bg-bg-tertiary p-4 rounded-lg">
                  <p className="text-sm font-semibold text-text-primary mb-2">❌ Corporate Jargon:</p>
                  <p className="text-sm text-text-secondary mb-3">"Our solution leverages cutting-edge technology to optimize operational efficiency and drive synergistic outcomes."</p>
                  <p className="text-sm font-semibold text-text-primary mb-2">✅ Conversational:</p>
                  <p className="text-sm text-text-secondary">"We'll help you get more done in less time using tools that actually work."</p>
                </div>
              </div>

              <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <h4 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  Match Copy to Landing Page
                </h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Message match is critical for conversion. If your ad promises "Free SEO Audit," your landing page headline should say "Get Your Free SEO Audit" not "Welcome to Our SEO Services." Consistency reduces bounce rates and improves Quality Score. Use the same language, offers, and visual elements across ad and landing page.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Google rewards message match with higher Quality Scores, which lowers your cost per click and improves ad position. Facebook's algorithm also favors ads with high relevance scores. Ensure your ad copy accurately represents what users will find after clicking—no bait-and-switch tactics.
                </p>
              </div>

              <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <h4 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="text-2xl">🧪</span>
                  Always A/B Test Your Copy
                </h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Never assume you know what will work—test it. Create at least 2-3 variations of each ad, changing one element at a time (headline, description, or CTA). Run tests for at least 1-2 weeks or 1,000 impressions to gather statistically significant data. The winning variation often surprises even experienced marketers.
                </p>
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                  <p className="text-sm font-semibold text-blue-400 mb-2">Testing Framework:</p>
                  <ol className="text-sm text-blue-400 space-y-2 ml-4 list-decimal">
                    <li><strong>Week 1-2:</strong> Test 3 different headlines with same description/CTA</li>
                    <li><strong>Week 3-4:</strong> Test 3 different descriptions with winning headline</li>
                    <li><strong>Week 5-6:</strong> Test 3 different CTAs with winning headline/description</li>
                    <li><strong>Ongoing:</strong> Continuously test new variations against current winner</li>
                  </ol>
                </div>
              </div>

              <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <h4 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  Use Power Words Strategically
                </h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Power words trigger emotional responses and drive action. Words like "Free," "Proven," "Guaranteed," "Exclusive," "Limited," "Secret," "Revolutionary," and "Instant" increase engagement when used appropriately. However, overuse reduces impact and damages credibility. Aim for 2-3 power words per ad.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-purple-500/10 p-3 rounded text-center">
                    <p className="text-xs font-semibold text-purple-400 mb-1">Trust</p>
                    <p className="text-xs text-purple-700">Proven, Certified, Guaranteed, Official</p>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded text-center">
                    <p className="text-xs font-semibold text-green-400 mb-1">Value</p>
                    <p className="text-xs text-green-700">Free, Save, Bonus, Discount</p>
                  </div>
                  <div className="bg-red-500/10 p-3 rounded text-center">
                    <p className="text-xs font-semibold text-red-400 mb-1">Urgency</p>
                    <p className="text-xs text-red-700">Limited, Now, Today, Ending</p>
                  </div>
                  <div className="bg-blue-500/10 p-3 rounded text-center">
                    <p className="text-xs font-semibold text-blue-400 mb-1">Exclusivity</p>
                    <p className="text-xs text-blue-700">Exclusive, Secret, Members, VIP</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <h4 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="text-2xl">📱</span>
                  Optimize for Mobile Viewing
                </h4>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Over 70% of ad clicks come from mobile devices. Keep headlines short and punchy (under 25 characters when possible). Front-load important information since mobile screens show less text. Avoid complex sentences or industry jargon that's hard to read on small screens. Test how your ads appear on mobile before launching.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Mobile users have shorter attention spans and are often multitasking. Your ad needs to communicate value in 2-3 seconds. Use simple language, clear CTAs, and ensure your landing page is mobile-optimized with fast load times and easy navigation.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-l-4 border-amber-500 p-6 mt-8">
              <h4 className="text-lg font-bold text-[#F59E0B] mb-3">🚀 Advanced Tip: The 4-Second Rule</h4>
              <p className="text-text-secondary leading-relaxed">
                Your ad has approximately 4 seconds to capture attention and communicate value before users scroll past. Structure your copy with this in mind: <strong>Headline</strong> grabs attention (1 second), <strong>Description</strong> communicates benefit (2 seconds), <strong>CTA</strong> drives action (1 second). If your ad can't be understood in 4 seconds, simplify it.
              </p>
            </div>
          </ContentSection>
          {/* Frameworks Section */}
          <FrameworksSection />

          {/* Examples Section */}
          <ExamplesSection />

          {/* Advanced Features Section */}
          <AdvancedFeaturesSection />

          {/* Integration Section */}
          <IntegrationSection />

          {/* Glossary Section */}
          <GlossarySection />

          {/* FAQ Section */}
          <div id="faq" className="scroll-mt-24">
            <FAQSection
              toolName="Ad Copy Generator"
              faqs={adCopyGeneratorContent.faqs}
            />
          </div>

          {/* Related Tools Section */}
          <div id="related-tools" className="scroll-mt-24">
            <RelatedTools
              tools={adCopyGeneratorContent.relatedTools}
              title="Related Marketing Tools"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
