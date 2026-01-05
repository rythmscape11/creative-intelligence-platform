'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { generateRobotsTxt, commonDisallowPaths } from '@/lib/tools/seo/robotsTxtGenerator';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { FileCode, Copy, Check } from 'lucide-react';
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
import { robotsTxtGeneratorContent } from '@/data/tools/robots-txt-generator-content';

export default function robotsTxtGeneratorEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = robotsTxtGeneratorContent;

  // Tool state and logic
  const [allowAll, setAllowAll] = useState(true);
  const [disallowPaths, setDisallowPaths] = useState<string[]>([]);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [crawlDelay, setCrawlDelay] = useState(0);
  const [robotsTxt, setRobotsTxt] = useState('');
  const [copied, setCopied] = useState(false);


  const handleGenerate = async () => {
    const result = generateRobotsTxt({ allowAll, disallowPaths, sitemapUrl, crawlDelay });
    setRobotsTxt(result);

  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(robotsTxt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePath = (path: string) => {
    setDisallowPaths(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Seo Tools', url: '/tools#seo' },
          { name: metadata.title, url: '/tools/seo/robots-txt-generator' },
        ]}
      />

      <HowToSchema
        name="How to Use Robots.txt Generator"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name={metadata.title}
        description={metadata.description}
        url="https://mediaplanpro.com/tools/seo/robots-txt-generator"
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

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowAll"
                    checked={allowAll}
                    onCheckedChange={(checked) => setAllowAll(checked as boolean)}
                  />
                  <Label htmlFor="allowAll" className="cursor-pointer">
                    Allow all robots to crawl all content
                  </Label>
                </div>

                {!allowAll && (
                  <div>
                    <Label className="mb-2 block">Common Paths to Disallow</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {commonDisallowPaths.map(path => (
                        <div key={path} className="flex items-center space-x-2">
                          <Checkbox
                            id={path}
                            checked={disallowPaths.includes(path)}
                            onCheckedChange={() => togglePath(path)}
                          />
                          <Label htmlFor={path} className="cursor-pointer text-sm">
                            {path}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="sitemap">Sitemap URL</Label>
                  <Input
                    id="sitemap"
                    placeholder="https://example.com/sitemap.xml"
                    value={sitemapUrl}
                    onChange={(e) => setSitemapUrl(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="crawlDelay">Crawl Delay (seconds, optional)</Label>
                  <Input
                    id="crawlDelay"
                    type="number"
                    min="0"
                    value={crawlDelay}
                    onChange={(e) => setCrawlDelay(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <Button onClick={handleGenerate} className="w-full" size="lg">
                  <FileCode className="w-5 h-5 mr-2" />
                  Generate Robots.txt
                </Button>

                {robotsTxt && (
                  <div className="space-y-4 pt-6 border-t border-border-primary">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text-primary">Generated Robots.txt</h3>
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>

                    <Textarea
                      value={robotsTxt}
                      readOnly
                      rows={10}
                      className="font-mono text-sm bg-bg-tertiary"
                    />

                    <div className="bg-[#F59E0B]/10 p-4 rounded-lg border border-[#F59E0B]/30">
                      <h4 className="font-semibold text-[#F59E0B] mb-2">💡 How to Use:</h4>
                      <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
                        <li>Copy the generated robots.txt content</li>
                        <li>Save it as "robots.txt" in your website's root directory</li>
                        <li>Access it at https://yourdomain.com/robots.txt</li>
                        <li>Test with Google Search Console</li>
                      </ol>
                    </div>
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
                title="How to Use the Robots.txt Generator"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Follow these steps to get the most out of the Robots.txt Generator:
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
                toolName="Robots.txt Generator"
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
