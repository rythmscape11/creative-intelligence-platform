'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calculateROI, getROIRating, getROASRating } from '@/lib/tools/advertising/roiCalculator';
import { ROIInput, ROIOutput } from '@/types/tools';
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
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
import { roiCalculatorContent } from '@/data/tools/roi-calculator-content';
import { EmailCaptureModal } from '@/components/cro/EmailCaptureModal';

export default function ROICalculatorEnhancedPage() {
  const [input, setInput] = useState<ROIInput>({
    investment: 0,
    revenue: 0,
    costs: 0,
    customers: 0,
    avgOrderValue: 0,
    customerLifetimeMonths: 0
  });

  const [result, setResult] = useState<ROIOutput | null>(null);

  // Email capture state
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = async () => {
    const output = calculateROI(input);
    setResult(output);
    setHasCalculated(true);
  };

  // Show email capture 3 seconds after first calculation
  useEffect(() => {
    if (hasCalculated && !localStorage.getItem('email-captured-roi-calculator')) {
      const timer = setTimeout(() => {
        setShowEmailCapture(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasCalculated]);

  const handleInputChange = (field: keyof ROIInput, value: string) => {
    setInput(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const roiRating = result ? getROIRating(parseFloat(result.roi)) : null;
  const roasRating = result ? getROASRating(parseFloat(result.roas)) : null;

  const { tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = roiCalculatorContent;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Advertising Tools', url: '/tools#advertising' },
          { name: 'ROI Calculator', url: '/tools/advertising/roi-calculator' },
        ]}
      />

      <HowToSchema
        name="How to Calculate Marketing ROI and ROAS"
        description="Step-by-step guide to calculating return on investment and return on ad spend for marketing campaigns"
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="ROI & ROAS Calculator"
        description="Free calculator for marketing return on investment (ROI) and return on ad spend (ROAS) with customer lifetime value analysis"
        url="https://mediaplanpro.com/tools/advertising/roi-calculator"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={roiCalculatorContent.metadata.title}
        description={roiCalculatorContent.metadata.description}
        category="advertising"
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {roiCalculatorContent.hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {roiCalculatorContent.hero.subtitle}
            </p>
          </div>

          {/* Quick Answer */}


          {/* Main Content Grid */}

          {/* Tool Interface - MOVED TO TOP */}
          <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
            <div className="space-y-6">
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                <p className="text-sm text-blue-400">
                  💡 <strong>Tip:</strong> Include all costs (ad spend, creative, tools, agency fees) for accurate ROI calculation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="investment" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Investment ($)
                  </Label>
                  <Input
                    id="investment"
                    type="number"
                    placeholder="5000"
                    value={input.investment || ''}
                    onChange={(e) => handleInputChange('investment', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="revenue" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Revenue Generated ($)
                  </Label>
                  <Input
                    id="revenue"
                    type="number"
                    placeholder="15000"
                    value={input.revenue || ''}
                    onChange={(e) => handleInputChange('revenue', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="costs">Additional Costs ($)</Label>
                  <Input
                    id="costs"
                    type="number"
                    placeholder="1000"
                    value={input.costs || ''}
                    onChange={(e) => handleInputChange('costs', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="customers" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Customers Acquired
                  </Label>
                  <Input
                    id="customers"
                    type="number"
                    placeholder="50"
                    value={input.customers || ''}
                    onChange={(e) => handleInputChange('customers', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="avgOrderValue">Average Order Value ($)</Label>
                  <Input
                    id="avgOrderValue"
                    type="number"
                    placeholder="300"
                    value={input.avgOrderValue || ''}
                    onChange={(e) => handleInputChange('avgOrderValue', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="customerLifetimeMonths" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Customer Lifetime (Months)
                  </Label>
                  <Input
                    id="customerLifetimeMonths"
                    type="number"
                    placeholder="12"
                    value={input.customerLifetimeMonths || ''}
                    onChange={(e) => handleInputChange('customerLifetimeMonths', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full"
                size="lg"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Calculate ROI
              </Button>

              {result && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Results</h3>
                    <ExportButtons
                      data={result}
                      filename="roi-analysis"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-500/30">
                      <div className="text-sm text-green-700 mb-2">Return on Investment (ROI)</div>
                      <div className="text-4xl font-bold text-green-400">{result.roi}%</div>
                      {roiRating && (
                        <div className={`text-sm mt-2 text-${roiRating.color}-700`}>{roiRating.rating}</div>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-500/30">
                      <div className="text-sm text-blue-700 mb-2">Return on Ad Spend (ROAS)</div>
                      <div className="text-4xl font-bold text-blue-400">{result.roas}:1</div>
                      {roasRating && (
                        <div className={`text-sm mt-2 text-${roasRating.color}-700`}>{roasRating.rating}</div>
                      )}
                    </div>

                    <div className="bg-bg-secondary p-4 rounded-lg border border-border-primary">
                      <div className="text-sm text-text-secondary">Net Profit</div>
                      <div className="text-2xl font-bold text-text-primary">${result.netProfit}</div>
                    </div>

                    <div className="bg-bg-secondary p-4 rounded-lg border border-border-primary">
                      <div className="text-sm text-text-secondary">Customer Acquisition Cost</div>
                      <div className="text-2xl font-bold text-text-primary">${result.cac}</div>
                    </div>

                    {result.clv && (
                      <div className="bg-bg-secondary p-4 rounded-lg border border-border-primary">
                        <div className="text-sm text-text-secondary">Customer Lifetime Value</div>
                        <div className="text-2xl font-bold text-text-primary">${result.clv}</div>
                      </div>
                    )}

                    {result.breakEven && (
                      <div className="bg-bg-secondary p-4 rounded-lg border border-border-primary">
                        <div className="text-sm text-text-secondary">Break-Even Point</div>
                        <div className="text-2xl font-bold text-text-primary">{result.breakEven} customers</div>
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
                title="How to Use the ROI Calculator"
              >
                <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  Calculate comprehensive ROI metrics including return on investment percentage, return on ad spend ratio, net profit, cost per acquisition, customer lifetime value, and payback period. Enter your campaign data to get instant profitability analysis.
                </p>

                <p className="text-text-secondary leading-relaxed mb-4">
                  Measuring ROI is crucial for campaign success. Our calculator helps you:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                  {howToSteps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.name}:</strong> {step.text}
                    </li>
                  ))}
                </ol>

                <div className="mt-8 bg-blue-500/10 p-6 rounded-lg border border-blue-500/30">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">💡 Key Formulas</h3>
                  <ul className="space-y-2 text-blue-400">
                    <li><strong>ROI:</strong> (Revenue - Investment) ÷ Investment × 100</li>
                    <li><strong>ROAS:</strong> Revenue ÷ Ad Spend</li>
                    <li><strong>Net Profit:</strong> Revenue - Total Costs</li>
                    <li><strong>CPA:</strong> Total Investment ÷ Customers Acquired</li>
                    <li><strong>CLV:</strong> Average Order Value × Purchase Frequency × Customer Lifetime</li>
                  </ul>
                </div>

              </ContentSection>

              {/* Benefits Section */}
              <ContentSection
                id="benefits"
                title="Benefits of Tracking ROI & ROAS"
              >
                <div className="prose max-w-none">
                  <p className="text-lg text-text-secondary leading-relaxed mb-6">
                    ROI and ROAS are the most important metrics for evaluating marketing effectiveness. They directly measure profitability and guide strategic budget allocation decisions.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">📊 Data-Driven Decisions</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Know exactly which campaigns, channels, and strategies are profitable. Eliminate guesswork and allocate budget based on proven performance.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">💰 Budget Optimization</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Shift spending from low-ROI to high-ROI campaigns. Companies that track ROI rigorously achieve 30-50% better marketing efficiency.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">📈 Stakeholder Reporting</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Demonstrate marketing value to executives and stakeholders with clear ROI metrics. Justify budget increases with proven returns.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">🎯 Performance Benchmarking</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Compare ROI across campaigns, channels, and time periods. Identify trends and optimize for continuous improvement.
                      </p>
                    </div>
                  </div>
                </div>
              </ContentSection>

              {/* Best Practices Section */}
              <ContentSection
                id="best-practices"
                title="ROI Measurement Best Practices"
              >
                <div className="prose max-w-none">
                  <div className="space-y-6">
                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">1. Include All Costs</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Don't just count ad spend. Include creative production, agency fees, tools/software, employee time, and overhead. Incomplete cost tracking inflates ROI by 20-40%.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">2. Use Proper Attribution</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Last-click attribution undervalues awareness and consideration channels. Use multi-touch attribution to accurately credit all touchpoints in the customer journey.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">3. Consider Customer Lifetime Value</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Don't just measure first-purchase ROI. Calculate CLV to understand true long-term profitability. Subscription businesses should track 12-24 month CLV.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">4. Set Realistic Benchmarks</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Average marketing ROI varies by industry: E-commerce (200-400%), B2B SaaS (300-500%), Services (150-300%). Compare against your industry, not generic benchmarks.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">5. Track by Channel and Campaign</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Calculate ROI separately for each channel (Google Ads, Facebook, email, SEO) and campaign. Aggregate ROI hides underperformers and overperformers.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 bg-red-500/10 p-6 rounded-lg border border-red-500/30">
                    <h3 className="text-lg font-semibold text-red-400 mb-3">🚫 Common Mistakes</h3>
                    <ul className="space-y-2 text-red-400">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">✗</span>
                        <span><strong>Ignoring time lag:</strong> B2B sales cycles can be 3-12 months</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">✗</span>
                        <span><strong>Forgetting overhead:</strong> Include tools, salaries, and indirect costs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">✗</span>
                        <span><strong>Short-term thinking:</strong> Some channels (SEO, content) have delayed ROI</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </ContentSection>

              {/* Metrics Explained Section */}
              <ContentSection
                id="metrics-explained"
                title="ROI Metrics Explained"
              >
                <div className="prose max-w-none">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-500/30">
                      <h3 className="text-2xl font-semibold text-green-400 mb-3">ROI (Return on Investment)</h3>
                      <p className="text-green-400 mb-3">
                        Expressed as a percentage, ROI shows how much profit you made relative to your investment. 200% ROI means you tripled your money (made $2 profit on $1 investment).
                      </p>
                      <div className="bg-bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-text-secondary"><strong>Formula:</strong> (Revenue - Investment) ÷ Investment × 100</p>
                        <p className="text-sm text-text-secondary mt-2"><strong>Example:</strong> ($15,000 - $5,000) ÷ $5,000 × 100 = 200% ROI</p>
                        <p className="text-sm text-text-secondary mt-2"><strong>Good ROI:</strong> 200%+ (e-commerce), 300%+ (B2B SaaS)</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-500/30">
                      <h3 className="text-2xl font-semibold text-blue-400 mb-3">ROAS (Return on Ad Spend)</h3>
                      <p className="text-blue-400 mb-3">
                        Expressed as a ratio, ROAS shows revenue generated per dollar of ad spend. 5:1 ROAS means $5 revenue for every $1 spent on ads.
                      </p>
                      <div className="bg-bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-text-secondary"><strong>Formula:</strong> Revenue ÷ Ad Spend</p>
                        <p className="text-sm text-text-secondary mt-2"><strong>Example:</strong> $15,000 ÷ $3,000 = 5:1 ROAS</p>
                        <p className="text-sm text-text-secondary mt-2"><strong>Good ROAS:</strong> 4:1+ (e-commerce), 5:1+ (high-margin products)</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-500/30">
                      <h3 className="text-2xl font-semibold text-purple-400 mb-3">Customer Lifetime Value (CLV)</h3>
                      <p className="text-purple-400 mb-3">
                        The total revenue a customer generates over their entire relationship with your business. Critical for subscription and repeat-purchase businesses.
                      </p>
                      <div className="bg-bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-text-secondary"><strong>Formula:</strong> Avg Order Value × Purchase Frequency × Customer Lifetime</p>
                        <p className="text-sm text-text-secondary mt-2"><strong>Example:</strong> $100 × 3 purchases/year × 2 years = $600 CLV</p>
                        <p className="text-sm text-text-secondary mt-2"><strong>Rule:</strong> CLV should be 3x+ your CPA for sustainable growth</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ContentSection>

              {/* Examples Section */}
              <ContentSection
                id="examples"
                title="ROI Calculation Examples"
              >
                <div className="prose max-w-none">
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-500/30">
                      <h3 className="text-2xl font-semibold text-green-400 mb-4">Example 1: E-commerce Google Ads Campaign</h3>
                      <div className="bg-bg-secondary p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>Ad Spend:</strong> $5,000</div>
                          <div><strong>Additional Costs:</strong> $1,000</div>
                          <div><strong>Revenue:</strong> $20,000</div>
                          <div><strong>Customers:</strong> 100</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-green-400">
                        <p><strong>ROI:</strong> ($20,000 - $6,000) ÷ $6,000 × 100 = <span className="text-2xl font-bold">233%</span></p>
                        <p><strong>ROAS:</strong> $20,000 ÷ $5,000 = <span className="text-2xl font-bold">4:1</span></p>
                        <p><strong>CPA:</strong> $6,000 ÷ 100 = <span className="text-2xl font-bold">$60</span></p>
                        <p className="mt-4 text-sm"><strong>Analysis:</strong> Excellent ROI and ROAS. Campaign is highly profitable and should be scaled.</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-500/30">
                      <h3 className="text-2xl font-semibold text-blue-400 mb-4">Example 2: B2B SaaS LinkedIn Campaign</h3>
                      <div className="bg-bg-secondary p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>Ad Spend:</strong> $10,000</div>
                          <div><strong>Additional Costs:</strong> $3,000</div>
                          <div><strong>Revenue (Year 1):</strong> $50,000</div>
                          <div><strong>Customers:</strong> 20</div>
                          <div><strong>Avg CLV:</strong> $5,000</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-blue-400">
                        <p><strong>ROI:</strong> ($50,000 - $13,000) ÷ $13,000 × 100 = <span className="text-2xl font-bold">285%</span></p>
                        <p><strong>ROAS:</strong> $50,000 ÷ $10,000 = <span className="text-2xl font-bold">5:1</span></p>
                        <p><strong>CPA:</strong> $13,000 ÷ 20 = <span className="text-2xl font-bold">$650</span></p>
                        <p><strong>CLV:CPA Ratio:</strong> $5,000 ÷ $650 = <span className="text-2xl font-bold">7.7:1</span></p>
                        <p className="mt-4 text-sm"><strong>Analysis:</strong> Outstanding performance. CLV is 7.7x CPA, indicating sustainable, profitable growth.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ContentSection>

              {/* FAQ Section */}
              <FAQSection
                toolName="ROI Calculator"
                faqs={faqs}
                title="Frequently Asked Questions About ROI & ROAS"
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

      <EmailCaptureModal
        isOpen={showEmailCapture}
        onClose={() => {
          setShowEmailCapture(false);
          localStorage.setItem('email-captured-roi-calculator', 'true');
        }}
        source="roi-calculator"
        toolId="roi-calculator-enhanced"
        title="Get Your ROI Report + Marketing Analytics Guide"
        description="Save your ROI calculations and receive expert tips on marketing analytics and optimization"
        incentive="Free Marketing Analytics Toolkit (worth $99)"
      />
    </>
  );
}

