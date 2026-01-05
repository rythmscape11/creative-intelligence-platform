/**
 * Notification Service
 * Handles user notifications for tasks, deadlines, and alerts
 */

import { prisma } from '@/lib/prisma';

export interface CreateNotificationInput {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
}

export type NotificationType =
    | 'TASK_ASSIGNED'
    | 'COMMENT_ADDED'
    | 'DEADLINE_APPROACHING'
    | 'DEADLINE_PASSED'
    | 'STATUS_CHANGED'
    | 'AD_ALERT'
    | 'BUDGET_ALERT'
    | 'APPROVAL_REQUESTED'
    | 'APPROVAL_GRANTED'
    | 'SYSTEM';

export class NotificationService {
    /**
     * Create a notification
     */
    static async create(input: CreateNotificationInput) {
        return prisma.agencyNotification.create({
            data: {
                userId: input.userId,
                type: input.type,
                title: input.title,
                message: input.message,
                link: input.link,
            },
        });
    }

    /**
     * List notifications for a user
     */
    static async listForUser(userId: string, options?: { unreadOnly?: boolean; limit?: number }) {
        const where: Record<string, unknown> = { userId };
        if (options?.unreadOnly) where.isRead = false;

        return prisma.agencyNotification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: options?.limit || 50,
        });
    }

    /**
     * Mark notification as read
     */
    static async markAsRead(id: string) {
        return prisma.agencyNotification.update({
            where: { id },
            data: { isRead: true },
        });
    }

    /**
     * Mark all notifications as read for a user
     */
    static async markAllAsRead(userId: string) {
        await prisma.agencyNotification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
        return { success: true };
    }

    /**
     * Get unread count for a user
     */
    static async getUnreadCount(userId: string): Promise<number> {
        return prisma.agencyNotification.count({
            where: { userId, isRead: false },
        });
    }

    /**
     * Delete a notification
     */
    static async delete(id: string) {
        await prisma.agencyNotification.delete({ where: { id } });
        return { success: true };
    }

    /**
     * Delete old notifications (cleanup)
     */
    static async deleteOldNotifications(daysOld: number = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await prisma.agencyNotification.deleteMany({
            where: {
                createdAt: { lt: cutoffDate },
                isRead: true,
            },
        });

        return { deleted: result.count };
    }

    // ============================================
    // NOTIFICATION TRIGGERS (Helper Methods)
    // ============================================

    static async notifyTaskAssigned(taskId: string, assigneeId: string, assignerName: string) {
        return this.create({
            userId: assigneeId,
            type: 'TASK_ASSIGNED',
            title: 'New Task Assigned',
            message: `${assignerName} assigned you a new task`,
            link: `/agency/tasks?id=${taskId}`,
        });
    }

    static async notifyCommentAdded(taskId: string, taskOwnerId: string, commenterName: string) {
        return this.create({
            userId: taskOwnerId,
            type: 'COMMENT_ADDED',
            title: 'New Comment',
            message: `${commenterName} commented on your task`,
            link: `/agency/tasks?id=${taskId}`,
        });
    }

    static async notifyDeadlineApproaching(taskId: string, userId: string, taskTitle: string, daysLeft: number) {
        return this.create({
            userId,
            type: 'DEADLINE_APPROACHING',
            title: 'Deadline Approaching',
            message: `"${taskTitle}" is due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
            link: `/agency/tasks?id=${taskId}`,
        });
    }

    static async notifyAdAlert(userId: string, adName: string, alertMessage: string) {
        return this.create({
            userId,
            type: 'AD_ALERT',
            title: 'Ad Performance Alert',
            message: `${adName}: ${alertMessage}`,
            link: '/agency/ads',
        });
    }

    static async notifyBudgetAlert(userId: string, campaignName: string, percentSpent: number) {
        return this.create({
            userId,
            type: 'BUDGET_ALERT',
            title: 'Budget Alert',
            message: `${campaignName} has spent ${percentSpent}% of its budget`,
            link: '/agency/campaigns',
        });
    }
}

export default NotificationService;
