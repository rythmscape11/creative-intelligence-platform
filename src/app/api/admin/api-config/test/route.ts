/**
 * Admin API Configuration - Test Endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ApiConfigService } from '@/lib/services/api-config.service';
import { z } from 'zod';

const testSchema = z.object({
    key: z.string().min(1),
});

async function isAdmin(userId: string): Promise<boolean> {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userId },
                    { clerkId: userId },
                ],
            },
            select: { role: true },
        });
        return user?.role === 'ADMIN';
    } catch (error) {
        return false;
    }
}

/**
 * POST /api/admin/api-config/test
 * Test an API key
 */
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!(await isAdmin(userId))) {
            return NextResponse.json(
                { success: false, error: 'Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { key } = testSchema.parse(body);

        const result = await ApiConfigService.testApiKey(key);

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: 'Invalid input' },
                { status: 400 }
            );
        }

        console.error('Error testing API key:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to test API key' },
            { status: 500 }
        );
    }
}
