'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import {
    Home,
    BarChart3,
    Users,
    Settings,
    FileText,
    Shield,
    Zap,
    CreditCard,
    BookOpen,
    Sparkles,
    LogOut,
    Target,
    Newspaper,
    Mail,
    ArrowLeft,
    Megaphone,
    Plug,
    UserCog,
    User,
    ChevronRight
} from 'lucide-react';
import { useClerk } from '@clerk/nextjs';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    isCollapsed?: boolean;
    setIsCollapsed?: (collapsed: boolean) => void;
}

export function Sidebar({ className, isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const [navigation, setNavigation] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('USER');
    const { signOut } = useClerk();

    const handleSignOut = () => {
        signOut(() => {
            window.location.href = '/';
        });
    };

    useEffect(() => {
        async function fetchNavigation() {
            try {
                const res = await fetch('/api/navigation', {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setNavigation([...data.primary, ...data.secondary]);
                    if (data.role) setUserRole(data.role);
                }
            } catch (error) {
                console.error('Failed to fetch navigation:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchNavigation();
    }, []);

    const iconMap: Record<string, any> = {
        Home, BarChart3, Users, Settings, FileText, Shield, Zap, CreditCard,
        BookOpen, Sparkles, Target, Newspaper, Mail, ArrowLeft, Megaphone,
        Plug, UserCog, User, ChevronRight
    };

    return (
        <div className={cn("flex flex-col h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-800", className)}>
            {/* Logo/Brand */}
            <div className="flex-shrink-0 p-4 border-b border-slate-800">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">M</span>
                    </div>
                    {!isCollapsed && (
                        <span className="font-semibold text-white">MediaPlanPro</span>
                    )}
                </Link>
            </div>

            {/* Role Badge for Admins */}
            {userRole === 'ADMIN' && !isCollapsed && (
                <div className="px-4 py-2">
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                        Admin Mode
                    </span>
                </div>
            )}

            {/* Scrollable navigation */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-thin">
                <div className="px-3">
                    <div className="space-y-1">
                        {loading ? (
                            <div className="space-y-2 px-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-9 bg-slate-800/50 rounded-md animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            navigation.map((item, index) => {
                                // Handle divider/section label
                                if (item.name === 'divider') {
                                    if (isCollapsed) {
                                        return (
                                            <div key={`divider-${index}`} className="my-3 border-t border-slate-700" />
                                        );
                                    }
                                    return (
                                        <div key={`divider-${index}`} className="pt-4 pb-2">
                                            <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                                {item.label}
                                            </span>
                                        </div>
                                    );
                                }

                                const Icon = iconMap[item.icon] || Home;
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                                            isActive
                                                ? "bg-indigo-600/20 text-indigo-400 shadow-lg shadow-indigo-600/10"
                                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                                        )}
                                        <Icon className={cn(
                                            "h-4 w-4 transition-colors flex-shrink-0",
                                            isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                                        )} />
                                        {!isCollapsed && <span className="truncate">{item.name}</span>}
                                        {!isCollapsed && item.badge && (
                                            <span className={cn(
                                                "ml-auto text-[10px] px-1.5 py-0.5 rounded font-semibold",
                                                item.badge === 'Admin' ? "bg-amber-500/20 text-amber-400" :
                                                    item.badge === 'AI' ? "bg-purple-500/20 text-purple-400" :
                                                        item.badge === 'Beta' ? "bg-blue-500/20 text-blue-400" :
                                                            "bg-slate-700 text-slate-300"
                                            )}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Fixed sign-out at bottom */}
            <div className="flex-shrink-0 p-3 border-t border-slate-800 bg-slate-900/50">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm",
                        isCollapsed && "justify-center px-2"
                    )}
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4" />
                    {!isCollapsed && <span>Sign Out</span>}
                </Button>
            </div>
        </div>
    );
}

