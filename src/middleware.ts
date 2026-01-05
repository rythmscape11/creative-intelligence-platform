import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protected routes that require authentication
const isAgencyRoute = createRouteMatcher(['/agency(.*)']);
const isPortalRoute = createRouteMatcher(['/agency/portal(.*)']);
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);
const isAdminRoute = createRouteMatcher(['/dashboard/admin(.*)']);

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
    '/',
    '/auth(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/pricing',
    '/about',
    '/contact',
    '/blog(.*)',
    '/tools(.*)',
    '/services(.*)',
    '/resources(.*)',
    '/templates',
    '/demo',
    '/privacy',
    '/terms',
    '/strategy',
    '/growth-suite(.*)',
    '/api/webhooks(.*)',
    '/api/lead-capture',
    '/api/blog/posts(.*)',
    '/api/health',
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionId } = await auth();

    // Add security headers to all responses
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Skip protection for public routes
    if (isPublicRoute(req)) {
        return response;
    }

    // Protect dashboard routes
    if (isDashboardRoute(req)) {
        if (!userId || !sessionId) {
            const signInUrl = new URL('/auth/signin', req.url);
            signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
            return NextResponse.redirect(signInUrl);
        }
        await auth.protect();
    }

    // Protect agency routes (except portal which uses access keys)
    if (isAgencyRoute(req) && !isPortalRoute(req)) {
        if (!userId || !sessionId) {
            const signInUrl = new URL('/auth/signin', req.url);
            signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
            return NextResponse.redirect(signInUrl);
        }
        await auth.protect();
    }

    return response;
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};

