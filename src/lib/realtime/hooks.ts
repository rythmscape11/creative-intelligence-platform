/**
 * React Hook for Real-time Updates
 * Uses Pusher client for WebSocket subscriptions
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Pusher from 'pusher-js';
import type { Channel, PresenceChannel } from 'pusher-js';
import { getChannelName, type RealtimeEvent, type RealtimeEventType, type PresenceData } from './service';

// Singleton Pusher instance
let pusherInstance: Pusher | null = null;

function getPusherClient(): Pusher {
    if (!pusherInstance) {
        pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
            authEndpoint: '/api/pusher/auth',
            forceTLS: true,
        });
    }
    return pusherInstance;
}

export interface UseRealtimeOptions {
    projectId?: string;
    taskId?: string;
    userId?: string;
    onTaskCreated?: (data: RealtimeEvent) => void;
    onTaskUpdated?: (data: RealtimeEvent) => void;
    onTaskMoved?: (data: RealtimeEvent) => void;
    onTaskDeleted?: (data: RealtimeEvent) => void;
    onCommentAdded?: (data: RealtimeEvent) => void;
    onProjectUpdated?: (data: RealtimeEvent) => void;
    onNotification?: (data: RealtimeEvent) => void;
}

export interface UseRealtimeReturn {
    isConnected: boolean;
    members: PresenceData[];
    connectionState: string;
}

/**
 * Hook for project-level real-time updates
 */
export function useRealtime(options: UseRealtimeOptions): UseRealtimeReturn {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionState, setConnectionState] = useState('disconnected');
    const [members, setMembers] = useState<PresenceData[]>([]);
    const channelRef = useRef<Channel | null>(null);

    const {
        projectId,
        userId,
        onTaskCreated,
        onTaskUpdated,
        onTaskMoved,
        onTaskDeleted,
        onCommentAdded,
        onProjectUpdated,
        onNotification,
    } = options;

    useEffect(() => {
        if (!projectId) return;

        const pusher = getPusherClient();

        // Connection state handling
        pusher.connection.bind('state_change', (states: { current: string }) => {
            setConnectionState(states.current);
            setIsConnected(states.current === 'connected');
        });

        // Subscribe to project channel
        const channel = pusher.subscribe(getChannelName.project(projectId));
        channelRef.current = channel;

        // Bind event handlers
        if (onTaskCreated) {
            channel.bind('task:created', onTaskCreated);
        }
        if (onTaskUpdated) {
            channel.bind('task:updated', onTaskUpdated);
        }
        if (onTaskMoved) {
            channel.bind('task:moved', onTaskMoved);
        }
        if (onTaskDeleted) {
            channel.bind('task:deleted', onTaskDeleted);
        }
        if (onCommentAdded) {
            channel.bind('comment:added', onCommentAdded);
        }
        if (onProjectUpdated) {
            channel.bind('project:updated', onProjectUpdated);
        }

        return () => {
            if (channelRef.current) {
                channelRef.current.unbind_all();
                pusher.unsubscribe(getChannelName.project(projectId));
            }
        };
    }, [projectId, onTaskCreated, onTaskUpdated, onTaskMoved, onTaskDeleted, onCommentAdded, onProjectUpdated]);

    // Subscribe to user's private notification channel
    useEffect(() => {
        if (!userId || !onNotification) return;

        const pusher = getPusherClient();
        const userChannel = pusher.subscribe(getChannelName.user(userId));

        userChannel.bind('notification:new', onNotification);

        return () => {
            userChannel.unbind_all();
            pusher.unsubscribe(getChannelName.user(userId));
        };
    }, [userId, onNotification]);

    return {
        isConnected,
        members,
        connectionState,
    };
}

/**
 * Hook for presence (who's online)
 */
export function usePresence(projectId: string, userData: PresenceData) {
    const [members, setMembers] = useState<PresenceData[]>([]);
    const channelRef = useRef<PresenceChannel | null>(null);

    useEffect(() => {
        if (!projectId || !userData.userId) return;

        const pusher = getPusherClient();
        const channel = pusher.subscribe(getChannelName.projectPresence(projectId)) as PresenceChannel;
        channelRef.current = channel;

        channel.bind('pusher:subscription_succeeded', (members: { each: (fn: (member: { info: PresenceData }) => void) => void }) => {
            const memberList: PresenceData[] = [];
            members.each((member: { info: PresenceData }) => {
                memberList.push(member.info);
            });
            setMembers(memberList);
        });

        channel.bind('pusher:member_added', (member: { info: PresenceData }) => {
            setMembers((prev) => [...prev, member.info]);
        });

        channel.bind('pusher:member_removed', (member: { info: PresenceData }) => {
            setMembers((prev) => prev.filter((m) => m.userId !== member.info.userId));
        });

        return () => {
            if (channelRef.current) {
                channelRef.current.unbind_all();
                pusher.unsubscribe(getChannelName.projectPresence(projectId));
            }
        };
    }, [projectId, userData.userId]);

    return { members };
}

/**
 * Simple notification toast trigger
 */
export function useRealtimeNotifications(userId: string, onNotify: (notification: { title: string; message: string; link?: string }) => void) {
    useEffect(() => {
        if (!userId) return;

        const pusher = getPusherClient();
        const channel = pusher.subscribe(getChannelName.user(userId));

        channel.bind('notification:new', (event: RealtimeEvent) => {
            const { title, message, link } = event.payload as { title: string; message: string; link?: string };
            onNotify({ title, message, link });
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(getChannelName.user(userId));
        };
    }, [userId, onNotify]);
}

export default useRealtime;
