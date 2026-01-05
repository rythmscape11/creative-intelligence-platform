'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analyzeKeywordDensity, analyzePhrases } from '@/lib/tools/content/keywordDensityChecker';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Search, AlertTriangle } from 'lucide-react';
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
import { keywordDensityCheckerContent } from '@/data/tools/keyword-density-checker-content';

export default function KeywordDensityCheckerEnhancedPage() {
  const [text, setText] = useState('');
  const [singleWords, setSingleWords] = useState<any[]>([]);
  const [twoWordPhrases, setTwoWordPhrases] = useState<any[]>([]);
  const [threeWordPhrases, setThreeWordPhrases] = useState<any[]>([]);


  const handleAnalyze = async () => {
    if (!text.trim()) return;

    const words = analyzeKeywordDensity(text);
    const phrases2 = analyzePhrases(text, 2);
    const phrases3 = analyzePhrases(text, 3);

    setSingleWords(words);
    setTwoWordPhrases(phrases2);
    setThreeWordPhrases(phrases3);

  };

  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const { tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = keywordDensityCheckerContent;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Content Tools', url: '/tools#content' },
          { name: 'Keyword Density Checker', url: '/tools/content/keyword-density-checker' },
        ]}
      />

      <HowToSchema
        name="How to Check Keyword Density"
        description="Step-by-step guide to analyzing keyword density and avoiding keyword stuffing"
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="Keyword Density Checker"
        description="Free tool to check keyword density and avoid overuse with detailed analysis of single words and phrases"
        url="https://mediaplanpro.com/tools/content/keyword-density-checker"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={keywordDensityCheckerContent.metadata.title}
        description={keywordDensityCheckerContent.metadata.description}
        category="content"
      >
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {keywordDensityCheckerContent.hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {keywordDensityCheckerContent.hero.subtitle}
            </p>

            {/* Tool Interface - MOVED TO TOP */}
            <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
              <div className="space-y-6">


                <div>
                  <Label htmlFor="text">Paste Your Content</Label>
                  <Textarea
                    id="text"
                    placeholder="Paste your article or blog post content here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={10}
                    className="mt-1 font-mono text-sm"
                  />
                  <p className="text-sm text-text-secondary mt-1">
                    {wordCount} words
                  </p>
                </div>

                <Button onClick={handleAnalyze} className="w-full" size="lg" disabled={!text.trim()}>
                  <Search className="w-5 h-5 mr-2" />
                  Analyze Keyword Density
                </Button>

                {singleWords.length > 0 && (
                  <div className="space-y-6 pt-6 border-t border-border-primary">
                    <div className="p-4 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <h4 className="font-semibold text-[#F59E0B]">SEO Tip</h4>
                      </div>
                      <p className="text-sm text-text-secondary">
                        Ideal keyword density is 1-2%. Higher densities may be flagged as keyword stuffing.
                      </p>
                    </div>

                    <Tabs defaultValue="single" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="single">Single Words</TabsTrigger>
                        <TabsTrigger value="two">2-Word Phrases</TabsTrigger>
                        <TabsTrigger value="three">3-Word Phrases</TabsTrigger>
                      </TabsList>

                      <TabsContent value="single" className="space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-bg-tertiary">
                                <th className="border border-border-primary px-4 py-2 text-left">Word</th>
                                <th className="border border-border-primary px-4 py-2 text-left">Count</th>
                                <th className="border border-border-primary px-4 py-2 text-left">Density</th>
                              </tr>
                            </thead>
                            <tbody>
                              {singleWords.slice(0, 20).map((item, index) => (
                                <tr key={index} className="hover:bg-bg-tertiary">
                                  <td className="border border-border-primary px-4 py-2">{item.word}</td>
                                  <td className="border border-border-primary px-4 py-2">{item.count}</td>
                                  <td className="border border-border-primary px-4 py-2">
                                    <span className={item.density > 2 ? 'text-red-400 font-semibold' : ''}>
                                      {item.density}%
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>

                      <TabsContent value="two" className="space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-bg-tertiary">
                                <th className="border border-border-primary px-4 py-2 text-left">Phrase</th>
                                <th className="border border-border-primary px-4 py-2 text-left">Count</th>
                                <th className="border border-border-primary px-4 py-2 text-left">Density</th>
                              </tr>
                            </thead>
                            <tbody>
                              {twoWordPhrases.slice(0, 20).map((item, index) => (
                                <tr key={index} className="hover:bg-bg-tertiary">
                                  <td className="border border-border-primary px-4 py-2">{item.phrase}</td>
                                  <td className="border border-border-primary px-4 py-2">{item.count}</td>
                                  <td className="border border-border-primary px-4 py-2">{item.density}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>

                      <TabsContent value="three" className="space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-bg-tertiary">
                                <th className="border border-border-primary px-4 py-2 text-left">Phrase</th>
                                <th className="border border-border-primary px-4 py-2 text-left">Count</th>
                                <th className="border border-border-primary px-4 py-2 text-left">Density</th>
                              </tr>
                            </thead>
                            <tbody>
                              {threeWordPhrases.slice(0, 20).map((item, index) => (
                                <tr key={index} className="hover:bg-bg-tertiary">
                                  <td className="border border-border-primary px-4 py-2">{item.phrase}</td>
                                  <td className="border border-border-primary px-4 py-2">{item.count}</td>
                                  <td className="border border-border-primary px-4 py-2">{item.density}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <ExportButtons
                      data={{ singleWords, twoWordPhrases, threeWordPhrases }}
                      filename="keyword-density-analysis"
                      textToCopy={`Keyword Density Analysis\n\nTop Single Words:\n${singleWords.slice(0, 10).map(w => `${w.word}: ${w.count} (${w.density}%)`).join('\n')}\n\nTop 2-Word Phrases:\n${twoWordPhrases.slice(0, 10).map(p => `${p.phrase}: ${p.count} (${p.density}%)`).join('\n')}`}
                      pdfTitle="Keyword Density Report"
                      pdfContent={`Top Single Words:\n${singleWords.slice(0, 20).map(w => `${w.word}: ${w.count} (${w.density}%)`).join('\n')}\n\nTop 2-Word Phrases:\n${twoWordPhrases.slice(0, 20).map(p => `${p.phrase}: ${p.count} (${p.density}%)`).join('\n')}`}
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
              <QuickAnswer question={quickAnswer.question} answer={quickAnswer.answer} />
              <ContentSection id="how-to-use" title="How to Use the Keyword Density Checker">
                <p className="text-text-secondary leading-relaxed mb-4">
                  Keyword density analysis helps you optimize content for SEO without over-optimization:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                  {howToSteps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.name}:</strong> {step.text}
                    </li>
                  ))}
                </ol>
              </ContentSection>

              <FAQSection toolName="Keyword Density Checker" faqs={faqs} />

              <ContentSection id="related-tools" title="Related SEO Tools">
                <RelatedTools tools={relatedTools} />
              </ContentSection>
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  );
}

