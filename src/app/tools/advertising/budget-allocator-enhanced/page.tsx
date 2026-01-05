'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { allocateBudget, getRecommendations, AllocationMode } from '@/lib/tools/advertising/budgetAllocator';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { DollarSign, Plus, X } from 'lucide-react';

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
import { budgetAllocatorContent } from '@/data/tools/budget-allocator-content';

export default function BudgetAllocatorPage() {
  const [totalBudget, setTotalBudget] = useState(0);
  const [mode, setMode] = useState<AllocationMode>('equal');
  const [channels, setChannels] = useState([{ name: '', weight: 1, performance: 1 }]);
  const [result, setResult] = useState<any>(null);


  const handleAddChannel = () => {
    setChannels([...channels, { name: '', weight: 1, performance: 1 }]);
  };

  const handleRemoveChannel = (index: number) => {
    setChannels(channels.filter((_, i) => i !== index));
  };

  const handleChannelChange = (index: number, field: string, value: any) => {
    const updated = [...channels];
    updated[index] = { ...updated[index], [field]: value };
    setChannels(updated);
  };

  const handleAllocate = async () => {
    const summary = allocateBudget(totalBudget, channels, mode);
    const recommendations = getRecommendations(summary.allocations, totalBudget);

    setResult({ allocations: summary.allocations, recommendations });

  };

  const isFormValid = totalBudget > 0 && channels.every(ch => ch.name.trim());

  const tocItems = budgetAllocatorContent.tableOfContents;
  const howToSteps = budgetAllocatorContent.howToSteps;

  return (
    <>
      {/* Schema Markup */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Advertising', url: '/tools/advertising' },
          { name: 'Budget Allocator', url: '/tools/advertising/budget-allocator' },
        ]}
      />
      <HowToSchema
        name="How to Use Marketing Budget Allocator"
        description="Step-by-step guide to allocating marketing budgets across channels for maximum ROI"
        steps={howToSteps}
      />
      <SoftwareApplicationSchema
        name="Marketing Budget Allocator"
        description="Free online tool to allocate marketing budgets across channels using equal, weighted, or performance-based strategies"
        url="https://mediaplanpro.com/tools/advertising/budget-allocator"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={budgetAllocatorContent.metadata.title}
        description={budgetAllocatorContent.metadata.description}
        category="advertising"
      >
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {budgetAllocatorContent.hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {budgetAllocatorContent.hero.subtitle}
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              {budgetAllocatorContent.hero.description}
            </p>
          </div>

          {/* Quick Answer */}



          {/* Tool Interface - MOVED TO TOP */}
          <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
            <div className="space-y-6">


              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget">Total Marketing Budget ($) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="mode">Allocation Mode *</Label>
                  <Select value={mode} onValueChange={(value) => setMode(value as AllocationMode)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">Equal - Split evenly across channels</SelectItem>
                      <SelectItem value="weighted">Weighted - Based on priority/importance</SelectItem>
                      <SelectItem value="performance">Performance - Based on ROI/results</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Marketing Channels *</Label>
                    <Button variant="outline" size="sm" onClick={handleAddChannel}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Channel
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {channels.map((channel, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Input
                            placeholder="Channel name (e.g., Google Ads)"
                            value={channel.name}
                            onChange={(e) => handleChannelChange(index, 'name', e.target.value)}
                          />
                        </div>

                        {mode === 'weighted' && (
                          <div className="w-24">
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              placeholder="Weight"
                              value={channel.weight}
                              onChange={(e) => handleChannelChange(index, 'weight', Number(e.target.value))}
                            />
                          </div>
                        )}

                        {mode === 'performance' && (
                          <div className="w-24">
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              placeholder="Score"
                              value={channel.performance}
                              onChange={(e) => handleChannelChange(index, 'performance', Number(e.target.value))}
                            />
                          </div>
                        )}

                        {channels.length > 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveChannel(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={handleAllocate} className="w-full" size="lg" disabled={!isFormValid}>
                <DollarSign className="w-5 h-5 mr-2" />
                Allocate Budget
              </Button>

              {result && (
                <div className="space-y-6 pt-6 border-t border-border-primary">
                  <h3 className="text-xl font-semibold text-text-primary">
                    Budget Allocation
                  </h3>

                  <div className="grid gap-4">
                    {result.allocations.map((allocation: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-bg-secondary rounded-lg border border-border-primary"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-text-primary">{allocation.channel}</h4>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-400">
                              ${allocation.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-text-secondary">{allocation.percentage.toFixed(1)}%</p>
                          </div>
                        </div>
                        <p className="text-sm text-text-secondary">{allocation.recommendation}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#F59E0B]/10 p-4 rounded-lg border border-[#F59E0B]/30">
                    <h4 className="font-semibold text-[#F59E0B] mb-3">💡 Recommendations:</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-text-secondary flex items-start gap-2">
                          <span className="text-amber-600 mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <ExportButtons
                    data={result.allocations}
                    filename="budget-allocation"
                    options={{ copy: true, csv: true, pdf: true }}
                  />
                </div>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
            {/* Table of Contents - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <TableOfContents items={tocItems} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Quick Answer Box */}
              <QuickAnswer
                question={budgetAllocatorContent.quickAnswer.question}
                answer={budgetAllocatorContent.quickAnswer.answer}
              />

              {/* Tool Interface */}
              {/* How to Use Section */}
              <ContentSection
                id="how-to-use"
                title="How to Use the Marketing Budget Allocator"
              >
                <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  Our marketing budget allocator helps you distribute your advertising spend strategically across multiple channels. Whether you're managing a small business budget or enterprise-level campaigns, this tool provides data-driven allocation recommendations based on your chosen strategy.
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
                  <h3 className="text-lg font-semibold text-green-400 mb-3">✅ Best Practices</h3>
                  <ul className="space-y-2 text-green-400">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Review and adjust allocations quarterly based on performance data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Reserve 10-15% of budget for testing new channels and strategies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Track ROI and ROAS metrics for each channel to inform future allocations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Consider seasonal trends and industry benchmarks when allocating budgets</span>
                    </li>
                  </ul>
                </div>

              </ContentSection>

              {/* Benefits Section */}
              <ContentSection
                id="benefits"
                title="Benefits of Strategic Budget Allocation"
              >
                <div className="prose max-w-none">
                  <p className="text-lg text-text-secondary leading-relaxed mb-6">
                    Strategic budget allocation is the foundation of successful marketing campaigns. By distributing your resources effectively across channels, you can maximize return on investment, reduce wasted spend, and achieve better overall campaign performance.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">📊 Improved ROI</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Allocate more budget to high-performing channels and reduce spend on underperforming ones. Companies using data-driven budget allocation see an average <strong>25-40% improvement in marketing ROI</strong> compared to equal distribution strategies.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">🎯 Better Targeting</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Match budget allocation to where your target audience is most active. Performance-based allocation ensures you're investing in channels that deliver the highest quality leads and conversions for your specific business goals.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">💰 Cost Efficiency</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Eliminate budget waste by identifying and reducing spend on ineffective channels. Strategic allocation can reduce customer acquisition costs (CAC) by <strong>15-30%</strong> while maintaining or increasing lead volume.
                      </p>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary shadow-sm">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">📈 Scalable Growth</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Build a sustainable growth strategy by continuously optimizing budget allocation based on performance data. This approach allows you to scale successful channels while testing new opportunities with controlled risk.
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-500/10 p-6 rounded-lg border border-purple-500/30">
                    <h3 className="text-lg font-semibold text-purple-400 mb-4">🎯 Use Cases</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">E-commerce Businesses</h4>
                        <p className="text-purple-400">
                          Allocate budgets across Google Ads, Facebook Ads, Instagram, email marketing, and influencer partnerships based on conversion rates and customer lifetime value (CLV) for each channel.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">B2B SaaS Companies</h4>
                        <p className="text-purple-400">
                          Distribute budgets between LinkedIn Ads, content marketing, SEO, webinars, and account-based marketing (ABM) campaigns based on lead quality scores and sales cycle metrics.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Local Service Businesses</h4>
                        <p className="text-purple-400">
                          Balance spending across Google Local Services Ads, Facebook local awareness campaigns, direct mail, and community sponsorships based on cost per lead and conversion rates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ContentSection>

              {/* Allocation Strategies Section */}
              <ContentSection
                id="strategies"
                title="Budget Allocation Strategies"
              >
                <div className="prose max-w-none">
                  <p className="text-lg text-text-secondary leading-relaxed mb-6">
                    Different allocation strategies serve different business objectives. Understanding when to use each approach is crucial for maximizing your marketing effectiveness.
                  </p>

                  <div className="space-y-6">
                    <div className="bg-bg-secondary p-6 rounded-lg border-2 border-blue-500/30">
                      <h3 className="text-2xl font-semibold text-blue-400 mb-3">Equal Distribution</h3>
                      <p className="text-text-secondary leading-relaxed mb-4">
                        <strong>Best for:</strong> New campaigns, testing phases, or when you have limited performance data. This strategy splits your budget evenly across all channels, providing a baseline for comparison.
                      </p>
                      <div className="bg-blue-500/10 p-4 rounded-lg">
                        <p className="text-sm text-blue-400 mb-2"><strong>When to use:</strong></p>
                        <ul className="text-sm text-blue-400 space-y-1 ml-4">
                          <li>• Launching a new product or service</li>
                          <li>• Testing multiple channels simultaneously</li>
                          <li>• Limited historical performance data available</li>
                          <li>• Want to establish performance benchmarks</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border-2 border-green-500/30">
                      <h3 className="text-2xl font-semibold text-green-400 mb-3">Weighted Allocation</h3>
                      <p className="text-text-secondary leading-relaxed mb-4">
                        <strong>Best for:</strong> Strategic prioritization based on business goals, market opportunities, or channel importance. Assign weights (1-10) to channels based on strategic value rather than past performance.
                      </p>
                      <div className="bg-green-500/10 p-4 rounded-lg">
                        <p className="text-sm text-green-400 mb-2"><strong>When to use:</strong></p>
                        <ul className="text-sm text-green-400 space-y-1 ml-4">
                          <li>• Prioritizing brand awareness over direct response</li>
                          <li>• Entering new markets or demographics</li>
                          <li>• Balancing short-term and long-term goals</li>
                          <li>• Strategic channel development initiatives</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border-2 border-purple-500/30">
                      <h3 className="text-2xl font-semibold text-purple-400 mb-3">Performance-Based Allocation</h3>
                      <p className="text-text-secondary leading-relaxed mb-4">
                        <strong>Best for:</strong> Mature campaigns with solid performance data. Allocate budgets based on ROI, ROAS, conversion rates, or other key performance indicators. This data-driven approach maximizes efficiency.
                      </p>
                      <div className="bg-purple-500/10 p-4 rounded-lg">
                        <p className="text-sm text-purple-400 mb-2"><strong>When to use:</strong></p>
                        <ul className="text-sm text-purple-400 space-y-1 ml-4">
                          <li>• 3+ months of performance data available</li>
                          <li>• Clear ROI/ROAS metrics for each channel</li>
                          <li>• Optimizing for maximum efficiency</li>
                          <li>• Scaling proven successful channels</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-[#F59E0B]/10 p-6 rounded-lg border border-[#F59E0B]/30">
                    <h3 className="text-lg font-semibold text-[#F59E0B] mb-3">⚖️ Hybrid Approach</h3>
                    <p className="text-text-secondary leading-relaxed">
                      Many successful marketers use a <strong>hybrid allocation strategy</strong>: allocate 70-80% of budget based on performance data, 10-20% for strategic priorities, and 10% for testing new channels. This balances optimization with innovation and risk management.
                    </p>
                  </div>
                </div>
              </ContentSection>

              {/* Best Practices Section */}
              <ContentSection
                id="best-practices"
                title="Budget Allocation Best Practices"
              >
                <div className="prose max-w-none">
                  <p className="text-lg text-text-secondary leading-relaxed mb-6">
                    Follow these proven best practices to maximize the effectiveness of your budget allocation strategy and avoid common pitfalls that waste marketing dollars.
                  </p>

                  <div className="space-y-6">
                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">1. Track Everything</h3>
                      <p className="text-text-secondary leading-relaxed mb-3">
                        Implement comprehensive tracking across all channels using UTM parameters, conversion pixels, and analytics platforms. You can't optimize what you don't measure. Track not just conversions, but also micro-conversions, engagement metrics, and customer journey touchpoints.
                      </p>
                      <div className="bg-bg-tertiary p-4 rounded-lg">
                        <p className="text-sm text-text-primary"><strong>Key metrics to track:</strong> CPA, ROAS, CLV, conversion rate, engagement rate, bounce rate, time to conversion</p>
                      </div>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">2. Review Regularly</h3>
                      <p className="text-text-secondary leading-relaxed mb-3">
                        Set a consistent schedule for budget reviews—monthly for active campaigns, quarterly for strategic planning. Market conditions, competition, and platform algorithms change constantly. What worked last quarter may not work today.
                      </p>
                      <div className="bg-bg-tertiary p-4 rounded-lg">
                        <p className="text-sm text-text-primary"><strong>Review schedule:</strong> Weekly for active campaigns, monthly for tactical adjustments, quarterly for strategic reallocations</p>
                      </div>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">3. Reserve Testing Budget</h3>
                      <p className="text-text-secondary leading-relaxed mb-3">
                        Always allocate 10-15% of your total budget for testing new channels, audiences, creatives, and strategies. This "innovation budget" prevents stagnation and helps you discover new growth opportunities before competitors.
                      </p>
                      <div className="bg-bg-tertiary p-4 rounded-lg">
                        <p className="text-sm text-text-primary"><strong>Testing priorities:</strong> New platforms, emerging channels, different audience segments, creative variations, messaging angles</p>
                      </div>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">4. Consider Customer Lifetime Value</h3>
                      <p className="text-text-secondary leading-relaxed mb-3">
                        Don't just optimize for immediate ROAS. Channels that bring higher CLV customers may justify higher acquisition costs. A channel with 2x ROAS but 3x CLV is more valuable than one with 3x ROAS but 1x CLV.
                      </p>
                      <div className="bg-bg-tertiary p-4 rounded-lg">
                        <p className="text-sm text-text-primary"><strong>CLV factors:</strong> Repeat purchase rate, average order value, retention rate, referral value, upsell potential</p>
                      </div>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">5. Account for Seasonality</h3>
                      <p className="text-text-secondary leading-relaxed mb-3">
                        Adjust allocations based on seasonal trends in your industry. Retail businesses should increase budgets before Q4, B2B companies may see slowdowns in summer, and service businesses have their own seasonal patterns.
                      </p>
                      <div className="bg-bg-tertiary p-4 rounded-lg">
                        <p className="text-sm text-text-primary"><strong>Seasonal planning:</strong> Analyze 2-3 years of historical data, plan budget increases 2-3 months before peak seasons, reduce spend during known slow periods</p>
                      </div>
                    </div>

                    <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">6. Don't Abandon Underperformers Too Quickly</h3>
                      <p className="text-text-secondary leading-relaxed mb-3">
                        Give new channels at least 3 months and sufficient budget to gather meaningful data. Some channels (like SEO or content marketing) have longer payback periods but deliver sustainable long-term results.
                      </p>
                      <div className="bg-bg-tertiary p-4 rounded-lg">
                        <p className="text-sm text-text-primary"><strong>Evaluation timeline:</strong> Paid ads: 30-60 days, SEO: 6-12 months, Content marketing: 3-6 months, Social organic: 2-4 months</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-red-500/10 p-6 rounded-lg border border-red-500/30">
                    <h3 className="text-lg font-semibold text-red-400 mb-3">🚫 Common Mistakes to Avoid</h3>
                    <ul className="space-y-2 text-red-400">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">✗</span>
                        <span><strong>Spreading too thin:</strong> Better to dominate 3-4 channels than be mediocre in 10</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">✗</span>
                        <span><strong>Ignoring attribution:</strong> Last-click attribution undervalues awareness and consideration channels</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">✗</span>
                        <span><strong>Set-and-forget mentality:</strong> Markets change; your allocation should too</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">✗</span>
                        <span><strong>Chasing vanity metrics:</strong> Focus on revenue and profit, not just impressions or clicks</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </ContentSection>

              {/* Examples Section */}
              <ContentSection
                id="examples"
                title="Budget Allocation Examples"
              >
                <div className="prose max-w-none">
                  <p className="text-lg text-text-secondary leading-relaxed mb-6">
                    See how different businesses allocate their marketing budgets based on their goals, industry, and growth stage.
                  </p>

                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-500/30">
                      <h3 className="text-2xl font-semibold text-blue-400 mb-4">Example 1: E-commerce Startup ($10,000/month)</h3>
                      <p className="text-blue-400 mb-4"><strong>Goal:</strong> Rapid customer acquisition and brand awareness</p>
                      <div className="bg-bg-secondary p-4 rounded-lg mb-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-border-primary">
                            <span className="font-semibold text-text-primary">Facebook/Instagram Ads</span>
                            <span className="text-xl font-bold text-blue-400">$4,000 (40%)</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-border-primary">
                            <span className="font-semibold text-text-primary">Google Shopping Ads</span>
                            <span className="text-xl font-bold text-blue-400">$3,000 (30%)</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-border-primary">
                            <span className="font-semibold text-text-primary">Influencer Marketing</span>
                            <span className="text-xl font-bold text-blue-400">$1,500 (15%)</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-border-primary">
                            <span className="font-semibold text-text-primary">Email Marketing</span>
                            <span className="text-xl font-bold text-blue-400">$500 (5%)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-text-primary">Testing Budget</span>
                            <span className="text-xl font-bold text-blue-400">$1,000 (10%)</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-blue-400">
                        <strong>Rationale:</strong> Heavy focus on paid social and search for immediate sales. Influencer marketing builds brand credibility. Testing budget explores TikTok and Pinterest.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-500/30">
                      <h3 className="text-2xl font-semibold text-green-400 mb-4">Example 2: B2B SaaS Company ($50,000/month)</h3>
                      <p className="text-green-400 mb-4"><strong>Goal:</strong> High-quality lead generation and thought leadership</p>
                      <div className="bg-bg-secondary p-4 rounded-lg mb-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-border-primary">
                            <span className="font-semibold text-text-primary">LinkedIn Ads</span>
                            <span className="text-xl font-bold text-green-400">$15,000 (30%)</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-border-primary">
                            <span className="font-semibold text-text-primary">Content Marketing/SEO</span>
                            <span className="text-xl font-bold text-green-400">$12,500 (25%)</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-border-primary">
                            <span className="font-semibold text-text-primary">Google Search Ads</span>
                            <span className="text-xl font-bold text-green-400">$10,000 (20%)</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-border-primary">
                            <span className="font-semibold text-text-primary">Webinars/Events</span>
                            <span className="text-xl font-bold text-green-400">$7,500 (15%)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-text-primary">Account-Based Marketing</span>
                            <span className="text-xl font-bold text-green-400">$5,000 (10%)</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-green-400">
                        <strong>Rationale:</strong> LinkedIn targets decision-makers. Content/SEO builds long-term organic traffic. ABM focuses on high-value enterprise accounts.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-500/30">
                      <h3 className="text-2xl font-semibold text-purple-400 mb-4">Example 3: Local Service Business ($5,000/month)</h3>
                      <p className="text-purple-400 mb-4"><strong>Goal:</strong> Local visibility and phone call conversions</p>
                      <div className="bg-bg-secondary p-4 rounded-lg mb-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-border-primary">
                            <span className="font-semibold text-text-primary">Google Local Services Ads</span>
                            <span className="text-xl font-bold text-purple-400">$2,000 (40%)</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-border-primary">
                            <span className="font-semibold text-text-primary">Facebook Local Awareness</span>
                            <span className="text-xl font-bold text-purple-400">$1,250 (25%)</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-border-primary">
                            <span className="font-semibold text-text-primary">SEO/Google Business Profile</span>
                            <span className="text-xl font-bold text-purple-400">$1,000 (20%)</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-border-primary">
                            <span className="font-semibold text-text-primary">Direct Mail/Print</span>
                            <span className="text-xl font-bold text-purple-400">$500 (10%)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-text-primary">Community Sponsorships</span>
                            <span className="text-xl font-bold text-purple-400">$250 (5%)</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-purple-400">
                        <strong>Rationale:</strong> Heavy focus on local search and awareness. SEO investment builds long-term visibility. Community presence builds trust and referrals.
                      </p>
                    </div>
                  </div>
                </div>
              </ContentSection>

              {/* FAQ Section */}
              <FAQSection
                toolName="Budget Allocator"
                faqs={budgetAllocatorContent.faqs}
                title="Frequently Asked Questions About Budget Allocation"
              />

              {/* Related Tools */}
              <RelatedTools
                tools={budgetAllocatorContent.relatedTools}
                title="Related Marketing Tools"
              />
            </div>
          </div>
        </div >
      </ToolLayout >
    </>
  );
}

