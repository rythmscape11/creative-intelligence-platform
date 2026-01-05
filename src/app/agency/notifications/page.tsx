'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AgencyListSkeleton } from '@/components/agency/AgencySkeletons';
import {
    Bell,
    CheckCheck,
    ExternalLink,
    Trash2,
    Clock,
    AlertCircle,
    MessageSquare,
    Target,
    DollarSign,
    CheckCircle,
} from 'lucide-react';
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

const TYPE_ICONS: Record<string, React.ReactNode> = {
    TASK_ASSIGNED: <Target className="h-4 w-4" />,
    COMMENT_ADDED: <MessageSquare className="h-4 w-4" />,
    DEADLINE_APPROACHING: <Clock className="h-4 w-4 text-amber-500" />,
    DEADLINE_PASSED: <AlertCircle className="h-4 w-4 text-red-500" />,
    AD_ALERT: <AlertCircle className="h-4 w-4 text-purple-500" />,
    BUDGET_ALERT: <DollarSign className="h-4 w-4 text-amber-500" />,
    APPROVAL_REQUESTED: <Clock className="h-4 w-4" />,
    APPROVAL_GRANTED: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    SYSTEM: <Bell className="h-4 w-4" />,
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        fetchNotifications();
    }, [filter]);

    const fetchNotifications = async () => {
        try {
            const params = filter === 'unread' ? '?unreadOnly=true' : '';
            const res = await fetch(`/api/agency/notifications${params}`);
            const data = await res.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
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

    const markAllAsRead = async () => {
        try {
            await fetch('/api/agency/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'readAll' }),
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await fetch('/api/agency/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id }),
            });
            setNotifications(prev => prev.filter(n => n.id !== id));
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

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Notifications</h1>
                </div>
                <AgencyListSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Notifications
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Stay updated on tasks, deadlines, and alerts
                    </p>
                </div>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={markAllAsRead} className="gap-2">
                            <CheckCheck className="h-4 w-4" />
                            Mark all read
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats & Filter */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Badge variant={unreadCount > 0 ? 'default' : 'secondary'} className="gap-1">
                        <Bell className="h-3 w-3" />
                        {unreadCount} unread
                    </Badge>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        size="sm"
                        variant={filter === 'unread' ? 'default' : 'outline'}
                        onClick={() => setFilter('unread')}
                    >
                        Unread
                    </Button>
                </div>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <Card className="p-12 text-center">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                    <p className="text-muted-foreground">
                        {filter === 'unread' ? 'All caught up! No unread notifications.' : 'You have no notifications yet.'}
                    </p>
                </Card>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`transition-colors ${!notification.isRead ? 'bg-zinc-50 dark:bg-zinc-900/50 border-l-4 border-l-zinc-500' : ''}`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                        {TYPE_ICONS[notification.type] || <Bell className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h4 className={`font-medium ${!notification.isRead ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                                    {notification.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground mt-0.5">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <span className="text-xs text-muted-foreground">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            {!notification.isRead && (
                                                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => markAsRead(notification.id)}>
                                                    Mark read
                                                </Button>
                                            )}
                                            {notification.link && (
                                                <Link href={notification.link}>
                                                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                                                        View <ExternalLink className="h-3 w-3" />
                                                    </Button>
                                                </Link>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 text-xs text-red-500 hover:text-red-600"
                                                onClick={() => deleteNotification(notification.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
