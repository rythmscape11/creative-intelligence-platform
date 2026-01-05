'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { analyzeEmailSubject } from '@/lib/tools/content/emailSubjectTester';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Mail, CheckCircle2, XCircle } from 'lucide-react';
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
import { emailSubjectTesterContent } from '@/data/tools/email-subject-tester-content';

export default function EmailSubjectTesterEnhancedPage() {
  const [subject, setSubject] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!subject.trim()) return;

    // Surface analyzer failures inline so users do not see the global "unexpected error" fallback.
    setError(null);
    setIsAnalyzing(true);

    try {
      const analysis = analyzeEmailSubject(subject);
      setResult(analysis);
      await trackToolUsage('email-subject-tester', 'Email Subject Tester', 'email', {
        score: analysis.score,
        spamRisk: analysis.spamRisk,
      });
    } catch (err) {
      console.error('Email subject analysis failed', err);
      setResult(null);
      setError(err instanceof Error ? err.message : 'Unable to test this subject line. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
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

  const { tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = emailSubjectTesterContent;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Content Tools', url: '/tools#content' },
          { name: 'Email Subject Tester', url: '/tools/content/email-subject-tester' },
        ]}
      />

      <HowToSchema
        name="How to Test Email Subject Lines"
        description="Step-by-step guide to testing and optimizing email subject lines for better open rates"
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="Email Subject Tester"
        description="Free tool to test and optimize email subject lines for better open rates with spam detection"
        url="https://mediaplanpro.com/tools/content/email-subject-tester"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={emailSubjectTesterContent.metadata.title}
        description={emailSubjectTesterContent.metadata.description}
        category="email"
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {emailSubjectTesterContent.hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {emailSubjectTesterContent.hero.subtitle}
            </p>
          </div>

          {/* Quick Answer */}


          {/* Main Content Grid */}

          {/* Tool Interface - MOVED TO TOP */}
          <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
            <div className="space-y-6">


              <div>
                <Label htmlFor="subject">Email Subject Line *</Label>
                <Input
                  id="subject"
                  placeholder="e.g., {firstname}, your exclusive 50% discount expires today!"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-text-secondary mt-1">
                  {subject.length} characters
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
                disabled={!subject.trim() || isAnalyzing}
                aria-busy={isAnalyzing}
              >
                <Mail className={`w-5 h-5 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? 'Analyzing…' : 'Analyze Subject Line'}
              </Button>

              {result && (
                <div className="space-y-6 pt-6 border-t border-border-primary">
                  {/* Score Display */}
                  <div className={`p-8 ${getScoreColor(result.score).bg} rounded-lg border-2 ${getScoreColor(result.score).border} text-center`}>
                    <p className="text-sm font-medium text-text-secondary mb-2">Subject Line Score</p>
                    <p className={`text-6xl font-bold ${getScoreColor(result.score).text}`}>
                      {result.score}
                    </p>
                    <p className="text-sm text-text-secondary mt-2">
                      Predicted Open Rate: {result.predictedOpenRateRange} ({result.openRateLabel})
                    </p>
                  </div>

                  {/* Analysis Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                      <h4 className="font-semibold text-text-primary mb-2">Length Analysis</h4>
                      <p className="text-sm text-text-secondary">
                        {result.length} characters ({result.lengthRating})
                      </p>
                      <p className="text-xs text-text-secondary mt-1">Ideal: 40-50 characters</p>
                    </div>

                    <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                      <h4 className="font-semibold text-text-primary mb-2">Personalization</h4>
                      <p className="text-sm text-text-secondary">
                        {result.hasPersonalization ? (
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle2 className="w-4 h-4" /> Personalized
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-text-secondary">
                            <XCircle className="w-4 h-4" /> Not personalized
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                      <h4 className="font-semibold text-text-primary mb-2">Spam Triggers</h4>
                      <p className="text-sm text-text-secondary">
                        {result.spamWords.length > 0 ? (
                          <span className="text-red-400">{result.spamWords.length} found: {result.spamWords.join(', ')}</span>
                        ) : (
                          <span className="text-green-400">None detected</span>
                        )}
                      </p>
                    </div>

                    <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                      <h4 className="font-semibold text-text-primary mb-2">Urgency</h4>
                      <p className="text-sm text-text-secondary">
                        {result.hasUrgency ? (
                          <span className="text-amber-600">Contains urgency words</span>
                        ) : (
                          <span className="text-text-secondary">No urgency detected</span>
                        )}
                      </p>
                    </div>

                    <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                      <h4 className="font-semibold text-text-primary mb-2">Preview</h4>
                      <p className="text-xs text-text-secondary uppercase mb-1">Mobile</p>
                      <p className="text-sm text-text-primary truncate border border-border-primary rounded px-2 py-1 bg-bg-primary">
                        {result.mobilePreview}
                      </p>
                      <p className="text-xs text-text-secondary uppercase mt-2 mb-1">Desktop</p>
                      <p className="text-sm text-text-primary truncate border border-border-primary rounded px-2 py-1 bg-bg-primary">
                        {result.desktopPreview}
                      </p>
                    </div>
                  </div>

                  {result.insights && result.insights.length > 0 && (
                    <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                      <h4 className="font-semibold text-text-primary mb-2">Insights</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary">
                        {result.insights.map((insight: string, index: number) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

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
                    filename="email-subject-analysis"
                    textToCopy={`Subject Line: ${subject}\nScore: ${result.score}/100\nPredicted Open Rate: ${result.predictedOpenRateRange}\nLength: ${result.length} characters (${result.lengthRating})\nSpam Words: ${result.spamWords.join(', ') || 'None'}`}
                    pdfTitle="Email Subject Line Analysis"
                    pdfContent={`Subject Line: ${subject}\n\nScore: ${result.score}/100\nPredicted Open Rate: ${result.predictedOpenRateRange} (${result.openRateLabel})\n\nAnalysis:\n- Length: ${result.length} characters (${result.lengthRating})\n- Personalization: ${result.hasPersonalization ? 'Yes' : 'No'}\n- Spam Words: ${result.spamWords.join(', ') || 'None'}\n- Urgency: ${result.hasUrgency ? 'Yes' : 'No'}\n- Mobile Preview: ${result.mobilePreview}`}
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
                title="How to Use the Email Subject Tester"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Email subject lines determine whether your emails get opened. Our tester helps you optimize for maximum open rates:
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
                toolName="Email Subject Tester"
                faqs={faqs}
              />

              {/* Related Tools */}
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
