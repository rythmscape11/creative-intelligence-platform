/**
 * Admin API Configuration Endpoints
 * Manage API keys for all products
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ApiConfigService, API_KEY_DEFINITIONS } from '@/lib/services/api-config.service';
import { z } from 'zod';

// Schema for API key operations
const setApiKeySchema = z.object({
    key: z.string().min(1),
    value: z.string().min(1),
});

const testApiKeySchema = z.object({
    key: z.string().min(1),
});

/**
 * Check if user is admin
 */
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
        console.error('Error checking admin status:', error);
        return false;
    }
}

/**
 * GET /api/admin/api-config
 * Get all API configurations with status
 */
export async function GET(request: NextRequest) {
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

        const configs = await ApiConfigService.getAllApiConfigs();

        return NextResponse.json({
            success: true,
            data: configs,
            definitions: API_KEY_DEFINITIONS,
        });
    } catch (error) {
        console.error('Error fetching API configs:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch API configurations' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/api-config
 * Set an API key
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
        const { key, value } = setApiKeySchema.parse(body);

        // Validate key is in definitions
        const definition = API_KEY_DEFINITIONS.find(d => d.key === key);
        if (!definition) {
            return NextResponse.json(
                { success: false, error: 'Invalid API key name' },
                { status: 400 }
            );
        }

        await ApiConfigService.setApiKey(key, value);

        return NextResponse.json({
            success: true,
            message: `API key ${key} updated successfully`,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error setting API key:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to set API key' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/api-config
 * Delete an API key from database (will fall back to env)
 */
export async function DELETE(request: NextRequest) {
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

        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json(
                { success: false, error: 'Key parameter required' },
                { status: 400 }
            );
        }

        await ApiConfigService.deleteApiKey(key);

        return NextResponse.json({
            success: true,
            message: `API key ${key} deleted. Will fall back to environment variable if set.`,
        });
    } catch (error) {
        console.error('Error deleting API key:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete API key' },
            { status: 500 }
        );
    }
}
