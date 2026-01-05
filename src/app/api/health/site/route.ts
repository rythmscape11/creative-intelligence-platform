/**
 * Site Health Check API
 * Tests all pages and returns a comprehensive health report
 * 
 * GET /api/health/site - Run health check
 */

import { NextRequest, NextResponse } from 'next/server';

interface PageHealth {
    url: string;
    status: 'healthy' | 'warning' | 'error';
    statusCode?: number;
    responseTime?: number;
    error?: string;
}

interface SiteHealthReport {
    timestamp: string;
    overall: 'healthy' | 'degraded' | 'unhealthy';
    summary: {
        total: number;
        healthy: number;
        warnings: number;
        errors: number;
    };
    pages: PageHealth[];
    apis: PageHealth[];
}

// Pages to check
const PAGES_TO_CHECK = [
    '/',
    '/pricing',
    '/about',
    '/contact',
    '/blog',
    '/tools',
    '/services',
    '/strategy',
];

// APIs to check
const APIS_TO_CHECK = [
    '/api/health',
    '/api/agency/tasks',
    '/api/agency/notifications',
    '/api/agency/ads',
];

async function checkPage(baseUrl: string, path: string): Promise<PageHealth> {
    const url = `${baseUrl}${path}`;
    const startTime = Date.now();

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'User-Agent': 'HealthCheck/1.0' },
            redirect: 'follow',
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status;

        if (statusCode >= 500) {
            return { url: path, status: 'error', statusCode, responseTime, error: 'Server error' };
        } else if (statusCode >= 400) {
            return { url: path, status: 'warning', statusCode, responseTime };
        } else if (responseTime > 3000) {
            return { url: path, status: 'warning', statusCode, responseTime, error: 'Slow response' };
        }

        return { url: path, status: 'healthy', statusCode, responseTime };
    } catch (error) {
        return {
            url: path,
            status: 'error',
            responseTime: Date.now() - startTime,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

export async function GET(request: NextRequest) {
    const { protocol, host } = new URL(request.url);
    const baseUrl = `${protocol}//${host}`;

    // Run all checks in parallel
    const pageChecks = await Promise.all(
        PAGES_TO_CHECK.map(path => checkPage(baseUrl, path))
    );

    const apiChecks = await Promise.all(
        APIS_TO_CHECK.map(path => checkPage(baseUrl, path))
    );

    // Calculate summary
    const allChecks = [...pageChecks, ...apiChecks];
    const healthy = allChecks.filter(c => c.status === 'healthy').length;
    const warnings = allChecks.filter(c => c.status === 'warning').length;
    const errors = allChecks.filter(c => c.status === 'error').length;

    // Determine overall status
    let overall: SiteHealthReport['overall'];
    if (errors > 0) {
        overall = 'unhealthy';
    } else if (warnings > 0) {
        overall = 'degraded';
    } else {
        overall = 'healthy';
    }

    const report: SiteHealthReport = {
        timestamp: new Date().toISOString(),
        overall,
        summary: {
            total: allChecks.length,
            healthy,
            warnings,
            errors,
        },
        pages: pageChecks,
        apis: apiChecks,
    };

    return NextResponse.json(report, {
        status: overall === 'healthy' ? 200 : overall === 'degraded' ? 200 : 500,
    });
}
