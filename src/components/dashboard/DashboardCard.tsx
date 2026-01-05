'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface DashboardCardProps {
    title?: string;
    subtitle?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
}

export function DashboardCard({
    title,
    subtitle,
    action,
    children,
    className,
    noPadding = false,
}: DashboardCardProps) {
    return (
        <div
            className={cn(
                'bg-[#111827] border border-[#1F2937] rounded-xl overflow-hidden',
                className
            )}
        >
            {(title || action) && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F2937]">
                    <div>
                        {title && (
                            <h3 className="text-base font-semibold text-white">{title}</h3>
                        )}
                        {subtitle && (
                            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                        )}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={noPadding ? '' : 'p-5'}>{children}</div>
        </div>
    );
}

export default DashboardCard;
