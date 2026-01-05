'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Briefcase,
    Users,
    CheckSquare,
    GanttChartSquare,
    UserCheck,
    Timer,
    Calendar,
    Megaphone,
    MonitorPlay,
    FolderOpen,
    Sparkles,
    BarChart3,
    Zap,
    Globe,
    Plug,
    Palette,
    Settings,
    ArrowLeft,
    LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

const navSections = [
    {
        title: 'Overview',
        items: [
            { name: 'Dashboard', href: '/dashboard/agency-os', icon: LayoutDashboard },
        ],
    },
    {
        title: 'Core Management',
        items: [
            { name: 'Clients', href: '/dashboard/agency-os/clients', icon: Users },
            { name: 'Projects', href: '/dashboard/agency-os/projects', icon: Briefcase },
            { name: 'Tasks', href: '/dashboard/agency-os/tasks', icon: CheckSquare },
        ],
    },
    {
        title: 'Planning Tools',
        items: [
            { name: 'Gantt Chart', href: '/dashboard/agency-os/gantt', icon: GanttChartSquare },
            { name: 'Workload', href: '/dashboard/agency-os/workload', icon: UserCheck },
            { name: 'Time Tracker', href: '/dashboard/agency-os/time-tracker', icon: Timer },
            { name: 'Calendar', href: '/dashboard/agency-os/content-calendar', icon: Calendar },
        ],
    },
    {
        title: 'Marketing Tools',
        items: [
            { name: 'Campaigns', href: '/dashboard/agency-os/campaigns', icon: Megaphone },
            { name: 'Ads Manager', href: '/dashboard/agency-os/ads', icon: MonitorPlay },
            { name: 'Assets', href: '/dashboard/agency-os/assets', icon: FolderOpen },
        ],
    },
    {
        title: 'Intelligence',
        items: [
            { name: 'AI Studio', href: '/dashboard/agency-os/ai-studio', icon: Sparkles },
            { name: 'Analytics', href: '/dashboard/agency-os/analytics', icon: BarChart3 },
            { name: 'Automations', href: '/dashboard/agency-os/automations', icon: Zap },
        ],
    },
    {
        title: 'Configuration',
        items: [
            { name: 'Client Portal', href: '/dashboard/agency-os/portal', icon: Globe },
            { name: 'Integrations', href: '/dashboard/agency-os/integrations', icon: Plug },
            { name: 'Branding', href: '/dashboard/agency-os/branding', icon: Palette },
            { name: 'Settings', href: '/dashboard/agency-os/settings', icon: Settings },
        ],
    },
];

export function AgencyOSSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/dashboard/agency-os') return pathname === '/dashboard/agency-os';
        return pathname?.startsWith(href);
    };

    return (
        <div className="w-[220px] bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h2 className="mt-3 text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    Agency OS
                </h2>
            </div>

            {/* Navigation */}
            <nav className="p-3 space-y-6">
                {navSections.map((section) => (
                    <div key={section.title}>
                        <p className="px-2 mb-2 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                            {section.title}
                        </p>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                                            active
                                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                        )}
                                    >
                                        <item.icon className={cn('w-4 h-4', active ? 'text-indigo-600 dark:text-indigo-400' : '')} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    );
}

export default AgencyOSSidebar;
