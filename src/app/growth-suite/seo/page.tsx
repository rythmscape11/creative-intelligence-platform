'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, FileText, TrendingUp, Download, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { BackButton } from '@/components/layout/back-button';
import { generateContentBrief, analyzeKeyword, type ContentBrief, type KeywordAnalysis } from '@/lib/growth-suite/seo-optimizer';

interface SavedBrief {
  id: string;
  keyword: string;
  analysis: KeywordAnalysis;
  brief: ContentBrief;
  createdAt: string;
}

export default function SEOPage() {
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedBriefs, setSavedBriefs] = useState<SavedBrief[]>([]);
  const [expandedBrief, setExpandedBrief] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsGenerating(true);

    // Simulate processing time for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysis = analyzeKeyword(keyword);
    const brief = generateContentBrief(keyword);

    const newBrief: SavedBrief = {
      id: Date.now().toString(),
      keyword,
      analysis,
      brief,
      createdAt: new Date().toISOString()
    };

    setSavedBriefs(prev => [newBrief, ...prev]);
    setExpandedBrief(newBrief.id);
    setIsGenerating(false);
    setKeyword('');
  };

  const handleCopy = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownload = (brief: SavedBrief) => {
    const content = `
SEO CONTENT BRIEF
=================

Keyword: ${brief.keyword}
Generated: ${new Date(brief.createdAt).toLocaleDateString()}

KEYWORD ANALYSIS
----------------
Search Volume: ${brief.analysis.searchVolume.toLocaleString()}/month
Difficulty: ${brief.analysis.difficulty}/100
Competition: ${brief.analysis.competition}
CPC: $${brief.analysis.cpc}
Opportunity Score: ${brief.analysis.opportunity}/100

CONTENT BRIEF
-------------
Title: ${brief.brief.title}
Meta Description: ${brief.brief.metaDescription}
Target Word Count: ${brief.brief.targetWordCount} words
Readability: ${brief.brief.readabilityTarget}
SEO Score: ${brief.brief.seoScore}/100

PRIMARY KEYWORD
${brief.brief.keywords.primary}

SECONDARY KEYWORDS
${brief.brief.keywords.secondary.map(k => `- ${k}`).join('\n')}

LSI KEYWORDS
${brief.brief.keywords.lsi.map(k => `- ${k}`).join('\n')}

CONTENT STRUCTURE
-----------------

Introduction:
${brief.brief.contentStructure.introduction}

Main Points:
${brief.brief.contentStructure.mainPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Conclusion:
${brief.brief.contentStructure.conclusion}

RECOMMENDED HEADINGS (H2)
${brief.brief.headings.h2.map(h => `- ${h}`).join('\n')}

RECOMMENDED SUBHEADINGS (H3)
${brief.brief.headings.h3.map(h => `- ${h}`).join('\n')}

SEO RECOMMENDATIONS
-------------------
${brief.brief.recommendations.map(r => `${r}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-brief-${brief.keyword.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs and Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { label: 'Growth Suite', href: '/growth-suite' },
              { label: 'SEO Tools', href: '/growth-suite/seo' }
            ]}
          />
          <BackButton href="/growth-suite" label="Back to Growth Suite" />
        </div>

        {/* Header */}
        <div className="mb-8 bg-bg-secondary border border-border-primary rounded-lg p-8 animate-fade-in-up">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-[#F59E0B]">
              <Search className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-text-primary">
              SEO Opportunity Engine
            </h1>
          </div>
          <p className="text-lg text-text-secondary">
            Generate AI-powered content briefs optimized for search
          </p>
        </div>

        {/* Generate Brief Form */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-text-primary">
            Generate New Brief
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-primary">
                Target Keyword
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., marketing strategy template"
                  required
                  className="flex-1 px-4 py-3 rounded-lg border border-[#F59E0B] bg-bg-tertiary text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isGenerating || !keyword}
                  className="px-8 py-3 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin h-5 w-5 mr-2 border-2 border-black border-t-transparent rounded-full"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Generate Brief
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs mt-2 text-text-tertiary">
                AI will analyze top-ranking content and create a comprehensive brief
              </p>
            </div>
          </form>

          {/* Usage indicator */}
          <div className="mt-6 p-4 bg-bg-tertiary border border-border-primary rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-text-primary">
                Session Usage
              </span>
              <span className="text-sm font-medium text-text-primary">
                {savedBriefs.length} briefs generated
              </span>
            </div>
            <div className="w-full bg-bg-hover rounded-full h-2">
              <div className="h-2 rounded-full transition-all duration-300 bg-[#F59E0B]"
                style={{
                  width: `${Math.min(100, (savedBriefs.length / 5) * 100)}%`
                }}>
              </div>
            </div>
            <p className="text-xs mt-2 text-text-tertiary">
              Briefs are saved in your browser session
            </p>
          </div>
        </div>

        {/* Briefs List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">
            Your Briefs ({savedBriefs.length})
          </h2>

          {savedBriefs.length === 0 ? (
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-12 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-[#F59E0B] opacity-30" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">
                No briefs yet
              </h3>
              <p className="text-text-secondary">
                Generate your first SEO content brief to get started
              </p>
            </div>
          ) : (
            savedBriefs.map((savedBrief) => {
              const isExpanded = expandedBrief === savedBrief.id;
              return (
                <div
                  key={savedBrief.id}
                  className="bg-bg-secondary border border-border-primary rounded-lg overflow-hidden"
                >
                  {/* Brief Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <FileText className="h-5 w-5 mr-2 text-[#F59E0B]" />
                          <h3 className="text-xl font-semibold text-text-primary">
                            {savedBrief.keyword}
                          </h3>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm mt-3">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 text-[#F59E0B]" />
                            <span className="text-text-secondary">
                              {savedBrief.analysis.searchVolume.toLocaleString()} searches/mo
                            </span>
                          </div>
                          <div>
                            <span className="text-text-tertiary">Difficulty:</span>
                            <span className={`ml-2 font-medium ${
                              savedBrief.analysis.difficulty < 40 ? 'text-green-400' :
                              savedBrief.analysis.difficulty < 60 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {savedBrief.analysis.difficulty}/100
                            </span>
                          </div>
                          <div>
                            <span className="text-text-tertiary">Opportunity:</span>
                            <span className="ml-2 font-medium text-[#F59E0B]">
                              {savedBrief.analysis.opportunity}/100
                            </span>
                          </div>
                          <div>
                            <span className="text-text-tertiary">SEO Score:</span>
                            <span className="ml-2 font-medium text-green-400">
                              {savedBrief.brief.seoScore}/100
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleDownload(savedBrief)}
                          className="px-4 py-2 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary hover:bg-bg-hover transition-colors flex items-center"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </button>
                        <button
                          onClick={() => setExpandedBrief(isExpanded ? null : savedBrief.id)}
                          className="px-4 py-2 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold transition-colors flex items-center"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-2" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-2" />
                              View Details
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Brief Details */}
                  {isExpanded && (
                    <div className="border-t border-border-primary p-6 space-y-6 bg-bg-tertiary">
                      {/* Title & Meta */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-text-primary">Recommended Title</h4>
                          <button
                            onClick={() => handleCopy(savedBrief.brief.title, `title-${savedBrief.id}`)}
                            className="text-sm text-[#F59E0B] hover:text-[#D97706] flex items-center"
                          >
                            {copiedSection === `title-${savedBrief.id}` ? (
                              <><Check className="h-4 w-4 mr-1" /> Copied</>
                            ) : (
                              <><Copy className="h-4 w-4 mr-1" /> Copy</>
                            )}
                          </button>
                        </div>
                        <p className="text-text-secondary bg-bg-secondary p-3 rounded border border-border-primary">
                          {savedBrief.brief.title}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-text-primary">Meta Description</h4>
                          <button
                            onClick={() => handleCopy(savedBrief.brief.metaDescription, `meta-${savedBrief.id}`)}
                            className="text-sm text-[#F59E0B] hover:text-[#D97706] flex items-center"
                          >
                            {copiedSection === `meta-${savedBrief.id}` ? (
                              <><Check className="h-4 w-4 mr-1" /> Copied</>
                            ) : (
                              <><Copy className="h-4 w-4 mr-1" /> Copy</>
                            )}
                          </button>
                        </div>
                        <p className="text-text-secondary bg-bg-secondary p-3 rounded border border-border-primary">
                          {savedBrief.brief.metaDescription}
                        </p>
                      </div>

                      {/* Keywords */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-text-primary">Secondary Keywords</h4>
                          <ul className="space-y-1">
                            {savedBrief.brief.keywords.secondary.map((kw, i) => (
                              <li key={i} className="text-sm text-text-secondary">• {kw}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-text-primary">LSI Keywords</h4>
                          <ul className="space-y-1">
                            {savedBrief.brief.keywords.lsi.slice(0, 5).map((kw, i) => (
                              <li key={i} className="text-sm text-text-secondary">• {kw}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Content Structure */}
                      <div>
                        <h4 className="font-semibold mb-2 text-text-primary">Recommended Headings (H2)</h4>
                        <ul className="space-y-1">
                          {savedBrief.brief.headings.h2.map((h, i) => (
                            <li key={i} className="text-sm text-text-secondary">• {h}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="font-semibold mb-2 text-text-primary">SEO Recommendations</h4>
                        <ul className="space-y-2">
                          {savedBrief.brief.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-text-secondary bg-bg-secondary p-2 rounded border border-border-primary">
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Target Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border-primary">
                        <div>
                          <div className="text-xs text-text-tertiary mb-1">Target Word Count</div>
                          <div className="text-lg font-semibold text-text-primary">
                            {savedBrief.brief.targetWordCount.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-text-tertiary mb-1">Readability</div>
                          <div className="text-lg font-semibold text-text-primary">
                            {savedBrief.brief.readabilityTarget}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-text-tertiary mb-1">CPC</div>
                          <div className="text-lg font-semibold text-text-primary">
                            ${savedBrief.analysis.cpc}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-text-tertiary mb-1">Competition</div>
                          <div className="text-lg font-semibold text-text-primary capitalize">
                            {savedBrief.analysis.competition}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Free Tier Notice */}
        <div className="mt-8 bg-bg-tertiary border border-border-primary rounded-lg p-6">
          <div className="flex items-start">
            <Search className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-[#F59E0B]" />
            <div>
              <h4 className="font-semibold mb-1 text-text-primary">
                Free Tier Limits
              </h4>
              <p className="text-sm text-text-secondary">
                Generate up to 5 SEO briefs per month and track 10 keywords.
                <Link href="/pricing" className="ml-1 underline text-[#F59E0B] hover:text-[#D97706]">
                  Upgrade for unlimited briefs
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

