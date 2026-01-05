import { NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/csrf';

/**
 * GET /api/csrf-token
 * Returns a CSRF token for client-side use
 */
export async function GET() {
  try {
    const token = generateCsrfToken();
    
    return NextResponse.json(
      { token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

