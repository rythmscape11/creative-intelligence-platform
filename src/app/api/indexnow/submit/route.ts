import { NextRequest, NextResponse } from 'next/server';
import { submitUrlToIndexNow, submitAllPagesToIndexNow } from '@/lib/services/indexnow-service';
import { logger } from '@/lib/services/logger-service';

/**
 * API endpoint to manually submit URLs to IndexNow
 * 
 * Usage:
 * - POST /api/indexnow/submit?url=https://example.com/page
 * - POST /api/indexnow/submit?all=true (submit all pages)
 * 
 * Requires API key for security
 */
export async function POST(request: NextRequest) {
  try {
    // Simple API key authentication
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.INDEXNOW_API_SECRET || 'your-secret-key';

    if (authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const submitAll = searchParams.get('all') === 'true';

    if (submitAll) {
      // Submit all important pages
      logger.info('IndexNow: Starting bulk submission');
      const results = await submitAllPagesToIndexNow();

      return NextResponse.json({
        success: true,
        message: 'Bulk submission complete',
        results,
      });
    }

    if (!url) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      );
    }

    // Submit single URL
    const result = await submitUrlToIndexNow(url);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully submitted ${url} to IndexNow`,
        result,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit URL',
        result,
      },
      { status: 500 }
    );
  } catch (error) {
    logger.error(
      'IndexNow API: Error processing request',
      error instanceof Error ? error : undefined
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check IndexNow status
 */
export async function GET() {
  return NextResponse.json({
    service: 'IndexNow Submission API',
    status: 'active',
    documentation: 'https://www.indexnow.org/',
    usage: {
      submitSingle: 'POST /api/indexnow/submit?url=YOUR_URL',
      submitAll: 'POST /api/indexnow/submit?all=true',
      authentication: 'Bearer token required in Authorization header',
    },
  });
}

