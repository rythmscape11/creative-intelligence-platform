'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

export function NotificationBadge() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/agency/notifications?limit=5');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch('/api/agency/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'read', id }),
            });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <div className="w-80">
                    <div className="flex items-center justify-between px-3 py-2">
                        <span className="font-semibold">Notifications</span>
                        {unreadCount > 0 && (
                            <span className="text-xs text-muted-foreground">
                                {unreadCount} unread
                            </span>
                        )}
                    </div>
                    <DropdownMenuSeparator />

                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        <>
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={`p-3 cursor-pointer ${!notification.isRead ? 'bg-zinc-50 dark:bg-zinc-800/50' : ''}`}
                                    onClick={() => {
                                        if (!notification.isRead) markAsRead(notification.id);
                                        if (notification.link) window.location.href = notification.link;
                                    }}
                                >
                                    <div className="flex gap-3 w-full">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${!notification.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{notification.title}</div>
                                            <div className="text-xs text-muted-foreground truncate">{notification.message}</div>
                                        </div>
                                        <div className="text-xs text-muted-foreground shrink-0">
                                            {formatTimeAgo(notification.createdAt)}
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <Link href="/agency/notifications">
                                <DropdownMenuItem className="text-center justify-center text-sm text-blue-600">
                                    View all notifications
                                </DropdownMenuItem>
                            </Link>
                        </>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

