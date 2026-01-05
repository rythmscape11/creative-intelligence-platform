import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ADMIN_EMAILS } from '@/config/tool-access';

export async function GET() {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user email from Clerk
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() || '';

    // Check role from multiple sources
    let role = 'USER';

    // Priority 1: Check hardcoded admin emails
    if (ADMIN_EMAILS.some(email => email?.toLowerCase() === userEmail)) {
        role = 'ADMIN';
    }

    // Priority 2: Check Clerk metadata
    if (role === 'USER') {
        const metadata = (sessionClaims?.publicMetadata || sessionClaims?.metadata || {}) as { role?: string };
        if (metadata.role === 'ADMIN' || metadata.role === 'EDITOR') {
            role = metadata.role;
        }
    }

    // Priority 3: Check database role
    if (role === 'USER') {
        try {
            const dbUser = await prisma.user.findFirst({
                where: {
                    OR: [{ id: userId }, { clerkId: userId }],
                },
                select: { role: true }
            });
            if (dbUser?.role === 'ADMIN' || dbUser?.role === 'EDITOR') {
                role = dbUser.role;
            }
        } catch (error) {
            console.error('Navigation: Error fetching user role from DB:', error);
        }
    }

    console.log(`Navigation - User: ${userId}, Role: ${role}`);

    // ========================
    // ORGANIZED NAVIGATION
    // ========================

    // CORE SECTION - For all users
    const primary = [
        // Home & Overview
        {
            name: 'Overview',
            href: '/dashboard',
            icon: 'Home',
            section: 'core',
        },
        {
            name: 'Billing',
            href: '/billing',
            icon: 'CreditCard',
            section: 'core',
        },

        // Strategy Section
        {
            name: 'divider',
            label: 'Strategy',
            section: 'strategy',
        },
        {
            name: 'My Strategies',
            href: '/dashboard/strategies',
            icon: 'FileText',
            section: 'strategy',
        },
        {
            name: 'Create Strategy',
            href: '/dashboard/strategies/create',
            icon: 'Sparkles',
            badge: 'AI',
            section: 'strategy',
        },

        // Products Section - The 4 main products
        {
            name: 'divider',
            label: 'Products',
            section: 'products',
        },
        {
            name: 'Agency OS',
            href: '/agency',
            icon: 'Users',
            section: 'products',
        },
        {
            name: 'The Optimiser',
            href: '/optimizer',
            icon: 'Zap',
            section: 'products',
        },
        {
            name: 'The Analyser',
            href: '/analyser',
            icon: 'BarChart3',
            section: 'products',
        },
        {
            name: 'The Strategiser',
            href: '/strategiser',
            icon: 'Target',
            section: 'products',
        },
    ];

    // ADMIN SECTION - Only for ADMIN/EDITOR roles
    if (role === 'ADMIN' || role === 'EDITOR') {
        primary.push(
            {
                name: 'divider',
                label: 'Admin',
                section: 'admin',
            },
            {
                name: 'Analytics Dashboard',
                href: '/admin/analytics',
                icon: 'BarChart3',
                badge: 'Admin',
                section: 'admin',
            },
            {
                name: 'User Management',
                href: '/admin/users',
                icon: 'UserCog',
                section: 'admin',
            },
            {
                name: 'Auto-Blog Engine',
                href: '/dashboard/blog-automation',
                icon: 'BookOpen',
                badge: 'AI',
                section: 'admin',
            },
            {
                name: 'Lead Chaser',
                href: '/dashboard/lead-chaser',
                icon: 'Mail',
                badge: 'Beta',
                section: 'admin',
            },
            {
                name: 'MLOps Control',
                href: '/dashboard/mlops',
                icon: 'Zap',
                section: 'admin',
            },
        );
    }

    // SECONDARY - Settings at bottom
    const secondary = [
        {
            name: 'Profile',
            href: '/dashboard/profile',
            icon: 'User',
        },
        {
            name: 'Settings',
            href: '/dashboard/settings',
            icon: 'Settings',
        },
    ];

    const response = NextResponse.json({ primary, secondary, role });

    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');

    return response;
}

