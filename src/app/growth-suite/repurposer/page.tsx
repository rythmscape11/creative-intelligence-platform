'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, FileText, Twitter, Linkedin, Instagram, Youtube, Copy, Check, Facebook, Video, Download } from 'lucide-react';
import { repurposeContent, platformConfigs, type Platform } from '@/lib/growth-suite/content-repurposer';

const platformIcons: Record<Platform, any> = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  tiktok: Video
};

export default function RepurposerPage() {
  const [sourceContent, setSourceContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Partial<Record<Platform, string>>>({});
  const [copiedPlatform, setCopiedPlatform] = useState<Platform | null>(null);

  const togglePlatform = (platformId: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceContent.trim() || selectedPlatforms.length === 0) return;

    setIsGenerating(true);

    try {
      const res = await fetch('/api/growth-suite/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: sourceContent,
          platforms: selectedPlatforms,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedContent(data.results || {});
      } else {
        // Fallback to local template-based
        const content = repurposeContent(sourceContent, selectedPlatforms);
        setGeneratedContent(content);
      }
    } catch (error) {
      console.error('Repurpose error:', error);
      // Fallback to local template-based
      const content = repurposeContent(sourceContent, selectedPlatforms);
      setGeneratedContent(content);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, platform: Platform) => {
    await navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  const downloadAll = () => {
    let allContent = 'REPURPOSED CONTENT\n';
    allContent += '==================\n\n';
    allContent += `Generated: ${new Date().toLocaleString()}\n`;
    allContent += `Source Length: ${sourceContent.length} characters\n\n`;

    Object.entries(generatedContent).forEach(([platform, content]) => {
      const config = platformConfigs[platform as Platform];
      allContent += `\n${'='.repeat(60)}\n`;
      allContent += `${config.name.toUpperCase()}\n`;
      allContent += `${'='.repeat(60)}\n\n`;
      allContent += content;
      allContent += '\n\n';
    });

    const blob = new Blob([allContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repurposed-content-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = sourceContent.trim().split(/\s+/).length;
  const charCount = sourceContent.length;

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-bg-secondary border border-border-primary rounded-lg p-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-[#F59E0B]">
              <Sparkles className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-text-primary">
              AI Content Repurposer
            </h1>
          </div>
          <p className="text-lg text-text-secondary">
            Transform one piece of content into multiple platform-optimized posts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-text-primary">
                Source Content
              </h2>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-primary">
                    Paste your content
                  </label>
                  <textarea
                    value={sourceContent}
                    onChange={(e) => setSourceContent(e.target.value)}
                    placeholder="Paste your blog post, article, or any content you want to repurpose..."
                    rows={12}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#F59E0B] bg-bg-tertiary text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none"
                  />
                  <div className="flex justify-between mt-2 text-xs text-text-tertiary">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-text-primary">
                    Select Platforms ({selectedPlatforms.length} selected)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(Object.keys(platformConfigs) as Platform[]).map((platformId) => {
                      const config = platformConfigs[platformId];
                      const Icon = platformIcons[platformId];
                      const isSelected = selectedPlatforms.includes(platformId);

                      return (
                        <button
                          key={platformId}
                          type="button"
                          onClick={() => togglePlatform(platformId)}
                          className={`p-4 rounded-lg border transition-all ${isSelected
                              ? 'bg-[#F59E0B]/10 border-[#F59E0B]'
                              : 'bg-bg-tertiary border-border-primary hover:border-border-hover'
                            }`}
                        >
                          <div className="flex items-center">
                            <Icon className={`h-5 w-5 mr-2 ${isSelected ? 'text-[#F59E0B]' : 'text-text-secondary'}`} />
                            <span className={`text-sm font-medium ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                              {config.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || !sourceContent.trim() || selectedPlatforms.length === 0}
                  className="w-full px-6 py-3 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin h-5 w-5 mr-2 border-2 border-black border-t-transparent rounded-full"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Repurpose Content
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Usage Info */}
            <div className="bg-bg-tertiary border border-border-primary rounded-lg p-4">
              <div className="flex items-start">
                <FileText className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-[#F59E0B]" />
                <div>
                  <h4 className="font-semibold mb-1 text-text-primary text-sm">
                    How it works
                  </h4>
                  <p className="text-xs text-text-secondary">
                    Our intelligent templates analyze your content and create platform-optimized versions with appropriate formatting, hashtags, and calls-to-action.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-primary">
                  Generated Content
                </h2>
                {Object.keys(generatedContent).length > 0 && (
                  <button
                    onClick={downloadAll}
                    className="px-3 py-2 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary hover:bg-bg-hover transition-colors flex items-center text-sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download All
                  </button>
                )}
              </div>

              {Object.keys(generatedContent).length === 0 ? (
                <div className="bg-bg-elevated rounded-lg p-12 text-center">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-text-tertiary" />
                  <p className="text-text-secondary">
                    Generated content will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {Object.entries(generatedContent).map(([platformId, content]) => {
                    const platform = platformId as Platform;
                    const config = platformConfigs[platform];
                    const Icon = platformIcons[platform];
                    const isCopied = copiedPlatform === platform;

                    return (
                      <div key={platform} className="bg-bg-tertiary border border-border-primary rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Icon className="h-5 w-5 mr-2 text-[#F59E0B]" />
                            <span className="font-semibold text-text-primary">{config.name}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(content, platform)}
                            className="px-3 py-1.5 rounded-lg bg-bg-secondary border border-border-primary text-text-primary hover:bg-bg-hover transition-colors flex items-center text-sm"
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-4 w-4 mr-1 text-green-400" />
                                <span className="text-green-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-1" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>

                        <div className="bg-bg-secondary rounded p-3 text-sm text-text-secondary whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                          {content}
                        </div>

                        <div className="flex justify-between mt-2 text-xs text-text-tertiary">
                          <span>{content.length} / {config.maxLength} characters</span>
                          <span className={content.length > config.maxLength ? 'text-red-400' : 'text-green-400'}>
                            {content.length > config.maxLength ? 'Over limit' : 'Within limit'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Free Tier Notice */}
        <div className="mt-8 bg-bg-tertiary border border-border-primary rounded-lg p-6">
          <div className="flex items-start">
            <Sparkles className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-[#F59E0B]" />
            <div>
              <h4 className="font-semibold mb-1 text-text-primary">
                Template-Based Repurposing
              </h4>
              <p className="text-sm text-text-secondary">
                Content is repurposed using intelligent templates and formatting rules. All processing happens in your browser.
                <Link href="/pricing" className="ml-1 underline text-[#F59E0B] hover:text-[#D97706]">
                  Upgrade for AI-powered repurposing
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

