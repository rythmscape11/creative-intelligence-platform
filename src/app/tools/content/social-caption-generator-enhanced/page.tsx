'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateSocialCaption, CaptionStyle, Platform } from '@/lib/tools/content/socialCaptionGenerator';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { MessageSquare, Copy, Check } from 'lucide-react';
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
import { socialCaptionGeneratorContent } from '@/data/tools/social-caption-generator-content';

export default function SocialCaptionGeneratorEnhancedPage() {
  const [topic, setTopic] = useState('');
  const [benefit, setBenefit] = useState('');
  const [style, setStyle] = useState<CaptionStyle>('professional');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [captions, setCaptions] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);


  const handleGenerate = async () => {
    if (!topic.trim() || !benefit.trim()) return;

    const results = generateSocialCaption(topic, benefit, style, platform);
    setCaptions(results);

  };

  const handleCopy = async (caption: string, hashtags: string[], index: number) => {
    const fullText = `${caption}\n\n${hashtags.join(' ')}`;
    await navigator.clipboard.writeText(fullText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const { tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = socialCaptionGeneratorContent;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Content Tools', url: '/tools#content' },
          { name: 'Social Caption Generator', url: '/tools/content/social-caption-generator' },
        ]}
      />

      <HowToSchema
        name="How to Generate Social Media Captions"
        description="Step-by-step guide to creating engaging social media captions with hashtags"
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="Social Caption Generator"
        description="Free tool to generate engaging social media captions with hashtags for Instagram, Facebook, Twitter, and LinkedIn"
        url="https://mediaplanpro.com/tools/content/social-caption-generator"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={socialCaptionGeneratorContent.metadata.title}
        description={socialCaptionGeneratorContent.metadata.description}
        category="social"
      >
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {socialCaptionGeneratorContent.hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {socialCaptionGeneratorContent.hero.subtitle}
            </p>

            {/* Tool Interface - MOVED TO TOP */}
            <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
              <div className="space-y-6">


                <div className="space-y-4">
                  <div>
                    <Label htmlFor="topic">Post Topic *</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., New product launch"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="benefit">Key Benefit *</Label>
                    <Input
                      id="benefit"
                      placeholder="e.g., Saves time and increases productivity"
                      value={benefit}
                      onChange={(e) => setBenefit(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="style">Caption Style *</Label>
                      <Select value={style} onValueChange={(value) => setStyle(value as CaptionStyle)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="humorous">Playful/Funny</SelectItem>
                          <SelectItem value="inspirational">Inspirational</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="storytelling">Storytelling</SelectItem>
                          <SelectItem value="sales">Promo/Sales</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

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
                  </div>
                </div>

                <Button onClick={handleGenerate} className="w-full" size="lg" disabled={!topic.trim() || !benefit.trim()}>
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Generate Captions
                </Button>

                {captions.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-border-primary">
                    <h3 className="text-lg font-semibold text-text-primary">Generated Captions</h3>
                    {captions.map((item, index) => (
                      <div key={index} className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <p className="text-text-primary flex-1">{item.caption}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(item.caption, item.hashtags, index)}
                          >
                            {copiedIndex === index ? (
                              <><Check className="w-4 h-4 mr-1" /> Copied</>
                            ) : (
                              <><Copy className="w-4 h-4 mr-1" /> Copy</>
                            )}
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.hashtags.map((tag: string, tagIndex: number) => (
                            <span key={tagIndex} className="text-sm text-blue-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                    <ExportButtons
                      data={captions}
                      filename="social-captions"
                      textToCopy={captions.map((c, i) => `${i + 1}. ${c.caption}\n${c.hashtags.join(' ')}`).join('\n\n')}
                      pdfTitle="Social Media Captions"
                      pdfContent={captions.map((c, i) => `Caption ${i + 1}:\n${c.caption}\n\nHashtags: ${c.hashtags.join(' ')}`).join('\n\n')}
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
              <ContentSection id="how-to-use" title="How to Use the Social Caption Generator">
                <p className="text-text-secondary leading-relaxed mb-4">
                  Engaging captions drive social media success. Our generator creates platform-optimized captions:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                  {howToSteps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.name}:</strong> {step.text}
                    </li>
                  ))}
                </ol>
              </ContentSection>

              <FAQSection toolName="Social Caption Generator" faqs={faqs} />

              <ContentSection id="related-tools" title="Related Social Tools">
                <RelatedTools tools={relatedTools} />
              </ContentSection>
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  );
}
