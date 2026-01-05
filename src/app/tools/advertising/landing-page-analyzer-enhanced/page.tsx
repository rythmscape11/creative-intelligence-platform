'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { analyzeLandingPage } from '@/lib/tools/advertising/landingPageAnalyzer';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { FileSearch } from 'lucide-react';
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
import { landingPageAnalyzerContent } from '@/data/tools/landing-page-analyzer-content';

export default function LandingPageAnalyzerEnhancedPage() {
  const [checklist, setChecklist] = useState({
    hasHeadline: false,
    hasSubheadline: false,
    hasCTA: false,
    hasBenefits: false,
    hasSocialProof: false,
    hasImages: false,
    hasVideo: false,
    hasTrustSignals: false,
    hasMobileOptimized: false,
    hasLoadSpeed: false
  });
  const [result, setResult] = useState<any>(null);


  const handleCheckboxChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  const handleAnalyze = async () => {
    const analysis = analyzeLandingPage(checklist);
    setResult(analysis);

  };

  const checklistItems = [
    { key: 'hasHeadline', label: 'Clear, compelling headline' },
    { key: 'hasSubheadline', label: 'Supporting subheadline' },
    { key: 'hasCTA', label: 'Prominent call-to-action button' },
    { key: 'hasBenefits', label: 'Key benefits listed' },
    { key: 'hasSocialProof', label: 'Testimonials or reviews' },
    { key: 'hasImages', label: 'High-quality images' },
    { key: 'hasVideo', label: 'Explainer or demo video' },
    { key: 'hasTrustSignals', label: 'Trust badges or guarantees' },
    { key: 'hasMobileOptimized', label: 'Mobile-responsive design' },
    { key: 'hasLoadSpeed', label: 'Fast loading speed (< 3s)' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
    };
    if (score >= 75) return {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
    };
    if (score >= 60) return {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
    };
    return {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
    };
  };

  const { tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = landingPageAnalyzerContent;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Advertising Tools', url: '/tools#advertising' },
          { name: 'Landing Page Analyzer', url: '/tools/advertising/landing-page-analyzer' },
        ]}
      />

      <HowToSchema
        name="How to Analyze and Optimize Landing Pages for Conversions"
        description="Step-by-step guide to analyzing and optimizing landing pages for maximum conversion rates"
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="Landing Page Analyzer"
        description="Free tool to analyze landing page elements and get optimization recommendations for better conversion rates"
        url="https://mediaplanpro.com/tools/advertising/landing-page-analyzer"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={landingPageAnalyzerContent.metadata.title}
        description={landingPageAnalyzerContent.metadata.description}
        category="advertising"
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {landingPageAnalyzerContent.hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {landingPageAnalyzerContent.hero.subtitle}
            </p>
          </div>

          {/* Quick Answer */}


          {/* Main Content Grid */}

          {/* Tool Interface - MOVED TO TOP */}
          <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
            <div className="space-y-6">


              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                <p className="text-sm text-blue-400">
                  💡 <strong>Tip:</strong> Check all elements present on your landing page to get a comprehensive conversion score.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">Landing Page Elements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {checklistItems.map((item) => (
                    <div key={item.key} className="flex items-center space-x-2 p-3 bg-bg-tertiary rounded-lg">
                      <Checkbox
                        id={item.key}
                        checked={checklist[item.key as keyof typeof checklist]}
                        onCheckedChange={(checked) => handleCheckboxChange(item.key, checked as boolean)}
                      />
                      <Label htmlFor={item.key} className="cursor-pointer">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                className="w-full"
                size="lg"
              >
                <FileSearch className="mr-2 h-5 w-5" />
                Analyze Landing Page
              </Button>

              {result && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Analysis Results</h3>
                    <ExportButtons
                      data={result}
                      filename="landing-page-analysis"
                    />
                  </div>

                  <div className={`${getScoreColor(result.score).bg} p-6 rounded-lg border-2 ${getScoreColor(result.score).border}`}>
                    <div className="text-center">
                      <div className="text-sm text-text-secondary mb-2">Overall Score</div>
                      <div className={`text-5xl font-bold ${getScoreColor(result.score).text}`}>
                        {result.score}%
                      </div>
                      <div className={`text-lg mt-2 text-${getScoreColor(result.score)}-700`}>
                        {result.rating}
                      </div>
                    </div>
                  </div>

                  <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                    <h4 className="font-semibold text-text-primary mb-4">Recommendations</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-text-secondary">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                    <h4 className="font-semibold text-text-primary mb-4">Missing Elements</h4>
                    <ul className="space-y-2">
                      {result.missingElements.map((element: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-text-secondary">
                          <span className="text-red-400 mt-1">✗</span>
                          <span>{element}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Table of Contents */}
            <div className="lg:col-span-1">
              <TableOfContents items={tableOfContents} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Quick Answer Box */}
              <QuickAnswer
                question={quickAnswer.question}
                answer={quickAnswer.answer}
              />

              {/* Tool Interface */}
              {/* How to Use Section */}
              <ContentSection
                id="how-to-use"
                title="How to Use the Landing Page Analyzer"
              >
                <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  Our landing page analyzer evaluates 10 critical conversion elements to give you an overall optimization score and actionable recommendations. Simply check off which elements are present on your page to receive instant feedback.
                </p>

                <div className="space-y-6">
                  {howToSteps.map((step, index) => (
                    <div key={index} className="bg-bg-tertiary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">
                        Step {index + 1}: {step.name}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">{step.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-green-500/10 p-6 rounded-lg border border-green-500/30">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">✅ Key Elements to Check</h3>
                  <ul className="space-y-2 text-green-400">
                    <li><strong>Headline:</strong> Clear value proposition in 10 words or less</li>
                    <li><strong>CTA:</strong> Prominent, action-oriented button above the fold</li>
                    <li><strong>Social Proof:</strong> Testimonials, reviews, or customer logos</li>
                    <li><strong>Mobile Optimization:</strong> Responsive design for all devices</li>
                    <li><strong>Page Speed:</strong> Load time under 3 seconds</li>
                  </ul>
                </div>

              </ContentSection>

              {/* Benefits Section */}
              <ContentSection
                id="benefits"
                title="Benefits of Landing Page Optimization"
              >
                <div className="prose max-w-none">
                  <p className="text-lg text-text-secondary leading-relaxed mb-6">
                    Optimized landing pages can increase conversion rates by 200-400%. Even small improvements in page elements can significantly impact your bottom line when you're driving paid traffic.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">📈 Higher Conversion Rates</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Well-optimized landing pages convert 5-15% of visitors compared to 1-3% for poorly designed pages. This 3-5x improvement directly impacts ROI.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">💰 Lower Cost Per Acquisition</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Higher conversion rates mean lower CPA. If you improve conversion from 2% to 4%, your CPA drops by 50% with the same ad spend.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">🎯 Better Quality Score</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Google Ads rewards relevant, high-converting landing pages with better Quality Scores, reducing your CPC by 20-50%.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">📊 Data-Driven Insights</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Systematic analysis reveals exactly which elements need improvement, eliminating guesswork from optimization efforts.
                      </p>
                    </div>
                  </div>
                </div>
              </ContentSection>

              {/* Best Practices Section */}
              <ContentSection
                id="best-practices"
                title="Landing Page Best Practices"
              >
                <div className="prose max-w-none">
                  <div className="space-y-6">
                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">1. Craft a Compelling Headline</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Your headline is the first thing visitors see. Make it clear, benefit-focused, and specific. Use numbers, questions, or bold claims. Test multiple variations to find what resonates with your audience.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">2. Use a Single, Clear CTA</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Don't confuse visitors with multiple CTAs. Focus on one primary action. Use action-oriented copy ("Get Started Free" not "Submit"). Make the button large, contrasting, and above the fold.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">3. Add Social Proof</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Include testimonials, customer logos, review ratings, or case study results. Social proof can increase conversions by 15-30%. Place it near your CTA for maximum impact.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">4. Optimize for Mobile</h3>
                      <p className="text-text-secondary leading-relaxed">
                        50-70% of traffic is mobile. Ensure your page loads fast, buttons are thumb-friendly, forms are simple, and content is readable without zooming.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">5. Minimize Form Fields</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Each form field reduces conversion rates by 5-10%. Ask only for essential information. Use multi-step forms for complex data collection.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 bg-red-500/10 p-6 rounded-lg border border-red-500/30">
                    <h3 className="text-lg font-semibold text-red-400 mb-3">🚫 Common Mistakes</h3>
                    <ul className="space-y-2 text-red-400">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">✗</span>
                        <span><strong>Too much text:</strong> Keep copy concise and scannable</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">✗</span>
                        <span><strong>Slow load times:</strong> Pages over 3 seconds lose 40% of visitors</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">✗</span>
                        <span><strong>Generic CTAs:</strong> "Submit" and "Click Here" underperform by 30%</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </ContentSection>

              {/* CRO Framework Section */}
              <ContentSection
                id="optimization-framework"
                title="Conversion Rate Optimization Framework"
              >
                <div className="prose max-w-none">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-500/30">
                      <h3 className="text-2xl font-semibold text-blue-400 mb-3">1. Analyze Current Performance</h3>
                      <p className="text-blue-400">
                        Use analytics to establish baseline metrics: current conversion rate, bounce rate, time on page, and traffic sources. Identify your biggest drop-off points.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-500/30">
                      <h3 className="text-2xl font-semibold text-green-400 mb-3">2. Identify Optimization Opportunities</h3>
                      <p className="text-green-400">
                        Use heatmaps, session recordings, and user testing to find friction points. Look for elements that confuse visitors or prevent them from converting.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-500/30">
                      <h3 className="text-2xl font-semibold text-purple-400 mb-3">3. Prioritize Tests</h3>
                      <p className="text-purple-400">
                        Focus on high-impact, low-effort changes first. Test headline variations, CTA copy, form length, and social proof placement before redesigning the entire page.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg border border-[#F59E0B]/30">
                      <h3 className="text-2xl font-semibold text-[#F59E0B] mb-3">4. Run A/B Tests</h3>
                      <p className="text-text-secondary">
                        Test one element at a time with sufficient traffic (minimum 100 conversions per variation). Run tests for at least 2 weeks to account for weekly patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </ContentSection>

              {/* Examples Section */}
              <ContentSection
                id="examples"
                title="Landing Page Analysis Examples"
              >
                <div className="prose max-w-none">
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-500/30">
                      <h3 className="text-2xl font-semibold text-blue-400 mb-4">Example 1: SaaS Free Trial Page</h3>
                      <div className="bg-bg-secondary p-4 rounded-lg mb-4">
                        <p className="text-sm text-text-secondary mb-2"><strong>Score:</strong> 90% (Excellent)</p>
                        <p className="text-sm text-text-secondary"><strong>Elements Present:</strong> Clear headline, benefit-focused subheadline, prominent CTA, customer logos, video demo, trust badges, mobile-optimized, fast loading</p>
                      </div>
                      <p className="text-blue-400">
                        <strong>Result:</strong> 12% conversion rate, 50% lower CPA than industry average. The combination of social proof and video demo increased conversions by 85%.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-500/30">
                      <h3 className="text-2xl font-semibold text-red-400 mb-4">Example 2: E-commerce Product Page (Before Optimization)</h3>
                      <div className="bg-bg-secondary p-4 rounded-lg mb-4">
                        <p className="text-sm text-text-secondary mb-2"><strong>Score:</strong> 40% (Needs Improvement)</p>
                        <p className="text-sm text-text-secondary"><strong>Missing:</strong> Clear headline, social proof, trust signals, mobile optimization, fast loading</p>
                      </div>
                      <p className="text-red-400">
                        <strong>Result:</strong> 1.5% conversion rate. After adding reviews, trust badges, and optimizing for mobile, conversion increased to 4.2% (180% improvement).
                      </p>
                    </div>
                  </div>
                </div>
              </ContentSection>

              {/* FAQ Section */}
              <FAQSection
                toolName="Landing Page Analyzer"
                faqs={faqs}
                title="Frequently Asked Questions About Landing Page Optimization"
              />

              {/* Related Tools */}
              <RelatedTools
                tools={relatedTools}
                title="Related Marketing Tools"
              />
            </div>
          </div>
        </div >
      </ToolLayout >
    </>
  );
}

