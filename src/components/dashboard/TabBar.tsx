'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Tab {
    name: string;
    href: string;
    count?: number;
}

interface TabBarProps {
    tabs: Tab[];
    activeTab: string;
    className?: string;
}

export function TabBar({ tabs, activeTab, className }: TabBarProps) {
    return (
        <div className={cn('border-b border-[#1F2937]', className)}>
            <nav className="flex gap-1 -mb-px" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.href || activeTab === tab.name.toLowerCase();

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                                isActive
                                    ? 'border-[#F1C40F] text-white'
                                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                            )}
                        >
                            {tab.name}
                            {tab.count !== undefined && (
                                <span
                                    className={cn(
                                        'ml-2 px-2 py-0.5 rounded-full text-xs',
                                        isActive
                                            ? 'bg-[#F1C40F]/20 text-[#F1C40F]'
                                            : 'bg-gray-800 text-gray-400'
                                    )}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

export default TabBar;
