'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    breadcrumb?: string;
    showSearch?: boolean;
}

export function DashboardLayout({
    children,
    title,
    subtitle,
    breadcrumb,
    showSearch = true,
}: DashboardLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // Load collapsed state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('dashboard-sidebar-collapsed');
        if (saved !== null) {
            setCollapsed(saved === 'true');
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#050709]">
            {/* Sidebar */}
            <DashboardSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Main content area */}
            <div
                className={cn(
                    'flex flex-col min-h-screen transition-all duration-300',
                    collapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
                )}
            >
                {/* Header */}
                <DashboardHeader
                    title={title}
                    subtitle={subtitle}
                    breadcrumb={breadcrumb}
                    onMenuClick={() => setMobileOpen(true)}
                    showSearch={showSearch}
                />

                {/* Page content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
