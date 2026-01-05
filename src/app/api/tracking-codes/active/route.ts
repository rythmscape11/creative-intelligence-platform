import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get all active tracking codes (public endpoint)
export async function GET() {
  try {
    const trackingCodes = await prisma.trackingCode.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
        type: true,
        position: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ trackingCodes });
  } catch (error) {
    console.error('Error fetching active tracking codes:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

