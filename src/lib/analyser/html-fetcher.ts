/**
 * HTML Fetcher & Page Analyzer
 * 
 * Fetches and parses HTML content from URLs for SEO analysis.
 * Used as the foundation for LLM-based fallback analysis.
 */

import { JSDOM } from 'jsdom';

export interface PageContent {
    url: string;
    html: string;
    title: string;
    metaDescription: string;
    metaKeywords: string;
    canonicalUrl: string;
    h1: string[];
    h2: string[];
    h3: string[];
    content: string;
    wordCount: number;
    internalLinks: string[];
    externalLinks: string[];
    images: { src: string; alt: string; width?: string; height?: string }[];
    schemaJson: object[];
    openGraph: Record<string, string>;
    twitterCard: Record<string, string>;
    fetchedAt: Date;
    statusCode: number;
    loadTimeMs: number;
}

export interface PageAnalysis {
    url: string;
    seoSignals: {
        hasTitle: boolean;
        titleLength: number;
        hasMetaDescription: boolean;
        metaDescriptionLength: number;
        hasH1: boolean;
        h1Count: number;
        hasCanonical: boolean;
        hasSchema: boolean;
        schemaTypes: string[];
        hasOpenGraph: boolean;
        hasTwitterCard: boolean;
        imageCount: number;
        imagesWithAlt: number;
        internalLinkCount: number;
        externalLinkCount: number;
        wordCount: number;
    };
    issues: string[];
    suggestions: string[];
}

/**
 * Fetch and parse a web page
 */
export async function fetchAndParsePage(url: string): Promise<PageContent> {
    const startTime = Date.now();

    // Fetch the page
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; AureonOneBot/1.0; +https://www.aureonone.in)',
            'Accept': 'text/html,application/xhtml+xml',
        },
        redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const loadTimeMs = Date.now() - startTime;

    // Parse with JSDOM
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    // Extract title
    const title = doc.querySelector('title')?.textContent?.trim() || '';

    // Extract meta tags
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const metaKeywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
    const canonicalUrl = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';

    // Extract headings
    const h1 = Array.from(doc.querySelectorAll('h1')).map(el => el.textContent?.trim() || '').filter(Boolean);
    const h2 = Array.from(doc.querySelectorAll('h2')).map(el => el.textContent?.trim() || '').filter(Boolean);
    const h3 = Array.from(doc.querySelectorAll('h3')).map(el => el.textContent?.trim() || '').filter(Boolean);

    // Extract main content (remove scripts, styles, nav, footer, etc.)
    const contentSelectors = ['main', 'article', '[role="main"]', '.content', '#content', '.post-content'];
    let contentElement: Element | null = null;

    for (const selector of contentSelectors) {
        contentElement = doc.querySelector(selector);
        if (contentElement) break;
    }

    if (!contentElement) {
        contentElement = doc.body;
    }

    // Clone and clean content
    const clone = contentElement.cloneNode(true) as Element;
    clone.querySelectorAll('script, style, nav, footer, header, aside, .sidebar, .menu, .navigation').forEach(el => el.remove());
    const content = clone.textContent?.replace(/\s+/g, ' ').trim() || '';
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;

    // Extract links
    const baseUrl = new URL(url);
    const internalLinks: string[] = [];
    const externalLinks: string[] = [];

    doc.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href') || '';
        try {
            const linkUrl = new URL(href, url);
            if (linkUrl.hostname === baseUrl.hostname) {
                internalLinks.push(linkUrl.href);
            } else if (href.startsWith('http')) {
                externalLinks.push(linkUrl.href);
            }
        } catch {
            // Invalid URL, skip
        }
    });

    // Extract images
    const images = Array.from(doc.querySelectorAll('img')).map(img => ({
        src: img.getAttribute('src') || '',
        alt: img.getAttribute('alt') || '',
        width: img.getAttribute('width') || undefined,
        height: img.getAttribute('height') || undefined,
    }));

    // Extract JSON-LD schema
    const schemaJson: object[] = [];
    doc.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        try {
            const json = JSON.parse(script.textContent || '');
            schemaJson.push(json);
        } catch {
            // Invalid JSON, skip
        }
    });

    // Extract Open Graph tags
    const openGraph: Record<string, string> = {};
    doc.querySelectorAll('meta[property^="og:"]').forEach(meta => {
        const property = meta.getAttribute('property')?.replace('og:', '') || '';
        const content = meta.getAttribute('content') || '';
        if (property) openGraph[property] = content;
    });

    // Extract Twitter Card tags
    const twitterCard: Record<string, string> = {};
    doc.querySelectorAll('meta[name^="twitter:"]').forEach(meta => {
        const name = meta.getAttribute('name')?.replace('twitter:', '') || '';
        const content = meta.getAttribute('content') || '';
        if (name) twitterCard[name] = content;
    });

    return {
        url,
        html,
        title,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        h1,
        h2,
        h3,
        content,
        wordCount,
        internalLinks: [...new Set(internalLinks)],
        externalLinks: [...new Set(externalLinks)],
        images,
        schemaJson,
        openGraph,
        twitterCard,
        fetchedAt: new Date(),
        statusCode: response.status,
        loadTimeMs,
    };
}

