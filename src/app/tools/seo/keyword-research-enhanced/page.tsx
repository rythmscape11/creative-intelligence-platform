'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { generateKeywordSuggestions } from '@/lib/tools/seo/keywordResearch';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Search, TrendingUp, Target, DollarSign } from 'lucide-react';
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
import { keywordResearchContent } from '@/data/tools/keyword-research-content';

export default function KeywordResearchEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = keywordResearchContent;

  // Tool state and logic
  const [seedKeyword, setSeedKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);


  const handleGenerate = async () => {
    if (!seedKeyword.trim()) return;

    const suggestions = generateKeywordSuggestions(seedKeyword);
    setResults(suggestions);

  };

  const getVolumeColor = (volume: string) => {
    if (volume === 'High') return 'text-green-400 bg-green-500/10';
    if (volume === 'Medium') return 'text-yellow-400 bg-yellow-500/10';
    return 'text-text-secondary bg-bg-tertiary';
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'Easy') return 'text-green-400 bg-green-500/10';
    if (difficulty === 'Medium') return 'text-yellow-400 bg-yellow-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case 'Informational': return <Search className="w-4 h-4" />;
      case 'Commercial': return <TrendingUp className="w-4 h-4" />;
      case 'Transactional': return <DollarSign className="w-4 h-4" />;
      case 'Navigational': return <Target className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Seo Tools', url: '/tools#seo' },
          { name: metadata.title, url: '/tools/seo/keyword-research' },
        ]}
      />

      <HowToSchema
        name="How to Use Keyword Research Tool"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name={metadata.title}
        description={metadata.description}
        url="https://mediaplanpro.com/tools/seo/keyword-research"
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
                  <Label htmlFor="keyword">Seed Keyword *</Label>
                  <Input
                    id="keyword"
                    placeholder="e.g., email marketing"
                    value={seedKeyword}
                    onChange={(e) => setSeedKeyword(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button onClick={handleGenerate} className="w-full" size="lg" disabled={!seedKeyword.trim()}>
                  <Search className="w-5 h-5 mr-2" />
                  Generate Keyword Ideas
                </Button>

                {results.length > 0 && (
                  <div className="space-y-6 pt-6 border-t border-border-primary">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-text-primary">
                        {results.length} Keyword Suggestions
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {results.map((kw, index) => (
                        <div
                          key={index}
                          className="p-4 bg-bg-secondary rounded-lg border border-border-primary hover:border-green-300 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-medium text-text-primary mb-2">{kw.keyword}</p>
                              <div className="flex flex-wrap gap-2">
                                <span className={`text-xs px-2 py-1 rounded ${getVolumeColor(kw.searchVolume)}`}>
                                  Volume: {kw.searchVolume}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(kw.difficulty)}`}>
                                  Difficulty: {kw.difficulty}
                                </span>
                                <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-600 flex items-center gap-1">
                                  {getIntentIcon(kw.intent)}
                                  {kw.intent}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#F59E0B]/10 p-4 rounded-lg border border-[#F59E0B]/30">
                      <h4 className="font-semibold text-[#F59E0B] mb-2">💡 Tips:</h4>
                      <ul className="text-sm text-text-secondary space-y-1">
                        <li>• Target long-tail keywords (3+ words) for easier ranking</li>
                        <li>• Focus on keywords with commercial or transactional intent for conversions</li>
                        <li>• Create content clusters around related keywords</li>
                        <li>• Monitor keyword performance and adjust strategy</li>
                      </ul>
                    </div>

                    <ExportButtons
                      data={results}
                      filename="keyword-research"
                      options={{ copy: true, csv: true }}
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
                title="How to Use the Keyword Research Tool"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Follow these steps to get the most out of the Keyword Research Tool:
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
                toolName="Keyword Research Tool"
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
