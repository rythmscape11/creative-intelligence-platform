/**
 * Task Management Service
 * Handles tasks, comments, and time tracking
 */

import { prisma } from '@/lib/prisma';

export interface CreateTaskInput {
    jobId: string;
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: Date;
    estimatedHours?: number;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: Date;
    estimatedHours?: number;
}

export interface CreateCommentInput {
    taskId: string;
    userId: string;
    content: string;
}

export interface CreateTimeEntryInput {
    taskId?: string;
    jobId?: string;
    projectId: string;
    userId: string;
    description?: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    billable?: boolean;
    hourlyRate?: number;
}

export class TaskService {
    // ============================================
    // TASK OPERATIONS
    // ============================================

    static async createTask(input: CreateTaskInput) {
        return prisma.agencyTask.create({
            data: {
                jobId: input.jobId,
                title: input.title,
                description: input.description,
                status: input.status || 'TODO',
                priority: input.priority || 'MEDIUM',
                assigneeId: input.assigneeId,
                dueDate: input.dueDate,
                estimatedHours: input.estimatedHours,
            },
            include: {
                job: { select: { title: true } },
                comments: { take: 3, orderBy: { createdAt: 'desc' } },
            },
        });
    }

    static async listTasks(filters?: {
        jobId?: string;
        status?: string;
        assigneeId?: string;
        priority?: string;
    }) {
        const where: Record<string, unknown> = {};
        if (filters?.jobId) where.jobId = filters.jobId;
        if (filters?.status) where.status = filters.status;
        if (filters?.assigneeId) where.assigneeId = filters.assigneeId;
        if (filters?.priority) where.priority = filters.priority;

        return prisma.agencyTask.findMany({
            where,
            include: {
                job: {
                    select: {
                        title: true,
                        project: { select: { id: true, name: true } }
                    }
                },
                comments: { select: { id: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async getTaskById(id: string) {
        return prisma.agencyTask.findUnique({
            where: { id },
            include: {
                job: {
                    select: {
                        title: true,
                        project: {
                            select: {
                                name: true,
                                client: { select: { name: true } }
                            }
                        }
                    }
                },
                comments: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
            },
        });
    }

    static async updateTask(id: string, input: UpdateTaskInput) {
        return prisma.agencyTask.update({
            where: { id },
            data: input,
            include: {
                job: { select: { title: true } },
            },
        });
    }

    static async moveTask(id: string, newStatus: string) {
        return this.updateTask(id, { status: newStatus });
    }

    static async deleteTask(id: string) {
        await prisma.agencyTask.delete({ where: { id } });
        return { success: true };
    }

    static async getKanbanBoard(projectId?: string) {
        const where: Record<string, unknown> = {};
        if (projectId) {
            where.job = { project: { id: projectId } };
        }

        const tasks = await prisma.agencyTask.findMany({
            where,
            include: {
                job: {
                    select: {
                        title: true,
                        project: { select: { id: true, name: true } }
                    }
                },
                comments: { select: { id: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Group by status - map to frontend expected format
        type TaskWithRelations = typeof tasks[0] & { job: { name?: string } };
        const columns: Record<string, TaskWithRelations[]> = {
            TODO: [],
            IN_PROGRESS: [],
            REVIEW: [],
            DONE: [],
        };

        tasks.forEach(task => {
            const status = task.status as keyof typeof columns;
            // Map job.title to job.name for frontend compatibility
            const mappedTask = {
                ...task,
                job: {
                    ...task.job,
                    name: task.job.title,
                }
            } as TaskWithRelations;

            if (columns[status]) {
                columns[status].push(mappedTask);
            } else {
                columns.TODO.push(mappedTask);
            }
        });

        return columns;
    }

    // ============================================
    // COMMENT OPERATIONS
    // ============================================

    static async addComment(input: CreateCommentInput) {
        return prisma.agencyTaskComment.create({
            data: {
                taskId: input.taskId,
                userId: input.userId,
                content: input.content,
            },
        });
    }

    static async listComments(taskId: string) {
        return prisma.agencyTaskComment.findMany({
            where: { taskId },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async deleteComment(id: string) {
        await prisma.agencyTaskComment.delete({ where: { id } });
        return { success: true };
    }

    // ============================================
    // TIME TRACKING
    // ============================================

    static async startTimeEntry(input: Omit<CreateTimeEntryInput, 'endTime' | 'duration'>) {
        return prisma.agencyTimeEntry.create({
            data: {
                taskId: input.taskId,
                jobId: input.jobId,
                projectId: input.projectId,
                userId: input.userId,
                description: input.description,
                startTime: input.startTime,
                billable: input.billable ?? true,
                hourlyRate: input.hourlyRate,
            },
        });
    }

    static async stopTimeEntry(id: string) {
        const entry = await prisma.agencyTimeEntry.findUnique({ where: { id } });
        if (!entry) throw new Error('Time entry not found');

        const endTime = new Date();
        const duration = Math.round((endTime.getTime() - entry.startTime.getTime()) / 60000); // minutes

        return prisma.agencyTimeEntry.update({
            where: { id },
            data: { endTime, duration },
        });
    }

    static async listTimeEntries(filters?: {
        projectId?: string;
        taskId?: string;
        userId?: string;
        startDate?: Date;
        endDate?: Date;
    }) {
        const where: Record<string, unknown> = {};
        if (filters?.projectId) where.projectId = filters.projectId;
        if (filters?.taskId) where.taskId = filters.taskId;
        if (filters?.userId) where.userId = filters.userId;
        if (filters?.startDate || filters?.endDate) {
            where.startTime = {};
            if (filters.startDate) (where.startTime as Record<string, Date>).gte = filters.startDate;
            if (filters.endDate) (where.startTime as Record<string, Date>).lte = filters.endDate;
        }

        return prisma.agencyTimeEntry.findMany({
            where,
            orderBy: { startTime: 'desc' },
        });
    }

    static async getTimeStats(projectId?: string, userId?: string) {
        const where: Record<string, unknown> = {};
        if (projectId) where.projectId = projectId;
        if (userId) where.userId = userId;

        const entries = await prisma.agencyTimeEntry.findMany({
            where: { ...where, duration: { not: null } },
            select: { duration: true, billable: true, hourlyRate: true },
        });

        type TimeEntry = { duration: number | null; billable: boolean; hourlyRate: number | null };

        const totalMinutes = entries.reduce((sum: number, e: TimeEntry) => sum + (e.duration || 0), 0);
        const billableMinutes = entries.filter((e: TimeEntry) => e.billable).reduce((sum: number, e: TimeEntry) => sum + (e.duration || 0), 0);
        const totalValue = entries.reduce((sum: number, e: TimeEntry) => {
            if (e.billable && e.hourlyRate && e.duration) {
                return sum + (e.duration / 60) * e.hourlyRate;
            }
            return sum;
        }, 0);

        return {
            totalHours: Math.round(totalMinutes / 60 * 10) / 10,
            billableHours: Math.round(billableMinutes / 60 * 10) / 10,
            totalValue: Math.round(totalValue * 100) / 100,
            entriesCount: entries.length,
        };
    }
}

export default TaskService;
