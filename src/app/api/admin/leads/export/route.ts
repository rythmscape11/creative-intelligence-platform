import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET /api/admin/leads/export - Export leads to CSV
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
    const source = searchParams.get('source') || 'all';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where: any = {};

    if (source !== 'all') {
      where.source = source;
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

    // Get all leads matching criteria
    const leads = await prisma.leadCapture.findMany({
      where,
      orderBy: { capturedAt: 'desc' },
    });

    // Convert to CSV
    const headers = ['Email', 'Name', 'Phone', 'Company', 'Source', 'Page', 'Tool ID', 'Budget Range', 'How Did You Hear About Us', 'Captured At', 'IP Address', 'User Agent'];
    const csvRows = [headers.join(',')];

    for (const lead of leads) {
      const row = [
        lead.email,
        lead.name || '',
        lead.phone || '',
        lead.company || '',
        lead.source,
        lead.page || '',
        lead.toolId || '',
        lead.budgetRange || '',
        lead.hearAboutUs || '',
        lead.capturedAt.toISOString(),
        lead.ipAddress || '',
        lead.userAgent || '',
      ];
      // Escape commas and quotes in CSV
      const escapedRow = row.map(field => {
        const stringField = String(field);
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      });
      csvRows.push(escapedRow.join(','));
    }

    const csv = csvRows.join('\n');

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json(
      { error: 'Failed to export leads' },
      { status: 500 }
    );
  }
}
