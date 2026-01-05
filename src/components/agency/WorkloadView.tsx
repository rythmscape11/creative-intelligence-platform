/**
 * Workload View Component
 * Visualizes team capacity and resource allocation
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Users,
    AlertTriangle,
    CheckCircle2,
    Clock,
    TrendingUp,
    User,
    Loader2,
} from 'lucide-react';

interface TeamMember {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    tasksAssigned: number;
    hoursAllocated: number;
    maxHours: number; // Weekly capacity
    tasks: {
        id: string;
        title: string;
        priority: string;
        dueDate?: string;
        estimatedHours: number;
    }[];
}

interface WorkloadViewProps {
    teamMembers?: TeamMember[];
    weekStartDate?: Date;
    className?: string;
    fetchFromApi?: boolean; // If true, fetch from /api/agency/workload
}

// Fallback mock data when API returns no data
const FALLBACK_TEAM: TeamMember[] = [
    {
        id: '1',
        name: 'Alex Johnson',
        role: 'Designer',
        tasksAssigned: 5,
        hoursAllocated: 32,
        maxHours: 40,
        tasks: [
            { id: 't1', title: 'Website Redesign', priority: 'HIGH', estimatedHours: 16 },
            { id: 't2', title: 'Logo Variants', priority: 'MEDIUM', estimatedHours: 8 },
            { id: 't3', title: 'Social Graphics', priority: 'LOW', estimatedHours: 8 },
        ],
    },
];

const PRIORITY_COLORS: Record<string, string> = {
    LOW: 'bg-zinc-200 text-zinc-700',
    MEDIUM: 'bg-blue-100 text-blue-700',
    HIGH: 'bg-amber-100 text-amber-700',
    URGENT: 'bg-red-100 text-red-700',
};

export function WorkloadView({
    teamMembers: propTeamMembers,
    weekStartDate = new Date(),
    className = '',
    fetchFromApi = true,
}: WorkloadViewProps) {
    const [view, setView] = useState<'capacity' | 'timeline'>('capacity');
    const [loading, setLoading] = useState(!propTeamMembers && fetchFromApi);
    const [apiTeamMembers, setApiTeamMembers] = useState<TeamMember[]>([]);

    // Fetch from API if no prop provided
    useEffect(() => {
        if (propTeamMembers || !fetchFromApi) return;

        async function fetchWorkload() {
            try {
                const res = await fetch('/api/agency/workload');
                if (res.ok) {
                    const data = await res.json();
                    if (data.data?.teamMembers?.length > 0) {
                        setApiTeamMembers(data.data.teamMembers);
                    } else {
                        setApiTeamMembers(FALLBACK_TEAM);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch workload:', error);
                setApiTeamMembers(FALLBACK_TEAM);
            } finally {
                setLoading(false);
            }
        }

        fetchWorkload();
    }, [propTeamMembers, fetchFromApi]);

    // Use prop, API data, or fallback
    const teamMembers = propTeamMembers || (apiTeamMembers.length > 0 ? apiTeamMembers : FALLBACK_TEAM);

    // Calculate utilization status
    const getUtilizationStatus = (allocated: number, max: number) => {
        const percent = (allocated / max) * 100;
        if (percent > 100) return { status: 'overloaded', color: 'text-red-500', bg: 'bg-red-500' };
        if (percent > 85) return { status: 'high', color: 'text-amber-500', bg: 'bg-amber-500' };
        if (percent > 50) return { status: 'balanced', color: 'text-green-500', bg: 'bg-green-500' };
        return { status: 'underutilized', color: 'text-blue-500', bg: 'bg-blue-500' };
    };

    // Team summary stats
    const totalCapacity = teamMembers.reduce((sum, m) => sum + m.maxHours, 0);
    const totalAllocated = teamMembers.reduce((sum, m) => sum + m.hoursAllocated, 0);
    const overloadedCount = teamMembers.filter(m => m.hoursAllocated > m.maxHours).length;
    const underutilizedCount = teamMembers.filter(m => (m.hoursAllocated / m.maxHours) < 0.5).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                            <Users className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{teamMembers.length}</div>
                            <div className="text-sm text-muted-foreground">Team Members</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">
                                {Math.round((totalAllocated / totalCapacity) * 100)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Team Utilization</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{overloadedCount}</div>
                            <div className="text-sm text-muted-foreground">Overloaded</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{totalCapacity - totalAllocated}h</div>
                            <div className="text-sm text-muted-foreground">Available</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Team Workload */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Team Capacity</CardTitle>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500" /> Balanced
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-amber-500" /> High
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500" /> Overloaded
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {teamMembers.map((member) => {
                        const utilization = getUtilizationStatus(member.hoursAllocated, member.maxHours);
                        const percent = Math.min((member.hoursAllocated / member.maxHours) * 100, 100);

                        return (
                            <div key={member.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-medium">{member.name}</div>
                                            <div className="text-sm text-muted-foreground">{member.role}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-semibold ${utilization.color}`}>
                                            {member.hoursAllocated}h / {member.maxHours}h
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {member.tasksAssigned} tasks
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${utilization.bg}`}
                                        style={{ width: `${percent}%` }}
                                    />
                                    {member.hoursAllocated > member.maxHours && (
                                        <div
                                            className="absolute top-0 h-full bg-red-600 opacity-50"
                                            style={{
                                                left: '100%',
                                                width: `${((member.hoursAllocated - member.maxHours) / member.maxHours) * 100}%`,
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Task Pills */}
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {member.tasks.slice(0, 4).map((task) => (
                                        <Badge
                                            key={task.id}
                                            variant="secondary"
                                            className={`text-xs ${PRIORITY_COLORS[task.priority]}`}
                                        >
                                            {task.title} ({task.estimatedHours}h)
                                        </Badge>
                                    ))}
                                    {member.tasks.length > 4 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{member.tasks.length - 4} more
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
}

export default WorkloadView;