/**
 * Analyze page for SEO signals
 */
export function analyzePageSeo(page: PageContent): PageAnalysis {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Title checks
    if (!page.title) {
        issues.push('Missing page title');
    } else if (page.title.length < 30) {
        suggestions.push('Title is too short (< 30 chars). Aim for 50-60 characters.');
    } else if (page.title.length > 60) {
        suggestions.push('Title is too long (> 60 chars). It may be truncated in search results.');
    }

    // Meta description checks
    if (!page.metaDescription) {
        issues.push('Missing meta description');
    } else if (page.metaDescription.length < 120) {
        suggestions.push('Meta description is short. Aim for 150-160 characters.');
    } else if (page.metaDescription.length > 160) {
        suggestions.push('Meta description is long and may be truncated.');
    }

    // H1 checks
    if (page.h1.length === 0) {
        issues.push('Missing H1 heading');
    } else if (page.h1.length > 1) {
        suggestions.push(`Multiple H1 headings found (${page.h1.length}). Consider using only one.`);
    }

    // Content checks
    if (page.wordCount < 300) {
        issues.push(`Thin content: only ${page.wordCount} words. Aim for 500+ words.`);
    } else if (page.wordCount < 500) {
        suggestions.push(`Content is somewhat thin (${page.wordCount} words). Consider expanding.`);
    }

    // Canonical check
    if (!page.canonicalUrl) {
        suggestions.push('No canonical URL specified. Add one to prevent duplicate content issues.');
    }

    // Schema check
    if (page.schemaJson.length === 0) {
        suggestions.push('No structured data (JSON-LD) found. Add schema markup for better visibility.');
    }

    // Image alt checks
    const imagesWithAlt = page.images.filter(img => img.alt && img.alt.length > 0).length;
    const imagesMissingAlt = page.images.length - imagesWithAlt;
    if (imagesMissingAlt > 0) {
        issues.push(`${imagesMissingAlt} images missing alt text`);
    }

    // Link checks
    if (page.internalLinks.length < 3) {
        suggestions.push('Few internal links. Add more to improve site navigation and SEO.');
    }

    // Open Graph check
    if (Object.keys(page.openGraph).length === 0) {
        suggestions.push('No Open Graph meta tags. Add them for better social media sharing.');
    }

    // Extract schema types
    const schemaTypes: string[] = [];
    page.schemaJson.forEach(schema => {
        if (typeof schema === 'object' && schema !== null) {
            const type = (schema as any)['@type'];
            if (type) {
                schemaTypes.push(Array.isArray(type) ? type[0] : type);
            }
        }
    });

    return {
        url: page.url,
        seoSignals: {
            hasTitle: !!page.title,
            titleLength: page.title.length,
            hasMetaDescription: !!page.metaDescription,
            metaDescriptionLength: page.metaDescription.length,
            hasH1: page.h1.length > 0,
            h1Count: page.h1.length,
            hasCanonical: !!page.canonicalUrl,
            hasSchema: page.schemaJson.length > 0,
            schemaTypes,
            hasOpenGraph: Object.keys(page.openGraph).length > 0,
            hasTwitterCard: Object.keys(page.twitterCard).length > 0,
            imageCount: page.images.length,
            imagesWithAlt,
            internalLinkCount: page.internalLinks.length,
            externalLinkCount: page.externalLinks.length,
            wordCount: page.wordCount,
        },
        issues,
        suggestions,
    };
}

export default {
    fetchAndParsePage,
    analyzePageSeo,
};
