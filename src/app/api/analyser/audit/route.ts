import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/analyser/audit - Get site audit issues
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const severity = searchParams.get('severity'); // critical, warning, info
        const category = searchParams.get('category'); // seo, performance, accessibility, security

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

        // Get audit issues with filtering
        const whereClause: Record<string, unknown> = { projectId };
        if (severity) whereClause.severity = severity.toUpperCase();
        if (category) whereClause.category = category.toLowerCase();

        const issues = await prisma.analyserAuditIssue.findMany({
            where: whereClause,
            orderBy: [
                { severity: 'asc' }, // CRITICAL first
                { createdAt: 'desc' },
            ],
        });

        // If no data, generate demo issues
        if (issues.length === 0) {
            const demoIssues = generateDemoAuditIssues(project.domain);
            const grouped = groupIssuesBySeverity(demoIssues);

            return NextResponse.json({
                domain: project.domain,
                issues: demoIssues,
                summary: {
                    total: demoIssues.length,
                    critical: grouped.CRITICAL?.length || 0,
                    warning: grouped.WARNING?.length || 0,
                    info: grouped.INFO?.length || 0,
                    healthScore: calculateHealthScore(demoIssues),
                },
                categories: getCategoryBreakdown(demoIssues),
                isEstimated: true,
            });
        }

        const grouped = groupIssuesBySeverity(issues);

        return NextResponse.json({
            domain: project.domain,
            issues: issues.map(issue => ({
                id: issue.id,
                type: issue.type,
                severity: issue.severity,
                category: issue.category,
                title: issue.title,
                description: issue.description,
                url: issue.url,
                recommendation: issue.recommendation,
                status: issue.status,
                createdAt: issue.createdAt,
            })),
            summary: {
                total: issues.length,
                critical: grouped.CRITICAL?.length || 0,
                warning: grouped.WARNING?.length || 0,
                info: grouped.INFO?.length || 0,
                healthScore: calculateHealthScore(issues),
            },
            categories: getCategoryBreakdown(issues),
            isEstimated: false,
        });
    } catch (error) {
        console.error('Error fetching audit issues:', error);
        return NextResponse.json({ error: 'Failed to fetch audit issues' }, { status: 500 });
    }
}

interface AuditIssue {
    severity: string;
    category: string;
    [key: string]: unknown;
}

function groupIssuesBySeverity(issues: AuditIssue[]) {
    return issues.reduce((acc, issue) => {
        const severity = issue.severity;
        if (!acc[severity]) acc[severity] = [];
        acc[severity].push(issue);
        return acc;
    }, {} as Record<string, AuditIssue[]>);
}

function getCategoryBreakdown(issues: AuditIssue[]) {
    const counts: Record<string, number> = {};
    issues.forEach(issue => {
        const cat = issue.category || 'other';
        counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
}

function calculateHealthScore(issues: AuditIssue[]) {
    let score = 100;
    issues.forEach(issue => {
        if (issue.severity === 'CRITICAL') score -= 10;
        else if (issue.severity === 'WARNING') score -= 3;
        else score -= 1;
    });
    return Math.max(0, Math.min(100, score));
}

function generateDemoAuditIssues(domain: string) {
    return [
        {
            id: 'demo-1',
            type: 'missing_meta_description',
            severity: 'CRITICAL',
            category: 'seo',
            title: 'Missing Meta Descriptions',
            description: '5 pages are missing meta descriptions',
            url: `https://${domain}/about`,
            recommendation: 'Add unique, compelling meta descriptions to all pages (150-160 characters)',
            status: 'OPEN',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'demo-2',
            type: 'slow_page_speed',
            severity: 'WARNING',
            category: 'performance',
            title: 'Slow Page Load Time',
            description: 'Homepage takes 4.2s to load (target: <3s)',
            url: `https://${domain}/`,
            recommendation: 'Optimize images, enable compression, and leverage browser caching',
            status: 'OPEN',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'demo-3',
            type: 'broken_links',
            severity: 'WARNING',
            category: 'seo',
            title: 'Broken Internal Links',
            description: '3 internal links return 404 errors',
            url: `https://${domain}/old-page`,
            recommendation: 'Update or remove broken links to improve user experience and SEO',
            status: 'OPEN',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'demo-4',
            type: 'missing_alt_text',
            severity: 'WARNING',
            category: 'accessibility',
            title: 'Images Missing Alt Text',
            description: '12 images are missing alt attributes',
            url: `https://${domain}/gallery`,
            recommendation: 'Add descriptive alt text to all images for accessibility and SEO',
            status: 'OPEN',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'demo-5',
            type: 'http_pages',
            severity: 'CRITICAL',
            category: 'security',
            title: 'Non-HTTPS Resources',
            description: '2 resources are loaded over HTTP on HTTPS pages',
            url: `https://${domain}/contact`,
            recommendation: 'Update all resource URLs to use HTTPS to avoid mixed content warnings',
            status: 'OPEN',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'demo-6',
            type: 'duplicate_titles',
            severity: 'INFO',
            category: 'seo',
            title: 'Duplicate Page Titles',
            description: '2 pages share the same title tag',
            url: `https://${domain}/blog`,
            recommendation: 'Create unique, descriptive titles for each page',
            status: 'OPEN',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'demo-7',
            type: 'large_images',
            severity: 'WARNING',
            category: 'performance',
            title: 'Large Image Files',
            description: '8 images exceed 200KB',
            url: `https://${domain}/products`,
            recommendation: 'Compress images and use modern formats like WebP',
            status: 'OPEN',
            createdAt: new Date().toISOString(),
        },
    ];
}
