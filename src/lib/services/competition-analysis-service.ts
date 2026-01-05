import OpenAI from 'openai';
import * as cheerio from 'cheerio';

export interface CompetitorAnalysisInput {
    competitors: { name: string; url?: string }[];
    industry: string;
    focusArea?: string;
}

export interface ScrapedData {
    text: string;
    socialLinks: string[];
    imageUrls: string[];
}

export interface CompetitorInsight {
    name: string;
    strengths: string[];
    weaknesses: string[];
    marketPosition: string;
    marketShareEstimate: number; // Percentage 0-100
    sentimentScore: number; // 0-100
    keyStrategies: string[];
    socialPresence: {
        channels: string[];
        strategy: string;
        followersEstimate: string;
    };
    visualIdentity: {
        description: string;
        sentiment: string;
    };
}

export interface MarketGap {
    opportunity: string;
    description: string;
    potentialImpact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
}

export interface IndustryTrend {
    trend: string;
    impact: string;
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    growthRate: string; // e.g., "+15% YoY"
}

export interface KeywordData {
    term: string;
    volume: string; // e.g. "10k-50k"
    difficulty: number; // 0-100
    cpc: string; // e.g. "$2.50"
    status: 'Breakout' | 'Stable' | 'Declining';
    topCompetitor: string;
}

export interface MarketData {
    totalMarketSize: string; // e.g., "$50B"
    cagr: string; // e.g., "8.5%"
    forecastYear: string; // e.g., "2028"
}

export interface CompetitorEcosystem {
    direct: string[];
    indirect: string[];
    emerging: string[];
}

export interface TrafficData {
    visits: string; // e.g. "5M"
    avgDuration: string; // e.g. "00:05:30"
    bounceRate: string; // e.g. "45%"
    sources: { name: string; percentage: number }[]; // e.g. Search 50%, Direct 30%
}

export interface AudienceData {
    ageBrackets: { range: string; percentage: number }[];
    genderSplit: { male: number; female: number };
    topInterests: string[];
    geoDistribution: { country: string; percentage: number }[];
}

export interface AdCreativeData {
    topThemes: string[];
    adFormats: string[]; // e.g. "Video", "Carousel"
    tone: string;
    visualStyle: string;
}

export interface SWOTAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

export interface CompetitionAnalysisResult {
    executiveSummary: string;
    marketData: MarketData;
    competitorInsights: CompetitorInsight[];
    marketGaps: MarketGap[];
    keywordAnalysis: KeywordData[];
    competitorEcosystem: CompetitorEcosystem;
    // New Enterprise Fields
    trafficAnalysis?: TrafficData;
    audienceDemographics?: AudienceData;
    adCreativeAnalysis?: AdCreativeData;
    swotAnalysis?: SWOTAnalysis;

    recommendedActions: string[];
    industryNews: {
        articles: NewsItem[];
        trends: IndustryTrend[];
        marketOutlook: string;
    };
}


