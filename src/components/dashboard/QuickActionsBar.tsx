'use client';

import Link from 'next/link';
import {
    PlusIcon,
    WrenchScrewdriverIcon,
    DocumentTextIcon,
    ChartBarIcon,
    UserGroupIcon,
    ArrowDownTrayIcon,
    SparklesIcon,
    PresentationChartBarIcon
} from '@heroicons/react/24/outline';

interface QuickAction {
    id: string;
    label: string;
    description: string;
    icon: React.ElementType;
    href: string;
    color: string;
    primary?: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
    {
        id: 'new-strategy',
        label: 'New Strategy',
        description: 'Create AI-powered strategy',
        icon: SparklesIcon,
        href: '/dashboard/strategies/create',
        color: 'bg-blue-500 hover:bg-blue-600',
        primary: true,
    },
    {
        id: 'tools',
        label: 'AI Tools',
        description: 'Access 50+ marketing tools',
        icon: WrenchScrewdriverIcon,
        href: '/tools',
        color: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30',
    },
    {
        id: 'reports',
        label: 'View Reports',
        description: 'See analytics & exports',
        icon: ChartBarIcon,
        href: '/dashboard/analytics',
        color: 'bg-green-500/20 text-green-400 hover:bg-green-500/30',
    },
    {
        id: 'exports',
        label: 'Exports',
        description: 'Download documents',
        icon: ArrowDownTrayIcon,
        href: '/dashboard/exports',
        color: 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30',
    },
    {
        id: 'strategies',
        label: 'My Strategies',
        description: 'View saved strategies',
        icon: DocumentTextIcon,
        href: '/dashboard/strategies',
        color: 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30',
    },
    {
        id: 'team',
        label: 'Team',
        description: 'Manage team members',
        icon: UserGroupIcon,
        href: '/dashboard/team',
        color: 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30',
    },
];

interface QuickActionsBarProps {
    variant?: 'full' | 'compact';
    className?: string;
}

export function QuickActionsBar({ variant = 'full', className = '' }: QuickActionsBarProps) {
    if (variant === 'compact') {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                {QUICK_ACTIONS.slice(0, 4).map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.id}
                            href={action.href}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${action.primary
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-bg-tertiary text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                                }`}
                            title={action.description}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="text-sm font-medium hidden lg:inline">{action.label}</span>
                        </Link>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 ${className}`}>
            {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                    <Link
                        key={action.id}
                        href={action.href}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${action.primary
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-600 hover:shadow-lg hover:shadow-blue-500/25'
                                : 'bg-bg-secondary border-border-primary hover:border-border-secondary hover:shadow-lg'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.primary ? 'bg-white/20' : action.color
                            }`}>
                            <Icon className={`h-6 w-6 ${action.primary ? '' : ''}`} />
                        </div>
                        <div className="text-center">
                            <p className={`font-medium ${action.primary ? 'text-white' : 'text-text-primary'}`}>
                                {action.label}
                            </p>
                            <p className={`text-xs mt-0.5 ${action.primary ? 'text-white/70' : 'text-text-secondary'}`}>
                                {action.description}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

interface QuickActionCardProps {
    action: QuickAction;
}

export function QuickActionCard({ action }: QuickActionCardProps) {
    const Icon = action.icon;

    return (
        <Link
            href={action.href}
            className="group flex items-center gap-4 p-4 bg-bg-secondary border border-border-primary rounded-xl hover:border-border-secondary hover:shadow-lg transition-all"
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
                <p className="font-medium text-text-primary group-hover:text-accent-highlight transition-colors">
                    {action.label}
                </p>
                <p className="text-sm text-text-secondary">{action.description}</p>
            </div>
            <PlusIcon className="h-5 w-5 text-text-tertiary group-hover:text-accent-highlight transition-colors" />
        </Link>
    );
}

export default QuickActionsBar;
