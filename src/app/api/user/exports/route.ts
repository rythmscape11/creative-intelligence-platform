import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ensureUserInDb } from '@/lib/ensure-user';

export const dynamic = 'force-dynamic';

/**
 * GET /api/user/exports
 * Returns user's export history
 */
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Ensure user exists and get their Prisma ID
        const userResult = await ensureUserInDb(userId);
        if (!userResult.success || !userResult.user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Fetch exports with strategy info
        const exports = await prisma.strategyExport.findMany({
            where: {
                strategy: { userId: userResult.user.id }
            },

            include: {
                strategy: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 100
        }).catch(() => []);

        // Transform for frontend
        const formattedExports = exports.map(exp => ({
            id: exp.id,
            strategyId: exp.strategyId,
            strategyTitle: exp.strategy?.title || 'Untitled Strategy',
            format: exp.format?.toUpperCase() || 'PDF',
            createdAt: exp.createdAt.toISOString(),
            fileSize: formatFileSize(exp.fileSize || 0),
            downloadUrl: exp.fileUrl || null
        }));

        return NextResponse.json({
            exports: formattedExports,
            total: formattedExports.length
        });

    } catch (error) {
        console.error('Exports API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch exports' },
            { status: 500 }
        );
    }
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
