/**
 * Slack OAuth Callback
 * Handles OAuth redirect from Slack
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/auth/oauth/slack
 * Initiates Slack OAuth flow - returns auth URL
 */
export async function GET(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get Slack credentials from Admin API Config
        const slackConfig = await prisma.adminApiConfig.findFirst({
            where: { provider: 'SLACK', isActive: true },
        });

        if (!slackConfig) {
            return NextResponse.json({
                error: 'Slack not configured',
                message: 'Please configure Slack OAuth credentials in Admin Settings',
                configRequired: ['SLACK_CLIENT_ID', 'SLACK_CLIENT_SECRET'],
            }, { status: 400 });
        }

        const clientId = slackConfig.apiKey;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/slack/callback`;
        const scope = 'channels:read,chat:write,users:read';
        const state = clerkId; // Use clerkId as state for security

        const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

        return NextResponse.json({
            success: true,
            authUrl,
            note: 'Redirect user to authUrl to complete OAuth flow',
        });
    } catch (error) {
        console.error('[Slack OAuth] GET error:', error);
        return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 });
    }
}

/**
 * POST /api/auth/oauth/slack
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

        // Get Slack credentials
        const slackConfig = await prisma.adminApiConfig.findFirst({
            where: { provider: 'SLACK', isActive: true },
        });

        if (!slackConfig) {
            return NextResponse.json({ error: 'Slack not configured' }, { status: 400 });
        }

        // Exchange code for token
        const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: slackConfig.apiKey!,
                client_secret: slackConfig.apiSecret!,
                code,
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/slack/callback`,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenData.ok) {
            return NextResponse.json({ error: tokenData.error || 'OAuth failed' }, { status: 400 });
        }

        // Store integration
        const integration = await prisma.integration.upsert({
            where: {
                id: `slack_${user.id}`,
            },
            create: {
                id: `slack_${user.id}`,
                userId: user.id,
                type: 'SLACK',
                category: 'COMMUNICATION',
                name: tokenData.team?.name || 'Slack Workspace',
                accessToken: tokenData.access_token,
                status: 'CONNECTED',
                isActive: true,
                settings: {
                    teamId: tokenData.team?.id,
                    botUserId: tokenData.bot_user_id,
                },
            },
            update: {
                accessToken: tokenData.access_token,
                status: 'CONNECTED',
                isActive: true,
                lastSyncAt: new Date(),
                settings: {
                    teamId: tokenData.team?.id,
                    botUserId: tokenData.bot_user_id,
                },
            },
        });

        return NextResponse.json({ success: true, data: { id: integration.id, name: integration.name } });
    } catch (error) {
        console.error('[Slack OAuth] POST error:', error);
        return NextResponse.json({ error: 'Failed to complete OAuth' }, { status: 500 });
    }
}
