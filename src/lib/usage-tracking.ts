import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * Usage Tracking Middleware
 * 
 * Tracks user activity for analytics:
 * - Page views
 * - Feature usage
 * - Session events
 * 
 * Data is stored asynchronously to not block requests
 */

// Routes to track
const TRACKED_ROUTES = [
    '/agency',
    '/optimizer',
    '/analyser',
    '/strategy',
    '/products',
    '/pricing',
    '/billing',
    '/dashboard',
];

// Map routes to products
const ROUTE_TO_PRODUCT: Record<string, string> = {
    '/agency': 'AGENCY_OS',
    '/optimizer': 'OPTIMISER',
    '/analyser': 'ANALYSER',
    '/strategy': 'STRATEGISER',
    '/strategiser': 'STRATEGISER',
};

export async function trackUsageMiddleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Only track specific routes
    const shouldTrack = TRACKED_ROUTES.some(route => pathname.startsWith(route));
    if (!shouldTrack) {
        return null;
    }

    try {
        const { userId } = await auth();

        if (!userId) {
            return null;
        }

        // Determine product from route
        let product: string | null = null;
        for (const [route, prod] of Object.entries(ROUTE_TO_PRODUCT)) {
            if (pathname.startsWith(route)) {
                product = prod;
                break;
            }
        }

        // Fire and forget - don't await to avoid blocking
        trackEvent({
            userId,
            event: 'page_view',
            pathname,
            product,
            timestamp: new Date().toISOString(),
        }).catch(err => console.error('Usage tracking failed:', err));

    } catch (error) {
        // Don't let tracking errors affect the request
        console.error('Usage tracking error:', error);
    }

    return null;
}

interface TrackingEvent {
    userId: string;
    event: string;
    pathname: string;
    product: string | null;
    timestamp: string;
    metadata?: Record<string, any>;
}

/**
 * Track an event to the database
 */
async function trackEvent(event: TrackingEvent) {
    try {
        // Use internal API to avoid circular imports
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        await fetch(`${baseUrl}/api/tracking/event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
        });
    } catch (error) {
        console.error('Failed to send tracking event:', error);
    }
}

/**
 * Track feature usage from client side
 */
export function trackFeatureUsage(feature: string, product: string, metadata?: Record<string, any>) {
    if (typeof window === 'undefined') return;

    fetch('/api/tracking/feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature, product, metadata }),
    }).catch(err => console.error('Feature tracking failed:', err));
}

/**
 * Track session events
 */
export function trackSessionEvent(eventType: 'login' | 'logout' | 'session_start' | 'session_end') {
    if (typeof window === 'undefined') return;

    fetch('/api/tracking/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType }),
    }).catch(err => console.error('Session tracking failed:', err));
}
