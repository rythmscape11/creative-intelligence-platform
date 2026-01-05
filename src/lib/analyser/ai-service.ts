// The Analyser AI Service
// Uses OpenAI for SEO intelligence and analysis

import OpenAI from 'openai';

// Initialize OpenAI client - only when API key is available
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

export interface KeywordAnalysis {
    keyword: string;
    searchVolume: number;
    difficulty: number;
    cpc: number;
    intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
    trend: number;
    suggestions: string[];
}

export interface ContentGap {
    keyword: string;
    yourPosition: number | null;
    competitorPosition: number;
    volume: number;
    opportunity: 'high' | 'medium' | 'low';
}

export interface SEORecommendation {
    type: 'keyword' | 'content' | 'backlink' | 'technical';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
    effort: string;
}

export class AnalyserAIService {
    /**
     * Analyze keywords and provide SEO insights
     */
    async analyzeKeywords(keywords: string[], domain: string): Promise<KeywordAnalysis[]> {
        if (!openai) {
            return this.getFallbackKeywordAnalysis(keywords);
        }

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are an SEO expert. Analyze the given keywords for the domain "${domain}". 
            Provide realistic search volume estimates, keyword difficulty (0-100), CPC estimates, 
            search intent classification, and trend direction (-100 to +100 for MoM change).
            Return JSON array of keyword analyses.`
                    },
                    {
                        role: 'user',
                        content: `Analyze these keywords: ${keywords.join(', ')}`
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.7,
            });

            const content = response.choices[0].message.content;
            if (!content) return this.getFallbackKeywordAnalysis(keywords);

            const parsed = JSON.parse(content);
            return parsed.keywords || this.getFallbackKeywordAnalysis(keywords);
        } catch (error) {
            console.error('AI keyword analysis failed:', error);
            return this.getFallbackKeywordAnalysis(keywords);
        }
    }

    /**
     * Find content gaps between domain and competitors
     */
    async findContentGaps(
        domain: string,
        competitors: string[],
        yourKeywords: string[]
    ): Promise<ContentGap[]> {
        if (!openai) {
            return this.getFallbackContentGaps();
        }

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are an SEO strategist. Identify content gaps between the domain "${domain}" 
            and competitors: ${competitors.join(', ')}. The domain currently ranks for: ${yourKeywords.slice(0, 20).join(', ')}.
            Find keywords the competitors likely rank for that the domain doesn't.
            Return JSON with 'gaps' array containing keyword opportunity analysis.`
                    },
                    {
                        role: 'user',
                        content: 'Find the top 10 content gap opportunities with realistic metrics.'
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.7,
            });

            const content = response.choices[0].message.content;
            if (!content) return this.getFallbackContentGaps();

            const parsed = JSON.parse(content);
            return parsed.gaps || this.getFallbackContentGaps();
        } catch (error) {
            console.error('AI content gap analysis failed:', error);
            return this.getFallbackContentGaps();
        }
    }

    /**
     * Generate SEO recommendations based on domain analysis
     */
    async generateRecommendations(
        domain: string,
        metrics: {
            authority: number;
            organicKeywords: number;
            backlinks: number;
            traffic: number;
        }
    ): Promise<SEORecommendation[]> {
        if (!openai) {
            return this.getFallbackRecommendations(metrics);
        }

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are an SEO consultant. Based on the domain metrics for "${domain}":
            - Authority Score: ${metrics.authority}/100
            - Organic Keywords: ${metrics.organicKeywords}
            - Backlinks: ${metrics.backlinks}
            - Monthly Traffic: ${metrics.traffic}
            
            Generate actionable SEO recommendations prioritized by impact and effort.
            Return JSON with 'recommendations' array.`
                    },
                    {
                        role: 'user',
                        content: 'Provide 5-8 specific, actionable SEO recommendations.'
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.7,
            });

            const content = response.choices[0].message.content;
            if (!content) return this.getFallbackRecommendations(metrics);

            const parsed = JSON.parse(content);
            return parsed.recommendations || this.getFallbackRecommendations(metrics);
        } catch (error) {
            console.error('AI recommendations failed:', error);
            return this.getFallbackRecommendations(metrics);
        }
    }

    /**
     * Process natural language queries for the SEO Copilot
     */
    async processCopilotQuery(
        query: string,
        context: {
            domain?: string;
            competitors?: string[];
            recentKeywords?: string[];
            metrics?: Record<string, number>;
        }
    ): Promise<{
        response: string;
        suggestedActions?: Array<{ type: string; label: string; data?: Record<string, unknown> }>;
    }> {
        if (!openai) {
            return this.getFallbackCopilotResponse(query);
        }

        try {
            const contextStr = context.domain
                ? `Current domain: ${context.domain}. ` +
                (context.competitors?.length ? `Competitors: ${context.competitors.join(', ')}. ` : '') +
                (context.metrics ? `Metrics: ${JSON.stringify(context.metrics)}` : '')
                : 'No specific domain context provided.';

            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are an SEO intelligence assistant for "The Analyser" platform. 
            You help users understand SEO metrics, find keyword opportunities, analyze competitors, 
            and improve their search rankings.
            
            Context: ${contextStr}
            
            Provide helpful, actionable responses. When appropriate, suggest specific actions 
            the user can take. Format responses with markdown for clarity.
            
            Return JSON with 'response' (markdown string) and optionally 'suggestedActions' 
            (array of {type, label, data} objects for actionable buttons).`
                    },
                    {
                        role: 'user',
                        content: query
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.8,
            });

            const content = response.choices[0].message.content;
            if (!content) return this.getFallbackCopilotResponse(query);

            const parsed = JSON.parse(content);
            return {
                response: parsed.response || 'I understand your question. Let me help you with that.',
                suggestedActions: parsed.suggestedActions,
            };
        } catch (error) {
            console.error('AI copilot query failed:', error);
            return this.getFallbackCopilotResponse(query);
        }
    }

    // Fallback methods when AI is unavailable

    private getFallbackKeywordAnalysis(keywords: string[]): KeywordAnalysis[] {
        return keywords.map(keyword => ({
            keyword,
            searchVolume: Math.floor(Math.random() * 10000) + 500,
            difficulty: Math.floor(Math.random() * 60) + 20,
            cpc: Math.round((Math.random() * 15 + 1) * 100) / 100,
            intent: ['informational', 'commercial', 'transactional', 'navigational'][
                Math.floor(Math.random() * 4)
            ] as KeywordAnalysis['intent'],
            trend: Math.floor(Math.random() * 40) - 10,
            suggestions: [
                `best ${keyword}`,
                `${keyword} guide`,
                `how to ${keyword}`,
            ],
        }));
    }

    private getFallbackContentGaps(): ContentGap[] {
        return [
            { keyword: 'marketing automation platform', yourPosition: null, competitorPosition: 3, volume: 8400, opportunity: 'high' },
            { keyword: 'best crm software', yourPosition: null, competitorPosition: 5, volume: 14200, opportunity: 'high' },
            { keyword: 'email marketing tools', yourPosition: 45, competitorPosition: 8, volume: 12500, opportunity: 'medium' },
            { keyword: 'lead generation software', yourPosition: 32, competitorPosition: 4, volume: 6800, opportunity: 'medium' },
            { keyword: 'sales automation', yourPosition: null, competitorPosition: 7, volume: 5400, opportunity: 'high' },
        ];
    }

    private getFallbackRecommendations(metrics: { authority: number }): SEORecommendation[] {
        const recs: SEORecommendation[] = [
            {
                type: 'content',
                priority: 'high',
                title: 'Create Pillar Content',
                description: 'Build comprehensive guides on your main topics to establish topical authority.',
                impact: '+20-30% organic traffic',
                effort: 'High (2-3 weeks)',
            },
            {
                type: 'backlink',
                priority: 'high',
                title: 'Guest Posting Campaign',
                description: 'Secure high-authority backlinks through strategic guest posts.',
                impact: '+10-15 authority score',
                effort: 'Medium (ongoing)',
            },
            {
                type: 'keyword',
                priority: 'medium',
                title: 'Target Long-tail Keywords',
                description: 'Focus on low-competition, high-intent long-tail keywords.',
                impact: '+500-1000 monthly visitors',
                effort: 'Low (1 week)',
            },
            {
                type: 'technical',
                priority: 'medium',
                title: 'Improve Core Web Vitals',
                description: 'Optimize page speed and user experience metrics.',
                impact: '+5-10% rankings improvement',
                effort: 'Medium (2 weeks)',
            },
        ];

        if (metrics.authority < 50) {
            recs.unshift({
                type: 'backlink',
                priority: 'high',
                title: 'Authority Building Campaign',
                description: 'Your authority score is below average. Focus on building quality backlinks.',
                impact: 'Critical for ranking improvement',
                effort: 'High (1-2 months)',
            });
        }

        return recs;
    }

    private getFallbackCopilotResponse(query: string): { response: string } {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('keyword')) {
            return {
                response: `**Keyword Analysis**\n\nBased on your domain, here are some keyword opportunities:\n\n1. **Long-tail keywords** - Lower competition, easier to rank\n2. **Question-based keywords** - Target featured snippets\n3. **Commercial intent keywords** - Higher conversion potential\n\nWould you like me to analyze specific keywords for your niche?`
            };
        }

        if (lowerQuery.includes('backlink')) {
            return {
                response: `**Backlink Strategy**\n\nTo improve your backlink profile:\n\n✅ **Quality over quantity** - Focus on high-authority domains\n✅ **Relevance matters** - Links from related sites are more valuable\n✅ **Diversify anchors** - Avoid over-optimization\n\nI can analyze your current backlink profile and find opportunities.`
            };
        }

        if (lowerQuery.includes('competitor')) {
            return {
                response: `**Competitor Analysis**\n\nI can help you understand your competitive landscape:\n\n📊 **Traffic comparison** - See who's winning\n🔑 **Keyword gaps** - Find opportunities they're ranking for\n🔗 **Backlink analysis** - Discover their link sources\n\nAdd competitors to your project to get detailed comparisons.`
            };
        }

        return {
            response: `I understand you're asking about: "${query}"\n\nAs your SEO intelligence assistant, I can help with:\n\n• **Keyword research** and opportunity analysis\n• **Competitor benchmarking** and gap analysis\n• **Backlink profile** evaluation\n• **Content strategy** recommendations\n• **Technical SEO** audits\n\nWhat specific aspect would you like to explore?`
        };
    }
}

// Export singleton instance
export const analyserAIService = new AnalyserAIService();
