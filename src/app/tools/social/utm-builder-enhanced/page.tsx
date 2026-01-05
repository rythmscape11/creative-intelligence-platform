'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Link as LinkIcon } from 'lucide-react';
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
import { utmBuilderContent } from '@/data/tools/utm-builder-content';
import { EmailCaptureModal } from '@/components/cro/EmailCaptureModal';

export default function utmBuilderEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = utmBuilderContent;

  // Tool state
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');

  // Email capture state
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);


  const buildUTMUrl = () => {
    if (!url || !source || !medium || !campaign) return '';

    const params = new URLSearchParams();
    params.append('utm_source', source);
    params.append('utm_medium', medium);
    params.append('utm_campaign', campaign);
    if (term) params.append('utm_term', term);
    if (content) params.append('utm_content', content);

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  };

  const utmUrl = buildUTMUrl();

  useEffect(() => {
    if (utmUrl && !hasGenerated) {
      setHasGenerated(true);
    }
  }, [utmUrl, hasGenerated]);

  // Show email capture 3 seconds after first URL generation
  useEffect(() => {
    if (hasGenerated && !localStorage.getItem('email-captured-utm-builder')) {
      const timer = setTimeout(() => {
        setShowEmailCapture(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasGenerated]);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Social Tools', url: '/tools#social' },
          { name: 'UTM Builder', url: '/tools/social/utm-builder' },
        ]}
      />

      <HowToSchema
        name="How to Use UTM Builder"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="UTM Builder"
        description={metadata.description}
        url="https://mediaplanpro.com/tools/social/utm-builder"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={metadata.title}
        description={metadata.description}
        category="social"
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


                <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/30">
                  <p className="text-sm text-purple-400">
                    <strong>What are UTM parameters?</strong> They help you track the effectiveness of your marketing campaigns in Google Analytics.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="url">Website URL * <span className="text-text-secondary text-sm">(required)</span></Label>
                    <Input
                      id="url"
                      placeholder="https://example.com/landing-page"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      The full website URL (including https://)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="source">Campaign Source * <span className="text-text-secondary text-sm">(required)</span></Label>
                    <Input
                      id="source"
                      placeholder="google, facebook, newsletter"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Where the traffic comes from (e.g., google, facebook, newsletter)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="medium">Campaign Medium * <span className="text-text-secondary text-sm">(required)</span></Label>
                    <Input
                      id="medium"
                      placeholder="cpc, email, social"
                      value={medium}
                      onChange={(e) => setMedium(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Marketing medium (e.g., cpc, email, social, banner)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="campaign">Campaign Name * <span className="text-text-secondary text-sm">(required)</span></Label>
                    <Input
                      id="campaign"
                      placeholder="summer_sale_2024"
                      value={campaign}
                      onChange={(e) => setCampaign(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Campaign identifier (e.g., summer_sale, product_launch)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="term">Campaign Term <span className="text-text-secondary text-sm">(optional)</span></Label>
                    <Input
                      id="term"
                      placeholder="running+shoes"
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Paid search keywords (for paid campaigns)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="content">Campaign Content <span className="text-text-secondary text-sm">(optional)</span></Label>
                    <Input
                      id="content"
                      placeholder="logolink, textlink"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Differentiate similar content or links (for A/B testing)
                    </p>
                  </div>
                </div>

                {utmUrl && (
                  <div className="space-y-4 pt-6 border-t border-border-primary">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-text-primary">Generated UTM URL</h3>
                    </div>

                    <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                      <p className="text-sm text-text-primary break-all font-mono">
                        {utmUrl}
                      </p>
                    </div>

                    <ExportButtons
                      data={{ url: utmUrl }}
                      filename="utm-url"
                      options={{ copy: true }}
                      textToCopy={utmUrl}
                    />

                    <div className="bg-[#F59E0B]/10 p-4 rounded-lg border border-[#F59E0B]/30">
                      <h4 className="font-semibold text-[#F59E0B] mb-2">Parameter Breakdown:</h4>
                      <div className="text-sm text-text-secondary space-y-1 font-mono">
                        <div><strong>utm_source:</strong> {source}</div>
                        <div><strong>utm_medium:</strong> {medium}</div>
                        <div><strong>utm_campaign:</strong> {campaign}</div>
                        {term && <div><strong>utm_term:</strong> {term}</div>}
                        {content && <div><strong>utm_content:</strong> {content}</div>}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-bg-tertiary p-4 rounded-lg border border-border-primary">
                  <h4 className="font-semibold text-text-primary mb-2">Common Examples:</h4>
                  <div className="text-sm text-text-secondary space-y-2">
                    <div>
                      <strong>Facebook Ad:</strong> source=facebook, medium=cpc, campaign=spring_sale
                    </div>
                    <div>
                      <strong>Email Newsletter:</strong> source=newsletter, medium=email, campaign=weekly_digest
                    </div>
                    <div>
                      <strong>Instagram Bio:</strong> source=instagram, medium=social, campaign=bio_link
                    </div>
                  </div>
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
                title="How to Use the UTM Builder"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  UTM parameters are essential for tracking campaign performance. Our builder helps you:
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
                toolName="UTM Builder"
                faqs={faqs}
              />

              <ContentSection
                id="related-tools"
                title="Related Social Tools"
              >
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
          localStorage.setItem('email-captured-utm-builder', 'true');
        }}
        source="utm-builder"
        toolId="utm-builder-enhanced"
        title="Get Your UTM URL + Campaign Tracking Guide"
        description="Save your UTM parameters and receive expert tips on campaign tracking and analytics"
        incentive="Free Campaign Tracking Toolkit (worth $79)"
      />
    </>
  );
}
