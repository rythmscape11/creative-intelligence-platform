'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { performSocialAudit } from '@/lib/tools/social/socialAudit';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { CheckCircle2 } from 'lucide-react';
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
import { socialAuditToolContent } from '@/data/tools/social-audit-tool-content';

export default function socialAuditToolEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = socialAuditToolContent;

  // Tool state and logic
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<any>(null);


  const handleCheckboxChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  const handleAudit = async () => {
    const auditResult = performSocialAudit(checklist);
    setResult(auditResult);

  };

  const checklistItems = [
    { key: 'profilePicture', label: 'Profile picture is clear and professional' },
    { key: 'coverImage', label: 'Cover/header image is branded' },
    { key: 'bio', label: 'Bio/description is complete and compelling' },
    { key: 'contact', label: 'Contact information is provided' },
    { key: 'website', label: 'Website link is included' },
    { key: 'postingFrequency', label: 'Posting consistently (3+ times per week)' },
    { key: 'brandVoice', label: 'Content aligns with brand voice' },
    { key: 'hashtags', label: 'Using relevant hashtags' },
    { key: 'contentMix', label: 'Mix of content types (images, videos, text)' },
    { key: 'commentResponse', label: 'Responding to comments within 24 hours' },
    { key: 'engagement', label: 'Engaging with other accounts' },
    { key: 'cta', label: 'Using calls-to-action in posts' },
    { key: 'imageOptimization', label: 'Images are optimized for platform' },
    { key: 'postingTimes', label: 'Posting at optimal times' },
    { key: 'analytics', label: 'Using analytics to track performance' },
    { key: 'paidCampaigns', label: 'Running paid campaigns' },
    { key: 'influencers', label: 'Collaborating with influencers' },
    { key: 'stories', label: 'Using Stories/Reels features' },
    { key: 'crossPromotion', label: 'Cross-promoting on other platforms' },
    { key: 'ugc', label: 'User-generated content strategy' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
    };
    if (score >= 60) return {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
    };
    if (score >= 40) return {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
    };
    return {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
    };
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Social Tools', url: '/tools#social' },
          { name: metadata.title, url: '/tools/social/social-audit-tool' },
        ]}
      />

      <HowToSchema
        name="How to Use Social Media Audit Tool"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name={metadata.title}
        description={metadata.description}
        url="https://mediaplanpro.com/tools/social/social-audit-tool"
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

                <div className="space-y-3">
                  <Label>Check all items that apply to your social media presence:</Label>
                  <div className="grid gap-3">
                    {checklistItems.map((item) => (
                      <div key={item.key} className="flex items-center space-x-3 p-3 bg-bg-secondary rounded-lg border border-border-primary">
                        <Checkbox
                          id={item.key}
                          checked={checklist[item.key] || false}
                          onCheckedChange={(checked) => handleCheckboxChange(item.key, checked as boolean)}
                        />
                        <label
                          htmlFor={item.key}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleAudit} className="w-full" size="lg">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Run Social Audit
                </Button>

                {result && (
                  <div className="space-y-6 pt-6 border-t border-border-primary">
                    <div className={`p-8 ${getScoreColor(result.score).bg} rounded-lg border-2 ${getScoreColor(result.score).border} text-center`}>
                      <p className="text-sm font-medium text-text-secondary mb-2">Social Media Health Score</p>
                      <p className={`text-6xl font-bold ${getScoreColor(result.score).text}`}>
                        {result.score}%
                      </p>
                      <p className="text-sm mt-2 text-text-secondary">
                        {result.completedItems} of {result.totalItems} items completed
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {(Object.entries(result.categoryScores || {}) as Array<[string, number]>).map(([category, value]) => (
                        <div key={category} className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
                          <p className="text-sm text-text-secondary">{category}</p>
                          <p className="text-2xl font-semibold text-text-primary">{value}%</p>
                        </div>
                      ))}
                    </div>

                    {result.strengths && result.strengths.length > 0 && (
                      <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                        <h4 className="font-semibold text-green-300 mb-2">Strengths</h4>
                        <ul className="list-disc list-inside text-sm text-green-100 space-y-1">
                          {result.strengths.map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.opportunities && result.opportunities.length > 0 && (
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                        <h4 className="font-semibold text-amber-200 mb-2">Opportunities</h4>
                        <ul className="list-disc list-inside text-sm text-amber-100 space-y-1">
                          {result.opportunities.map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                      <h4 className="font-semibold text-yellow-400 mb-3">📋 Recommendations:</h4>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-yellow-400 flex items-start gap-2">
                            <span className="text-yellow-400 mt-0.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {result.actionPlan && result.actionPlan.length > 0 && (
                      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
                        <h4 className="font-semibold text-text-primary mb-2">Action Plan</h4>
                        <div className="space-y-3">
                          {result.actionPlan.map((section: { category: string; items: string[] }, sectionIndex: number) => (
                            <div key={sectionIndex}>
                              <p className="text-sm font-medium text-text-secondary">{section.category}</p>
                              <ul className="ml-4 list-disc text-sm text-text-primary">
                                {section.items.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <ExportButtons
                      data={result}
                      filename="social-audit"
                      options={{ copy: true, pdf: true }}
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
                title="How to Use the Social Media Audit Tool"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Follow these steps to get the most out of the Social Media Audit Tool:
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
                toolName="Social Media Audit Tool"
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
