/**
 * Invoices API Route
 * 
 * Get user's invoices.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/**
 * GET /api/invoices
 * Get user's invoices
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get invoices
    const invoices = await prisma.invoice.findMany({
      where: { userId: userId },
      orderBy: {
        invoiceDate: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Get total count
    const total = await prisma.invoice.count({
      where: { userId: userId },
    });

    return NextResponse.json({
      invoices,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });

  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json(
      { error: 'Failed to get invoices' },
      { status: 500 }
    );
  }
}
