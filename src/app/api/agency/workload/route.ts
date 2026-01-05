/**
 * Workload API
 * Returns team workload data based on AgencyTask assignments
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface TeamMemberWorkload {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
    tasksAssigned: number;
    hoursAllocated: number;
    maxHours: number;
    tasks: {
        id: string;
        title: string;
        priority: string;
        dueDate?: string;
        estimatedHours: number;
    }[];
}

/**
 * GET /api/agency/workload
 * Returns team workload data
 */
export async function GET(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get all users in the organization (for now, all users with tasks)
        const usersWithTasks = await prisma.user.findMany({
            where: {
                assignedTasks: {
                    some: {
                        status: { notIn: ['DONE', 'CANCELLED'] },
                    },
                },
            },
            include: {
                assignedTasks: {
                    where: {
                        status: { notIn: ['DONE', 'CANCELLED'] },
                    },
                    select: {
                        id: true,
                        title: true,
                        priority: true,
                        dueDate: true,
                        estimatedHours: true,
                    },
                    take: 20,
                },
            },
        });

        // Transform to workload format
        const workloadData: TeamMemberWorkload[] = usersWithTasks.map(teamMember => {
            const tasks = teamMember.assignedTasks;
            const hoursAllocated = tasks.reduce((sum, t) => sum + (t.estimatedHours || 4), 0);

            return {
                id: teamMember.id,
                name: teamMember.name || teamMember.email || 'Unknown',
                email: teamMember.email || undefined,
                avatar: teamMember.image || undefined,
                role: undefined, // Would need role field on user
                tasksAssigned: tasks.length,
                hoursAllocated,
                maxHours: 40, // Default 40 hour work week
                tasks: tasks.map(t => ({
                    id: t.id,
                    title: t.title,
                    priority: t.priority || 'MEDIUM',
                    dueDate: t.dueDate?.toISOString(),
                    estimatedHours: t.estimatedHours || 4,
                })),
            };
        });

        // Calculate summary stats
        const stats = {
            totalTeamMembers: workloadData.length,
            totalTasks: workloadData.reduce((sum, m) => sum + m.tasksAssigned, 0),
            totalHoursAllocated: workloadData.reduce((sum, m) => sum + m.hoursAllocated, 0),
            overloadedMembers: workloadData.filter(m => m.hoursAllocated > m.maxHours).length,
            averageUtilization: workloadData.length > 0
                ? Math.round(workloadData.reduce((sum, m) => sum + (m.hoursAllocated / m.maxHours) * 100, 0) / workloadData.length)
                : 0,
        };

        return NextResponse.json({
            success: true,
            data: {
                teamMembers: workloadData,
                stats,
            },
        });
    } catch (error) {
        console.error('[Workload API] GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch workload' }, { status: 500 });
    }
}
