'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type TileCategory = 'revenue' | 'leads' | 'engagement' | 'strategies' | 'blog' | 'default';

export interface DashboardTileProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  href?: string;
  loading?: boolean;
  error?: string;
  subtitle?: string;
  className?: string;
  category?: TileCategory;
}

// Category color mappings
const categoryColors = {
  revenue: {
    border: 'border-zinc-500/30',
    hoverBorder: 'hover:border-zinc-500/60',
    iconBg: 'bg-zinc-500/10',
    iconColor: 'text-zinc-500',
    gradient: 'from-zinc-500/5 to-transparent',
  },
  leads: {
    border: 'border-[#3B82F6]/30',
    hoverBorder: 'hover:border-[#3B82F6]/60',
    iconBg: 'bg-[#3B82F6]/10',
    iconColor: 'text-[#3B82F6]',
    gradient: 'from-[#3B82F6]/5 to-transparent',
  },
  engagement: {
    border: 'border-[#10B981]/30',
    hoverBorder: 'hover:border-[#10B981]/60',
    iconBg: 'bg-[#10B981]/10',
    iconColor: 'text-[#10B981]',
    gradient: 'from-[#10B981]/5 to-transparent',
  },
  strategies: {
    border: 'border-[#8B5CF6]/30',
    hoverBorder: 'hover:border-[#8B5CF6]/60',
    iconBg: 'bg-[#8B5CF6]/10',
    iconColor: 'text-[#8B5CF6]',
    gradient: 'from-[#8B5CF6]/5 to-transparent',
  },
  blog: {
    border: 'border-zinc-500/30',
    hoverBorder: 'hover:border-zinc-500/60',
    iconBg: 'bg-zinc-500/10',
    iconColor: 'text-zinc-500',
    gradient: 'from-zinc-500/5 to-transparent',
  },
  default: {
    border: 'border-gray-200 dark:border-[#2A2A2A]',
    hoverBorder: 'hover:border-zinc-500 dark:hover:border-zinc-500/50',
    iconBg: 'bg-gray-100 dark:bg-[#1A1A1A]',
    iconColor: 'text-zinc-600 dark:text-zinc-400',
    gradient: 'from-transparent to-transparent',
  },
};

export function DashboardTile({
  title,
  value,
  icon,
  trend,
  href,
  loading,
  error,
  subtitle,
  className = '',
  category = 'default',
}: DashboardTileProps) {
  const colors = categoryColors[category];

  const content = (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${colors.border} ${colors.hoverBorder} bg-gradient-to-br ${colors.gradient} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-[#A0A0A0]">
          {title}
        </CardTitle>
        <div className={`h-8 w-8 rounded-lg ${colors.iconBg} flex items-center justify-center ${colors.iconColor}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-zinc-400" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        ) : (
          <>
            <div className="text-2xl font-bold text-gray-900 dark:text-[#FFFFFF] mb-1">
              {value}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-[#707070] mb-2">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                {trend.isPositive !== false ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600 dark:text-[#10B981]" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600 dark:text-[#EF4444]" />
                )}
                <span className={trend.isPositive !== false ? 'text-green-600 dark:text-[#10B981]' : 'text-red-600 dark:text-[#EF4444]'}>
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
                <span className="text-gray-500 dark:text-[#707070]">{trend.label}</span>
              </div>
            )}
          </>
        )}
      </CardContent>
      {href && !loading && !error && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <TrendingUp className="h-4 w-4 text-blue-600 dark:text-zinc-400" />
        </div>
      )}
    </Card>
  );

  if (href && !loading && !error) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    );
  }

  return content;
}

// Skeleton loader for dashboard tiles
export function DashboardTileSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-[#1A1A1A] rounded"></div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-[#1A1A1A] rounded-lg"></div>
      </CardHeader>
      <CardContent>
        <div className="h-8 w-20 bg-gray-200 dark:bg-[#1A1A1A] rounded mb-2"></div>
        <div className="h-3 w-32 bg-gray-200 dark:bg-[#1A1A1A] rounded"></div>
      </CardContent>
    </Card>
  );
}

