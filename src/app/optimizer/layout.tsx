'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    LayoutDashboard,
    Link2,
    Megaphone,
    Zap,
    Palette,
    FlaskConical,
    MessageSquare,
    FileBarChart,
    Settings,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    TrendingUp,
    Target,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/optimizer', icon: LayoutDashboard },
    { name: 'Connections', href: '/optimizer/connections', icon: Link2 },
    { name: 'Campaigns', href: '/optimizer/campaigns', icon: Megaphone },
    { name: 'Automations', href: '/optimizer/automations', icon: Zap },
    { name: 'Creative Intel', href: '/optimizer/creative-intel', icon: Palette },
    { name: 'Experiments', href: '/optimizer/experiments', icon: FlaskConical },
    { name: 'AI Copilot', href: '/optimizer/copilot', icon: MessageSquare },
    { name: 'Reports', href: '/optimizer/reports', icon: FileBarChart },
];

export default function OptimizerLayout({
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
                        <Link href="/optimizer" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-lg">The Optimiser</span>
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
                                            ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800',
                                        collapsed && 'justify-center'
                                    )}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {!collapsed && item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Quick Stats (when expanded) */}
                    {!collapsed && (
                        <div className="mt-8 mx-4 p-4 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 dark:border-indigo-800/50">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="h-4 w-4 text-indigo-500" />
                                <span className="text-sm font-medium">Today's Performance</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Spend</span>
                                    <span className="font-medium">$2,450</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">ROAS</span>
                                    <span className="font-medium text-green-600">3.2x</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Actions</span>
                                    <span className="font-medium">12</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Link */}
                    <div className="absolute bottom-4 left-0 right-0 px-2">
                        <Link
                            href="/optimizer/settings"
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
