/**
 * Google Calendar OAuth
 * Handles OAuth for Google Calendar integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/auth/oauth/google-calendar
 * Initiates Google Calendar OAuth flow
 */
export async function GET(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get Google Calendar credentials from Admin API Config
        const googleConfig = await prisma.adminApiConfig.findFirst({
            where: { provider: 'GOOGLE_CALENDAR', isActive: true },
        });

        if (!googleConfig) {
            return NextResponse.json({
                error: 'Google Calendar not configured',
                message: 'Please configure Google OAuth credentials in Admin Settings',
                configRequired: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
            }, { status: 400 });
        }

        const clientId = googleConfig.apiKey;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/google-calendar/callback`;
        const scope = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events';
        const state = clerkId;

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}&access_type=offline&prompt=consent`;

        return NextResponse.json({
            success: true,
            authUrl,
            note: 'Redirect user to authUrl to complete OAuth flow',
        });
    } catch (error) {
        console.error('[Google Calendar OAuth] GET error:', error);
        return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 });
    }
}

/**
 * POST /api/auth/oauth/google-calendar
 * Handles OAuth callback with code
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

        const { code } = await req.json();
        if (!code) {
            return NextResponse.json({ error: 'Authorization code required' }, { status: 400 });
        }

        const googleConfig = await prisma.adminApiConfig.findFirst({
            where: { provider: 'GOOGLE_CALENDAR', isActive: true },
        });

        if (!googleConfig) {
            return NextResponse.json({ error: 'Google Calendar not configured' }, { status: 400 });
        }

        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: googleConfig.apiKey!,
                client_secret: googleConfig.apiSecret!,
                code,
                grant_type: 'authorization_code',
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/google-calendar/callback`,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return NextResponse.json({ error: tokenData.error_description || 'OAuth failed' }, { status: 400 });
        }

        // Store integration
        const integration = await prisma.integration.upsert({
            where: {
                id: `google_calendar_${user.id}`,
            },
            create: {
                id: `google_calendar_${user.id}`,
                userId: user.id,
                type: 'GOOGLE_CALENDAR',
                category: 'CALENDAR',
                name: 'Google Calendar',
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                status: 'CONNECTED',
                isActive: true,
                settings: {
                    expiresIn: tokenData.expires_in,
                    tokenType: tokenData.token_type,
                },
            },
            update: {
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token || undefined,
                status: 'CONNECTED',
                isActive: true,
                lastSyncAt: new Date(),
            },
        });

        return NextResponse.json({ success: true, data: { id: integration.id, name: integration.name } });
    } catch (error) {
        console.error('[Google Calendar OAuth] POST error:', error);
        return NextResponse.json({ error: 'Failed to complete OAuth' }, { status: 500 });
    }
}
