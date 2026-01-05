'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateEmailPreview, EmailClient } from '@/lib/tools/email/emailPreview';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Eye } from 'lucide-react';
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
import { emailPreviewContent } from '@/data/tools/email-preview-content';

export default function EmailPreviewEnhancedPage() {
  const [subject, setSubject] = useState('');
  const [preheader, setPreheader] = useState('');
  const [from, setFrom] = useState('');
  const [client, setClient] = useState<EmailClient>('gmail');
  const [preview, setPreview] = useState('');


  const handleGenerate = async () => {
    const html = generateEmailPreview({ subject, preheader, from }, client);
    setPreview(html);

  };

  const isFormValid = subject && from;
  const { tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = emailPreviewContent;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Email Tools', url: '/tools#email' },
          { name: 'Email Preview', url: '/tools/email/email-preview' },
        ]}
      />

      <HowToSchema
        name="How to Preview Emails"
        description="Step-by-step guide to previewing emails across different email clients"
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="Email Preview Tool"
        description="Free tool to preview how your email appears in different email clients including Gmail, Outlook, and Apple Mail"
        url="https://mediaplanpro.com/tools/email/email-preview"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={emailPreviewContent.metadata.title}
        description={emailPreviewContent.metadata.description}
        category="email"
      >
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {emailPreviewContent.hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {emailPreviewContent.hero.subtitle}
            </p>

            {/* Tool Interface - MOVED TO TOP */}
            <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
              <div className="space-y-6">


                <div className="space-y-4">
                  <div>
                    <Label htmlFor="from">From Name *</Label>
                    <Input
                      id="from"
                      placeholder="Your Company"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject Line *</Label>
                    <Input
                      id="subject"
                      placeholder="Your exclusive offer inside!"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preheader">Preheader Text</Label>
                    <Textarea
                      id="preheader"
                      placeholder="This text appears after the subject line in most email clients..."
                      value={preheader}
                      onChange={(e) => setPreheader(e.target.value)}
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="client">Email Client *</Label>
                    <Select value={client} onValueChange={(value) => setClient(value as EmailClient)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gmail">Gmail</SelectItem>
                        <SelectItem value="outlook">Outlook</SelectItem>
                        <SelectItem value="apple">Apple Mail</SelectItem>
                        <SelectItem value="yahoo">Yahoo Mail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleGenerate} className="w-full" size="lg" disabled={!isFormValid}>
                  <Eye className="w-5 h-5 mr-2" />
                  Generate Preview
                </Button>

                {preview && (
                  <div className="space-y-4 pt-6 border-t border-border-primary">
                    <h3 className="text-lg font-semibold text-text-primary">Email Preview - {client}</h3>
                    <div className="border-2 border-border-primary rounded-lg overflow-hidden">
                      <div dangerouslySetInnerHTML={{ __html: preview }} />
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
              <QuickAnswer question={quickAnswer.question} answer={quickAnswer.answer} />
              <ContentSection id="how-to-use" title="How to Use the Email Preview Tool">
                <p className="text-text-secondary leading-relaxed mb-4">
                  Email clients render emails differently. Our preview tool helps ensure consistent appearance:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                  {howToSteps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.name}:</strong> {step.text}
                    </li>
                  ))}
                </ol>
              </ContentSection>

              <FAQSection toolName="Email Preview Tool" faqs={faqs} />

              <ContentSection id="related-tools" title="Related Email Tools">
                <RelatedTools tools={relatedTools} />
              </ContentSection>
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  );
}

