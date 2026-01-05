/**
 * Notifications API Routes
 * GET /api/agency/notifications - List notifications
 * POST /api/agency/notifications/read - Mark as read
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { NotificationService } from '@/lib/agency/notification-service';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get('unreadOnly') === 'true';

        const [notifications, unreadCount] = await Promise.all([
            NotificationService.listForUser(userId, { unreadOnly }),
            NotificationService.getUnreadCount(userId),
        ]);

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error('[Notifications API] Error:', error);
        return NextResponse.json({ error: 'Failed to list notifications' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        // Mark single notification as read
        if (body.action === 'read' && body.id) {
            await NotificationService.markAsRead(body.id);
            return NextResponse.json({ success: true });
        }

        // Mark all as read
        if (body.action === 'readAll') {
            await NotificationService.markAllAsRead(userId);
            return NextResponse.json({ success: true });
        }

        // Delete notification
        if (body.action === 'delete' && body.id) {
            await NotificationService.delete(body.id);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('[Notifications API] Error:', error);
        return NextResponse.json({ error: 'Failed to process notification action' }, { status: 500 });
    }
}
