'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Monitor, Smartphone } from 'lucide-react';
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
import { serpPreviewContent } from '@/data/tools/serp-preview-content';

export default function serpPreviewEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = serpPreviewContent;

  // Tool state and logic
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');


  useEffect(() => {
    if (title || description || url) {
    }
  }, [title, description, url]);

  const titleLength = title.length;
  const descLength = description.length;
  const desktopTitleMax = 60;
  const mobileTitleMax = 78;
  const descMax = 160;

  const getTitleColor = (length: number, max: number) => {
    if (length === 0) return 'text-text-secondary';
    if (length > max) return 'text-red-400';
    if (length > max * 0.9) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getDescColor = (length: number) => {
    if (length === 0) return 'text-text-secondary';
    if (length > descMax) return 'text-red-400';
    if (length > descMax * 0.9) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Seo Tools', url: '/tools#seo' },
          { name: metadata.title, url: '/tools/seo/serp-preview' },
        ]}
      />

      <HowToSchema
        name="How to Use SERP Preview Tool"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name={metadata.title}
        description={metadata.description}
        url="https://mediaplanpro.com/tools/seo/serp-preview"
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

                {/* Input Form */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <Label htmlFor="title">Page Title</Label>
                      <span className={`text-sm ${getTitleColor(titleLength, desktopTitleMax)}`}>
                        {titleLength}/{desktopTitleMax} chars
                      </span>
                    </div>
                    <Input
                      id="title"
                      placeholder="Your Amazing Page Title - Brand Name"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <Label htmlFor="description">Meta Description</Label>
                      <span className={`text-sm ${getDescColor(descLength)}`}>
                        {descLength}/{descMax} chars
                      </span>
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Write a compelling meta description that summarizes your page content and encourages clicks..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com/page-url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                </div>

                {/* Desktop Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-semibold text-text-primary">Desktop Preview</h3>
                  </div>

                  <div className="p-6 bg-bg-secondary rounded-lg border border-border-primary">
                    <div className="max-w-2xl">
                      <div className="text-sm text-green-700 mb-1">
                        {url || 'https://example.com/page-url'}
                      </div>
                      <div className="text-xl text-amber-600 hover:underline cursor-pointer mb-2">
                        {title.slice(0, desktopTitleMax) || 'Your Page Title Appears Here'}
                        {title.length > desktopTitleMax && '...'}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {description.slice(0, descMax) || 'Your meta description appears here. Make it compelling to encourage clicks from search results.'}
                        {description.length > descMax && '...'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-text-primary">Mobile Preview</h3>
                  </div>

                  <div className="p-6 bg-bg-secondary rounded-lg border border-border-primary">
                    <div className="max-w-sm">
                      <div className="text-xs text-green-700 mb-1 truncate">
                        {url || 'https://example.com/page-url'}
                      </div>
                      <div className="text-base text-amber-600 hover:underline cursor-pointer mb-2">
                        {title.slice(0, mobileTitleMax) || 'Your Page Title Appears Here'}
                        {title.length > mobileTitleMax && '...'}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {description.slice(0, descMax) || 'Your meta description appears here.'}
                        {description.length > descMax && '...'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-[#F59E0B]/10 p-4 rounded-lg border border-[#F59E0B]/30">
                  <h4 className="font-semibold text-[#F59E0B] mb-2">SEO Tips:</h4>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• Desktop title: 50-60 characters (optimal)</li>
                    <li>• Mobile title: Up to 78 characters</li>
                    <li>• Meta description: 150-160 characters</li>
                    <li>• Include your target keyword in both title and description</li>
                    <li>• Make it compelling to improve click-through rate</li>
                  </ul>
                </div>
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
                title="How to Use the SERP Preview Tool"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Follow these steps to get the most out of the SERP Preview Tool:
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
                toolName="SERP Preview Tool"
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
