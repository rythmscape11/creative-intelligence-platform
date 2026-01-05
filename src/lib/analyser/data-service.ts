// Free SEO Data Service
// Uses free/open APIs for SEO data

export interface SERPResult {
    position: number;
    title: string;
    url: string;
    domain: string;
    snippet: string;
}

export interface KeywordData {
    keyword: string;
    volume: number;
    cpc: number;
    competition: number;
    trend: number[];
}

export interface DomainMetrics {
    domain: string;
    authority: number;
    traffic: number;
    organicKeywords: number;
    backlinks: number;
}

/**
 * Free SEO Data Service
 * Uses estimation algorithms and free data sources
 */
export class FreeSEODataService {
    /**
     * Estimate keyword metrics using heuristics
     * In production, this could integrate with free APIs like:
     * - Google Trends API (free)
     * - Datamuse API (free word suggestions)
     * - Common Crawl (open dataset)
     */
    async estimateKeywordMetrics(keyword: string): Promise<KeywordData> {
        // Estimate based on keyword characteristics
        const wordCount = keyword.split(' ').length;
        const hasNumbers = /\d/.test(keyword);
        const isQuestion = /^(how|what|why|when|where|who|which)/i.test(keyword);

        // Base volume estimation (longer = lower volume typically)
        let baseVolume = 10000 / Math.pow(wordCount, 1.5);
        if (isQuestion) baseVolume *= 0.8; // Questions often lower volume
        if (hasNumbers) baseVolume *= 1.2; // Numbers often indicate specific searches

        // Competition based on word count (long-tail = lower competition)
        const competition = Math.max(0.1, 1 - (wordCount - 1) * 0.15);

        // CPC estimation
        const baseCPC = 2 + Math.random() * 8;
        const cpc = baseCPC * competition;

        return {
            keyword,
            volume: Math.round(baseVolume + Math.random() * baseVolume * 0.3),
            cpc: Math.round(cpc * 100) / 100,
            competition: Math.round(competition * 100) / 100,
            trend: this.generateTrendData(),
        };
    }

    /**
     * Estimate domain authority based on various signals
     */
    async estimateDomainMetrics(domain: string): Promise<DomainMetrics> {
        // In production, could use:
        // - WHOIS data (domain age)
        // - DNS records
        // - SSL certificate info
        // - Alexa rank (historical)

        // For now, estimate based on domain characteristics
        const isWellKnown = this.isWellKnownDomain(domain);
        const tld = domain.split('.').pop() || 'com';
        const tldBonus = ['com', 'org', 'net', 'edu', 'gov'].includes(tld) ? 10 : 0;

        let baseAuthority = 30 + Math.random() * 30;
        if (isWellKnown) baseAuthority += 30;
        baseAuthority += tldBonus;

        const authority = Math.min(100, Math.round(baseAuthority));
        const traffic = Math.round(Math.pow(authority, 2.5) * (10 + Math.random() * 10));

        return {
            domain,
            authority,
            traffic,
            organicKeywords: Math.round(traffic * 0.01 * (1 + Math.random())),
            backlinks: Math.round(traffic * 0.05 * (1 + Math.random() * 2)),
        };
    }

    /**
     * Get related keywords using word patterns
     */
    async getRelatedKeywords(seedKeyword: string, count: number = 10): Promise<string[]> {
        const modifiers = {
            prefix: ['best', 'top', 'free', 'cheap', 'professional', 'easy', 'fast', 'online'],
            suffix: ['software', 'tool', 'service', 'guide', 'tips', 'examples', 'template', 'vs'],
            questions: ['how to', 'what is', 'why', 'when to use', 'how much does', 'where to find'],
        };

        const related: string[] = [];

        // Add prefix variations
        modifiers.prefix.forEach(prefix => {
            related.push(`${prefix} ${seedKeyword}`);
        });

        // Add suffix variations
        modifiers.suffix.forEach(suffix => {
            related.push(`${seedKeyword} ${suffix}`);
        });

        // Add question variations
        modifiers.questions.forEach(q => {
            related.push(`${q} ${seedKeyword}`);
        });

        // Shuffle and limit
        return this.shuffleArray(related).slice(0, count);
    }

    /**
     * Simulate SERP results for a keyword
     * In production, could use free SERP APIs with rate limits
     */
    async simulateSERP(keyword: string): Promise<SERPResult[]> {
        const domains = [
            'wikipedia.org',
            'forbes.com',
            'hubspot.com',
            'neilpatel.com',
            'moz.com',
            'searchenginejournal.com',
            'ahrefs.com',
            'semrush.com',
            'backlinko.com',
            'contentmarketinginstitute.com',
        ];

        return domains.slice(0, 10).map((domain, index) => ({
            position: index + 1,
            title: this.generateTitle(keyword, domain),
            url: `https://${domain}/${keyword.toLowerCase().replace(/\s+/g, '-')}`,
            domain,
            snippet: this.generateSnippet(keyword),
        }));
    }

    /**
     * Get traffic source estimates
     */
    getTrafficSourceEstimates(): Record<string, number> {
        // Industry average traffic source distribution
        const base = {
            organic: 40 + Math.random() * 20,
            direct: 20 + Math.random() * 10,
            referral: 10 + Math.random() * 10,
            social: 5 + Math.random() * 10,
            paid: 5 + Math.random() * 5,
            email: 2 + Math.random() * 5,
        };

        // Normalize to 100%
        const total = Object.values(base).reduce((a, b) => a + b, 0);
        return Object.fromEntries(
            Object.entries(base).map(([key, value]) => [key, Math.round(value / total * 100)])
        );
    }

    // Helper methods

    private generateTrendData(): number[] {
        // Generate 12 months of trend data
        const base = 50 + Math.random() * 50;
        return Array.from({ length: 12 }, () =>
            Math.round(base + (Math.random() - 0.5) * base * 0.4)
        );
    }

    private isWellKnownDomain(domain: string): boolean {
        const wellKnown = [
            'google', 'facebook', 'amazon', 'apple', 'microsoft',
            'wikipedia', 'youtube', 'twitter', 'linkedin', 'github',
            'forbes', 'nytimes', 'bbc', 'cnn', 'reuters',
        ];
        return wellKnown.some(known => domain.toLowerCase().includes(known));
    }

    private generateTitle(keyword: string, domain: string): string {
        const templates = [
            `${keyword} - Complete Guide | ${domain}`,
            `The Ultimate ${keyword} Guide for 2024`,
            `${keyword}: Everything You Need to Know`,
            `Best ${keyword} Strategies & Tips`,
            `How to Master ${keyword} | Expert Guide`,
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    }

    private generateSnippet(keyword: string): string {
        return `Learn everything about ${keyword}. This comprehensive guide covers the best practices, strategies, and tools you need to succeed. Updated for 2024 with the latest insights and recommendations.`;
    }

    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Export singleton
export const freeSEODataService = new FreeSEODataService();
