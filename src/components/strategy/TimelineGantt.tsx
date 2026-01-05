'use client';

import { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export interface GanttTask {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    progress: number; // 0-100
    color?: string;
    dependencies?: string[];
    milestone?: boolean;
    assignee?: string;
    phase?: string;
}

export interface GanttMilestone {
    id: string;
    name: string;
    date: Date;
    color?: string;
}

interface TimelineGanttProps {
    tasks: GanttTask[];
    milestones?: GanttMilestone[];
    startDate?: Date;
    endDate?: Date;
    className?: string;
}

const PHASE_COLORS: Record<string, string> = {
    'Planning': 'bg-blue-500',
    'Research': 'bg-purple-500',
    'Creative': 'bg-pink-500',
    'Launch': 'bg-green-500',
    'Optimization': 'bg-amber-500',
    'Analysis': 'bg-cyan-500',
    'default': 'bg-indigo-500'
};

export function TimelineGantt({
    tasks,
    milestones = [],
    startDate: propStartDate,
    endDate: propEndDate,
    className = ''
}: TimelineGanttProps) {
    const [viewOffset, setViewOffset] = useState(0);
    const daysToShow = 30;

    // Calculate date range
    const { startDate, endDate, totalDays } = useMemo(() => {
        const tasksStart = tasks.length > 0
            ? new Date(Math.min(...tasks.map(t => new Date(t.startDate).getTime())))
            : new Date();
        const tasksEnd = tasks.length > 0
            ? new Date(Math.max(...tasks.map(t => new Date(t.endDate).getTime())))
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        const start = propStartDate || tasksStart;
        const end = propEndDate || tasksEnd;
        const total = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        return { startDate: start, endDate: end, totalDays: total };
    }, [tasks, propStartDate, propEndDate]);

    // Generate visible days
    const visibleDays = useMemo(() => {
        const days: Date[] = [];
        const viewStart = new Date(startDate);
        viewStart.setDate(viewStart.getDate() + viewOffset);

        for (let i = 0; i < Math.min(daysToShow, totalDays - viewOffset); i++) {
            const day = new Date(viewStart);
            day.setDate(day.getDate() + i);
            days.push(day);
        }
        return days;
    }, [startDate, viewOffset, totalDays, daysToShow]);

    // Calculate task position
    const getTaskPosition = (task: GanttTask) => {
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.endDate);
        const viewStart = new Date(startDate);
        viewStart.setDate(viewStart.getDate() + viewOffset);

        const startDiff = Math.floor((taskStart.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24));
        const duration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        const left = Math.max(0, startDiff);
        const width = Math.min(duration, daysToShow - left);
        const isVisible = startDiff < daysToShow && startDiff + duration > 0;

        return { left, width, isVisible };
    };

    // Check if day is weekend
    const isWeekend = (date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    // Check if day is today
    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    // Format date for header
    const formatDayHeader = (date: Date) => {
        return date.getDate();
    };

    const formatMonthHeader = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short' });
    };

    // Navigation
    const canGoBack = viewOffset > 0;
    const canGoForward = viewOffset + daysToShow < totalDays;

    const goBack = () => setViewOffset(Math.max(0, viewOffset - 7));
    const goForward = () => setViewOffset(Math.min(totalDays - daysToShow, viewOffset + 7));
    const goToToday = () => {
        const today = new Date();
        const diff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        setViewOffset(Math.max(0, Math.min(totalDays - daysToShow, diff - 7)));
    };

    // Group days by month
    const monthGroups = useMemo(() => {
        const groups: { month: string; days: Date[] }[] = [];
        let currentMonth = '';

        visibleDays.forEach(day => {
            const month = formatMonthHeader(day);
            if (month !== currentMonth) {
                groups.push({ month, days: [] });
                currentMonth = month;
            }
            groups[groups.length - 1].days.push(day);
        });

        return groups;
    }, [visibleDays]);

    return (
        <div className={`bg-bg-secondary border border-border-primary rounded-xl overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary">
                <h3 className="font-semibold text-text-primary">Campaign Timeline</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToToday}
                        className="px-3 py-1 text-sm bg-bg-tertiary text-text-secondary hover:text-text-primary rounded transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={goBack}
                        disabled={!canGoBack}
                        className="p-1 rounded hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeftIcon className="h-5 w-5 text-text-secondary" />
                    </button>
                    <button
                        onClick={goForward}
                        disabled={!canGoForward}
                        className="p-1 rounded hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRightIcon className="h-5 w-5 text-text-secondary" />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                {/* Month Headers */}
                <div className="flex border-b border-border-primary">
                    <div className="w-48 flex-shrink-0 px-4 py-2 bg-bg-tertiary border-r border-border-primary">
                        <span className="text-xs text-text-tertiary uppercase tracking-wide">Task</span>
                    </div>
                    <div className="flex-1 flex">
                        {monthGroups.map((group, i) => (
                            <div
                                key={i}
                                className="border-r border-border-primary bg-bg-tertiary"
                                style={{ width: `${(group.days.length / visibleDays.length) * 100}%` }}
                            >
                                <div className="px-2 py-1 text-xs font-medium text-text-secondary">
                                    {group.month}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Day Headers */}
                <div className="flex border-b border-border-primary">
                    <div className="w-48 flex-shrink-0 px-4 py-2 bg-bg-tertiary border-r border-border-primary" />
                    <div className="flex-1 flex">
                        {visibleDays.map((day, i) => (
                            <div
                                key={i}
                                className={`flex-1 text-center py-1 text-xs border-r border-border-primary ${isWeekend(day) ? 'bg-bg-tertiary/50' : ''
                                    } ${isToday(day) ? 'bg-blue-500/20' : ''}`}
                            >
                                <span className={`${isToday(day) ? 'text-blue-400 font-bold' : 'text-text-tertiary'}`}>
                                    {formatDayHeader(day)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tasks */}
                <div className="divide-y divide-border-primary">
                    {tasks.map(task => {
                        const { left, width, isVisible } = getTaskPosition(task);
                        const color = task.color || PHASE_COLORS[task.phase || 'default'] || PHASE_COLORS.default;

                        return (
                            <div key={task.id} className="flex h-12 group">
                                {/* Task Name */}
                                <div className="w-48 flex-shrink-0 px-4 py-2 border-r border-border-primary flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${color}`} />
                                    <span className="text-sm text-text-primary truncate" title={task.name}>
                                        {task.name}
                                    </span>
                                </div>

                                {/* Task Bar */}
                                <div className="flex-1 relative">
                                    {/* Grid lines */}
                                    <div className="absolute inset-0 flex">
                                        {visibleDays.map((day, i) => (
                                            <div
                                                key={i}
                                                className={`flex-1 border-r border-border-primary ${isWeekend(day) ? 'bg-bg-tertiary/30' : ''
                                                    } ${isToday(day) ? 'bg-blue-500/10' : ''}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Task bar */}
                                    {isVisible && (
                                        <div
                                            className="absolute top-2 h-8 rounded group-hover:ring-2 ring-white/20 transition-all cursor-pointer"
                                            style={{
                                                left: `${(left / visibleDays.length) * 100}%`,
                                                width: `${(width / visibleDays.length) * 100}%`,
                                                minWidth: '20px'
                                            }}
                                        >
                                            {task.milestone ? (
                                                <div className={`w-6 h-6 ${color} rotate-45 mx-auto mt-1`} />
                                            ) : (
                                                <div className={`h-full ${color} rounded overflow-hidden`}>
                                                    {/* Progress */}
                                                    <div
                                                        className="h-full bg-white/20"
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                    {/* Label */}
                                                    {width > 3 && (
                                                        <span className="absolute inset-0 flex items-center px-2 text-xs text-white font-medium truncate">
                                                            {task.progress}%
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty state */}
                {tasks.length === 0 && (
                    <div className="py-12 text-center text-text-secondary">
                        No tasks to display
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 px-4 py-3 border-t border-border-primary bg-bg-tertiary">
                {Object.entries(PHASE_COLORS).filter(([key]) => key !== 'default').map(([phase, color]) => (
                    <div key={phase} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${color}`} />
                        <span className="text-xs text-text-secondary">{phase}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TimelineGantt;
