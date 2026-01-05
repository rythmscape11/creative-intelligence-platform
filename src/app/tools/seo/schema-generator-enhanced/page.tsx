'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateSchema, SchemaType } from '@/lib/tools/seo/schemaGenerator';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Code, Copy, Check } from 'lucide-react';
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
import { schemaGeneratorContent } from '@/data/tools/schema-generator-content';

export default function schemaGeneratorEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = schemaGeneratorContent;

  // Tool state and logic
  const [schemaType, setSchemaType] = useState<SchemaType>('article');
  const [formData, setFormData] = useState<any>({});
  const [schema, setSchema] = useState('');
  const [copied, setCopied] = useState(false);


  const handleGenerate = async () => {
    const result = generateSchema(schemaType, formData);
    setSchema(result);

  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(schema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Seo Tools', url: '/tools#seo' },
          { name: metadata.title, url: '/tools/seo/schema-generator' },
        ]}
      />

      <HowToSchema
        name="How to Use Schema Markup Generator"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name={metadata.title}
        description={metadata.description}
        url="https://mediaplanpro.com/tools/seo/schema-generator"
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
                  <Label htmlFor="type">Schema Type *</Label>
                  <Select value={schemaType} onValueChange={(value) => setSchemaType(value as SchemaType)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="recipe">Recipe</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {schemaType === 'article' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Headline *</Label>
                      <Input
                        placeholder="Article headline"
                        onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Author *</Label>
                      <Input
                        placeholder="Author name"
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Date Published *</Label>
                      <Input
                        type="date"
                        onChange={(e) => setFormData({ ...formData, datePublished: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Image URL *</Label>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {schemaType === 'product' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Product Name *</Label>
                      <Input
                        placeholder="Product name"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Description *</Label>
                      <Textarea
                        placeholder="Product description"
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Price *</Label>
                        <Input
                          type="number"
                          placeholder="99.99"
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Currency *</Label>
                        <Input
                          placeholder="USD"
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Brand *</Label>
                      <Input
                        placeholder="Brand name"
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                <Button onClick={handleGenerate} className="w-full" size="lg">
                  <Code className="w-5 h-5 mr-2" />
                  Generate Schema
                </Button>

                {schema && (
                  <div className="space-y-4 pt-6 border-t border-border-primary">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text-primary">Generated Schema</h3>
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

                    <div className="relative">
                      <pre className="p-4 bg-card rounded-lg overflow-x-auto">
                        <code className="text-sm text-green-400">{schema}</code>
                      </pre>
                    </div>

                    <div className="bg-[#F59E0B]/10 p-4 rounded-lg border border-[#F59E0B]/30">
                      <h4 className="font-semibold text-[#F59E0B] mb-2">💡 How to Use:</h4>
                      <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
                        <li>Copy the generated JSON-LD code</li>
                        <li>Paste it in the &lt;head&gt; section of your HTML</li>
                        <li>Wrap it in &lt;script type="application/ld+json"&gt; tags</li>
                        <li>Test with Google's Rich Results Test tool</li>
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
                title="How to Use the Schema Markup Generator"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Follow these steps to get the most out of the Schema Markup Generator:
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
                toolName="Schema Markup Generator"
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
