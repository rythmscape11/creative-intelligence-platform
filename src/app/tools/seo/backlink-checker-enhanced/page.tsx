'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { analyzeBacklinks, parseBacklinkList } from '@/lib/tools/seo/backlinkChecker';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Link2 } from 'lucide-react';
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
import { backlinkCheckerContent } from '@/data/tools/backlink-checker-content';

export default function BacklinkCheckerEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = backlinkCheckerContent;

  // Tool state
  const [backlinkList, setBacklinkList] = useState('');
  const [result, setResult] = useState<any>(null);


  const handleAnalyze = async () => {
    if (!backlinkList.trim()) return;

    const backlinks = parseBacklinkList(backlinkList);
    const analysis = analyzeBacklinks(backlinks);
    setResult(analysis);

  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
    };
    if (score >= 60) return {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
    };
    if (score >= 40) return {
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

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Seo Tools', url: '/tools#seo' },
          { name: 'Backlink Checker', url: '/tools/seo/backlink-checker' },
        ]}
      />

      <HowToSchema
        name="How to Use Backlink Checker"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="Backlink Checker"
        description={metadata.description}
        url="https://mediaplanpro.com/tools/seo/backlink-checker"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={metadata.title}
        description={metadata.description}
        category="seo"
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


                <div>
                  <Label htmlFor="backlinks">Backlink List *</Label>
                  <Textarea
                    id="backlinks"
                    placeholder="Enter backlinks (one per line):
https://example.com, anchor text, dofollow
https://example2.com, brand name, nofollow"
                    value={backlinkList}
                    onChange={(e) => setBacklinkList(e.target.value)}
                    rows={10}
                    className="mt-1 font-mono text-sm"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Format: URL, Anchor Text, Type (dofollow/nofollow)
                  </p>
                </div>

                <Button onClick={handleAnalyze} className="w-full" size="lg" disabled={!backlinkList.trim()}>
                  <Link2 className="w-5 h-5 mr-2" />
                  Analyze Backlinks
                </Button>

                {result && (
                  <div className="space-y-6 pt-6 border-t border-border-primary">
                    <div className={`p-8 ${getScoreColor(result.healthScore).bg} rounded-lg border-2 ${getScoreColor(result.healthScore).border} text-center`}>
                      <p className="text-sm font-medium text-text-secondary mb-2">Backlink Health Score</p>
                      <p className={`text-6xl font-bold ${getScoreColor(result.healthScore).text}`}>
                        {result.healthScore}
                      </p>
                      <p className="text-lg mt-2 font-semibold text-text-secondary">
                        {result.rating}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary text-center">
                        <p className="text-sm text-text-secondary mb-2">Total Backlinks</p>
                        <p className="text-3xl font-bold text-text-primary">{result.totalBacklinks}</p>
                      </div>

                      <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary text-center">
                        <p className="text-sm text-text-secondary mb-2">DoFollow</p>
                        <p className="text-3xl font-bold text-green-400">{result.doFollowCount}</p>
                      </div>

                      <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary text-center">
                        <p className="text-sm text-text-secondary mb-2">NoFollow</p>
                        <p className="text-3xl font-bold text-text-secondary">{result.noFollowCount}</p>
                      </div>

                      <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary text-center">
                        <p className="text-sm text-text-secondary mb-2">Diversity</p>
                        <p className="text-3xl font-bold text-amber-600">{result.anchorTextDiversity}%</p>
                      </div>
                    </div>

                    {result.topAnchors.length > 0 && (
                      <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/30">
                        <h4 className="font-semibold text-purple-400 mb-3">🔗 Top Anchor Texts:</h4>
                        <div className="grid gap-2">
                          {result.topAnchors.slice(0, 5).map((anchor: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-bg-secondary rounded"
                            >
                              <span className="text-sm text-text-primary">{anchor.text}</span>
                              <span className="text-sm font-medium text-purple-400">
                                {anchor.count} uses
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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

                    <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                      <h4 className="font-semibold text-green-400 mb-2">✅ Best Practices:</h4>
                      <ul className="text-sm text-green-400 space-y-1">
                        <li>• Aim for 60-70% dofollow backlinks</li>
                        <li>• Diversify anchor text (brand, exact match, generic)</li>
                        <li>• Focus on high-authority domains (DA 50+)</li>
                        <li>• Avoid link schemes and paid links</li>
                        <li>• Build links naturally through quality content</li>
                      </ul>
                    </div>

                    <ExportButtons
                      data={result}
                      filename="backlink-analysis"
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
                title="How to Use the Backlink Checker"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Follow these steps to get the most out of the Backlink Checker:
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
                toolName="Backlink Checker"
                faqs={faqs}
              />

              <ContentSection
                id="related-tools"
                title="Related Seo Tools"
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
