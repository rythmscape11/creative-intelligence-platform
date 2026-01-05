/**
 * Pusher Authentication Endpoint
 * Required for private and presence channels
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import Pusher from 'pusher';

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID || '',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
    secret: process.env.PUSHER_SECRET || '',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
    useTLS: true,
});

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await currentUser();
        const body = await req.text();
        const params = new URLSearchParams(body);

        const socketId = params.get('socket_id');
        const channelName = params.get('channel_name');

        if (!socketId || !channelName) {
            return NextResponse.json({ error: 'Missing socket_id or channel_name' }, { status: 400 });
        }

        // Check if presence channel
        if (channelName.startsWith('presence-')) {
            const presenceData = {
                user_id: userId,
                user_info: {
                    userId,
                    name: user?.fullName || user?.firstName || 'Unknown',
                    email: user?.emailAddresses?.[0]?.emailAddress,
                    avatar: user?.imageUrl,
                    status: 'online',
                },
            };

            const authResponse = pusher.authorizeChannel(socketId, channelName, presenceData);
            return NextResponse.json(authResponse);
        }

        // For private channels, just authenticate
        if (channelName.startsWith('private-')) {
            // Verify user has access to this channel
            const channelUserId = channelName.replace('private-user-', '');
            if (channelUserId !== userId) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            const authResponse = pusher.authorizeChannel(socketId, channelName);
            return NextResponse.json(authResponse);
        }

        // Public channels don't need auth, but we still process them
        const authResponse = pusher.authorizeChannel(socketId, channelName);
        return NextResponse.json(authResponse);
    } catch (error) {
        console.error('[Pusher Auth] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
