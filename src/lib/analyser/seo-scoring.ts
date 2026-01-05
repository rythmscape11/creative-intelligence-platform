/**
 * SEO Scoring Engine
 * 
 * Computes SEO scores based on page analysis and various signals.
 * Used for page audits and opportunity identification.
 */

import { type PageContent, type PageAnalysis } from './html-fetcher';

export interface SeoScore {
    overall: number;  // 0-100
    factors: {
        title: { score: number; weight: number; issues: string[] };
        metaDescription: { score: number; weight: number; issues: string[] };
        headings: { score: number; weight: number; issues: string[] };
        content: { score: number; weight: number; issues: string[] };
        internalLinks: { score: number; weight: number; issues: string[] };
        images: { score: number; weight: number; issues: string[] };
        schema: { score: number; weight: number; issues: string[] };
        social: { score: number; weight: number; issues: string[] };
        technical: { score: number; weight: number; issues: string[] };
    };
    issues: Array<{
        severity: 'critical' | 'warning' | 'info';
        category: string;
        message: string;
        recommendation: string;
    }>;
    recommendations: string[];
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

// Scoring weights (must sum to 1)
const WEIGHTS = {
    title: 0.15,
    metaDescription: 0.10,
    headings: 0.15,
    content: 0.20,
    internalLinks: 0.10,
    images: 0.08,
    schema: 0.08,
    social: 0.07,
    technical: 0.07,
};

/**
 * Compute SEO score from page content
 */
export function computeSeoScore(page: PageContent): SeoScore {
    const factors: SeoScore['factors'] = {
        title: scoreTitleTag(page),
        metaDescription: scoreMetaDescription(page),
        headings: scoreHeadings(page),
        content: scoreContent(page),
        internalLinks: scoreInternalLinks(page),
        images: scoreImages(page),
        schema: scoreSchema(page),
        social: scoreSocial(page),
        technical: scoreTechnical(page),
    };

    // Calculate weighted overall score
    let overall = 0;
    for (const [key, factor] of Object.entries(factors)) {
        overall += factor.score * factor.weight;
    }
    overall = Math.round(overall);

    // Collect all issues
    const issues: SeoScore['issues'] = [];
    for (const [category, factor] of Object.entries(factors)) {
        for (const issue of factor.issues) {
            const severity: 'critical' | 'warning' | 'info' =
                factor.score < 30 ? 'critical' :
                    factor.score < 60 ? 'warning' : 'info';

            issues.push({
                severity,
                category,
                message: issue,
                recommendation: getRecommendation(category, issue),
            });
        }
    }

    // Sort issues by severity
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    // Generate recommendations
    const recommendations = generateRecommendations(factors, overall);

    // Calculate grade
    const grade: SeoScore['grade'] =
        overall >= 90 ? 'A' :
            overall >= 80 ? 'B' :
                overall >= 70 ? 'C' :
                    overall >= 50 ? 'D' : 'F';

    return {
        overall,
        factors,
        issues,
        recommendations,
        grade,
    };
}

function scoreTitleTag(page: PageContent): { score: number; weight: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    if (!page.title || page.title.trim().length === 0) {
        score = 0;
        issues.push('Missing title tag');
    } else {
        const length = page.title.length;

        if (length < 30) {
            score -= 30;
            issues.push(`Title too short (${length} chars). Aim for 50-60 characters.`);
        } else if (length > 60) {
            score -= 20;
            issues.push(`Title too long (${length} chars). May be truncated in search results.`);
        }

        // Check for generic titles
        const genericTitles = ['home', 'welcome', 'untitled', 'page'];
        if (genericTitles.some(g => page.title.toLowerCase().includes(g))) {
            score -= 20;
            issues.push('Title appears generic. Use descriptive, keyword-rich title.');
        }
    }

    return { score: Math.max(0, score), weight: WEIGHTS.title, issues };
}

function scoreMetaDescription(page: PageContent): { score: number; weight: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    if (!page.metaDescription || page.metaDescription.trim().length === 0) {
        score = 0;
        issues.push('Missing meta description');
    } else {
        const length = page.metaDescription.length;

        if (length < 120) {
            score -= 25;
            issues.push(`Meta description too short (${length} chars). Aim for 150-160.`);
        } else if (length > 160) {
            score -= 15;
            issues.push(`Meta description too long (${length} chars). Will be truncated.`);
        }
    }

    return { score: Math.max(0, score), weight: WEIGHTS.metaDescription, issues };
}

function scoreHeadings(page: PageContent): { score: number; weight: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    if (page.h1.length === 0) {
        score -= 40;
        issues.push('Missing H1 heading');
    } else if (page.h1.length > 1) {
        score -= 20;
        issues.push(`Multiple H1 tags (${page.h1.length}). Use only one H1 per page.`);
    }

    if (page.h2.length === 0) {
        score -= 20;
        issues.push('No H2 subheadings. Add structure with H2 tags.');
    }

    // Check heading hierarchy
    if (page.h3.length > 0 && page.h2.length === 0) {
        score -= 15;
        issues.push('H3 without H2. Maintain proper heading hierarchy.');
    }

    return { score: Math.max(0, score), weight: WEIGHTS.headings, issues };
}

function scoreContent(page: PageContent): { score: number; weight: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    if (page.wordCount < 100) {
        score = 20;
        issues.push(`Very thin content (${page.wordCount} words). Aim for 500+ words.`);
    } else if (page.wordCount < 300) {
        score = 50;
        issues.push(`Thin content (${page.wordCount} words). Consider adding more depth.`);
    } else if (page.wordCount < 500) {
        score = 70;
        issues.push(`Content could be longer (${page.wordCount} words). 800+ is optimal.`);
    }

    return { score: Math.max(0, score), weight: WEIGHTS.content, issues };
}

function scoreInternalLinks(page: PageContent): { score: number; weight: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    if (page.internalLinks.length === 0) {
        score = 30;
        issues.push('No internal links found. Add links to other pages.');
    } else if (page.internalLinks.length < 3) {
        score = 60;
        issues.push(`Few internal links (${page.internalLinks.length}). Add more for better navigation.`);
    }

    return { score: Math.max(0, score), weight: WEIGHTS.internalLinks, issues };
}

function scoreImages(page: PageContent): { score: number; weight: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    if (page.images.length === 0) {
        score = 70; // Not critical if no images
        issues.push('No images found. Consider adding relevant visuals.');
    } else {
        const missingAlt = page.images.filter(img => !img.alt || img.alt.trim().length === 0);
        if (missingAlt.length > 0) {
            const percentage = Math.round((missingAlt.length / page.images.length) * 100);
            score -= percentage * 0.8;
            issues.push(`${missingAlt.length} images missing alt text (${percentage}%).`);
        }
    }

    return { score: Math.max(0, score), weight: WEIGHTS.images, issues };
}

function scoreSchema(page: PageContent): { score: number; weight: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    if (page.schemaJson.length === 0) {
        score = 40;
        issues.push('No structured data (JSON-LD) found. Add schema markup.');
    }

    return { score: Math.max(0, score), weight: WEIGHTS.schema, issues };
}

function scoreSocial(page: PageContent): { score: number; weight: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    const hasOg = Object.keys(page.openGraph).length > 0;
    const hasTwitter = Object.keys(page.twitterCard).length > 0;

    if (!hasOg) {
        score -= 40;
        issues.push('Missing Open Graph tags for social sharing.');
    }

    if (!hasTwitter) {
        score -= 20;
        issues.push('Missing Twitter Card meta tags.');
    }

    return { score: Math.max(0, score), weight: WEIGHTS.social, issues };
}

function scoreTechnical(page: PageContent): { score: number; weight: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    if (!page.canonicalUrl) {
        score -= 30;
        issues.push('No canonical URL specified.');
    }

    if (page.loadTimeMs > 3000) {
        score -= 30;
        issues.push(`Slow initial response (${page.loadTimeMs}ms).`);
    } else if (page.loadTimeMs > 1500) {
        score -= 15;
        issues.push(`Response time could be improved (${page.loadTimeMs}ms).`);
    }

    return { score: Math.max(0, score), weight: WEIGHTS.technical, issues };
}

function getRecommendation(category: string, issue: string): string {
    const recommendations: Record<string, string> = {
        'title': 'Write a unique, descriptive title between 50-60 characters including your target keyword.',
        'metaDescription': 'Write a compelling meta description between 150-160 characters with a call to action.',
        'headings': 'Use a single H1 tag and organize content with H2 and H3 subheadings.',
        'content': 'Add more valuable content. Aim for comprehensive coverage of your topic.',
        'internalLinks': 'Add relevant internal links to help users and search engines navigate your site.',
        'images': 'Add descriptive alt text to all images for accessibility and SEO.',
        'schema': 'Add relevant Schema.org markup (Article, Product, FAQ, etc.) using JSON-LD.',
        'social': 'Add Open Graph and Twitter Card meta tags for better social media sharing.',
        'technical': 'Implement canonical URLs and optimize server response time.',
    };
    return recommendations[category] || 'Review and optimize this element.';
}

function generateRecommendations(factors: SeoScore['factors'], overall: number): string[] {
    const recs: string[] = [];

    // Sort factors by score (lowest first)
    const sortedFactors = Object.entries(factors)
        .sort((a, b) => a[1].score - b[1].score)
        .slice(0, 3); // Top 3 improvements

    for (const [key, factor] of sortedFactors) {
        if (factor.score < 80) {
            recs.push(getRecommendation(key, ''));
        }
    }

    if (overall >= 90) {
        recs.unshift('Great job! Your page is well-optimized. Consider A/B testing titles and meta descriptions.');
    }

    return recs;
}

export default {
    computeSeoScore,
};
