'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Sparkles,
    Settings,
    X,
    BarChart3,
    Megaphone,
    CalendarDays,
    FolderOpen,
    MonitorPlay,
    CheckSquare,
    Timer,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    GanttChartSquare,
    UserCheck,
    Zap,
    Plug,
    Globe,
    ArrowLeft,
    Palette,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';

// Navigation organized into groups
const navGroups = [
    {
        id: 'overview',
        name: 'Overview',
        items: [
            { name: 'Dashboard', href: '/agency', icon: LayoutDashboard },
        ]
    },
    {
        id: 'clients',
        name: 'Client Management',
        items: [
            { name: 'Clients', href: '/agency/clients', icon: Users },
            { name: 'Projects', href: '/agency/projects', icon: Briefcase },
        ]
    },
    {
        id: 'work',
        name: 'Work Management',
        items: [
            { name: 'Tasks', href: '/agency/tasks', icon: CheckSquare },
            { name: 'Gantt Chart', href: '/agency/gantt', icon: GanttChartSquare },
            { name: 'Workload', href: '/agency/workload', icon: UserCheck },
            { name: 'Time Tracker', href: '/agency/time-tracker', icon: Timer },
        ]
    },
    {
        id: 'content',
        name: 'Content & Marketing',
        items: [
            { name: 'Calendar', href: '/agency/content-calendar', icon: CalendarDays },
            { name: 'Assets', href: '/agency/assets', icon: FolderOpen },
            { name: 'Campaigns', href: '/agency/campaigns', icon: Megaphone },
            { name: 'Ads Manager', href: '/agency/ads', icon: MonitorPlay },
        ]
    },
    {
        id: 'intelligence',
        name: 'Intelligence',
        items: [
            { name: 'AI Studio', href: '/agency/ai-studio', icon: Sparkles },
            { name: 'Analytics', href: '/agency/analytics', icon: BarChart3 },
            { name: 'Automations', href: '/agency/automations', icon: Zap },
        ]
    },
    {
        id: 'settings',
        name: 'Configuration',
        items: [
            { name: 'Client Portal', href: '/agency/portal', icon: Globe },
            { name: 'Integrations', href: '/agency/integrations', icon: Plug },
            { name: 'Branding', href: '/agency/branding', icon: Palette },
            { name: 'Settings', href: '/agency/settings', icon: Settings },
        ]
    },
];

interface AgencySidebarProps {
    mobileOpen?: boolean;
    setMobileOpen?: (open: boolean) => void;
    collapsed?: boolean;
    setCollapsed?: (collapsed: boolean) => void;
}

export function AgencySidebar({
    mobileOpen,
    setMobileOpen,
    collapsed: externalCollapsed,
    setCollapsed: externalSetCollapsed
}: AgencySidebarProps) {
    const pathname = usePathname();
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['overview', 'clients', 'work', 'content', 'intelligence', 'settings']));

    // Use external state if provided, otherwise use internal
    const collapsed = externalCollapsed ?? internalCollapsed;
    const setCollapsed = externalSetCollapsed ?? setInternalCollapsed;

    // Load collapsed state from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('agency-sidebar-collapsed');
        if (saved !== null) {
            setInternalCollapsed(saved === 'true');
        }
    }, []);

    // Save to localStorage when collapsed changes
    const handleToggleCollapse = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem('agency-sidebar-collapsed', String(newState));
    };

    const toggleGroup = (groupId: string) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupId)) {
            newExpanded.delete(groupId);
        } else {
            newExpanded.add(groupId);
        }
        setExpandedGroups(newExpanded);
    };

    const isActive = (href: string) => {
        if (href === '/agency') return pathname === '/agency';
        return pathname?.startsWith(href);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen?.(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed top-0 left-0 z-50 h-screen text-white transition-all duration-300 lg:translate-x-0 lg:fixed flex flex-col",
                "bg-[#1E293B] border-r border-[#334155]",
                collapsed ? "w-[68px]" : "w-[260px]",
                mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Header */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-[#334155] shrink-0">
                    <Link href="/agency" className={clsx(
                        "flex items-center gap-2 font-bold text-xl tracking-tight transition-opacity",
                        collapsed && "lg:opacity-0 lg:w-0"
                    )}>
                        <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                            Agency
                        </span>
                        <span className="text-white">OS</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-700"
                        onClick={() => setMobileOpen?.(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Back to Dashboard Link */}
                <div className="px-3 pt-4 pb-2">
                    <Link
                        href="/dashboard"
                        className={clsx(
                            "flex items-center gap-3 rounded-lg text-sm font-medium transition-all px-3 py-2.5",
                            "text-slate-400 hover:text-white hover:bg-[#334155] border border-[#334155] bg-[#0F172A]",
                            collapsed && "justify-center px-2"
                        )}
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>Back to Dashboard</span>}
                    </Link>
                </div>

                {/* Navigation - Scrollable middle section */}
                <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                    {navGroups.map((group) => {
                        const isGroupExpanded = expandedGroups.has(group.id);
                        const hasActiveItem = group.items.some(item => isActive(item.href));

                        return (
                            <div key={group.id} className="mb-1">
                                {/* Group Header - Only show if not collapsed */}
                                {!collapsed && group.id !== 'overview' && (
                                    <button
                                        onClick={() => toggleGroup(group.id)}
                                        className={clsx(
                                            "w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors rounded-md",
                                            hasActiveItem ? "text-teal-400" : "text-slate-500 hover:text-slate-300"
                                        )}
                                    >
                                        <span>{group.name}</span>
                                        <ChevronDown className={clsx(
                                            "h-3 w-3 transition-transform duration-200",
                                            !isGroupExpanded && "-rotate-90"
                                        )} />
                                    </button>
                                )}

                                {/* Group Items */}
                                <div className={clsx(
                                    "space-y-0.5",
                                    !collapsed && group.id !== 'overview' && !isGroupExpanded && "hidden"
                                )}>
                                    {group.items.map((item) => {
                                        const active = isActive(item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={clsx(
                                                    "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
                                                    collapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5",
                                                    active
                                                        ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-900/30"
                                                        : "text-slate-400 hover:text-white hover:bg-[#334155]"
                                                )}
                                                title={collapsed ? item.name : undefined}
                                            >
                                                <item.icon className={clsx(
                                                    "h-[18px] w-[18px] shrink-0 transition-colors",
                                                    active ? "text-white" : "text-slate-500"
                                                )} />
                                                {!collapsed && <span>{item.name}</span>}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Collapse Toggle - Desktop only */}
                <div className="hidden lg:flex shrink-0 p-3 border-t border-[#334155]">
                    <button
                        onClick={handleToggleCollapse}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors"
                        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <>
                                <ChevronLeft className="h-5 w-5" />
                                <span className="text-sm">Collapse</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Footer - Fixed at bottom, inside the sidebar */}
                {!collapsed && (
                    <div className="shrink-0 p-3 border-t border-[#334155]">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-teal-900/30 to-emerald-900/20 border border-teal-800/30 text-xs">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                <p className="font-semibold text-slate-200">Agency Pro</p>
                            </div>
                            <p className="text-slate-400">Full Access Active</p>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}

export default AgencySidebar;
