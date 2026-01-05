/**
 * Real-time Service for Agency OS
 * Uses Pusher for WebSocket communication
 * 
 * Features:
 * - Real-time task updates
 * - Live user presence
 * - Instant notifications
 * - Collaborative editing signals
 */

import Pusher from 'pusher';
import type { Channel } from 'pusher-js';

// Server-side Pusher instance
const pusherServer = new Pusher({
    appId: process.env.PUSHER_APP_ID || '',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
    secret: process.env.PUSHER_SECRET || '',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
    useTLS: true,
});

// Event types for type safety
export type RealtimeEventType =
    | 'task:created'
    | 'task:updated'
    | 'task:deleted'
    | 'task:moved'
    | 'task:assigned'
    | 'project:updated'
    | 'comment:added'
    | 'presence:update'
    | 'notification:new';

export interface RealtimeEvent {
    type: RealtimeEventType;
    payload: Record<string, unknown>;
    userId?: string;
    timestamp: string;
}

export interface PresenceData {
    userId: string;
    name: string;
    email?: string;
    avatar?: string;
    status: 'online' | 'away' | 'busy';
    currentPage?: string;
}

// Channel naming conventions
export const getChannelName = {
    // Project-specific channel (all project activities)
    project: (projectId: string) => `project-${projectId}`,

    // Task-specific channel (for collaborative editing)
    task: (taskId: string) => `task-${taskId}`,

    // User's private notification channel
    user: (userId: string) => `private-user-${userId}`,

    // Agency-wide updates
    agency: (agencyId: string) => `agency-${agencyId}`,

    // Presence channel for project (who's viewing)
    projectPresence: (projectId: string) => `presence-project-${projectId}`,
};

/**
 * Broadcast event to a channel
 */
export async function broadcast(
    channel: string,
    event: RealtimeEventType,
    data: Record<string, unknown>
): Promise<boolean> {
    try {
        const eventPayload: RealtimeEvent = {
            type: event,
            payload: data,
            timestamp: new Date().toISOString(),
        };

        await pusherServer.trigger(channel, event, eventPayload);
        return true;
    } catch (error) {
        console.error('[Realtime] Broadcast error:', error);
        return false;
    }
}

/**
 * Broadcast to multiple channels at once
 */
export async function broadcastMultiple(
    channels: string[],
    event: RealtimeEventType,
    data: Record<string, unknown>
): Promise<boolean> {
    try {
        // Pusher allows up to 10 channels at once
        for (let i = 0; i < channels.length; i += 10) {
            const batch = channels.slice(i, i + 10);
            await pusherServer.trigger(batch, event, {
                type: event,
                payload: data,
                timestamp: new Date().toISOString(),
            });
        }
        return true;
    } catch (error) {
        console.error('[Realtime] Multi-broadcast error:', error);
        return false;
    }
}

// ============================================
// HIGH-LEVEL EVENT HELPERS
// ============================================

export const RealtimeService = {
    /**
     * Notify when a task is created
     */
    async taskCreated(projectId: string, task: Record<string, unknown>) {
        return broadcast(
            getChannelName.project(projectId),
            'task:created',
            { task }
        );
    },

    /**
     * Notify when a task is updated
     */
    async taskUpdated(projectId: string, taskId: string, changes: Record<string, unknown>) {
        return broadcast(
            getChannelName.project(projectId),
            'task:updated',
            { taskId, changes }
        );
    },

    /**
     * Notify when a task is moved (Kanban)
     */
    async taskMoved(
        projectId: string,
        taskId: string,
        fromStatus: string,
        toStatus: string,
        userId: string
    ) {
        return broadcast(
            getChannelName.project(projectId),
            'task:moved',
            { taskId, fromStatus, toStatus, movedBy: userId }
        );
    },

    /**
     * Notify when a task is assigned
     */
    async taskAssigned(
        projectId: string,
        taskId: string,
        assigneeId: string,
        assignerName: string
    ) {
        // Broadcast to project and to assigned user
        await broadcast(
            getChannelName.project(projectId),
            'task:assigned',
            { taskId, assigneeId }
        );

        // Send private notification to assignee
        return broadcast(
            getChannelName.user(assigneeId),
            'notification:new',
            {
                title: 'New Task Assigned',
                message: `${assignerName} assigned you a new task`,
                link: `/agency/tasks?taskId=${taskId}`,
            }
        );
    },

    /**
     * Notify when a comment is added
     */
    async commentAdded(
        projectId: string,
        taskId: string,
        comment: Record<string, unknown>,
        mentions: string[] = []
    ) {
        await broadcast(
            getChannelName.project(projectId),
            'comment:added',
            { taskId, comment }
        );

        // Send notifications to mentioned users
        for (const userId of mentions) {
            await broadcast(
                getChannelName.user(userId),
                'notification:new',
                {
                    title: 'You were mentioned',
                    message: `Someone mentioned you in a comment`,
                    link: `/agency/tasks?taskId=${taskId}`,
                }
            );
        }
    },

    /**
     * Notify when project is updated
     */
    async projectUpdated(projectId: string, changes: Record<string, unknown>) {
        return broadcast(
            getChannelName.project(projectId),
            'project:updated',
            { projectId, changes }
        );
    },
};

export default RealtimeService;
