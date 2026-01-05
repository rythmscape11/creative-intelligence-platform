/**
 * PageSpeed Insights API Integration
 * 
 * FREE performance & Core Web Vitals data:
 * - Largest Contentful Paint (LCP)
 * - First Input Delay (FID)
 * - Cumulative Layout Shift (CLS)
 * - Performance score
 * - SEO score
 * - Accessibility score
 * 
 * Limit: 25,000 queries/day (FREE)
 */

// PageSpeed API doesn't require authentication for basic usage
const PAGESPEED_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY || '';
const PAGESPEED_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export interface CoreWebVitals {
    lcp: number;  // Largest Contentful Paint (ms)
    fid: number;  // First Input Delay (ms)
    cls: number;  // Cumulative Layout Shift
    fcp: number;  // First Contentful Paint (ms)
    ttfb: number; // Time to First Byte (ms)
}

export interface PerformanceScores {
    performance: number;  // 0-100
    accessibility: number;
    bestPractices: number;
    seo: number;
}

export interface PageSpeedResult {
    url: string;
    strategy: 'mobile' | 'desktop';
    scores: PerformanceScores;
    coreWebVitals: CoreWebVitals;
    loadingExperience: 'FAST' | 'AVERAGE' | 'SLOW';
    opportunities: Opportunity[];
    diagnostics: Diagnostic[];
    fetchedAt: Date;
}

export interface Opportunity {
    id: string;
    title: string;
    description: string;
    savings: number; // estimated ms savings
}

export interface Diagnostic {
    id: string;
    title: string;
    description: string;
    displayValue?: string;
}

/**
 * Run PageSpeed Insights analysis on a URL
 */
export async function analyzePageSpeed(
    url: string,
    strategy: 'mobile' | 'desktop' = 'mobile'
): Promise<PageSpeedResult> {
    const params = new URLSearchParams({
        url,
        strategy,
        category: 'performance',
        category: 'accessibility',
        category: 'best-practices',
        category: 'seo',
    });

    if (PAGESPEED_API_KEY) {
        params.append('key', PAGESPEED_API_KEY);
    }

    const response = await fetch(`${PAGESPEED_API_URL}?${params.toString()}`);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`PageSpeed API error: ${error}`);
    }

    const data = await response.json();

    // Extract scores
    const categories = data.lighthouseResult?.categories || {};
    const scores: PerformanceScores = {
        performance: Math.round((categories.performance?.score || 0) * 100),
        accessibility: Math.round((categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
        seo: Math.round((categories.seo?.score || 0) * 100),
    };

    // Extract Core Web Vitals from field data or lab data
    const loadingExperience = data.loadingExperience?.metrics || {};
    const audits = data.lighthouseResult?.audits || {};

    const coreWebVitals: CoreWebVitals = {
        lcp: loadingExperience.LARGEST_CONTENTFUL_PAINT_MS?.percentile ||
            audits['largest-contentful-paint']?.numericValue || 0,
        fid: loadingExperience.FIRST_INPUT_DELAY_MS?.percentile ||
            audits['max-potential-fid']?.numericValue || 0,
        cls: loadingExperience.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile ||
            audits['cumulative-layout-shift']?.numericValue || 0,
        fcp: loadingExperience.FIRST_CONTENTFUL_PAINT_MS?.percentile ||
            audits['first-contentful-paint']?.numericValue || 0,
        ttfb: audits['server-response-time']?.numericValue || 0,
    };

    // Get loading experience overall category
    const overallCategory = data.loadingExperience?.overall_category || 'AVERAGE';

    // Extract opportunities (things to improve)
    const opportunities: Opportunity[] = [];
    const opportunityAudits = [
        'render-blocking-resources',
        'unused-css-rules',
        'unused-javascript',
        'unminified-css',
        'unminified-javascript',
        'modern-image-formats',
        'uses-optimized-images',
        'uses-responsive-images',
        'efficient-animated-content',
    ];

    for (const auditId of opportunityAudits) {
        const audit = audits[auditId];
        if (audit && audit.score !== null && audit.score < 1) {
            opportunities.push({
                id: auditId,
                title: audit.title || auditId,
                description: audit.description || '',
                savings: audit.numericValue || 0,
            });
        }
    }

    // Extract diagnostics
    const diagnostics: Diagnostic[] = [];
    const diagnosticAudits = [
        'dom-size',
        'critical-request-chains',
        'network-requests',
        'network-rtt',
        'network-server-latency',
        'main-thread-tasks',
        'bootup-time',
    ];

    for (const auditId of diagnosticAudits) {
        const audit = audits[auditId];
        if (audit) {
            diagnostics.push({
                id: auditId,
                title: audit.title || auditId,
                description: audit.description || '',
                displayValue: audit.displayValue,
            });
        }
    }

    return {
        url,
        strategy,
        scores,
        coreWebVitals,
        loadingExperience: overallCategory as 'FAST' | 'AVERAGE' | 'SLOW',
        opportunities: opportunities.sort((a, b) => b.savings - a.savings).slice(0, 5),
        diagnostics: diagnostics.slice(0, 5),
        fetchedAt: new Date(),
    };
}

/**
 * Get Core Web Vitals assessment
 */
export function assessCoreWebVitals(vitals: CoreWebVitals): {
    lcp: 'good' | 'needs-improvement' | 'poor';
    fid: 'good' | 'needs-improvement' | 'poor';
    cls: 'good' | 'needs-improvement' | 'poor';
    overall: 'good' | 'needs-improvement' | 'poor';
} {
    // LCP thresholds: Good < 2.5s, Poor > 4s
    const lcp = vitals.lcp < 2500 ? 'good' : vitals.lcp < 4000 ? 'needs-improvement' : 'poor';

    // FID thresholds: Good < 100ms, Poor > 300ms
    const fid = vitals.fid < 100 ? 'good' : vitals.fid < 300 ? 'needs-improvement' : 'poor';

    // CLS thresholds: Good < 0.1, Poor > 0.25
    const cls = vitals.cls < 0.1 ? 'good' : vitals.cls < 0.25 ? 'needs-improvement' : 'poor';

    // Overall: good only if all are good
    const scores = [lcp, fid, cls];
    const overall = scores.every(s => s === 'good') ? 'good' :
        scores.some(s => s === 'poor') ? 'poor' : 'needs-improvement';

    return { lcp, fid, cls, overall };
}

/**
 * Quick performance check (without API key)
 */
export async function quickPerformanceCheck(url: string): Promise<{
    mobile: PageSpeedResult;
    desktop: PageSpeedResult;
}> {
    const [mobile, desktop] = await Promise.all([
        analyzePageSpeed(url, 'mobile'),
        analyzePageSpeed(url, 'desktop'),
    ]);

    return { mobile, desktop };
}

export default {
    analyzePageSpeed,
    assessCoreWebVitals,
    quickPerformanceCheck,
};
