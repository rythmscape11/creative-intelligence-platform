'use client';

import { useState, useEffect } from 'react';
import { AgencySidebar } from '@/components/agency/AgencySidebar';
import { NotificationBadge } from '@/components/agency/NotificationBadge';
import { Menu, Search, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserButton } from '@clerk/nextjs';
import { clsx } from 'clsx';
import '@/styles/agency-theme.css';

export default function AgencyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // Load collapsed state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('agency-sidebar-collapsed');
        if (saved !== null) {
            setCollapsed(saved === 'true');
        }
    }, []);

    // Command palette keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                // TODO: Open command palette
                console.log('Command palette triggered');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-[#0F172A]">
            {/* Agency Sidebar with new design */}
            <AgencySidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div className={clsx(
                "flex flex-col min-h-screen transition-all duration-300",
                collapsed ? "lg:pl-[68px]" : "lg:pl-[260px]"
            )}>
                {/* Agency OS styled header with teal accent */}
                <header className="sticky top-0 z-30 h-16 bg-[#1E293B]/95 backdrop-blur-md border-b border-[#334155] flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-700"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-teal-400 to-emerald-500"></div>
                            <div>
                                <h1 className="text-lg font-semibold text-white">Agency OS</h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Command Palette Trigger (desktop) */}
                        <button
                            className="hidden md:flex items-center gap-3 px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-slate-400 hover:text-white hover:border-teal-500/50 transition-all cursor-pointer"
                            onClick={() => console.log('Open command palette')}
                        >
                            <Search className="h-4 w-4" />
                            <span className="text-sm">Search...</span>
                            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#334155] rounded text-xs text-slate-400">
                                <Command className="h-3 w-3" />K
                            </kbd>
                        </button>

                        {/* Mobile search */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-slate-400 hover:text-white hover:bg-slate-700"
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        <NotificationBadge />

                        <div className="h-8 w-px bg-[#334155] hidden sm:block"></div>

                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "h-8 w-8 ring-2 ring-teal-500/20"
                                }
                            }}
                        />
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>

                {/* Footer */}
                <footer className="px-6 py-4 border-t border-[#334155] text-center text-xs text-slate-500">
                    <span>Agency OS</span>
                    <span className="mx-2">•</span>
                    <span>Part of Aureon One</span>
                </footer>
            </div>
        </div>
    );
}
