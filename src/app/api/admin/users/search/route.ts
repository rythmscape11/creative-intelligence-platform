import { NextResponse } from 'next/server';
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ADMIN_EMAILS } from '@/config/tool-access';

// Admin check helper
async function checkAdmin() {
    const { userId } = await auth();
    if (!userId) return false;

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();

    if (email && ADMIN_EMAILS.includes(email)) return true;

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    return dbUser?.role === 'ADMIN';
}

// GET: Search for a user by email
export async function GET(req: Request) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.toLowerCase();

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        // First check our database
        const dbUser = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive',
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
            }
        });

        if (dbUser) {
            return NextResponse.json({ user: dbUser });
        }

        // If not in DB, search Clerk
        try {
            const client = await clerkClient();
            const clerkUsers = await client.users.getUserList({
                emailAddress: [email],
                limit: 1,
            });

            if (clerkUsers.data.length > 0) {
                const clerkUser = clerkUsers.data[0];

                // Create user in our DB if they exist in Clerk but not DB
                const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
                const newUser = await prisma.user.upsert({
                    where: { id: clerkUser.id },
                    update: {},
                    create: {
                        id: clerkUser.id,
                        email: clerkUser.emailAddresses[0]?.emailAddress || email,
                        name: fullName || 'Unknown User',
                    }
                });

                return NextResponse.json({
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        name: newUser.name,
                    }
                });
            }
        } catch (clerkError) {
            console.error('Clerk search failed:', clerkError);
        }

        return NextResponse.json({ user: null, message: 'User not found' });
    } catch (error) {
        console.error('User search failed:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
