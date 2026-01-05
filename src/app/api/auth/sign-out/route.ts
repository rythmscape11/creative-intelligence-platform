import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/sign-out
 * Server-side session destruction with complete cookie clearing
 */
export async function POST() {
    try {
        const cookieStore = await cookies();

        // List of all Clerk-related cookies to clear
        const clerkCookies = [
            '__clerk_db_jwt',
            '__session',
            '__client_uat',
            '__clerk_handshake',
        ];

        // Delete each Clerk cookie
        for (const name of clerkCookies) {
            try {
                cookieStore.delete(name);
            } catch {
                // Cookie might not exist, continue
            }
        }

        // Also set cookies to expired to ensure they're cleared
        const expiredDate = new Date(0);

        for (const name of clerkCookies) {
            try {
                cookieStore.set(name, '', {
                    expires: expiredDate,
                    path: '/',
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: true,
                    sameSite: 'lax'
                });
            } catch {
                // Continue if setting fails
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Session destroyed successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Sign out error:', error);

        // Even on error, return success to allow client to continue
        return NextResponse.json({
            success: true,
            message: 'Session cleared (with warnings)',
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * GET /api/auth/sign-out
 * Redirect-based sign out for direct browser navigation
 */
export async function GET() {
    try {
        const cookieStore = await cookies();

        // Clear all Clerk cookies
        const clerkCookies = [
            '__clerk_db_jwt',
            '__session',
            '__client_uat',
            '__clerk_handshake',
        ];

        for (const name of clerkCookies) {
            try {
                cookieStore.delete(name);
                cookieStore.set(name, '', {
                    expires: new Date(0),
                    path: '/',
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: true,
                    sameSite: 'lax'
                });
            } catch {
                // Continue on error
            }
        }

        // Redirect to home page
        return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'https://www.aureonone.in'));

    } catch (error) {
        console.error('Sign out redirect error:', error);
        return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'https://www.aureonone.in'));
    }
}
