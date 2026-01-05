'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Users,
    FolderKanban,
    CheckCircle2,
    DollarSign,
    BarChart3,
    Calendar,
    List,
    Plus
} from 'lucide-react';
import { useToolAccess } from '@/hooks/use-tool-access';

// Simple KPI Card component (adapted from shadcn-admin)
function KPICard({
    title,
    value,
    change,
    icon: Icon
}: {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType
}) {
    return (
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
                <Icon className="h-4 w-4 text-text-secondary" />
            </div>
            <div className="mt-2">
                <div className="text-2xl font-bold text-text-primary">{value}</div>
                <p className="text-xs text-emerald-500">{change}</p>
            </div>
        </div>
    );
}

// Tab component
function TabButton({
    active,
    onClick,
    children
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${active
                    ? 'bg-emerald-500 text-white'
                    : 'text-text-secondary hover:bg-bg-tertiary'
                }`}
        >
            {children}
        </button>
    );
}

// Overview Chart (simplified)
function OverviewChart() {
    const data = [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 5000 },
        { name: 'Apr', value: 4500 },
        { name: 'May', value: 6000 },
        { name: 'Jun', value: 5500 },
    ];

    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="h-[200px] flex items-end gap-2">
            {data.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                        className="w-full bg-emerald-500 rounded-t"
                        style={{ height: `${(item.value / maxValue) * 150}px` }}
                    />
                    <span className="text-xs text-text-secondary">{item.name}</span>
                </div>
            ))}
        </div>
    );
}

// Recent Projects Component
function RecentProjects() {
    const projects = [
        { name: 'Brand Campaign Q1', client: 'Acme Corp', status: 'In Progress', budget: '$12,000' },
        { name: 'Social Media Revamp', client: 'TechStart', status: 'Review', budget: '$8,500' },
        { name: 'Product Launch', client: 'GreenLife', status: 'Completed', budget: '$25,000' },
        { name: 'SEO Optimization', client: 'LocalBiz', status: 'In Progress', budget: '$5,000' },
    ];

    return (
        <div className="space-y-4">
            {projects.map((project, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border-primary last:border-0">
                    <div>
                        <p className="font-medium text-text-primary">{project.name}</p>
                        <p className="text-sm text-text-secondary">{project.client}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-text-primary">{project.budget}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'Completed'
                                ? 'bg-green-500/20 text-green-400'
                                : project.status === 'Review'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-blue-500/20 text-blue-400'
                            }`}>
                            {project.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AgencyDashboard() {
    const { userPlan, isAdmin } = useToolAccess();
    const hasAgencyAccess = ['AGENCY', 'TEAM', 'ENTERPRISE'].includes(userPlan || '') || isAdmin;
    const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');

    // Non-agency users see upgrade prompt
    if (!hasAgencyAccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-bg-secondary border border-border-primary rounded-lg p-8 text-center">
                    <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FolderKanban className="h-10 w-10 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary mb-4">Agency OS</h1>
                    <p className="text-lg text-text-secondary mb-8">
                        A stable, structured operating system for modern marketing agencies
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                        {[
                            'Client workspaces',
                            'Campaign projects',
                            'Deliverable tracking',
                            'Time & budget tracking',
                            'Kanban & list views',
                            'Activity audit logs'
                        ].map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-text-secondary">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                {feature}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/dashboard"
                            className="px-6 py-3 border border-border-primary bg-bg-tertiary rounded-lg text-text-primary hover:bg-bg-hover transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                        <Link
                            href="/pricing"
                            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                            Upgrade to Agency
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Agency Dashboard</h1>
                    <p className="text-text-secondary">Welcome back! Here's your agency overview.</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/agency/tasks"
                        className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors"
                    >
                        <List className="h-4 w-4" />
                        Tasks
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                        <Plus className="h-4 w-4" />
                        New Project
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
                    Overview
                </TabButton>
                <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
                    Analytics
                </TabButton>
            </div>

            {activeTab === 'overview' && (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <KPICard
                            title="Total Revenue"
                            value="$45,231"
                            change="+20.1% from last month"
                            icon={DollarSign}
                        />
                        <KPICard
                            title="Active Clients"
                            value="12"
                            change="+2 new this month"
                            icon={Users}
                        />
                        <KPICard
                            title="Active Projects"
                            value="24"
                            change="+5 from last month"
                            icon={FolderKanban}
                        />
                        <KPICard
                            title="Completed Tasks"
                            value="156"
                            change="+32 this week"
                            icon={CheckCircle2}
                        />
                    </div>

                    {/* Charts and Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                        {/* Overview Chart */}
                        <div className="lg:col-span-4 rounded-lg border border-border-primary bg-bg-secondary p-6">
                            <h3 className="font-semibold text-text-primary mb-4">Revenue Overview</h3>
                            <OverviewChart />
                        </div>

                        {/* Recent Projects */}
                        <div className="lg:col-span-3 rounded-lg border border-border-primary bg-bg-secondary p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-text-primary">Recent Projects</h3>
                                <Link href="/agency/projects" className="text-sm text-emerald-500 hover:underline">
                                    View all
                                </Link>
                            </div>
                            <RecentProjects />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href="/agency/clients"
                            className="flex items-center gap-3 p-4 rounded-lg border border-border-primary bg-bg-secondary hover:bg-bg-tertiary transition-colors"
                        >
                            <Users className="h-5 w-5 text-blue-400" />
                            <span className="text-text-primary">Manage Clients</span>
                        </Link>
                        <Link
                            href="/agency/projects"
                            className="flex items-center gap-3 p-4 rounded-lg border border-border-primary bg-bg-secondary hover:bg-bg-tertiary transition-colors"
                        >
                            <FolderKanban className="h-5 w-5 text-purple-400" />
                            <span className="text-text-primary">All Projects</span>
                        </Link>
                        <Link
                            href="/agency/tasks"
                            className="flex items-center gap-3 p-4 rounded-lg border border-border-primary bg-bg-secondary hover:bg-bg-tertiary transition-colors"
                        >
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            <span className="text-text-primary">Task Board</span>
                        </Link>
                        <Link
                            href="/agency/calendar"
                            className="flex items-center gap-3 p-4 rounded-lg border border-border-primary bg-bg-secondary hover:bg-bg-tertiary transition-colors"
                        >
                            <Calendar className="h-5 w-5 text-orange-400" />
                            <span className="text-text-primary">Calendar</span>
                        </Link>
                    </div>
                </>
            )}

            {activeTab === 'analytics' && (
                <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className="h-6 w-6 text-emerald-400" />
                        <h3 className="font-semibold text-text-primary">Analytics</h3>
                    </div>
                    <p className="text-text-secondary mb-4">
                        Detailed analytics and reporting coming soon. Track project performance,
                        client satisfaction, and team productivity.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-bg-tertiary">
                            <p className="text-sm text-text-secondary">Avg. Project Duration</p>
                            <p className="text-xl font-bold text-text-primary">23 days</p>
                        </div>
                        <div className="p-4 rounded-lg bg-bg-tertiary">
                            <p className="text-sm text-text-secondary">Client Retention</p>
                            <p className="text-xl font-bold text-text-primary">94%</p>
                        </div>
                        <div className="p-4 rounded-lg bg-bg-tertiary">
                            <p className="text-sm text-text-secondary">On-Time Delivery</p>
                            <p className="text-xl font-bold text-text-primary">87%</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
