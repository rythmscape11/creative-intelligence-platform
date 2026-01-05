'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { analyzeHeadline } from '@/lib/tools/content/headlineAnalyzer';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { ToolUsageLimit } from '@/types/tools';
import { Sparkles, TrendingUp, Type, Hash } from 'lucide-react';
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
import { headlineAnalyzerContent } from '@/data/tools/headline-analyzer-content';
import { EmailCaptureModal } from '@/components/cro/EmailCaptureModal';

export default function HeadlineAnalyzerEnhancedPage() {
  const [headline, setHeadline] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!headline.trim()) return;

    // Surfacing analyzer errors here prevents the UI from falling back to the generic page-level error boundary.
    setError(null);
    setIsAnalyzing(true);

    try {
      const analysis = analyzeHeadline(headline);
      setResult(analysis);
      setHasAnalyzed(true);
      await trackToolUsage('headline-analyzer', 'Headline Analyzer', 'content', {
        score: analysis.score,
        length: analysis.characterCount,
      });
    } catch (err) {
      console.error('Headline analysis failed', err);
      setResult(null);
      setError(err instanceof Error ? err.message : 'Unable to analyze this headline. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Show email capture 3 seconds after first analysis
  useEffect(() => {
    if (hasAnalyzed && !localStorage.getItem('email-captured-headline-analyzer')) {
      const timer = setTimeout(() => {
        setShowEmailCapture(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasAnalyzed]);

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

  const scoreColor = result ? getScoreColor(result.score) : {
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
  };

  const { tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = headlineAnalyzerContent;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Content Tools', url: '/tools#content' },
          { name: 'Headline Analyzer', url: '/tools/content/headline-analyzer' },
        ]}
      />

      <HowToSchema
        name="How to Analyze Headlines"
        description="Step-by-step guide to analyzing and optimizing headlines for better engagement"
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="Headline Analyzer"
        description="Free tool to score headlines 0-100 with emotion and power word detection for better click-through rates"
        url="https://mediaplanpro.com/tools/content/headline-analyzer"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={headlineAnalyzerContent.metadata.title}
        description={headlineAnalyzerContent.metadata.description}
        category="content"
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {headlineAnalyzerContent.hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {headlineAnalyzerContent.hero.subtitle}
            </p>
          </div>

          {/* Quick Answer */}


          {/* Main Content Grid */}

          {/* Tool Interface - MOVED TO TOP */}
          <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
            <div className="space-y-6">



              <div>
                <Label htmlFor="headline">Enter Your Headline</Label>
                <Textarea
                  id="headline"
                  placeholder="10 Proven Ways to Boost Your Marketing ROI in 2024"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
                <p className="text-sm text-text-secondary mt-1">
                  {headline.length} characters, {headline.split(/\s+/).filter(w => w.length > 0).length} words
                </p>
              </div>

              {error && (
                <div className="rounded-md border border-error/40 bg-error/10 p-4 text-sm text-error" role="alert">
                  {error}
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                className="w-full"
                size="lg"
                disabled={!headline.trim() || isAnalyzing}
                aria-busy={isAnalyzing}
              >
                <Sparkles className={`w-5 h-5 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? 'Analyzing…' : 'Analyze Headline'}
              </Button>

              {result && (
                <div className="space-y-6 pt-6 border-t border-border-primary">
                  {/* Score Display */}
                  <div className={`p-8 ${scoreColor.bg} rounded-lg border-2 ${scoreColor.border} text-center`}>
                    <p className="text-sm font-medium text-text-secondary mb-2">Headline Score</p>
                    <p className={`text-6xl font-bold ${scoreColor.text}`}>
                      {result.score}
                    </p>
                    <p className="text-sm text-text-secondary mt-2">{result.rating}</p>
                  </div>

                  {/* Analysis Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <Type className="w-5 h-5 text-amber-600" />
                        <h4 className="font-semibold text-text-primary">Word Count</h4>
                      </div>
                      <p className="text-2xl font-bold text-text-primary">{result.wordCount}</p>
                      <p className="text-sm text-text-secondary">Ideal: 6-12 words</p>
                    </div>

                    <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="w-5 h-5 text-amber-600" />
                        <h4 className="font-semibold text-text-primary">Character Count</h4>
                      </div>
                      <p className="text-2xl font-bold text-text-primary">{result.characterCount}</p>
                      <p className="text-sm text-text-secondary">Ideal: 40-60 characters</p>
                    </div>

                    <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                        <h4 className="font-semibold text-text-primary">Power Words</h4>
                      </div>
                      <p className="text-2xl font-bold text-text-primary">{result.powerWords.length}</p>
                      {result.powerWords.length > 0 && (
                        <p className="text-sm text-text-secondary">{result.powerWords.join(', ')}</p>
                      )}
                    </div>

                    <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-amber-600" />
                        <h4 className="font-semibold text-text-primary">Emotional Impact</h4>
                      </div>
                      <p className="text-2xl font-bold text-text-primary">{result.emotionalWords.length}</p>
                      {result.emotionalWords.length > 0 && (
                        <p className="text-sm text-text-secondary">{result.emotionalWords.join(', ')}</p>
                      )}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {result.suggestions && result.suggestions.length > 0 && (
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <h4 className="font-semibold text-blue-400 mb-2">💡 Suggestions for Improvement</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-400">
                        {result.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Export Buttons */}
                  <ExportButtons
                    data={result}
                    filename="headline-analysis"
                    textToCopy={`Headline: ${headline}\nScore: ${result.score}/100\nRating: ${result.rating}\nWord Count: ${result.wordCount}\nCharacter Count: ${result.characterCount}\nPower Words: ${result.powerWords.join(', ')}\nEmotional Words: ${result.emotionalWords.join(', ')}`}
                    pdfTitle="Headline Analysis Report"
                    pdfContent={`Headline: ${headline}\n\nScore: ${result.score}/100\nRating: ${result.rating}\n\nMetrics:\n- Word Count: ${result.wordCount}\n- Character Count: ${result.characterCount}\n- Power Words: ${result.powerWords.join(', ')}\n- Emotional Words: ${result.emotionalWords.join(', ')}`}
                  />
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
                title="How to Use the Headline Analyzer"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Headlines are the first thing readers see. Our analyzer helps you create compelling headlines by:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                  {howToSteps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.name}:</strong> {step.text}
                    </li>
                  ))}
                </ol>
              </ContentSection>

              {/* FAQ Section */}
              <FAQSection
                toolName="Headline Analyzer"
                faqs={faqs}
              />

              {/* Related Tools */}
              <ContentSection
                id="related-tools"
                title="Related Content Tools"
              >
                <RelatedTools tools={relatedTools} />
              </ContentSection>
            </div>
          </div>
        </div>
      </ToolLayout>

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailCapture}
        onClose={() => {
          setShowEmailCapture(false);
          localStorage.setItem('email-captured-headline-analyzer', 'true');
        }}
        source="headline-analyzer"
        toolId="headline-analyzer-enhanced"
        title="Get Your Results + Weekly Marketing Tips"
        description="Save your analysis and receive expert content marketing insights every week"
        incentive="Free Content Marketing Toolkit (worth $99)"
      />
    </>
  );
}
