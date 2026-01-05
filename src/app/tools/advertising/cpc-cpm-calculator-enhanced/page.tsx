'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calculateAdMetrics, getMetricRating } from '@/lib/tools/advertising/cpcCpmCalculator';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { AdMetrics } from '@/types/tools';
import { Calculator } from 'lucide-react';
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
import { cpcCpmCalculatorContent } from '@/data/tools/cpc-cpm-calculator-content';

export default function CPCCPMCalculatorEnhancedPage() {
  const [input, setInput] = useState<AdMetrics>({});
  const [result, setResult] = useState<AdMetrics | null>(null);


  const handleCalculate = async () => {
    const output = calculateAdMetrics(input);
    setResult(output);
  };

  const handleInputChange = (field: keyof AdMetrics, value: string) => {
    setInput(prev => ({
      ...prev,
      [field]: value ? parseFloat(value) : undefined
    }));
  };

  const { tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = cpcCpmCalculatorContent;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Advertising Tools', url: '/tools#advertising' },
          { name: 'CPC & CPM Calculator', url: '/tools/advertising/cpc-cpm-calculator' },
        ]}
      />

      <HowToSchema
        name="How to Calculate CPC and CPM for Advertising Campaigns"
        description="Step-by-step guide to calculating cost per click and cost per thousand impressions for your advertising campaigns"
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="CPC & CPM Calculator"
        description="Free calculator for cost per click (CPC), cost per thousand impressions (CPM), and other advertising metrics"
        url="https://mediaplanpro.com/tools/advertising/cpc-cpm-calculator"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={cpcCpmCalculatorContent.metadata.title}
        description={cpcCpmCalculatorContent.metadata.description}
        category="advertising"
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {cpcCpmCalculatorContent.hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {cpcCpmCalculatorContent.hero.subtitle}
            </p>
          </div>

          {/* Quick Answer */}


          {/* Main Content Grid */}

          {/* Tool Interface - MOVED TO TOP */}
          <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
            <div className="space-y-6">


              <div className="bg-[#F59E0B]/10 p-4 rounded-lg border border-[#F59E0B]/30">
                <p className="text-sm text-[#F59E0B]">
                  💡 <strong>Tip:</strong> Enter any 2 or more metrics to calculate the rest automatically.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="impressions">Impressions</Label>
                  <Input
                    id="impressions"
                    type="number"
                    placeholder="10000"
                    value={input.impressions || ''}
                    onChange={(e) => handleInputChange('impressions', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="clicks">Clicks</Label>
                  <Input
                    id="clicks"
                    type="number"
                    placeholder="350"
                    value={input.clicks || ''}
                    onChange={(e) => handleInputChange('clicks', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="conversions">Conversions</Label>
                  <Input
                    id="conversions"
                    type="number"
                    placeholder="25"
                    value={input.conversions || ''}
                    onChange={(e) => handleInputChange('conversions', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="spend">Spend ($)</Label>
                  <Input
                    id="spend"
                    type="number"
                    placeholder="500"
                    value={input.spend || ''}
                    onChange={(e) => handleInputChange('spend', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full"
                size="lg"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Metrics
              </Button>

              {result && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Results</h3>
                    <ExportButtons
                      data={result}
                      filename="ad-metrics"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.cpc !== undefined && (
                      <div className="bg-bg-secondary p-4 rounded-lg border border-border-primary">
                        <div className="text-sm text-text-secondary">Cost Per Click (CPC)</div>
                        <div className="text-2xl font-bold text-text-primary">${result.cpc.toFixed(2)}</div>
                        {result.cpc !== undefined && (
                          <div className={`text-sm mt-1 ${getMetricRating('cpc', result.cpc).color}`}>
                            {getMetricRating('cpc', result.cpc).rating}
                          </div>
                        )}
                      </div>
                    )}

                    {result.cpm !== undefined && (
                      <div className="bg-bg-secondary p-4 rounded-lg border border-border-primary">
                        <div className="text-sm text-text-secondary">Cost Per Mille (CPM)</div>
                        <div className="text-2xl font-bold text-text-primary">${result.cpm.toFixed(2)}</div>
                        {result.cpm !== undefined && (
                          <div className={`text-sm mt-1 ${getMetricRating('cpm', result.cpm).color}`}>
                            {getMetricRating('cpm', result.cpm).rating}
                          </div>
                        )}
                      </div>
                    )}

                    {result.ctr !== undefined && (
                      <div className="bg-bg-secondary p-4 rounded-lg border border-border-primary">
                        <div className="text-sm text-text-secondary">Click-Through Rate (CTR)</div>
                        <div className="text-2xl font-bold text-text-primary">{result.ctr.toFixed(2)}%</div>
                        {result.ctr !== undefined && (
                          <div className={`text-sm mt-1 ${getMetricRating('ctr', result.ctr).color}`}>
                            {getMetricRating('ctr', result.ctr).rating}
                          </div>
                        )}
                      </div>
                    )}

                    {result.conversionRate !== undefined && (
                      <div className="bg-bg-secondary p-4 rounded-lg border border-border-primary">
                        <div className="text-sm text-text-secondary">Conversion Rate</div>
                        <div className="text-2xl font-bold text-text-primary">{result.conversionRate.toFixed(2)}%</div>
                      </div>
                    )}

                    {result.cpa !== undefined && (
                      <div className="bg-bg-secondary p-4 rounded-lg border border-border-primary">
                        <div className="text-sm text-text-secondary">Cost Per Acquisition (CPA)</div>
                        <div className="text-2xl font-bold text-text-primary">${result.cpa.toFixed(2)}</div>
                      </div>
                    )}
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
                title="How to Use the CPC & CPM Calculator"
              >
                <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  Our CPC & CPM calculator simplifies advertising metric calculations. Enter any two or more values, and the calculator automatically computes all related metrics including CPC, CPM, CTR, conversion rate, CPA, and ROAS.
                </p>

                <p className="text-text-secondary leading-relaxed mb-4">
                  Understanding your ad costs is essential for profitability. Our calculator helps you:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                  {howToSteps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.name}:</strong> {step.text}
                    </li>
                  ))}
                </ol>
                <div className="mt-8 bg-blue-500/10 p-6 rounded-lg border border-blue-500/30">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">💡 Quick Formulas</h3>
                  <ul className="space-y-2 text-blue-400">
                    <li><strong>CPC:</strong> Total Spend ÷ Total Clicks</li>
                    <li><strong>CPM:</strong> (Total Spend ÷ Total Impressions) × 1,000</li>
                    <li><strong>CTR:</strong> (Total Clicks ÷ Total Impressions) × 100</li>
                    <li><strong>Conversion Rate:</strong> (Conversions ÷ Clicks) × 100</li>
                    <li><strong>CPA:</strong> Total Spend ÷ Total Conversions</li>
                    <li><strong>ROAS:</strong> Total Revenue ÷ Total Spend</li>
                  </ul>
                </div>

              </ContentSection>

              {/* Benefits Section */}
              <ContentSection
                id="benefits"
                title="Benefits of Tracking CPC & CPM"
              >
                <div className="prose max-w-none">
                  <p className="text-lg text-text-secondary leading-relaxed mb-6">
                    Understanding and optimizing CPC and CPM metrics is crucial for maximizing advertising ROI. These metrics help you make informed decisions about budget allocation, campaign optimization, and platform selection.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">📊 Budget Optimization</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Track CPC and CPM across platforms to identify the most cost-effective channels. Advertisers who monitor these metrics reduce wasted spend by <strong>30-40%</strong> on average.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">🎯 Campaign Performance</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Compare performance across campaigns, ad sets, and creatives. Low CPC with high CTR indicates effective targeting and compelling ad creative.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">💰 ROI Measurement</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Calculate true advertising ROI by combining CPC/CPM with conversion and revenue data. This reveals which campaigns drive profitable growth.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">📈 Competitive Analysis</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Benchmark your CPC and CPM against industry standards to ensure competitive pricing and identify opportunities for improvement.
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-500/10 p-6 rounded-lg border border-purple-500/30">
                    <h3 className="text-lg font-semibold text-purple-400 mb-4">🎯 Use Cases</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Google Ads Campaigns</h4>
                        <p className="text-purple-400">
                          Calculate CPC for search campaigns and CPM for display campaigns. Optimize bids based on target CPA and ROAS goals.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Facebook & Instagram Ads</h4>
                        <p className="text-purple-400">
                          Track CPM for awareness campaigns and CPC for traffic/conversion campaigns. Compare performance across placements and audiences.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Multi-Platform Comparison</h4>
                        <p className="text-purple-400">
                          Compare CPC and CPM across Google, Facebook, LinkedIn, TikTok, and other platforms to allocate budget to the most efficient channels.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ContentSection>

              {/* Best Practices Section */}
              <ContentSection
                id="best-practices"
                title="CPC & CPM Best Practices"
              >
                <div className="prose max-w-none">
                  <div className="space-y-6">
                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">1. Choose the Right Pricing Model</h3>
                      <p className="text-text-secondary leading-relaxed mb-3">
                        <strong>Use CPC when:</strong> Your goal is clicks, traffic, or conversions. You pay only when users engage with your ad. Best for search ads, retargeting, and direct response campaigns.
                      </p>
                      <p className="text-text-secondary leading-relaxed">
                        <strong>Use CPM when:</strong> Your goal is brand awareness, reach, or impressions. You pay for ad visibility regardless of clicks. Best for display ads, video ads, and top-of-funnel campaigns.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">2. Monitor Industry Benchmarks</h3>
                      <p className="text-text-secondary leading-relaxed mb-3">
                        Average CPC and CPM vary significantly by industry and platform. Compare your metrics to industry standards:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-text-secondary">
                        <li><strong>Google Search CPC:</strong> $1-$2 (average), $5-$50+ (competitive industries)</li>
                        <li><strong>Facebook CPC:</strong> $0.50-$2.00 (most industries)</li>
                        <li><strong>Display CPM:</strong> $2-$10 (standard), $10-$30 (premium placements)</li>
                        <li><strong>LinkedIn CPC:</strong> $5-$10 (B2B targeting premium)</li>
                      </ul>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">3. Optimize for Quality Score</h3>
                      <p className="text-text-secondary leading-relaxed">
                        On Google Ads, higher Quality Scores (7-10) can reduce CPC by 30-50%. Improve Quality Score by enhancing ad relevance, landing page experience, and expected CTR.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">4. Test Different Bidding Strategies</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Experiment with manual CPC, enhanced CPC, target CPA, and maximize conversions bidding. Each strategy impacts your effective CPC and campaign performance differently.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">5. Segment and Analyze</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Break down CPC and CPM by device, location, time of day, and audience segment. Often, mobile CPC differs significantly from desktop, and certain demographics perform better.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 bg-red-500/10 p-6 rounded-lg border border-red-500/30">
                    <h3 className="text-lg font-semibold text-red-400 mb-3">🚫 Common Mistakes</h3>
                    <ul className="space-y-2 text-red-400">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">✗</span>
                        <span><strong>Focusing only on low CPC:</strong> Low CPC with poor conversion rate wastes money</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">✗</span>
                        <span><strong>Ignoring CTR:</strong> High CPM with low CTR means poor ad relevance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">✗</span>
                        <span><strong>Not tracking conversions:</strong> CPC means nothing without conversion data</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </ContentSection>

              {/* Metrics Explained Section */}
              <ContentSection
                id="metrics-explained"
                title="Advertising Metrics Explained"
              >
                <div className="prose max-w-none">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-500/30">
                      <h3 className="text-2xl font-semibold text-blue-400 mb-3">CPC (Cost Per Click)</h3>
                      <p className="text-blue-400 mb-3">
                        The amount you pay each time someone clicks your ad. Lower CPC means more efficient spending, but must be balanced with conversion quality.
                      </p>
                      <div className="bg-bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-text-secondary"><strong>Formula:</strong> Total Ad Spend ÷ Total Clicks</p>
                        <p className="text-sm text-text-secondary mt-2"><strong>Example:</strong> $500 spend ÷ 250 clicks = $2.00 CPC</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-500/30">
                      <h3 className="text-2xl font-semibold text-green-400 mb-3">CPM (Cost Per Mille)</h3>
                      <p className="text-green-400 mb-3">
                        The cost per 1,000 ad impressions. Used primarily for brand awareness campaigns where visibility matters more than immediate clicks.
                      </p>
                      <div className="bg-bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-text-secondary"><strong>Formula:</strong> (Total Ad Spend ÷ Total Impressions) × 1,000</p>
                        <p className="text-sm text-text-secondary mt-2"><strong>Example:</strong> ($500 ÷ 100,000) × 1,000 = $5.00 CPM</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-500/30">
                      <h3 className="text-2xl font-semibold text-purple-400 mb-3">CTR (Click-Through Rate)</h3>
                      <p className="text-purple-400 mb-3">
                        The percentage of people who click your ad after seeing it. Higher CTR indicates more relevant, compelling ads.
                      </p>
                      <div className="bg-bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-text-secondary"><strong>Formula:</strong> (Total Clicks ÷ Total Impressions) × 100</p>
                        <p className="text-sm text-text-secondary mt-2"><strong>Example:</strong> (250 ÷ 10,000) × 100 = 2.5% CTR</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ContentSection>

              {/* Examples Section */}
              <ContentSection
                id="examples"
                title="Calculation Examples"
              >
                <div className="prose max-w-none">
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-500/30">
                      <h3 className="text-2xl font-semibold text-blue-400 mb-4">Example 1: Google Search Campaign</h3>
                      <div className="bg-bg-secondary p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>Impressions:</strong> 50,000</div>
                          <div><strong>Clicks:</strong> 1,500</div>
                          <div><strong>Spend:</strong> $3,000</div>
                          <div><strong>Conversions:</strong> 75</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-blue-400">
                        <p><strong>CPC:</strong> $3,000 ÷ 1,500 = <span className="text-xl font-bold">$2.00</span></p>
                        <p><strong>CPM:</strong> ($3,000 ÷ 50,000) × 1,000 = <span className="text-xl font-bold">$60.00</span></p>
                        <p><strong>CTR:</strong> (1,500 ÷ 50,000) × 100 = <span className="text-xl font-bold">3.0%</span></p>
                        <p><strong>Conversion Rate:</strong> (75 ÷ 1,500) × 100 = <span className="text-xl font-bold">5.0%</span></p>
                        <p><strong>CPA:</strong> $3,000 ÷ 75 = <span className="text-xl font-bold">$40.00</span></p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-500/30">
                      <h3 className="text-2xl font-semibold text-green-400 mb-4">Example 2: Facebook Awareness Campaign</h3>
                      <div className="bg-bg-secondary p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>Impressions:</strong> 200,000</div>
                          <div><strong>Clicks:</strong> 2,000</div>
                          <div><strong>Spend:</strong> $1,000</div>
                          <div><strong>Conversions:</strong> 40</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-green-400">
                        <p><strong>CPC:</strong> $1,000 ÷ 2,000 = <span className="text-xl font-bold">$0.50</span></p>
                        <p><strong>CPM:</strong> ($1,000 ÷ 200,000) × 1,000 = <span className="text-xl font-bold">$5.00</span></p>
                        <p><strong>CTR:</strong> (2,000 ÷ 200,000) × 100 = <span className="text-xl font-bold">1.0%</span></p>
                        <p><strong>Conversion Rate:</strong> (40 ÷ 2,000) × 100 = <span className="text-xl font-bold">2.0%</span></p>
                        <p><strong>CPA:</strong> $1,000 ÷ 40 = <span className="text-xl font-bold">$25.00</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </ContentSection>

              {/* FAQ Section */}
              <FAQSection
                toolName="CPC/CPM Calculator"
                faqs={faqs}
                title="Frequently Asked Questions About CPC & CPM"
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

