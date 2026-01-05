'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Globe,
  Share2,
  BarChart3,
  CheckCircle,
  AlertCircle,
  XCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

interface SEOOptimizationProps {
  title: string;
  description: string;
  slug?: string;
  content?: string;
  onSEOUpdate?: (seoData: any) => void;
}

interface SEOScore {
  score: number;
  issues: string[];
  suggestions: string[];
}

export function SEOOptimization({
  title,
  description,
  slug,
  content,
  onSEOUpdate
}: SEOOptimizationProps) {
  const [seoTitle, setSeoTitle] = useState(title);
  const [seoDescription, setSeoDescription] = useState(description);
  const [keywords, setKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [seoScore, setSeoScore] = useState<SEOScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSeoTitle(title);
    setSeoDescription(description);
    if (slug) {
      setCanonicalUrl(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aureonone.in'}/blog/${slug}`);
    }
  }, [title, description, slug]);

  useEffect(() => {
    if (seoTitle && seoDescription) {
      calculateSEOScore();
    }
  }, [seoTitle, seoDescription, keywords, content]);

  const calculateSEOScore = () => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Title analysis (25 points)
    if (seoTitle.length >= 30 && seoTitle.length <= 60) {
      score += 25;
    } else if (seoTitle.length < 30) {
      issues.push('Title is too short (less than 30 characters)');
      suggestions.push('Expand your title to 30-60 characters for better SEO');
      score += 10;
    } else {
      issues.push('Title is too long (more than 60 characters)');
      suggestions.push('Shorten your title to 30-60 characters');
      score += 10;
    }

    // Description analysis (25 points)
    if (seoDescription.length >= 120 && seoDescription.length <= 160) {
      score += 25;
    } else if (seoDescription.length < 120) {
      issues.push('Meta description is too short (less than 120 characters)');
      suggestions.push('Expand your meta description to 120-160 characters');
      score += 15;
    } else {
      issues.push('Meta description is too long (more than 160 characters)');
      suggestions.push('Shorten your meta description to 120-160 characters');
      score += 15;
    }

    // Keywords analysis (20 points)
    if (keywords.trim()) {
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
      if (keywordList.length >= 3 && keywordList.length <= 10) {
        score += 20;
      } else if (keywordList.length < 3) {
        suggestions.push('Add more keywords (3-10 recommended)');
        score += 10;
      } else {
        suggestions.push('Reduce number of keywords (3-10 recommended)');
        score += 15;
      }
    } else {
      issues.push('No keywords specified');
      suggestions.push('Add relevant keywords for better SEO');
    }

    // Content analysis (20 points)
    if (content) {
      const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      if (wordCount >= 300) {
        score += 20;
      } else if (wordCount >= 150) {
        score += 15;
        suggestions.push('Consider adding more content (300+ words recommended)');
      } else {
        issues.push('Content is too short (less than 150 words)');
        suggestions.push('Add more content for better SEO (300+ words recommended)');
        score += 5;
      }
    } else {
      suggestions.push('Add content for analysis');
    }

    // Technical SEO (10 points)
    if (canonicalUrl) {
      score += 5;
    } else {
      suggestions.push('Set a canonical URL');
    }

    if (ogImage) {
      score += 5;
    } else {
      suggestions.push('Add an Open Graph image');
    }

    setSeoScore({
      score: Math.min(score, 100),
      issues,
      suggestions,
    });
  };

  const handleSEOUpdate = () => {
    if (onSEOUpdate) {
      onSEOUpdate({
        seoTitle,
        seoDescription,
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
        canonicalUrl,
        ogImage,
      });
    }

    toast({
      title: 'SEO Updated',
      description: 'SEO metadata has been updated successfully',
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `${label} copied to clipboard`,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* SEO Score Overview */}
      {seoScore && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getScoreIcon(seoScore.score)}
                <div>
                  <CardTitle>SEO Score</CardTitle>
                  <CardDescription>
                    Overall optimization score for search engines
                  </CardDescription>
                </div>
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(seoScore.score)}`}>
                {seoScore.score}/100
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {seoScore.issues.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-red-600 mb-2">Issues to Fix:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                  {seoScore.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {seoScore.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-yellow-600 mb-2">Suggestions:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-600">
                  {seoScore.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* SEO Configuration */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Basic SEO</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Social Media</span>
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Technical</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic SEO Settings</CardTitle>
              <CardDescription>
                Configure title, description, and keywords for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seo-title">SEO Title</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="seo-title"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Enter SEO title (30-60 characters)"
                    maxLength={60}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(seoTitle, 'SEO Title')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {seoTitle.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="seo-description">Meta Description</Label>
                <div className="flex items-start space-x-2">
                  <Textarea
                    id="seo-description"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Enter meta description (120-160 characters)"
                    maxLength={160}
                    rows={3}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(seoDescription, 'Meta Description')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {seoDescription.length}/160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter keywords separated by commas"
                />
                <p className="text-sm text-gray-700 mt-1">
                  Separate keywords with commas (3-10 recommended)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Settings</CardTitle>
              <CardDescription>
                Configure how your content appears on social media platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="og-image">Open Graph Image URL</Label>
                <Input
                  id="og-image"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-gray-700 mt-1">
                  Recommended size: 1200x630 pixels
                </p>
              </div>

              {ogImage && (
                <div>
                  <Label>Preview</Label>
                  <div className="border rounded-lg p-4 bg-bg-tertiary">
                    <img
                      src={ogImage}
                      alt="Open Graph preview"
                      className="w-full max-w-md h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <h3 className="font-medium mt-2">{seoTitle}</h3>
                    <p className="text-sm text-gray-600">{seoDescription}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical SEO</CardTitle>
              <CardDescription>
                Advanced SEO settings for better search engine optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="canonical-url">Canonical URL</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="canonical-url"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://example.com/page"
                  />
                  {canonicalUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(canonicalUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  The preferred URL for this content
                </p>
              </div>

              {slug && (
                <div>
                  <Label>Generated URLs</Label>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-bg-tertiary rounded">
                      <span>Sitemap: /sitemap.xml</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('/sitemap.xml', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-bg-tertiary rounded">
                      <span>Robots: /robots.txt</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('/robots.txt', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSEOUpdate}>
          <BarChart3 className="h-4 w-4 mr-2" />
          Update SEO Settings
        </Button>
      </div>
    </div>
  );
}
