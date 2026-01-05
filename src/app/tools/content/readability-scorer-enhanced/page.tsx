'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calculateReadability, getFleschDescription } from '@/lib/tools/content/readabilityScorer';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { BookOpen } from 'lucide-react';
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
import { readabilityScorerContent } from '@/data/tools/readability-scorer-content';

export default function ReadabilityScorerEnhancedPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);


  const handleAnalyze = async () => {
    if (!text.trim()) return;

    const scores = calculateReadability(text);
    setResult(scores);

  };

  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const { tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = readabilityScorerContent;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Content Tools', url: '/tools#content' },
          { name: 'Readability Scorer', url: '/tools/content/readability-scorer' },
        ]}
      />

      <HowToSchema
        name="How to Score Readability"
        description="Step-by-step guide to analyzing text readability with multiple formulas"
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="Readability Scorer"
        description="Free tool to analyze text with 5 readability formulas including Flesch Reading Ease and Flesch-Kincaid Grade Level"
        url="https://mediaplanpro.com/tools/content/readability-scorer"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={readabilityScorerContent.metadata.title}
        description={readabilityScorerContent.metadata.description}
        category="content"
      >
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {readabilityScorerContent.hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {readabilityScorerContent.hero.subtitle}
            </p>

            {/* Tool Interface - MOVED TO TOP */}
            <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
              <div className="space-y-6">


                <div>
                  <Label htmlFor="text">Paste Your Text</Label>
                  <Textarea
                    id="text"
                    placeholder="Paste your article, blog post, or any text content here to analyze its readability..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={10}
                    className="mt-1 font-mono text-sm"
                  />
                  <p className="text-sm text-text-secondary mt-1">
                    {wordCount} words, {sentenceCount} sentences
                  </p>
                </div>

                <Button onClick={handleAnalyze} className="w-full" size="lg" disabled={!text.trim()}>
                  <BookOpen className="w-5 h-5 mr-2" />
                  Analyze Readability
                </Button>

                {result && (
                  <div className="space-y-6 pt-6 border-t border-border-primary">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 bg-blue-500/10 rounded-lg border-2 border-blue-500/30">
                        <h4 className="font-semibold text-blue-400 mb-2">Flesch Reading Ease</h4>
                        <p className="text-4xl font-bold text-blue-400 mb-2">{result.fleschReadingEase}</p>
                        <p className="text-sm text-blue-400">{getFleschDescription(result.fleschReadingEase)}</p>
                      </div>

                      <div className="p-6 bg-green-500/10 rounded-lg border-2 border-green-500/30">
                        <h4 className="font-semibold text-green-400 mb-2">Flesch-Kincaid Grade</h4>
                        <p className="text-4xl font-bold text-green-400 mb-2">{result.fleschKincaidGrade}</p>
                        <p className="text-sm text-green-400">Grade {result.fleschKincaidGrade} reading level</p>
                      </div>

                      <div className="p-6 bg-[#F59E0B]/10 rounded-lg border-2 border-[#F59E0B]/30">
                        <h4 className="font-semibold text-[#F59E0B] mb-2">Gunning Fog Index</h4>
                        <p className="text-4xl font-bold text-amber-600 mb-2">{result.gunningFog}</p>
                        <p className="text-sm text-text-secondary">Years of education needed</p>
                      </div>

                      <div className="p-6 bg-purple-500/10 rounded-lg border-2 border-purple-500/30">
                        <h4 className="font-semibold text-purple-400 mb-2">SMOG Index</h4>
                        <p className="text-4xl font-bold text-purple-400 mb-2">{result.smog}</p>
                        <p className="text-sm text-purple-400">Grade level required</p>
                      </div>
                    </div>

                    <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                      <h4 className="font-semibold text-text-primary mb-3">Text Statistics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-text-secondary">Words</p>
                          <p className="text-2xl font-bold text-text-primary">{result.wordCount}</p>
                        </div>
                        <div>
                          <p className="text-text-secondary">Sentences</p>
                          <p className="text-2xl font-bold text-text-primary">{result.sentenceCount}</p>
                        </div>
                        <div>
                          <p className="text-text-secondary">Syllables</p>
                          <p className="text-2xl font-bold text-text-primary">{result.syllableCount}</p>
                        </div>
                        <div>
                          <p className="text-text-secondary">Avg Words/Sentence</p>
                          <p className="text-2xl font-bold text-text-primary">{result.avgWordsPerSentence}</p>
                        </div>
                      </div>
                    </div>

                    <ExportButtons
                      data={result}
                      filename="readability-analysis"
                      textToCopy={`Readability Analysis\n\nFlesch Reading Ease: ${result.fleschReadingEase}\nFlesch-Kincaid Grade: ${result.fleschKincaidGrade}\nGunning Fog: ${result.gunningFog}\nSMOG: ${result.smog}\n\nWords: ${result.wordCount}\nSentences: ${result.sentenceCount}`}
                      pdfTitle="Readability Report"
                      pdfContent={`Flesch Reading Ease: ${result.fleschReadingEase} (${getFleschDescription(result.fleschReadingEase)})\nFlesch-Kincaid Grade: ${result.fleschKincaidGrade}\nGunning Fog Index: ${result.gunningFog}\nSMOG Index: ${result.smog}\n\nText Statistics:\nWords: ${result.wordCount}\nSentences: ${result.sentenceCount}\nSyllables: ${result.syllableCount}\nAvg Words/Sentence: ${result.avgWordsPerSentence}`}
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
              <ContentSection id="how-to-use" title="How to Use the Readability Scorer">
                <p className="text-text-secondary leading-relaxed mb-4">
                  Readable content keeps visitors engaged. Our scorer helps you improve readability by:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                  {howToSteps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.name}:</strong> {step.text}
                    </li>
                  ))}
                </ol>
              </ContentSection>

              <FAQSection toolName="Readability Scorer" faqs={faqs} />

              <ContentSection id="related-tools" title="Related Content Tools">
                <RelatedTools tools={relatedTools} />
              </ContentSection>
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  );
}

