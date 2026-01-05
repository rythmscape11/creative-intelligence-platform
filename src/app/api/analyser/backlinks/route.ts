import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { findBacklinks, getDomainStats } from '@/lib/commoncrawl';
import { getBacklinkDataWithLLM } from '@/lib/analyser/llm-fallback';

// GET /api/analyser/backlinks - Get backlink profile data
// Use ?source=commoncrawl for real CommonCrawl data
// Use ?source=llm for LLM-based analysis
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const domain = searchParams.get('domain'); // For direct CommonCrawl lookup
        const source = searchParams.get('source'); // 'commoncrawl' for real data, 'llm' for AI
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const status = searchParams.get('status'); // ACTIVE, LOST, NEW
        const force_llm = searchParams.get('force_llm') === 'true';

        // If domain provided, try to get backlink data
        if (domain) {
            const cleanDomain = domain
                .replace(/^https?:\/\//, '')
                .replace(/^www\./, '')
                .replace(/\/$/, '');

            // Try CommonCrawl first unless forced to use LLM
            if (!force_llm && source !== 'llm') {
                try {
                    const ccData = await findBacklinks(cleanDomain, limit);
                    const stats = await getDomainStats(cleanDomain);

                    return NextResponse.json({
                        domain: ccData.targetDomain,
                        backlinks: ccData.backlinks.map(b => ({
                            id: `cc-${b.sourceUrl}`,
                            sourceUrl: b.sourceUrl,
                            sourceDomain: b.sourceHost,
                            targetUrl: `https://${cleanDomain}`,
                            anchorText: 'discovered link',
                            authority: 0, // CommonCrawl doesn't provide authority
                            isNofollow: false,
                            status: 'ACTIVE',
                            firstSeen: b.crawlDate,
                            lastSeen: b.crawlDate,
                        })),
                        summary: {
                            totalBacklinks: ccData.totalBacklinks,
                            referringDomains: ccData.uniqueDomains,
                            pagesIndexed: stats.pagesIndexed,
                            crawlIndex: ccData.crawlIndex,
                        },
                        source: 'commoncrawl',
                        isEstimated: false,
                    });
                } catch (error) {
                    console.warn('[Backlinks API] CommonCrawl error, falling back to LLM:', error);
                }
            }

            // LLM Fallback
            const llmResult = await getBacklinkDataWithLLM(cleanDomain);

            return NextResponse.json({
                domain: cleanDomain,
                backlinks: llmResult.topBacklinkSources.map((src, i) => ({
                    id: `llm-${i}`,
                    sourceUrl: `https://${src.domain}`,
                    sourceDomain: src.domain,
                    targetUrl: `https://${cleanDomain}`,
                    anchorText: 'estimated link',
                    authority: parseInt(src.estimatedDR.split('-')[0]) || 30,
                    isNofollow: false,
                    status: 'ACTIVE',
                    type: src.type,
                })),
                summary: {
                    totalBacklinks: llmResult.estimatedBacklinks,
                    referringDomains: llmResult.estimatedReferringDomains,
                    backlinkQuality: llmResult.backlinkQuality,
                    anchorTextDistribution: llmResult.anchorTextDistribution,
                },
                recommendations: llmResult.recommendations,
                analysis: llmResult.analysis,
                source: 'llm_fallback',
                message: 'Analysis powered by AI',
                isEstimated: true,
            });
        }

        if (!projectId) {
            return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
        }

        // Verify project belongs to user
        const project = await prisma.analyserProject.findFirst({
            where: { id: projectId, userId },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Get backlinks with filtering
        const whereClause: Record<string, unknown> = { projectId };
        if (status) {
            whereClause.status = status;
        }

        const [backlinks, totalCount] = await Promise.all([
            prisma.analyserBacklink.findMany({
                where: whereClause,
                orderBy: { authority: 'desc' },
                take: limit,
                skip: offset,
            }),
            prisma.analyserBacklink.count({ where: whereClause }),
        ]);

        // If no real data, return demo data
        if (backlinks.length === 0) {
            const demoBacklinks = generateDemoBacklinks(project.domain, limit);
            return NextResponse.json({
                domain: project.domain,
                backlinks: demoBacklinks,
                summary: {
                    totalBacklinks: demoBacklinks.length * 20, // Estimate
                    referringDomains: Math.round(demoBacklinks.length * 15),
                    avgAuthority: 35 + Math.random() * 20,
                    dofollow: Math.round(demoBacklinks.length * 0.7),
                    nofollow: Math.round(demoBacklinks.length * 0.3),
                },
                pagination: {
                    total: demoBacklinks.length * 20,
                    limit,
                    offset,
                },
                isEstimated: true,
            });
        }

        // Calculate summary stats
        const allBacklinks = await prisma.analyserBacklink.findMany({
            where: { projectId },
            select: { authority: true, isNofollow: true, sourceDomain: true },
        });

        const uniqueDomains = new Set(allBacklinks.map(b => b.sourceDomain));
        const avgAuthority = allBacklinks.reduce((sum, b) => sum + (b.authority || 0), 0) / allBacklinks.length || 0;
        const dofollow = allBacklinks.filter(b => !b.isNofollow).length;
        const nofollow = allBacklinks.filter(b => b.isNofollow).length;

        return NextResponse.json({
            domain: project.domain,
            backlinks: backlinks.map(b => ({
                id: b.id,
                sourceUrl: b.sourceUrl,
                sourceDomain: b.sourceDomain,
                targetUrl: b.targetUrl,
                anchorText: b.anchorText,
                authority: b.authority,
                isNofollow: b.isNofollow,
                status: b.status,
                firstSeen: b.firstSeen,
                lastSeen: b.lastSeen,
            })),
            summary: {
                totalBacklinks: totalCount,
                referringDomains: uniqueDomains.size,
                avgAuthority: Math.round(avgAuthority * 10) / 10,
                dofollow,
                nofollow,
            },
            pagination: {
                total: totalCount,
                limit,
                offset,
            },
            isEstimated: false,
        });
    } catch (error) {
        console.error('Error fetching backlinks:', error);
        return NextResponse.json({ error: 'Failed to fetch backlinks' }, { status: 500 });
    }
}

function generateDemoBacklinks(targetDomain: string, count: number) {
    const domains = [
        'techcrunch.com', 'forbes.com', 'medium.com', 'linkedin.com',
        'twitter.com', 'github.com', 'producthunt.com', 'hackernews.com',
        'reddit.com', 'quora.com', 'stackoverflow.com', 'dev.to',
        'businessinsider.com', 'entrepreneur.com', 'inc.com',
    ];

    const anchors = [
        targetDomain, 'click here', 'learn more', 'official website',
        'visit site', 'read more', 'source', 'reference',
    ];

    return domains.slice(0, count).map((domain, i) => ({
        id: `demo-${i}`,
        sourceUrl: `https://${domain}/article-${i}`,
        sourceDomain: domain,
        targetUrl: `https://${targetDomain}/`,
        anchorText: anchors[i % anchors.length],
        authority: Math.round(30 + Math.random() * 60),
        isNofollow: Math.random() > 0.7,
        status: 'ACTIVE',
        firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastSeen: new Date().toISOString(),
    }));
}
