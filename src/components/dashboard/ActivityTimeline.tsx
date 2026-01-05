'use client';

import { useState, useEffect } from 'react';
import {
    ClockIcon,
    DocumentTextIcon,
    ArrowDownTrayIcon,
    UserPlusIcon,
    CogIcon,
    SparklesIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

export type ActivityType =
    | 'strategy_created'
    | 'strategy_exported'
    | 'strategy_updated'
    | 'strategy_deleted'
    | 'strategy_viewed'
    | 'team_invited'
    | 'team_removed'
    | 'settings_updated'
    | 'login'
    | 'tool_used';

export interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    description?: string;
    timestamp: Date;
    metadata?: {
        strategyId?: string;
        strategyTitle?: string;
        exportFormat?: string;
        toolName?: string;
        memberEmail?: string;
        [key: string]: any;
    };
}

const ACTIVITY_ICONS: Record<ActivityType, React.ElementType> = {
    strategy_created: SparklesIcon,
    strategy_exported: ArrowDownTrayIcon,
    strategy_updated: PencilIcon,
    strategy_deleted: TrashIcon,
    strategy_viewed: EyeIcon,
    team_invited: UserPlusIcon,
    team_removed: UserPlusIcon,
    settings_updated: CogIcon,
    login: ClockIcon,
    tool_used: DocumentTextIcon,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
    strategy_created: 'bg-blue-500/20 text-blue-400',
    strategy_exported: 'bg-green-500/20 text-green-400',
    strategy_updated: 'bg-amber-500/20 text-amber-400',
    strategy_deleted: 'bg-red-500/20 text-red-400',
    strategy_viewed: 'bg-purple-500/20 text-purple-400',
    team_invited: 'bg-cyan-500/20 text-cyan-400',
    team_removed: 'bg-pink-500/20 text-pink-400',
    settings_updated: 'bg-gray-500/20 text-gray-400',
    login: 'bg-indigo-500/20 text-indigo-400',
    tool_used: 'bg-violet-500/20 text-violet-400',
};

interface ActivityTimelineProps {
    activities?: ActivityItem[];
    maxItems?: number;
    showViewAll?: boolean;
    className?: string;
}

export function ActivityTimeline({
    activities: propActivities,
    maxItems = 10,
    showViewAll = true,
    className = ''
}: ActivityTimelineProps) {
    const [activities, setActivities] = useState<ActivityItem[]>(propActivities || []);
    const [loading, setLoading] = useState(!propActivities);

    useEffect(() => {
        if (!propActivities) {
            fetchActivities();
        }
    }, [propActivities]);

    const fetchActivities = async () => {
        try {
            const res = await fetch('/api/user/activity');
            if (res.ok) {
                const data = await res.json();
                setActivities(data.activities || []);
            }
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={`space-y-4 ${className}`}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-bg-tertiary rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-bg-tertiary rounded w-3/4" />
                            <div className="h-3 bg-bg-tertiary rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className={`text-center py-8 ${className}`}>
                <ClockIcon className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
                <p className="text-text-secondary">No recent activity</p>
                <p className="text-sm text-text-tertiary mt-1">
                    Your activity will appear here
                </p>
            </div>
        );
    }

    const displayedActivities = activities.slice(0, maxItems);

    return (
        <div className={className}>
            <div className="space-y-1">
                {displayedActivities.map((activity, index) => {
                    const Icon = ACTIVITY_ICONS[activity.type] || ClockIcon;
                    const colorClass = ACTIVITY_COLORS[activity.type] || 'bg-gray-500/20 text-gray-400';
                    const isLast = index === displayedActivities.length - 1;

                    return (
                        <div key={activity.id} className="flex gap-4 group">
                            {/* Timeline line */}
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                {!isLast && (
                                    <div className="w-px h-full bg-border-primary min-h-[24px]" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="font-medium text-text-primary group-hover:text-accent-highlight transition-colors">
                                            {activity.title}
                                        </p>
                                        {activity.description && (
                                            <p className="text-sm text-text-secondary mt-0.5">
                                                {activity.description}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-xs text-text-tertiary whitespace-nowrap">
                                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                    </span>
                                </div>

                                {/* Metadata pills */}
                                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {activity.metadata.strategyTitle && (
                                            <span className="px-2 py-0.5 bg-bg-tertiary rounded text-xs text-text-secondary">
                                                {activity.metadata.strategyTitle}
                                            </span>
                                        )}
                                        {activity.metadata.exportFormat && (
                                            <span className="px-2 py-0.5 bg-bg-tertiary rounded text-xs text-text-secondary uppercase">
                                                {activity.metadata.exportFormat}
                                            </span>
                                        )}
                                        {activity.metadata.toolName && (
                                            <span className="px-2 py-0.5 bg-bg-tertiary rounded text-xs text-text-secondary">
                                                {activity.metadata.toolName}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {showViewAll && activities.length > maxItems && (
                <div className="text-center pt-4 border-t border-border-primary">
                    <a
                        href="/dashboard/activity"
                        className="text-sm text-accent-primary hover:text-accent-highlight transition-colors"
                    >
                        View all activity →
                    </a>
                </div>
            )}
        </div>
    );
}

export default ActivityTimeline;
