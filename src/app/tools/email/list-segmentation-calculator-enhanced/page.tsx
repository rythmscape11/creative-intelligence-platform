'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calculateListSegmentation } from '@/lib/tools/email/listSegmentation';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Users } from 'lucide-react';
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
import { listSegmentationCalculatorContent } from '@/data/tools/list-segmentation-calculator-content';

export default function ListSegmentationCalculatorEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = listSegmentationCalculatorContent;

  // Tool state
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [engagementRate, setEngagementRate] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [result, setResult] = useState<any>(null);


  const handleCalculate = async () => {
    const analysis = calculateListSegmentation({ totalSubscribers, engagementRate, conversionRate });
    setResult(analysis);

  };

  const isFormValid = totalSubscribers > 0 && engagementRate >= 0 && conversionRate >= 0;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Email Tools', url: '/tools#email' },
          { name: 'List Segmentation Calculator', url: '/tools/email/list-segmentation-calculator' },
        ]}
      />

      <HowToSchema
        name="How to Use List Segmentation Calculator"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="List Segmentation Calculator"
        description={metadata.description}
        url="https://mediaplanpro.com/tools/email/list-segmentation-calculator"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={metadata.title}
        description={metadata.description}
        category="email"
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


                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subscribers">Total Subscribers *</Label>
                    <Input
                      id="subscribers"
                      type="number"
                      min="0"
                      value={totalSubscribers}
                      onChange={(e) => setTotalSubscribers(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="engagement">Average Engagement Rate (%) *</Label>
                    <Input
                      id="engagement"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={engagementRate}
                      onChange={(e) => setEngagementRate(Number(e.target.value))}
                      className="mt-1"
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Percentage of subscribers who open/click your emails
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="conversion">Average Conversion Rate (%) *</Label>
                    <Input
                      id="conversion"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={conversionRate}
                      onChange={(e) => setConversionRate(Number(e.target.value))}
                      className="mt-1"
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Percentage of subscribers who complete desired actions
                    </p>
                  </div>
                </div>

                <Button onClick={handleCalculate} className="w-full" size="lg" disabled={!isFormValid}>
                  <Users className="w-5 h-5 mr-2" />
                  Calculate Segments
                </Button>

                {result && (
                  <div className="space-y-6 pt-6 border-t border-border-primary">
                    <h3 className="text-xl font-semibold text-text-primary">
                      Recommended Segments
                    </h3>

                    <div className="grid gap-4">
                      {result.segments.map((segment: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-bg-secondary rounded-lg border border-border-primary"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-text-primary">{segment.segment}</h4>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-orange-400">
                                {segment.size.toLocaleString()}
                              </p>
                              <p className="text-xs text-text-secondary">{segment.percentage}% of list</p>
                            </div>
                          </div>
                          <p className="text-sm text-text-secondary mb-2">{segment.description}</p>
                          <div className="p-3 bg-orange-500/10 rounded border border-orange-500/30">
                            <p className="text-sm text-orange-400">
                              <strong>Strategy:</strong> {segment.strategy}
                            </p>
                          </div>
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
                      data={result}
                      filename="list-segmentation"
                      options={{ copy: true, csv: true, pdf: true }}
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
                title="How to Use the List Segmentation Calculator"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Follow these steps to get the most out of the List Segmentation Calculator:
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
                toolName="List Segmentation Calculator"
                faqs={faqs}
              />

              <ContentSection
                id="related-tools"
                title="Related Email Tools"
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
