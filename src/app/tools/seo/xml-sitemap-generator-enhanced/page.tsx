'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { generateXMLSitemap, parseUrlList } from '@/lib/tools/seo/xmlSitemapGenerator';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { FileCode, Copy, Check, Download } from 'lucide-react';
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
import { xmlSitemapGeneratorContent } from '@/data/tools/xml-sitemap-generator-content';

export default function xmlSitemapGeneratorEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = xmlSitemapGeneratorContent;

  // Tool state and logic
  const [urlList, setUrlList] = useState('');
  const [sitemap, setSitemap] = useState('');
  const [copied, setCopied] = useState(false);


  const handleGenerate = async () => {
    const urls = parseUrlList(urlList);
    const xml = generateXMLSitemap(urls);
    setSitemap(xml);

  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sitemap);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const urlCount = urlList.split('\n').filter(line => line.trim().startsWith('http')).length;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Seo Tools', url: '/tools#seo' },
          { name: metadata.title, url: '/tools/seo/xml-sitemap-generator' },
        ]}
      />

      <HowToSchema
        name="How to Use XML Sitemap Generator"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name={metadata.title}
        description={metadata.description}
        url="https://mediaplanpro.com/tools/seo/xml-sitemap-generator"
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
                  <Label htmlFor="urls">Enter URLs (one per line)</Label>
                  <Textarea
                    id="urls"
                    placeholder="https://example.com/
https://example.com/about
https://example.com/contact"
                    value={urlList}
                    onChange={(e) => setUrlList(e.target.value)}
                    rows={10}
                    className="mt-1 font-mono text-sm"
                  />
                  <p className="text-sm text-text-secondary mt-1">
                    {urlCount} valid URLs
                  </p>
                </div>

                <Button onClick={handleGenerate} className="w-full" size="lg" disabled={urlCount === 0}>
                  <FileCode className="w-5 h-5 mr-2" />
                  Generate XML Sitemap
                </Button>

                {sitemap && (
                  <div className="space-y-4 pt-6 border-t border-border-primary">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text-primary">Generated Sitemap</h3>
                      <div className="flex gap-2">
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
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>

                    <Textarea
                      value={sitemap}
                      readOnly
                      rows={15}
                      className="font-mono text-sm bg-bg-tertiary"
                    />

                    <div className="bg-[#F59E0B]/10 p-4 rounded-lg border border-[#F59E0B]/30">
                      <h4 className="font-semibold text-[#F59E0B] mb-2">💡 How to Use:</h4>
                      <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
                        <li>Download or copy the generated sitemap.xml</li>
                        <li>Upload it to your website's root directory</li>
                        <li>Submit to Google Search Console and Bing Webmaster Tools</li>
                        <li>Add sitemap URL to your robots.txt file</li>
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
                title="How to Use the XML Sitemap Generator"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Follow these steps to get the most out of the XML Sitemap Generator:
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
                toolName="XML Sitemap Generator"
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
