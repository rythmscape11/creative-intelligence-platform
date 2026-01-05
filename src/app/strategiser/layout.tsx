'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    LayoutDashboard,
    FileText,
    Sparkles,
    Target,
    Users,
    BarChart3,
    MessageSquare,
    Settings,
    ChevronLeft,
    ChevronRight,
    Lightbulb,
    Layers,
    PieChart,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/strategiser', icon: LayoutDashboard },
    { name: 'My Strategies', href: '/strategiser/strategies', icon: FileText },
    { name: 'Create Strategy', href: '/strategiser/create', icon: Sparkles, badge: 'AI' },
    { name: 'Templates', href: '/strategiser/templates', icon: Layers },
    { name: 'AI Copilot', href: '/strategiser/copilot', icon: MessageSquare },
    { name: 'Personas', href: '/strategiser/personas', icon: Users },
    { name: 'Insights', href: '/strategiser/insights', icon: Lightbulb },
    { name: 'Channel Mix', href: '/strategiser/channel-mix', icon: PieChart },
    { name: 'Reports', href: '/strategiser/reports', icon: BarChart3 },
];

export default function StrategiserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 z-40 h-screen transition-all duration-300 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900',
                    collapsed ? 'w-16' : 'w-64'
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
                    {!collapsed && (
                        <Link href="/strategiser" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <Target className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-lg">The Strategiser</span>
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className="ml-auto"
                    >
                        {collapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {/* Navigation */}
                <ScrollArea className="h-[calc(100vh-4rem)] py-4">
                    <nav className="space-y-1 px-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400'
                                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800',
                                        collapsed && 'justify-center'
                                    )}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {!collapsed && item.name}
                                    {!collapsed && item.badge && (
                                        <span className="ml-auto text-[10px] bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded font-medium">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Quick Stats */}
                    {!collapsed && (
                        <div className="mt-8 mx-4 p-4 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/50">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="h-4 w-4 text-violet-500" />
                                <span className="text-sm font-medium">AI Credits</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Used</span>
                                    <span className="font-medium">24/100</span>
                                </div>
                                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                    <div className="bg-violet-500 h-2 rounded-full" style={{ width: '24%' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Link */}
                    <div className="absolute bottom-4 left-0 right-0 px-2">
                        <Link
                            href="/strategiser/settings"
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors',
                                collapsed && 'justify-center'
                            )}
                        >
                            <Settings className="h-5 w-5" />
                            {!collapsed && 'Settings'}
                        </Link>
                    </div>
                </ScrollArea>
            </aside>

            {/* Main Content */}
            <main
                className={cn(
                    'transition-all duration-300',
                    collapsed ? 'ml-16' : 'ml-64'
                )}
            >
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
