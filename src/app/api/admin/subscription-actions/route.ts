/**
 * Admin Subscription Actions API
 * 
 * Founder-led sales support actions:
 * - Extend trial
 * - Comp/gift a plan
 * - Cancel subscription
 * 
 * All actions are logged to activity_logs.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface SubscriptionAction {
    action: 'extend_trial' | 'comp_plan' | 'cancel' | 'update_plan';
    targetUserId: string;
    plan?: string;
    daysToAdd?: number;
    reason?: string;
}

/**
 * POST - Execute a subscription action
 */
export async function POST(request: NextRequest) {
    try {
        const { userId: adminId } = await auth();

        if (!adminId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify admin role
        const admin = await prisma.user.findUnique({
            where: { id: adminId },
            select: { role: true, email: true },
        });

        if (!admin || admin.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }

        const body: SubscriptionAction = await request.json();
        const { action, targetUserId, plan, daysToAdd = 14, reason } = body;

        if (!action || !targetUserId) {
            return NextResponse.json(
                { error: 'Missing required fields: action, targetUserId' },
                { status: 400 }
            );
        }

        // Get target user
        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
            include: { subscription: true },
        });

        if (!targetUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        let result: { success: boolean; message: string; data?: Record<string, unknown> };

        switch (action) {
            case 'extend_trial': {
                // Extend trial by adding days to currentPeriodEnd
                const currentEnd = targetUser.subscription?.currentPeriodEnd || new Date();
                const newEnd = new Date(currentEnd);
                newEnd.setDate(newEnd.getDate() + daysToAdd);

                if (targetUser.subscription) {
                    await prisma.subscription.update({
                        where: { id: targetUser.subscription.id },
                        data: {
                            status: 'TRIALING',
                            currentPeriodEnd: newEnd,
                        },
                    });
                } else {
                    // Create a trial subscription if none exists
                    await prisma.subscription.create({
                        data: {
                            userId: targetUserId,
                            plan: plan || 'PRO',
                            status: 'TRIALING',
                            currentPeriodStart: new Date(),
                            currentPeriodEnd: newEnd,
                        },
                    });
                }

                result = {
                    success: true,
                    message: `Trial extended by ${daysToAdd} days until ${newEnd.toLocaleDateString()}`,
                    data: { newEndDate: newEnd },
                };
                break;
            }

            case 'comp_plan': {
                if (!plan) {
                    return NextResponse.json(
                        { error: 'Plan is required for comp_plan action' },
                        { status: 400 }
                    );
                }

                // Create or update subscription with comped plan
                const endDate = new Date();
                endDate.setFullYear(endDate.getFullYear() + 1); // 1 year comp

                if (targetUser.subscription) {
                    await prisma.subscription.update({
                        where: { id: targetUser.subscription.id },
                        data: {
                            plan,
                            status: 'ACTIVE',
                            currentPeriodEnd: endDate,
                        },
                    });
                } else {
                    await prisma.subscription.create({
                        data: {
                            userId: targetUserId,
                            plan,
                            status: 'ACTIVE',
                            currentPeriodStart: new Date(),
                            currentPeriodEnd: endDate,
                        },
                    });
                }

                result = {
                    success: true,
                    message: `Comped ${plan} plan until ${endDate.toLocaleDateString()}`,
                    data: { plan, endDate },
                };
                break;
            }

            case 'cancel': {
                if (targetUser.subscription) {
                    await prisma.subscription.update({
                        where: { id: targetUser.subscription.id },
                        data: { status: 'CANCELLED' },
                    });
                }

                result = {
                    success: true,
                    message: 'Subscription cancelled',
                };
                break;
            }

            case 'update_plan': {
                if (!plan) {
                    return NextResponse.json(
                        { error: 'Plan is required for update_plan action' },
                        { status: 400 }
                    );
                }

                if (targetUser.subscription) {
                    await prisma.subscription.update({
                        where: { id: targetUser.subscription.id },
                        data: { plan },
                    });
                }

                result = {
                    success: true,
                    message: `Plan updated to ${plan}`,
                    data: { plan },
                };
                break;
            }

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        // Log the action
        await prisma.userActivity.create({
            data: {
                userId: adminId,
                action: `admin:subscription:${action}`,
                entityType: 'subscription',
                entityId: targetUserId,
                details: JSON.stringify({
                    targetEmail: targetUser.email,
                    action,
                    plan,
                    daysToAdd,
                    reason,
                    result: result.message,
                    performedBy: admin.email,
                }),
            },
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Admin subscription action failed:', error);
        return NextResponse.json(
            { error: 'Failed to execute action' },
            { status: 500 }
        );
    }
}

/**
 * GET - Get subscription action history for a user
 */
export async function GET(request: NextRequest) {
    try {
        const { userId: adminId } = await auth();

        if (!adminId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify admin role
        const admin = await prisma.user.findUnique({
            where: { id: adminId },
            select: { role: true },
        });

        if (!admin || admin.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        const targetUserId = request.nextUrl.searchParams.get('userId');

        const actions = await prisma.userActivity.findMany({
            where: {
                action: { startsWith: 'admin:subscription:' },
                ...(targetUserId ? { entityId: targetUserId } : {}),
            },
            orderBy: { timestamp: 'desc' },
            take: 100,
        });

        return NextResponse.json({
            actions: actions.map((a) => ({
                id: a.id,
                action: a.action.replace('admin:subscription:', ''),
                targetUserId: a.entityId,
                details: a.details,
                timestamp: a.timestamp,
                performedBy: a.userId,
            })),
        });
    } catch (error) {
        console.error('Failed to get subscription actions:', error);
        return NextResponse.json(
            { error: 'Failed to get actions' },
            { status: 500 }
        );
    }
}
