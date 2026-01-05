'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  generateContentCalendar,
  getCalendarStats,
  ContentType,
  PostingFrequency,
  CalendarEntry,
  CalendarStats,
} from '@/lib/tools/content/contentCalendar';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Calendar } from 'lucide-react';
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
import { contentCalendarGeneratorContent } from '@/data/tools/content-calendar-generator-content';
import { EmailCaptureModal } from '@/components/cro/EmailCaptureModal';

export default function ContentCalendarGeneratorEnhancedPage() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState(30);
  const [contentType, setContentType] = useState<ContentType>('mixed');
  const [frequency, setFrequency] = useState<PostingFrequency>('3x-week');
  const [calendar, setCalendar] = useState<CalendarEntry[]>([]);
  const [stats, setStats] = useState<CalendarStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Email capture state
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    // Wrap generation in try/catch so users get actionable messages instead of the generic "unexpected error".
    setError(null);
    setIsGenerating(true);

    try {
      const start = new Date(startDate);
      const entries = generateContentCalendar(start, days, contentType, frequency);
      const calendarStats = getCalendarStats(entries);

      setCalendar(entries);
      setStats(calendarStats);
      setHasGenerated(true);
    } catch (err) {
      console.error('Failed to generate content calendar', err);
      setCalendar([]);
      setStats(null);
      setError(err instanceof Error ? err.message : 'Unable to generate the calendar. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  const isGenerateDisabled = !startDate || Number.isNaN(days) || days < 7 || days > 90;

  // Show email capture 3 seconds after first generation
  useEffect(() => {
    if (hasGenerated && !localStorage.getItem('email-captured-content-calendar')) {
      const timer = setTimeout(() => {
        setShowEmailCapture(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasGenerated]);

  const { tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = contentCalendarGeneratorContent;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Content Tools', url: '/tools#content' },
          { name: 'Content Calendar Generator', url: '/tools/content/content-calendar-generator' },
        ]}
      />

      <HowToSchema
        name="How to Generate Content Calendars"
        description="Step-by-step guide to creating content calendars for consistent marketing"
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="Content Calendar Generator"
        description="Free tool to generate 30-day content calendars for your marketing with customizable posting frequency"
        url="https://mediaplanpro.com/tools/content/content-calendar-generator"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={contentCalendarGeneratorContent.metadata.title}
        description={contentCalendarGeneratorContent.metadata.description}
        category="content"
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {contentCalendarGeneratorContent.hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {contentCalendarGeneratorContent.hero.subtitle}
            </p>
          </div>

          {/* Quick Answer */}


          {/* Main Content Grid */}

          {/* Tool Interface - MOVED TO TOP */}
          <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
            <div className="space-y-6">


              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="days">Number of Days *</Label>
                    <Input
                      id="days"
                      type="number"
                      min="7"
                      max="90"
                      value={Number.isNaN(days) ? '' : days}
                      onChange={(e) => setDays(e.target.value === '' ? Number.NaN : Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contentType">Content Type *</Label>
                    <Select value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a content mix" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mixed">Mixed Content</SelectItem>
                        <SelectItem value="blog">Blog Posts</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="email">Email Campaigns</SelectItem>
                        <SelectItem value="video">Video Content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="frequency">Posting Frequency *</Label>
                    <Select value={frequency} onValueChange={(value) => setFrequency(value as PostingFrequency)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a cadence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="3x-week">3x per Week</SelectItem>
                        <SelectItem value="2x-week">2x per Week</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-md border border-error/40 bg-error/10 p-4 text-sm text-error" role="alert">
                  {error}
                </div>
              )}

              <Button
                onClick={handleGenerate}
                className="w-full"
                size="lg"
                disabled={isGenerateDisabled || isGenerating}
              >
                <Calendar className="w-5 h-5 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Content Calendar'}
              </Button>

              {calendar.length > 0 && stats && (
                <div className="space-y-6 pt-6 border-t border-border-primary">
                  {/* Stats */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/30 text-center">
                      <p className="text-2xl font-bold text-amber-500">{stats.totalPosts}</p>
                      <p className="text-sm text-text-secondary">Total Posts</p>
                    </div>
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 text-center">
                      <p className="text-2xl font-bold text-blue-400">{stats.blogPosts}</p>
                      <p className="text-sm text-text-secondary">Blog Posts</p>
                    </div>
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                      <p className="text-2xl font-bold text-green-400">{stats.socialPosts}</p>
                      <p className="text-sm text-text-secondary">Social Posts</p>
                    </div>
                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30 text-center">
                      <p className="text-2xl font-bold text-purple-400">{stats.emailCampaigns}</p>
                      <p className="text-sm text-text-secondary">Email Campaigns</p>
                    </div>
                    <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/30 text-center">
                      <p className="text-2xl font-bold text-pink-400">{stats.videoPosts}</p>
                      <p className="text-sm text-text-secondary">Video Posts</p>
                    </div>
                    <div className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/30 text-center">
                      <p className="text-2xl font-bold text-teal-300">{stats.consistencyScore}%</p>
                      <p className="text-sm text-text-secondary">Consistency Score</p>
                    </div>
                  </div>

                  {stats.busiestDay && (
                    <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4 text-sm text-text-secondary">
                      Most active day: <span className="font-semibold text-text-primary">{stats.busiestDay}</span>
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(stats.byPlatform).map(([platform, count]) => (
                      <div
                        key={platform}
                        className="flex items-center justify-between rounded-lg border border-border-primary bg-bg-tertiary px-4 py-2 text-sm text-text-secondary"
                      >
                        <span>{platform}</span>
                        <span className="font-semibold text-text-primary">{count}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-bg-tertiary">
                          <th className="border border-border-primary px-4 py-2 text-left text-text-primary">Date</th>
                          <th className="border border-border-primary px-4 py-2 text-left text-text-primary">Day</th>
                          <th className="border border-border-primary px-4 py-2 text-left text-text-primary">Content Type</th>
                          <th className="border border-border-primary px-4 py-2 text-left text-text-primary">Topic</th>
                          <th className="border border-border-primary px-4 py-2 text-left text-text-primary">Platform</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calendar.map((entry, index) => (
                          <tr key={index} className="hover:bg-bg-tertiary">
                            <td className="border border-border-primary px-4 py-2 text-text-primary">{entry.date}</td>
                            <td className="border border-border-primary px-4 py-2 text-text-primary">{entry.day}</td>
                            <td className="border border-border-primary px-4 py-2 text-text-primary">{entry.contentType}</td>
                            <td className="border border-border-primary px-4 py-2 text-text-primary">{entry.topic}</td>
                            <td className="border border-border-primary px-4 py-2 text-text-primary">{entry.platform}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Export Buttons */}
                  <ExportButtons
                    data={calendar}
                    filename="content-calendar"
                    textToCopy={calendar.map(e => `${e.date} - ${e.contentType}: ${e.topic} (${e.platform})`).join('\n')}
                    pdfTitle="Content Calendar"
                    pdfContent={calendar.map(e => `${e.date} (${e.day}) - ${e.contentType}: ${e.topic} (${e.platform})`).join('\n')}
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
                title="How to Use the Content Calendar Generator"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Consistent content publishing is key to marketing success. Our generator helps you plan ahead:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                  {howToSteps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.name}:</strong> {step.text}
                    </li>
                  ))}
                </ol>
              </ContentSection>

              {/* FAQ Section */}
              <FAQSection
                toolName="Content Calendar Generator"
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

      <EmailCaptureModal
        isOpen={showEmailCapture}
        onClose={() => {
          setShowEmailCapture(false);
          localStorage.setItem('email-captured-content-calendar', 'true');
        }}
        source="content-calendar"
        toolId="content-calendar-generator-enhanced"
        title="Get Your Calendar + Content Planning Guide"
        description="Save your content calendar and receive expert content strategy tips every week"
        incentive="Free Content Strategy Toolkit (worth $99)"
      />
    </>
  );
}