export class CompetitionAnalysisService {
    private static async scrapeCompetitorSite(url: string): Promise<ScrapedData> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for deep scraping

            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; AureonOneBot/1.0; +https://aureonone.in)'
                }
            });
            clearTimeout(timeoutId);

            if (!response.ok) return { text: '', socialLinks: [], imageUrls: [] };

            const html = await response.text();
            const $ = cheerio.load(html);

            // Remove scripts, styles, and comments
            $('script, style, noscript, iframe, svg').remove();

            // Extract meaningful text
            const text = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 5000); // 5000 chars for deep analysis

            // Extract Social Links
            const socialDomains = ['twitter.com', 'x.com', 'linkedin.com', 'facebook.com', 'instagram.com', 'youtube.com', 'tiktok.com', 'pinterest.com'];
            const socialLinks = new Set<string>();
            $('a[href]').each((_: any, el: any) => {
                const href = $(el).attr('href');
                if (href && socialDomains.some(d => href.includes(d))) {
                    socialLinks.add(href);
                }
            });

            // Extract Images (Logo, Hero) - Simple heuristic
            const imageUrls = new Set<string>();
            $('img[src]').each((_: any, el: any) => {
                let src = $(el).attr('src');
                if (src) {
                    // Resolve relative URLs
                    if (src.startsWith('/')) {
                        try {
                            const baseUrl = new URL(url);
                            src = `${baseUrl.origin}${src}`;
                        } catch (e) {
                            return;
                        }
                    } else if (!src.startsWith('http')) {
                        return; // Skip weird protocols or data URIs for now if complex
                    }

                    // Filter for likely significant images
                    if (!src.match(/\.(svg|gif)$/i) && (src.match(/logo/i) || src.match(/hero/i) || ($(el).attr('width') && parseInt($(el).attr('width')!) > 200))) {
                        imageUrls.add(src);
                    }
                }
            });

            return {
                text,
                socialLinks: Array.from(socialLinks).slice(0, 5),
                imageUrls: Array.from(imageUrls).slice(0, 5) // Limit to 5 images
            };
        } catch (error) {
            console.warn(`Failed to scrape ${url}:`, error);
            return { text: '', socialLinks: [], imageUrls: [] };
        }
    }

    private static async fetchIndustryNews(industry: string): Promise<NewsItem[]> {
        try {
            const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(industry + ' industry business news')}&hl=en-US&gl=US&ceid=US:en`;
            const response = await fetch(rssUrl);
            if (!response.ok) return [];

            const xml = await response.text();
            const $ = cheerio.load(xml, { xmlMode: true });
            const articles: NewsItem[] = [];

            $('item').each((i: any, el: any) => {
                if (i >= 10) return false; // Limit to top 10 news
                articles.push({
                    title: $(el).find('title').text(),
                    link: $(el).find('link').text(),
                    pubDate: $(el).find('pubDate').text(),
                    source: $(el).find('source').text() || 'Google News'
                });
            });

            return articles;
        } catch (error) {
            console.warn('Failed to fetch industry news:', error);
            return [];
        }
    }

    static async analyzeMarket(industry: string, location: string): Promise<any> {
        try {
            const news = await this.fetchIndustryNews(industry);
            const openai = new OpenAI({ apiKey: (process.env.OPENAI_API_KEY || '').trim() });

            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a senior market research analyst. Analyze the provided industry news and your internal knowledge to provide market data, detailed keyword intelligence, and trends.' },
                    { role: 'user', content: `Analyze the ${industry} industry in ${location}.\n\nRecent News:\n${news.map(n => `- ${n.title} (${n.source})`).join('\n')}\n\nProvide JSON: { "marketData": { "totalMarketSize": "string", "cagr": "string", "forecastYear": "string" }, "industryNews": { "trends": [{ "trend": "string", "impact": "string", "sentiment": "POSITIVE"|"NEGATIVE"|"NEUTRAL", "growthRate": "string" }], "marketOutlook": "string" }, "keywordAnalysis": [{ "term": "string", "volume": "string (e.g. 10k-50k)", "difficulty": number (0-100), "cpc": "string (e.g. $2.50)", "status": "Breakout"|"Stable"|"Declining", "topCompetitor": "string" }] }` }
                ],
                response_format: { type: 'json_object' },
                max_tokens: 2000
            });

            const result = JSON.parse(completion.choices[0].message.content || '{}');
            return { ...result, newsArticles: news };
        } catch (error) {
            console.error('Market Analysis Failed:', error);
            return { marketData: {}, industryNews: { trends: [], marketOutlook: '' }, keywordAnalysis: [], newsArticles: [] };
        }
    }

    static async analyzeCompetitor(competitor: { name: string; url?: string }): Promise<any> {
        try {
            let scrapedData: ScrapedData = { text: '', socialLinks: [], imageUrls: [] };
            if (competitor.url) {
                const targetUrl = competitor.url.startsWith('http') ? competitor.url : `https://${competitor.url}`;
                scrapedData = await this.scrapeCompetitorSite(targetUrl);
            }

            const openai = new OpenAI({ apiKey: (process.env.OPENAI_API_KEY || '').trim() });
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a competitor intelligence expert. Analyze the competitor based on scraped data.' },
                    { role: 'user', content: `Analyze Competitor: ${competitor.name}\nURL: ${competitor.url}\nText: "${scrapedData.text}"\nSocials: ${scrapedData.socialLinks.join(', ')}\n\nProvide JSON: { "strengths": ["string"], "weaknesses": ["string"], "marketPosition": "string", "marketShareEstimate": number, "sentimentScore": number, "keyStrategies": ["string"], "socialPresence": { "channels": ["string"], "strategy": "string", "followersEstimate": "string" }, "visualIdentity": { "description": "string", "sentiment": "string" } }` }
                ],
                response_format: { type: 'json_object' },
                max_tokens: 1500
            });

            return {
                name: competitor.name,
                url: competitor.url,
                ...JSON.parse(completion.choices[0].message.content || '{}')
            };
        } catch (error) {
            console.error(`Competitor Analysis Failed for ${competitor.name}:`, error);
            return { name: competitor.name, error: 'Analysis failed' };
        }
    }

    static async synthesizeReport(marketData: any, competitors: any[]): Promise<any> {
        try {
            const openai = new OpenAI({ apiKey: (process.env.OPENAI_API_KEY || '').trim() });
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a Chief Strategy Officer at a top-tier consulting firm (like BCG or McKinsey). Synthesize market data and competitor insights into a comprehensive "Nielsen-Level" strategic report. You MUST provide deep insights on Traffic, Audience, Ad Creatives, and a structured SWOT analysis.' },
                    {
                        role: 'user', content: `Market Data: ${JSON.stringify(marketData)}\nCompetitors: ${JSON.stringify(competitors)}\n\nProvide JSON: { 
                        "executiveSummary": "string", 
                        "marketGaps": [{ "opportunity": "string", "description": "string", "potentialImpact": "HIGH"|"MEDIUM"|"LOW" }], 
                        "recommendedActions": ["string"], 
                        "competitorEcosystem": { "direct": ["string"], "indirect": ["string"], "emerging": ["string"] },
                        "trafficAnalysis": { "visits": "string", "avgDuration": "string", "bounceRate": "string", "sources": [{ "name": "string", "percentage": number }] },
                        "audienceDemographics": { "ageBrackets": [{ "range": "string", "percentage": number }], "genderSplit": { "male": number, "female": number }, "topInterests": ["string"], "geoDistribution": [{ "country": "string", "percentage": number }] },
                        "adCreativeAnalysis": { "topThemes": ["string"], "adFormats": ["string"], "tone": "string", "visualStyle": "string" },
                        "swotAnalysis": { "strengths": ["string"], "weaknesses": ["string"], "opportunities": ["string"], "threats": ["string"] }
                    }` }
                ],
                response_format: { type: 'json_object' },
                max_tokens: 3000
            });

            return JSON.parse(completion.choices[0].message.content || '{}');
        } catch (error) {
            console.error('Synthesis Failed:', error);
            return { executiveSummary: '', marketGaps: [], recommendedActions: [], competitorEcosystem: { direct: [], indirect: [], emerging: [] } };
        }
    }

    // Legacy method wrapper for backward compatibility (if needed)
    static async analyze(input: CompetitorAnalysisInput): Promise<CompetitionAnalysisResult> {
        // This monolithic method is deprecated for the multi-stage pipeline but kept for fallback
        const market = await this.analyzeMarket(input.industry, 'Global');
        const competitors = await Promise.all(input.competitors.map(c => this.analyzeCompetitor(c)));
        const synthesis = await this.synthesizeReport(market, competitors);

        // STRICT VALIDATION: Ensure we have critical data
        if (!market.marketData || !market.marketData.totalMarketSize) {
            throw new Error('Market analysis failed to generate valid data.');
        }
        if (!competitors || competitors.length === 0 || !competitors[0].name) {
            throw new Error('Competitor analysis failed.');
        }
        if (!synthesis.executiveSummary) {
            throw new Error('Report synthesis failed.');
        }

        return {
            ...synthesis,
            marketData: market.marketData,
            industryNews: { ...market.industryNews, articles: market.newsArticles },
            keywordTrends: market.keywordTrends,
            competitorInsights: competitors
        };
    }
}
