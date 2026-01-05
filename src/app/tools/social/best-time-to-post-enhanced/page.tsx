'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBestTimesToPost, Platform, Industry } from '@/lib/tools/social/bestTimeToPost';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Clock } from 'lucide-react';
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
import { bestTimeToPostContent } from '@/data/tools/best-time-to-post-content';

export default function bestTimeToPostEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = bestTimeToPostContent;

  // Tool state and logic
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [industry, setIndustry] = useState<Industry>('ecommerce');
  const [schedule, setSchedule] = useState<any[]>([]);


  const handleGenerate = async () => {
    const results = getBestTimesToPost(platform, industry);
    setSchedule(results);

  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Social Tools', url: '/tools#social' },
          { name: metadata.title, url: '/tools/social/best-time-to-post' },
        ]}
      />

      <HowToSchema
        name="How to Use Best Time to Post Analyzer"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name={metadata.title}
        description={metadata.description}
        url="https://mediaplanpro.com/tools/social/best-time-to-post"
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

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="platform">Platform *</Label>
                    <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="pinterest">Pinterest</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="threads">Threads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={industry} onValueChange={(value) => setIndustry(value as Industry)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="media">Media & Publishing</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleGenerate} className="w-full" size="lg">
                  <Clock className="w-5 h-5 mr-2" />
                  Get Best Times
                </Button>

                {schedule.length > 0 && (
                  <div className="space-y-6 pt-6 border-t border-border-primary">
                    <h3 className="text-xl font-semibold text-text-primary">
                      Recommended Posting Schedule
                    </h3>

                    <div className="grid gap-3">
                      {schedule.map((slot, index) => (
                        <div
                          key={index}
                          className="p-4 bg-bg-secondary rounded-lg border border-border-primary flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-24 font-semibold text-text-primary">
                              {slot.day}
                            </div>
                            <div className="text-purple-400 font-medium">
                              {slot.time}
                            </div>
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${slot.engagement === 'High' ? 'bg-green-500/10 text-green-700' :
                                slot.engagement === 'Medium' ? 'bg-yellow-500/10 text-yellow-700' :
                                  'bg-bg-tertiary text-text-secondary'
                              }`}>
                              {slot.engagement} Engagement
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#F59E0B]/10 p-4 rounded-lg border border-[#F59E0B]/30">
                      <h4 className="font-semibold text-[#F59E0B] mb-2">💡 Pro Tips:</h4>
                      <ul className="text-sm text-text-secondary space-y-1">
                        <li>• Test different times and track your own engagement data</li>
                        <li>• Post consistently at the same times to build audience habits</li>
                        <li>• Consider your specific audience's time zone and behavior</li>
                        <li>• High engagement times may have more competition</li>
                        <li>• Use scheduling tools to maintain consistency</li>
                      </ul>
                    </div>

                    <ExportButtons
                      data={schedule}
                      filename="posting-schedule"
                      options={{ copy: true, csv: true, pdf: true }}
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
                title="How to Use the Best Time to Post"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Posting at the right time maximizes engagement. Our tool helps you determine the best times by:
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
                toolName="Best Time to Post"
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
    </>
  );
}
