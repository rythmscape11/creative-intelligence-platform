'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { generateMetaDescriptions, validateMetaDescription } from '@/lib/tools/content/metaDescriptionGenerator';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { FileText, Copy, Check } from 'lucide-react';
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
import { metaDescriptionGeneratorContent } from '@/data/tools/meta-description-generator-content';
import { EmailCaptureModal } from '@/components/cro/EmailCaptureModal';

export default function MetaDescriptionGeneratorEnhancedPage() {
  const [keyword, setKeyword] = useState('');
  const [topic, setTopic] = useState('');
  const [cta, setCta] = useState('Learn more');
  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Email capture state
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!keyword.trim() || !topic.trim()) return;

    const descriptions = generateMetaDescriptions({ keyword, topic, cta });
    setResults(descriptions);
    setHasGenerated(true);

  };

  // Show email capture 3 seconds after first generation
  useEffect(() => {
    if (hasGenerated && !localStorage.getItem('email-captured-meta-description')) {
      const timer = setTimeout(() => {
        setShowEmailCapture(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasGenerated]);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const { tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = metaDescriptionGeneratorContent;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Content Tools', url: '/tools#content' },
          { name: 'Meta Description Generator', url: '/tools/content/meta-description-generator' },
        ]}
      />

      <HowToSchema
        name="How to Generate Meta Descriptions"
        description="Step-by-step guide to creating SEO-optimized meta descriptions"
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="Meta Description Generator"
        description="Free tool to generate 5 SEO-optimized meta descriptions instantly for better click-through rates"
        url="https://mediaplanpro.com/tools/content/meta-description-generator"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={metaDescriptionGeneratorContent.metadata.title}
        description={metaDescriptionGeneratorContent.metadata.description}
        category="content"
      >
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {metaDescriptionGeneratorContent.hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {metaDescriptionGeneratorContent.hero.subtitle}
            </p>

            {/* Tool Interface - MOVED TO TOP */}
            <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
              <div className="space-y-6">


                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keyword">Target Keyword *</Label>
                    <Input
                      id="keyword"
                      placeholder="e.g., email marketing"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="topic">Page Topic *</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Complete guide to email marketing strategies"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cta">Call-to-Action (Optional)</Label>
                    <Input
                      id="cta"
                      placeholder="e.g., Learn more, Get started, Download now"
                      value={cta}
                      onChange={(e) => setCta(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button onClick={handleGenerate} className="w-full" size="lg" disabled={!keyword.trim() || !topic.trim()}>
                  <FileText className="w-5 h-5 mr-2" />
                  Generate Meta Descriptions
                </Button>

                {results.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-border-primary">
                    <h3 className="text-lg font-semibold text-text-primary">Generated Meta Descriptions</h3>
                    {results.map((description, index) => {
                      const validation = validateMetaDescription(description);
                      return (
                        <div key={index} className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <p className="text-text-primary mb-2">{description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className={validation.isValid ? 'text-green-400' : 'text-red-400'}>
                                  {description.length} characters
                                </span>
                                {validation.isValid ? (
                                  <span className="text-green-400">✓ Optimal length</span>
                                ) : (
                                  <span className="text-red-400">⚠ {validation.issues[0] || 'Length issue'}</span>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(description, index)}
                            >
                              {copiedIndex === index ? (
                                <><Check className="w-4 h-4 mr-1" /> Copied</>
                              ) : (
                                <><Copy className="w-4 h-4 mr-1" /> Copy</>
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    <ExportButtons
                      data={results}
                      filename="meta-descriptions"
                      textToCopy={results.join('\n\n')}
                      pdfTitle="Meta Descriptions"
                      pdfContent={results.map((d, i) => `${i + 1}. ${d}`).join('\n\n')}
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
              <ContentSection id="how-to-use" title="How to Use the Meta Description Generator">
                <p className="text-text-secondary leading-relaxed mb-4">
                  Meta descriptions are crucial for SEO and click-through rates. Our generator creates optimized descriptions:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                  {howToSteps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.name}:</strong> {step.text}
                    </li>
                  ))}
                </ol>
              </ContentSection>

              <FAQSection toolName="Meta Description Generator" faqs={faqs} />

              <ContentSection id="related-tools" title="Related SEO Tools">
                <RelatedTools tools={relatedTools} />
              </ContentSection>
            </div>
          </div>
        </div>
      </ToolLayout>

      <EmailCaptureModal
        isOpen={showEmailCapture}
        onClose={() => {
          setShowEmailCapture(false);
          localStorage.setItem('email-captured-meta-description', 'true');
        }}
        source="meta-description"
        toolId="meta-description-generator-enhanced"
        title="Get Your Meta Descriptions + SEO Guide"
        description="Save your meta descriptions and receive expert SEO optimization tips"
        incentive="Free SEO Optimization Toolkit (worth $79)"
      />
    </>
  );
}

