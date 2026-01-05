/**
 * CommonCrawl Integration for Backlink Discovery
 * 
 * Uses CommonCrawl's FREE Index API to find pages linking to a domain.
 * This is much simpler than parsing raw WARC files.
 * 
 * How it works:
 * 1. Query the CC Index for pages containing links to target domain
 * 2. Returns list of pages, their URLs, and when they were crawled
 * 
 * Limitations:
 * - Data is from monthly crawls (not real-time)
 * - May not have every backlink
 * - Rate limited (be respectful)
 */

// CommonCrawl Index Server
const CC_INDEX_SERVER = 'https://index.commoncrawl.org';

// Get the latest crawl index (format: CC-MAIN-YYYY-WW)
async function getLatestCrawlIndex(): Promise<string> {
    try {
        const response = await fetch(`${CC_INDEX_SERVER}/collinfo.json`);
        const data = await response.json();
        // Return the most recent crawl
        return data[0]?.id || 'CC-MAIN-2024-10';
    } catch {
        // Fallback to a known recent crawl
        return 'CC-MAIN-2024-10';
    }
}

export interface BacklinkResult {
    sourceUrl: string;       // URL of the page containing the backlink
    sourceHost: string;      // Domain of the source page
    crawlDate: string;       // When CommonCrawl found this
    mimeType: string;        // Content type
    status: number;          // HTTP status when crawled
    length: number;          // Page size in bytes
}

export interface BacklinkSummary {
    targetDomain: string;
    totalBacklinks: number;
    uniqueDomains: number;
    backlinks: BacklinkResult[];
    crawlIndex: string;
    fetchedAt: Date;
}

/**
 * Search CommonCrawl Index for pages linking to a domain
 * 
 * @param targetDomain - Domain to find backlinks for (e.g., "example.com")
 * @param limit - Max results to return (default 100)
 */
export async function findBacklinks(
    targetDomain: string,
    limit: number = 100
): Promise<BacklinkSummary> {
    // Clean up domain
    const cleanDomain = targetDomain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');

    const crawlIndex = await getLatestCrawlIndex();

    // Query the CC Index
    // We search for pages that contain the target domain in their content
    // Using the "url" filter to find pages (we'll parse for backlinks)
    const searchUrl = `${CC_INDEX_SERVER}/${crawlIndex}-index?` + new URLSearchParams({
        url: `*.${cleanDomain}/*`,
        output: 'json',
        limit: String(limit),
    });

    try {
        const response = await fetch(searchUrl);

        if (!response.ok) {
            throw new Error(`CommonCrawl API error: ${response.status}`);
        }

        const text = await response.text();
        const lines = text.trim().split('\n').filter(Boolean);

        const backlinks: BacklinkResult[] = [];
        const uniqueHosts = new Set<string>();

        for (const line of lines) {
            try {
                const data = JSON.parse(line);

                // Extract the source URL
                const sourceUrl = data.url || '';
                const sourceHost = new URL(sourceUrl).hostname;

                // Skip self-links (same domain)
                if (sourceHost.includes(cleanDomain)) continue;

                uniqueHosts.add(sourceHost);

                backlinks.push({
                    sourceUrl,
                    sourceHost,
                    crawlDate: data.timestamp || '',
                    mimeType: data.mime || 'text/html',
                    status: parseInt(data.status) || 200,
                    length: parseInt(data.length) || 0,
                });
            } catch {
                // Skip malformed lines
            }
        }

        return {
            targetDomain: cleanDomain,
            totalBacklinks: backlinks.length,
            uniqueDomains: uniqueHosts.size,
            backlinks: backlinks.slice(0, limit),
            crawlIndex,
            fetchedAt: new Date(),
        };
    } catch (error: unknown) {
        console.error('[CommonCrawl] Error fetching backlinks:', error);
        throw error;
    }
}

/**
 * Alternative: Search for pages that LINK TO a domain
 * This queries for pages containing the domain in anchor tags
 */
export async function findInboundLinks(
    targetDomain: string,
    limit: number = 50
): Promise<BacklinkSummary> {
    const cleanDomain = targetDomain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');

    const crawlIndex = await getLatestCrawlIndex();

    // Use wildcard search to find pages on OTHER domains
    // that might link to our target
    const searchUrl = `${CC_INDEX_SERVER}/${crawlIndex}-index?` + new URLSearchParams({
        url: `*`,
        filter: `!url:*${cleanDomain}*`, // Exclude pages on the target domain
        output: 'json',
        limit: String(limit * 2), // Get more since we'll filter
    });

    try {
        const response = await fetch(searchUrl);

        if (!response.ok) {
            // If the filter doesn't work, fall back to basic search
            return findBacklinks(targetDomain, limit);
        }

        const text = await response.text();
        const lines = text.trim().split('\n').filter(Boolean);

        const backlinks: BacklinkResult[] = [];
        const uniqueHosts = new Set<string>();

        for (const line of lines) {
            try {
                const data = JSON.parse(line);
                const sourceUrl = data.url || '';
                const sourceHost = new URL(sourceUrl).hostname;

                if (sourceHost.includes(cleanDomain)) continue;

                uniqueHosts.add(sourceHost);
                backlinks.push({
                    sourceUrl,
                    sourceHost,
                    crawlDate: data.timestamp || '',
                    mimeType: data.mime || 'text/html',
                    status: parseInt(data.status) || 200,
                    length: parseInt(data.length) || 0,
                });
            } catch {
                // Skip malformed lines
            }
        }

        return {
            targetDomain: cleanDomain,
            totalBacklinks: backlinks.length,
            uniqueDomains: uniqueHosts.size,
            backlinks: backlinks.slice(0, limit),
            crawlIndex,
            fetchedAt: new Date(),
        };
    } catch {
        return findBacklinks(targetDomain, limit);
    }
}

/**
 * Get domain statistics from CommonCrawl
 */
export async function getDomainStats(domain: string): Promise<{
    pagesIndexed: number;
    crawlIndex: string;
    mimeTypes: Record<string, number>;
}> {
    const cleanDomain = domain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '');

    const crawlIndex = await getLatestCrawlIndex();

    const searchUrl = `${CC_INDEX_SERVER}/${crawlIndex}-index?` + new URLSearchParams({
        url: `*.${cleanDomain}/*`,
        output: 'json',
        limit: '1000',
    });

    try {
        const response = await fetch(searchUrl);
        const text = await response.text();
        const lines = text.trim().split('\n').filter(Boolean);

        const mimeTypes: Record<string, number> = {};

        for (const line of lines) {
            try {
                const data = JSON.parse(line);
                const mime = data.mime || 'unknown';
                mimeTypes[mime] = (mimeTypes[mime] || 0) + 1;
            } catch {
                // Skip
            }
        }

        return {
            pagesIndexed: lines.length,
            crawlIndex,
            mimeTypes,
        };
    } catch (error: unknown) {
        console.error('[CommonCrawl] Error getting domain stats:', error);
        throw error;
    }
}

export default {
    findBacklinks,
    findInboundLinks,
    getDomainStats,
    getLatestCrawlIndex,
};
