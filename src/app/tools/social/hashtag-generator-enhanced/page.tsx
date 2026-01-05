'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateHashtags, getOptimalHashtagCount, SocialPlatform } from '@/lib/tools/social/hashtagGenerator';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Hash, Copy, Check } from 'lucide-react';
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
import { hashtagGeneratorContent } from '@/data/tools/hashtag-generator-content';
import { EmailCaptureModal } from '@/components/cro/EmailCaptureModal';

export default function hashtagGeneratorEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = hashtagGeneratorContent;

  // Tool state and logic
  const [keyword, setKeyword] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [hashtags, setHashtags] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  // Email capture state
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!keyword.trim()) return;

    const results = generateHashtags(keyword, platform);
    setHashtags(results);
    setHasGenerated(true);

  };

  // Show email capture 3 seconds after first generation
  useEffect(() => {
    if (hasGenerated && !localStorage.getItem('email-captured-hashtag-generator')) {
      const timer = setTimeout(() => {
        setShowEmailCapture(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasGenerated]);

  const handleCopyAll = async () => {
    const allHashtags = hashtags.map(h => h.hashtag).join(' ');
    await navigator.clipboard.writeText(allHashtags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const optimal = getOptimalHashtagCount(platform);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Social Tools', url: '/tools#social' },
          { name: metadata.title, url: '/tools/social/hashtag-generator' },
        ]}
      />

      <HowToSchema
        name="How to Use Hashtag Generator"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name={metadata.title}
        description={metadata.description}
        url="https://mediaplanpro.com/tools/social/hashtag-generator"
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
                    <Label htmlFor="keyword">Keyword or Topic *</Label>
                    <Input
                      id="keyword"
                      placeholder="e.g., marketing"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="platform">Platform *</Label>
                    <Select value={platform} onValueChange={(value) => setPlatform(value as SocialPlatform)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-text-secondary mt-1">
                      Recommended: {optimal.recommended} hashtags for {platform}
                    </p>
                  </div>
                </div>

                <Button onClick={handleGenerate} className="w-full" size="lg" disabled={!keyword.trim()}>
                  <Hash className="w-5 h-5 mr-2" />
                  Generate Hashtags
                </Button>

                {hashtags.length > 0 && (
                  <div className="space-y-6 pt-6 border-t border-border-primary">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-text-primary">
                        {hashtags.length} Hashtags Generated
                      </h3>
                      <Button variant="outline" size="sm" onClick={handleCopyAll}>
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy All
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {hashtags.map((tag, index) => (
                        <div
                          key={index}
                          className="p-3 bg-bg-secondary rounded-lg border border-border-primary"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-purple-400">{tag.hashtag}</span>
                            <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-700">
                              {tag.category}
                            </span>
                          </div>
                          <div className="flex gap-2 text-xs">
                            <span className={`px-2 py-0.5 rounded ${tag.volume === 'High' ? 'bg-green-500/10 text-green-700' :
                                tag.volume === 'Medium' ? 'bg-yellow-500/10 text-yellow-700' :
                                  'bg-bg-tertiary text-text-secondary'
                              }`}>
                              Vol: {tag.volume}
                            </span>
                            <span className={`px-2 py-0.5 rounded ${tag.competition === 'Low' ? 'bg-green-500/10 text-green-700' :
                                tag.competition === 'Medium' ? 'bg-yellow-500/10 text-yellow-700' :
                                  'bg-red-500/10 text-red-700'
                              }`}>
                              Comp: {tag.competition}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#F59E0B]/10 p-4 rounded-lg border border-[#F59E0B]/30">
                      <h4 className="font-semibold text-[#F59E0B] mb-2">💡 Best Practices:</h4>
                      <ul className="text-sm text-text-secondary space-y-1">
                        <li>• Mix high, medium, and low volume hashtags for best reach</li>
                        <li>• Use {optimal.recommended} hashtags for optimal engagement on {platform}</li>
                        <li>• Include branded hashtags to build community</li>
                        <li>• Research trending hashtags in your niche</li>
                        <li>• Avoid banned or spam hashtags</li>
                      </ul>
                    </div>

                    <ExportButtons
                      data={hashtags}
                      filename="hashtags"
                      options={{ copy: true, csv: true }}
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
                title="How to Use the Hashtag Generator"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Follow these steps to get the most out of the Hashtag Generator:
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
                toolName="Hashtag Generator"
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
          localStorage.setItem('email-captured-hashtag-generator', 'true');
        }}
        source="hashtag-generator"
        toolId="hashtag-generator-enhanced"
        title="Get Your Hashtags + Social Media Growth Guide"
        description="Save your hashtag sets and receive expert tips on social media growth and engagement"
        incentive="Free Social Media Growth Toolkit (worth $89)"
      />
    </>
  );
}
