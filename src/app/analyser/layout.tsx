'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Globe,
    Search,
    BarChart3,
    Link2,
    FileText,
    Users,
    ClipboardList,
    Bot,
    Settings,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
    { name: 'Overview', href: '/analyser', icon: LayoutDashboard },
    { name: 'Domains', href: '/analyser/domains', icon: Globe },
    { name: 'Keywords', href: '/analyser/keywords', icon: Search },
    { name: 'Traffic', href: '/analyser/traffic', icon: BarChart3 },
    { name: 'Backlinks', href: '/analyser/backlinks', icon: Link2 },
    { name: 'Pages', href: '/analyser/pages', icon: FileText },
    { name: 'Competitors', href: '/analyser/competitors', icon: Users },
    { name: 'Site Audit', href: '/analyser/audit', icon: Shield },
    { name: 'Reports', href: '/analyser/reports', icon: ClipboardList },
    { name: 'AI Copilot', href: '/analyser/copilot', icon: Bot },
    { name: 'Settings', href: '/analyser/settings', icon: Settings },
];

export default function AnalyserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside
                className={cn(
                    'flex flex-col border-r bg-card transition-all duration-300',
                    collapsed ? 'w-16' : 'w-64'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    {!collapsed && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-sm">The Analyser</h2>
                                <p className="text-xs text-muted-foreground">SEO Intelligence</p>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className="h-8 w-8"
                    >
                        {collapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/analyser' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                    collapsed && 'justify-center'
                                )}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Quick Stats */}
                {!collapsed && (
                    <div className="p-4 border-t">
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                            Quick Stats
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Domains</span>
                                <span className="font-medium">5</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Keywords</span>
                                <span className="font-medium">2,450</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Backlinks</span>
                                <span className="font-medium">12.4K</span>
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    );
}
