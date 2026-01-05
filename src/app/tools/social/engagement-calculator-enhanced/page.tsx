'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateEngagement } from '@/lib/tools/social/engagementCalculator';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { EngagementInput, EngagementOutput } from '@/types/tools';
import { TrendingUp } from 'lucide-react';
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
import { engagementCalculatorContent } from '@/data/tools/engagement-calculator-content';

export default function engagementCalculatorEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = engagementCalculatorContent;

  // Tool state and logic
  const [input, setInput] = useState<EngagementInput>({
    followers: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    platform: 'instagram'
  });

  const [result, setResult] = useState<EngagementOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);


  const handleCalculate = async () => {
    // Catch calculation errors so we can present actionable guidance instead of the generic error toast.
    setError(null);
    setIsCalculating(true);

    try {
      const output = calculateEngagement(input);
      setResult(output);
    } catch (err) {
      console.error('Engagement calculation failed', err);
      setResult(null);
      setError(err instanceof Error ? err.message : 'Unable to calculate engagement rate. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };
  const isCalculateDisabled = input.followers <= 0;

  const ratingColors = {
    Excellent: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    Good: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    Average: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    Poor: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' }
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Social Tools', url: '/tools#social' },
          { name: metadata.title, url: '/tools/social/engagement-calculator' },
        ]}
      />

      <HowToSchema
        name="How to Use Engagement Rate Calculator"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name={metadata.title}
        description={metadata.description}
        url="https://mediaplanpro.com/tools/social/engagement-calculator"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={metadata.title}
        description={metadata.description}
        category="social"
      >
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {hero.subtitle}
            </p>

            {/* Tool Interface - MOVED TO TOP */}
            <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
              <div className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="platform">Platform *</Label>
                    <Select
                      value={input.platform}
                      onValueChange={(value: any) => setInput(prev => ({ ...prev, platform: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="followers">Followers *</Label>
                    <Input
                      id="followers"
                      type="number"
                      placeholder="10000"
                      value={input.followers || ''}
                      onChange={(e) => setInput(prev => ({ ...prev, followers: parseInt(e.target.value) || 0 }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="likes">Likes *</Label>
                    <Input
                      id="likes"
                      type="number"
                      placeholder="350"
                      value={input.likes || ''}
                      onChange={(e) => setInput(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="comments">Comments *</Label>
                    <Input
                      id="comments"
                      type="number"
                      placeholder="45"
                      value={input.comments || ''}
                      onChange={(e) => setInput(prev => ({ ...prev, comments: parseInt(e.target.value) || 0 }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shares">Shares/Retweets *</Label>
                    <Input
                      id="shares"
                      type="number"
                      placeholder="25"
                      value={input.shares || ''}
                      onChange={(e) => setInput(prev => ({ ...prev, shares: parseInt(e.target.value) || 0 }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-md border border-error/40 bg-error/10 p-4 text-sm text-error" role="alert">
                    {error}
                  </div>
                )}

                <Button onClick={handleCalculate} className="w-full" size="lg" disabled={isCalculateDisabled || isCalculating}>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  {isCalculating ? 'Calculating...' : 'Calculate Engagement'}
                </Button>

                {result && (
                  <div className="space-y-6 pt-6 border-t border-border-primary">
                    <h3 className="text-xl font-semibold text-text-primary">Results</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-6 ${ratingColors[result.rating as keyof typeof ratingColors].bg} rounded-lg border-2 ${ratingColors[result.rating as keyof typeof ratingColors].border}`}>
                        <p className="text-sm font-medium text-text-secondary mb-2">Engagement Rate</p>
                        <p className={`text-4xl font-bold ${ratingColors[result.rating as keyof typeof ratingColors].text}`}>
                          {result.engagementRate}%
                        </p>
                        <p className={`text-sm mt-2 ${ratingColors[result.rating as keyof typeof ratingColors].text}`}>
                          {result.rating}
                        </p>
                      </div>

                      <div className="p-6 bg-bg-tertiary rounded-lg border border-border-primary">
                        <p className="text-sm font-medium text-text-secondary mb-2">Total Engagements</p>
                        <p className="text-4xl font-bold text-text-primary">
                          {result.totalEngagements.toLocaleString()}
                        </p>
                        <p className="text-sm mt-2 text-text-secondary">
                          Benchmark: {result.benchmark}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
                        <p className="text-sm text-text-secondary">Avg. Engagements/Post</p>
                        <p className="text-2xl font-semibold text-text-primary">
                          {result.avgEngagementsPerPost ? Number(result.avgEngagementsPerPost).toLocaleString() : '—'}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
                        <p className="text-sm text-text-secondary">Comment to Like Ratio</p>
                        <p className="text-2xl font-semibold text-text-primary">{result.commentToLikeRatio}%</p>
                      </div>
                      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
                        <p className="text-sm text-text-secondary">Share Rate</p>
                        <p className="text-2xl font-semibold text-text-primary">{result.shareRate}%</p>
                      </div>
                      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4 col-span-full lg:col-span-1">
                        <p className="text-sm text-text-secondary">Virality Score</p>
                        <p className="text-2xl font-semibold text-text-primary">{result.viralityScore}</p>
                      </div>
                    </div>

                    {result.insights && result.insights.length > 0 && (
                      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
                        <h4 className="mb-2 text-base font-semibold text-text-primary">Insights</h4>
                        <ul className="space-y-1 text-sm text-text-secondary">
                          {result.insights.map((insight, index) => (
                            <li key={index}>• {insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.recommendations && result.recommendations.length > 0 && (
                      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
                        <h4 className="mb-2 text-base font-semibold text-yellow-400">Recommended Next Steps</h4>
                        <ul className="space-y-1 text-sm text-yellow-100">
                          {result.recommendations.map((recommendation, index) => (
                            <li key={index}>• {recommendation}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <ExportButtons
                      data={result}
                      filename="engagement-calculation"
                      options={{ copy: true, pdf: true }}
                    />
                  </div>
                )}
              </div>
            </section>

          </div>



          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <TableOfContents items={tableOfContents} />
            </div>

            <div className="lg:col-span-3 space-y-12">
              {/* Quick Answer Box */}
              <QuickAnswer
                question={quickAnswer.question}
                answer={quickAnswer.answer}
              />
              <ContentSection
                id="how-to-use"
                title="How to Use the Engagement Rate Calculator"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Engagement rate is a key metric for social media success. Our calculator helps you:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                  {howToSteps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.name}:</strong> {step.text}
                    </li>
                  ))}
                </ol>
              </ContentSection>

              <FAQSection
                toolName="Engagement Rate Calculator"
                faqs={faqs}
              />

              <ContentSection
                id="related-tools"
                title="Related Social Tools"
              >
                <RelatedTools tools={relatedTools} />
              </ContentSection>
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  );
}
