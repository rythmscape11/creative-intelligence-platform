'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { analyzePageSpeed } from '@/lib/tools/seo/pageSpeedAnalyzer';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Zap, Image, Code, FileText } from 'lucide-react';
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
import { pageSpeedAnalyzerContent } from '@/data/tools/page-speed-analyzer-content';

export default function PageSpeedAnalyzerEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = pageSpeedAnalyzerContent;

  // Tool state and logic
  const [images, setImages] = useState(0);
  const [scripts, setScripts] = useState(0);
  const [stylesheets, setStylesheets] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [result, setResult] = useState<any>(null);


  const handleAnalyze = async () => {
    const analysis = analyzePageSpeed(images, scripts, stylesheets, pageSize);
    setResult(analysis);

  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
    };
    if (score >= 70) return {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
    };
    if (score >= 50) return {
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

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Seo Tools', url: '/tools#seo' },
          { name: metadata.title, url: '/tools/seo/page-speed-analyzer' },
        ]}
      />

      <HowToSchema
        name="How to Use Page Speed Analyzer"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name={metadata.title}
        description={metadata.description}
        url="https://mediaplanpro.com/tools/seo/page-speed-analyzer"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="images">Number of Images</Label>
                    <Input
                      id="images"
                      type="number"
                      min="0"
                      value={images}
                      onChange={(e) => setImages(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="scripts">Number of Scripts</Label>
                    <Input
                      id="scripts"
                      type="number"
                      min="0"
                      value={scripts}
                      onChange={(e) => setScripts(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stylesheets">Number of Stylesheets</Label>
                    <Input
                      id="stylesheets"
                      type="number"
                      min="0"
                      value={stylesheets}
                      onChange={(e) => setStylesheets(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pageSize">Page Size (KB)</Label>
                    <Input
                      id="pageSize"
                      type="number"
                      min="0"
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button onClick={handleAnalyze} className="w-full" size="lg">
                  <Zap className="w-5 h-5 mr-2" />
                  Analyze Page Speed
                </Button>

                {result && (
                  <div className="space-y-6 pt-6 border-t border-border-primary">
                    <div className={`p-8 ${scoreColor.bg} rounded-lg border-2 ${scoreColor.border} text-center`}>
                      <p className="text-sm font-medium text-text-secondary mb-2">Performance Score</p>
                      <p className={`text-6xl font-bold ${scoreColor.text}`}>
                        {result.score}
                      </p>
                      <p className="text-sm mt-2 text-text-secondary">{result.rating}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary">
                        <div className="flex items-center gap-2 mb-2">
                          <Image className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-text-secondary">Images</span>
                        </div>
                        <p className="text-2xl font-bold text-text-primary">{result.metrics.images}</p>
                      </div>

                      <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary">
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-text-secondary">Scripts</span>
                        </div>
                        <p className="text-2xl font-bold text-text-primary">{result.metrics.scripts}</p>
                      </div>

                      <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium text-text-secondary">Stylesheets</span>
                        </div>
                        <p className="text-2xl font-bold text-text-primary">{result.metrics.stylesheets}</p>
                      </div>

                      <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-orange-400" />
                          <span className="text-sm font-medium text-text-secondary">Total</span>
                        </div>
                        <p className="text-2xl font-bold text-text-primary">{result.metrics.totalResources}</p>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                      <h4 className="font-semibold text-yellow-400 mb-3">💡 Optimization Suggestions:</h4>
                      <ul className="space-y-2">
                        {result.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="text-sm text-yellow-400 flex items-start gap-2">
                            <span className="text-yellow-400 mt-0.5">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <ExportButtons
                      data={result}
                      filename="page-speed-analysis"
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
                title="How to Use the Page Speed Analyzer"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Follow these steps to get the most out of the Page Speed Analyzer:
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
                toolName="Page Speed Analyzer"
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
