'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { analyzeSpamScore } from '@/lib/tools/email/spamScoreChecker';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Shield } from 'lucide-react';
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
import { spamScoreCheckerContent } from '@/data/tools/spam-score-checker-content';

export default function SpamScoreCheckerEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = spamScoreCheckerContent;

  // Tool state
  const [emailContent, setEmailContent] = useState('');
  const [result, setResult] = useState<any>(null);


  const handleAnalyze = async () => {
    if (!emailContent.trim()) return;

    const analysis = analyzeSpamScore(emailContent);
    setResult(analysis);

  };

  const getScoreColor = (score: number) => {
    if (score <= 2) return {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
    };
    if (score <= 4) return {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
    };
    if (score <= 6) return {
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

  const getRatingColor = (rating: string) => {
    if (rating === 'Excellent') return 'green';
    if (rating === 'Good') return 'blue';
    if (rating === 'Fair') return 'yellow';
    return 'red';
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Email Tools', url: '/tools#email' },
          { name: 'Spam Score Checker', url: '/tools/email/spam-score-checker' },
        ]}
      />

      <HowToSchema
        name="How to Use Spam Score Checker"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="Spam Score Checker"
        description={metadata.description}
        url="https://mediaplanpro.com/tools/email/spam-score-checker"
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


                <div>
                  <Label htmlFor="content">Email Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Paste your email content here (subject line + body)..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={10}
                    className="mt-1"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    {emailContent.length} characters
                  </p>
                </div>

                <Button onClick={handleAnalyze} className="w-full" size="lg" disabled={!emailContent.trim()}>
                  <Shield className="w-5 h-5 mr-2" />
                  Check Spam Score
                </Button>

                {result && (
                  <div className="space-y-6 pt-6 border-t border-border-primary">
                    <div className={`p-8 ${getScoreColor(result.score).bg} rounded-lg border-2 ${getScoreColor(result.score).border} text-center`}>
                      <p className="text-sm font-medium text-text-secondary mb-2">Spam Score</p>
                      <p className={`text-6xl font-bold ${getScoreColor(result.score).text}`}>
                        {result.score.toFixed(1)}/10
                      </p>
                      <p className={`text-lg mt-2 font-semibold text-${getRatingColor(result.rating)}-600`}>
                        {result.rating}
                      </p>
                    </div>

                    {result.triggers.length > 0 && (
                      <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                        <h4 className="font-semibold text-yellow-400 mb-3">
                          ⚠️ Spam Triggers Detected ({result.triggers.length})
                        </h4>
                        <div className="grid gap-2">
                          {result.triggers.slice(0, 15).map((trigger: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-bg-secondary rounded"
                            >
                              <span className="text-sm text-text-primary">{trigger.word}</span>
                              <span className={`text-xs px-2 py-1 rounded ${trigger.severity === 'high' ? 'bg-red-500/10 text-red-700' :
                                  trigger.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-700' :
                                    'bg-bg-tertiary text-text-secondary'
                                }`}>
                                {trigger.severity}
                              </span>
                            </div>
                          ))}
                        </div>
                        {result.triggers.length > 15 && (
                          <p className="text-xs text-yellow-700 mt-2">
                            + {result.triggers.length - 15} more triggers
                          </p>
                        )}
                      </div>
                    )}

                    <div className="bg-[#F59E0B]/10 p-4 rounded-lg border border-[#F59E0B]/30">
                      <h4 className="font-semibold text-[#F59E0B] mb-3">💡 Recommendations:</h4>
                      <ul className="space-y-2">
                        {result.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="text-sm text-text-secondary flex items-start gap-2">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                      <h4 className="font-semibold text-green-400 mb-2">✅ Best Practices:</h4>
                      <ul className="text-sm text-green-400 space-y-1">
                        <li>• Avoid excessive use of sales language</li>
                        <li>• Do not use ALL CAPS or multiple exclamation marks</li>
                        <li>• Include a clear unsubscribe link</li>
                        <li>• Use a reputable email service provider</li>
                        <li>• Authenticate your domain (SPF, DKIM, DMARC)</li>
                      </ul>
                    </div>

                    <ExportButtons
                      data={result}
                      filename="spam-score-analysis"
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
                title="How to Use the Spam Score Checker"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Follow these steps to get the most out of the Spam Score Checker:
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
                toolName="Spam Score Checker"
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
