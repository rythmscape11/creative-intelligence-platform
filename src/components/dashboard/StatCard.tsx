'use client';

import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        label?: string;
    };
    icon?: LucideIcon;
    className?: string;
}

export function StatCard({ title, value, change, icon: Icon, className }: StatCardProps) {
    const isPositive = change && change.value >= 0;

    return (
        <div
            className={cn(
                'bg-[#111827] border border-[#1F2937] rounded-xl p-5 hover:border-[#F1C40F]/30 transition-colors',
                className
            )}
        >
            <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-gray-400">{title}</p>
                {Icon && (
                    <div className="w-8 h-8 rounded-lg bg-[#F1C40F]/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#F1C40F]" />
                    </div>
                )}
            </div>

            <p className="text-3xl font-bold text-white mb-1">{value}</p>

            {change && (
                <div className="flex items-center gap-1.5">
                    {isPositive ? (
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                        className={cn(
                            'text-sm font-medium',
                            isPositive ? 'text-emerald-500' : 'text-red-500'
                        )}
                    >
                        {isPositive ? '+' : ''}
                        {change.value}%
                    </span>
                    {change.label && (
                        <span className="text-sm text-gray-500">{change.label}</span>
                    )}
                </div>
            )}
        </div>
    );
}

export default StatCard;
