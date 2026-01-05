import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/leads - Get all leads with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const source = searchParams.get('source') || 'all';
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (source !== 'all') {
      where.source = source;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.capturedAt = {};
      if (startDate) {
        where.capturedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.capturedAt.lte = new Date(endDate);
      }
    }

    // Get leads with pagination
    const [leads, total] = await Promise.all([
      prisma.leadCapture.findMany({
        where,
        orderBy: { capturedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.leadCapture.count({ where }),
    ]);

    // Get stats
    const stats = await prisma.leadCapture.groupBy({
      by: ['source'],
      _count: true,
    });

    const sourceStats = stats.reduce((acc, stat) => {
      acc[stat.source] = stat._count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total,
        bySource: sourceStats,
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST /api/admin/leads - Create a new lead (for testing or manual entry)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, source, page, toolId, metadata } = body;

    if (!email || !source) {
      return NextResponse.json(
        { error: 'Email and source are required' },
        { status: 400 }
      );
    }

    const lead = await prisma.leadCapture.create({
      data: {
        email,
        name,
        source,
        page,
        toolId,
        metadata,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

