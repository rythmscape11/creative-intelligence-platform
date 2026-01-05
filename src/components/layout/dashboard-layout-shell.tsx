'use client';

import { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { cn } from '@/lib/utils';

export default function DashboardLayoutShell({
    children,
}: {
    children: React.ReactNode;
}) {
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
            {/* Unified Aureon One Dashboard Sidebar */}
            <DashboardSidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div
                className={cn(
                    'flex flex-col min-h-screen transition-all duration-300',
                    collapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
                )}
            >
                {/* Header */}
                <DashboardHeader
                    title="Overview"
                    subtitle="Your Aureon One command center"
                    onMenuClick={() => setMobileOpen(true)}
                />

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
