'use client';

import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserButton } from '@clerk/nextjs';

interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumb?: string;
    onMenuClick?: () => void;
    showSearch?: boolean;
}

export function DashboardHeader({
    title,
    subtitle,
    breadcrumb,
    onMenuClick,
    showSearch = true,
}: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-30 h-16 bg-[#0B0C10] border-b border-white/5 flex items-center justify-between px-4 md:px-6">
            {/* Left section */}
            <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-gray-400 hover:text-white hover:bg-white/5"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Page title and breadcrumb */}
                <div>
                    {breadcrumb && (
                        <p className="text-xs text-gray-500 mb-0.5">{breadcrumb}</p>
                    )}
                    <h1 className="text-lg font-semibold text-white">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-gray-400 hidden md:block">{subtitle}</p>
                    )}
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
                {/* Search bar (desktop) */}
                {showSearch && (
                    <div className="hidden md:flex relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search clients, campaigns, tasks..."
                            className="w-64 pl-10 bg-[#111827] border-[#1F2937] text-white placeholder:text-gray-500 focus:border-[#F1C40F]/50 focus:ring-[#F1C40F]/20"
                        />
                    </div>
                )}

                {/* Notifications */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-white/5 relative"
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#B3001B] rounded-full" />
                </Button>

                {/* User button (hidden on mobile, shown in sidebar) */}
                <div className="hidden lg:block">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </header>
    );
}

export default DashboardHeader;
