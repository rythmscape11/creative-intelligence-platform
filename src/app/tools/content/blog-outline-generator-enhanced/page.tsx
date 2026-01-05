'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateBlogOutline, BlogTemplate } from '@/lib/tools/content/blogOutlineGenerator';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { FileText, ChevronRight } from 'lucide-react';
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
import { blogOutlineGeneratorContent } from '@/data/tools/blog-outline-generator-content';

export default function BlogOutlineGeneratorEnhancedPage() {
  const [topic, setTopic] = useState('');
  const [template, setTemplate] = useState<BlogTemplate>('how-to');
  const [outline, setOutline] = useState<any>(null);


  const handleGenerate = async () => {
    if (!topic.trim()) return;

    const result = generateBlogOutline(topic, template);
    setOutline(result);

  };

  const { tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = blogOutlineGeneratorContent;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Content Tools', url: '/tools#content' },
          { name: 'Blog Outline Generator', url: '/tools/content/blog-outline-generator' },
        ]}
      />

      <HowToSchema
        name="How to Generate Blog Outlines"
        description="Step-by-step guide to creating structured blog outlines with proven templates"
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="Blog Outline Generator"
        description="Free tool to generate structured blog outlines with 5 proven templates for better content planning"
        url="https://mediaplanpro.com/tools/content/blog-outline-generator"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={blogOutlineGeneratorContent.metadata.title}
        description={blogOutlineGeneratorContent.metadata.description}
        category="content"
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {blogOutlineGeneratorContent.hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {blogOutlineGeneratorContent.hero.subtitle}
            </p>
          </div>

          {/* Quick Answer */}


          {/* Main Content Grid */}

          {/* Tool Interface - MOVED TO TOP */}
          <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
            <div className="space-y-6">


              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic">Blog Topic *</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Improve Your Email Marketing"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="template">Template Type *</Label>
                  <Select value={template} onValueChange={(value) => setTemplate(value as BlogTemplate)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="how-to">How-To Guide</SelectItem>
                      <SelectItem value="listicle">Listicle (Top 10)</SelectItem>
                      <SelectItem value="guide">Complete Guide</SelectItem>
                      <SelectItem value="comparison">Comparison</SelectItem>
                      <SelectItem value="case-study">Case Study</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-text-secondary mt-1">
                    Choose the structure that best fits your content goals
                  </p>
                </div>
              </div>

              <Button onClick={handleGenerate} className="w-full" size="lg" disabled={!topic.trim()}>
                <FileText className="w-5 h-5 mr-2" />
                Generate Blog Outline
              </Button>

              {outline && (
                <div className="space-y-6 pt-6 border-t border-border-primary">
                  {/* Title */}
                  <div className="p-4 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/30">
                    <p className="text-sm font-medium text-[#F59E0B] mb-2">Suggested Title</p>
                    <h2 className="text-2xl font-bold text-amber-600">{outline.title}</h2>
                  </div>

                  {/* Introduction */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-amber-600" />
                      Introduction
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                      {outline.introduction.map((point: string, index: number) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Main Sections */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-amber-600" />
                      Main Sections
                    </h3>
                    {outline.sections.map((section: any, index: number) => (
                      <div key={index} className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                        <h4 className="font-semibold text-text-primary mb-2">{section.title}</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary ml-4">
                          {section.points.map((point: string, pIndex: number) => (
                            <li key={pIndex}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Conclusion */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-amber-600" />
                      Conclusion
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                      {outline.conclusion.map((point: string, index: number) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Export Buttons */}
                  <ExportButtons
                    data={outline}
                    filename="blog-outline"
                    textToCopy={`${outline.title}\n\nIntroduction:\n${outline.introduction.join('\n')}\n\n${outline.sections.map((s: any) => `${s.title}\n${s.points.join('\n')}`).join('\n\n')}\n\nConclusion:\n${outline.conclusion.join('\n')}`}
                    pdfTitle={outline.title}
                    pdfContent={`Introduction:\n${outline.introduction.join('\n')}\n\n${outline.sections.map((s: any) => `${s.title}\n${s.points.join('\n')}`).join('\n\n')}\n\nConclusion:\n${outline.conclusion.join('\n')}`}
                  />
                </div>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Table of Contents */}
            <div className="lg:col-span-1">
              <TableOfContents items={tableOfContents} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Quick Answer Box */}
              <QuickAnswer
                question={quickAnswer.question}
                answer={quickAnswer.answer}
              />

              {/* Tool Interface */}
              {/* How to Use Section */}
              <ContentSection
                id="how-to-use"
                title="How to Use the Blog Outline Generator"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Creating a structured blog outline is the foundation of great content. Our generator helps you create comprehensive outlines in seconds:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                  {howToSteps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.name}:</strong> {step.text}
                    </li>
                  ))}
                </ol>
              </ContentSection>

              {/* Benefits Section */}
              <ContentSection
                id="benefits"
                title="Benefits of Using Blog Outlines"
              >
                <div className="prose max-w-none">
                  <p className="text-text-secondary leading-relaxed mb-4">
                    Blog outlines provide structure and direction for your content creation process:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-text-secondary">
                    <li><strong>Save Time:</strong> Reduce writing time by 30-50% with a clear structure</li>
                    <li><strong>Improve Quality:</strong> Ensure comprehensive coverage of topics</li>
                    <li><strong>Better SEO:</strong> Structured content ranks better in search engines</li>
                    <li><strong>Consistent Voice:</strong> Maintain consistent messaging throughout</li>
                    <li><strong>Easier Collaboration:</strong> Share outlines with team members for feedback</li>
                  </ul>
                </div>
              </ContentSection>

              {/* Templates Section */}
              <ContentSection
                id="templates"
                title="Blog Outline Templates"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                    <h4 className="font-semibold text-text-primary mb-2">How-To Guide</h4>
                    <p className="text-sm text-text-secondary">Step-by-step instructions for completing a task or solving a problem.</p>
                  </div>
                  <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                    <h4 className="font-semibold text-text-primary mb-2">Listicle</h4>
                    <p className="text-sm text-text-secondary">Numbered list format (Top 10, 5 Ways, etc.) for easy scanning.</p>
                  </div>
                  <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                    <h4 className="font-semibold text-text-primary mb-2">Complete Guide</h4>
                    <p className="text-sm text-text-secondary">Comprehensive resource covering all aspects of a topic.</p>
                  </div>
                  <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                    <h4 className="font-semibold text-text-primary mb-2">Comparison</h4>
                    <p className="text-sm text-text-secondary">Side-by-side comparison of products, services, or approaches.</p>
                  </div>
                </div>
              </ContentSection>

              {/* FAQ Section */}
              <FAQSection
                toolName="Blog Outline Generator"
                faqs={faqs}
              />

              {/* Related Tools */}
              <ContentSection
                id="related-tools"
                title="Related Content Tools"
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

