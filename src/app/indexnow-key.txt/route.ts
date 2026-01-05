import { NextResponse } from 'next/server';
import { generateIndexNowKeyFile } from '@/lib/services/indexnow-service';

/**
 * IndexNow Key File Endpoint
 * 
 * This endpoint serves the IndexNow API key for verification.
 * Search engines will check this file to verify ownership.
 * 
 * @see https://www.indexnow.org/documentation
 */
export async function GET() {
  const key = generateIndexNowKeyFile();

  return new NextResponse(key, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}

