'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Clock, 
  Hash, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  RefreshCw,
  Eye,
  Link
} from 'lucide-react';

interface SEOAnalysis {
  keywords: string[];
  readingTime: number;
  suggestedMetaDescription: string;
  wordCount: number;
  titleLength: number;
  titleSEOScore: 'good' | 'too_short' | 'too_long';
  hasHeadings: boolean;
  hasImages: boolean;
  hasLinks: boolean;
}

interface InternalLinkSuggestion {
  title: string;
  url: string;
  excerpt: string;
  category: string;
  tags: string[];
}

interface SEOAnalyzerProps {
  title: string;
  content: string;
  metaDescription?: string;
  slug?: string;
  onMetaDescriptionSuggestion?: (description: string) => void;
}

export function SEOAnalyzer({ 
  title, 
  content, 
  metaDescription, 
  slug,
  onMetaDescriptionSuggestion 
}: SEOAnalyzerProps) {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [internalLinks, setInternalLinks] = useState<InternalLinkSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (title && content) {
      analyzeContent();
    }
  }, [title, content]);

  useEffect(() => {
    if (slug) {
      loadInternalLinkSuggestions();
    }
  }, [slug]);

  const analyzeContent = async () => {
    if (!title || !content) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/seo/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
        
        // Suggest meta description if not provided
        if (!metaDescription && onMetaDescriptionSuggestion) {
          onMetaDescriptionSuggestion(data.data.suggestedMetaDescription);
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Analysis Error',
        description: 'Failed to analyze content for SEO',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadInternalLinkSuggestions = async () => {
    if (!slug) return;

    setIsLoadingLinks(true);
    try {
      const response = await fetch(`/api/seo/internal-links/${slug}?limit=5`);
      const data = await response.json();

      if (data.success) {
        setInternalLinks(data.data);
      }
    } catch (error) {
      console.error('Failed to load internal link suggestions:', error);
    } finally {
      setIsLoadingLinks(false);
    }
  };

  const getScoreIcon = (score: string) => {
    switch (score) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'too_short':
      case 'too_long':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'good':
        return 'text-green-600';
      case 'too_short':
      case 'too_long':
        return 'text-yellow-600';
      default:
        return 'text-red-600';
    }
  };

  const calculateSEOScore = () => {
    if (!analysis) return 0;

    let score = 0;
    const maxScore = 100;

    // Title score (20 points)
    if (analysis.titleSEOScore === 'good') score += 20;
    else if (analysis.titleSEOScore === 'too_short' || analysis.titleSEOScore === 'too_long') score += 10;

    // Content length (15 points)
    if (analysis.wordCount >= 300) score += 15;
    else if (analysis.wordCount >= 150) score += 10;
    else if (analysis.wordCount >= 50) score += 5;

    // Headings (15 points)
    if (analysis.hasHeadings) score += 15;

    // Images (10 points)
    if (analysis.hasImages) score += 10;

    // Links (10 points)
    if (analysis.hasLinks) score += 10;

    // Keywords (15 points)
    if (analysis.keywords.length >= 5) score += 15;
    else if (analysis.keywords.length >= 3) score += 10;
    else if (analysis.keywords.length >= 1) score += 5;

    // Meta description (15 points)
    if (metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160) score += 15;
    else if (metaDescription && metaDescription.length >= 50) score += 10;

    return Math.min(score, maxScore);
  };

  const seoScore = calculateSEOScore();

  return (
    <div className="space-y-6">
      {/* SEO Score Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                SEO Analysis
              </CardTitle>
              <CardDescription>
                Optimize your content for better search engine visibility
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeContent}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Analyze
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {analysis ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">SEO Score</span>
                  <span className="text-sm font-bold">{seoScore}/100</span>
                </div>
                <Progress value={seoScore} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-700" />
                  <span className="text-sm">{analysis.readingTime} min read</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-700" />
                  <span className="text-sm">{analysis.wordCount} words</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">Enter title and content to analyze SEO</p>
          )}
        </CardContent>
      </Card>

      {/* SEO Checklist */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>SEO Checklist</CardTitle>
            <CardDescription>
              Review these factors to improve your content's SEO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getScoreIcon(analysis.titleSEOScore)}
                  <span className="text-sm">Title Length</span>
                </div>
                <span className={`text-sm ${getScoreColor(analysis.titleSEOScore)}`}>
                  {analysis.titleLength} characters
                  {analysis.titleSEOScore === 'too_short' && ' (too short)'}
                  {analysis.titleSEOScore === 'too_long' && ' (too long)'}
                  {analysis.titleSEOScore === 'good' && ' (optimal)'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {analysis.wordCount >= 300 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">Content Length</span>
                </div>
                <span className="text-sm">
                  {analysis.wordCount} words
                  {analysis.wordCount < 300 && ' (consider adding more content)'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {analysis.hasHeadings ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">Headings</span>
                </div>
                <span className="text-sm">
                  {analysis.hasHeadings ? 'Present' : 'Missing'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {analysis.hasImages ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">Images</span>
                </div>
                <span className="text-sm">
                  {analysis.hasImages ? 'Present' : 'Consider adding images'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {analysis.hasLinks ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">Links</span>
                </div>
                <span className="text-sm">
                  {analysis.hasLinks ? 'Present' : 'Consider adding links'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keywords */}
      {analysis && analysis.keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Keywords</CardTitle>
            <CardDescription>
              Key terms found in your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Internal Link Suggestions */}
      {slug && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Link className="h-5 w-5 mr-2" />
                  Internal Link Suggestions
                </CardTitle>
                <CardDescription>
                  Related posts you might want to link to
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadInternalLinkSuggestions}
                disabled={isLoadingLinks}
              >
                {isLoadingLinks ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {internalLinks.length > 0 ? (
              <div className="space-y-3">
                {internalLinks.map((link, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-1">{link.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{link.excerpt}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {link.category}
                      </Badge>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {link.url}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 text-sm">
                No related posts found for internal linking
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
