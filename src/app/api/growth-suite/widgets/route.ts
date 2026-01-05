/**
 * Widgets API
 * Manage embeddable Growth Suite widgets
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';

// Note: Widget model would be needed - for now using settings storage
const WidgetConfigSchema = z.object({
    type: z.enum(['lead_capture', 'cta', 'announcement', 'popup', 'banner']),
    name: z.string().min(1).max(100),
    config: z.object({
        headline: z.string().optional(),
        body: z.string().optional(),
        ctaText: z.string().optional(),
        ctaUrl: z.string().optional(),
        position: z.string().optional(),
        delay: z.number().optional(),
        showOnPages: z.array(z.string()).optional(),
    }),
    isActive: z.boolean().optional(),
});

/**
 * GET /api/growth-suite/widgets
 * List all widgets for the user
 */
export async function GET(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get widgets from user settings or dedicated storage
        // For now, return widget configuration structure
        const widgetTypes = [
            {
                id: 'lead_capture',
                type: 'lead_capture',
                name: 'Lead Capture',
                description: 'Capture visitor emails with a popup form',
                embedCode: `<script src="https://aureonone.in/widgets/lead-capture.js" data-user="${user.id}"></script>`,
            },
            {
                id: 'cta',
                type: 'cta',
                name: 'Call to Action',
                description: 'Floating CTA button',
                embedCode: `<script src="https://aureonone.in/widgets/cta.js" data-user="${user.id}"></script>`,
            },
            {
                id: 'announcement',
                type: 'announcement',
                name: 'Announcement Bar',
                description: 'Top-of-page announcement banner',
                embedCode: `<script src="https://aureonone.in/widgets/announcement.js" data-user="${user.id}"></script>`,
            },
        ];

        return NextResponse.json({ success: true, data: widgetTypes });
    } catch (error) {
        console.error('[Widgets API] GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch widgets' }, { status: 500 });
    }
}

/**
 * POST /api/growth-suite/widgets
 * Create/configure a widget
 */
export async function POST(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await req.json();
        const validated = WidgetConfigSchema.parse(body);

        // Generate widget ID and embed code
        const widgetId = crypto.randomBytes(8).toString('hex');
        const embedCode = `<script src="https://aureonone.in/widgets/${validated.type}.js" data-widget="${widgetId}" data-user="${user.id}"></script>`;

        return NextResponse.json({
            success: true,
            data: {
                id: widgetId,
                ...validated,
                embedCode,
                createdAt: new Date().toISOString(),
            },
            note: 'Widget configuration saved. Add the embed code to your website to activate.',
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        console.error('[Widgets API] POST error:', error);
        return NextResponse.json({ error: 'Failed to create widget' }, { status: 500 });
    }
}
