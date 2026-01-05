'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { generateEmailSignature, SignatureTemplate } from '@/lib/tools/email/signatureGenerator';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Mail, Copy, Check } from 'lucide-react';
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
import { signatureGeneratorContent } from '@/data/tools/signature-generator-content';

export default function SignatureGeneratorEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = signatureGeneratorContent;

  // Tool state
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    twitter: ''
  });
  const [template, setTemplate] = useState<SignatureTemplate>('professional');
  const [signature, setSignature] = useState('');
  const [copied, setCopied] = useState(false);


  const handleGenerate = async () => {
    const html = generateEmailSignature(formData, template);
    setSignature(html);

  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFormValid = formData.name && formData.title && formData.company && formData.email && formData.phone && formData.website;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Email Tools', url: '/tools#email' },
          { name: 'Email Signature Generator', url: '/tools/email/signature-generator' },
        ]}
      />

      <HowToSchema
        name="How to Use Email Signature Generator"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="Email Signature Generator"
        description={metadata.description}
        url="https://mediaplanpro.com/tools/email/signature-generator"
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


                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Website URL *</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="twitter">Twitter URL (Optional)</Label>
                      <Input
                        id="twitter"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="template">Signature Template *</Label>
                    <Select value={template} onValueChange={(value) => setTemplate(value as SignatureTemplate)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleGenerate} className="w-full" size="lg" disabled={!isFormValid}>
                  <Mail className="w-5 h-5 mr-2" />
                  Generate Signature
                </Button>

                {signature && (
                  <div className="space-y-6 pt-6 border-t border-border-primary">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text-primary">Preview</h3>
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy HTML
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="p-6 bg-bg-secondary rounded-lg border border-border-primary">
                      <div dangerouslySetInnerHTML={{ __html: signature }} />
                    </div>

                    <div>
                      <Label>HTML Code</Label>
                      <Textarea
                        value={signature}
                        readOnly
                        rows={10}
                        className="mt-1 font-mono text-xs bg-bg-tertiary"
                      />
                    </div>

                    <div className="bg-[#F59E0B]/10 p-4 rounded-lg border border-[#F59E0B]/30">
                      <h4 className="font-semibold text-[#F59E0B] mb-2">💡 How to Use:</h4>
                      <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
                        <li>Copy the HTML code above</li>
                        <li>Open your email client settings</li>
                        <li>Find the signature section</li>
                        <li>Paste the HTML code (use HTML mode if available)</li>
                        <li>Save and test by sending yourself an email</li>
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
                title="How to Use the Email Signature Generator"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Follow these steps to get the most out of the Email Signature Generator:
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
                toolName="Email Signature Generator"
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
