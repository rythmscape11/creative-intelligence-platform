'use client';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    {
        variants: {
            variant: {
                default: 'bg-gray-800 text-gray-300',
                success: 'bg-emerald-500/20 text-emerald-400',
                warning: 'bg-amber-500/20 text-amber-400',
                error: 'bg-red-500/20 text-red-400',
                info: 'bg-blue-500/20 text-blue-400',
                gold: 'bg-[#F1C40F]/20 text-[#F1C40F]',
                draft: 'bg-gray-700 text-gray-400',
                active: 'bg-emerald-500/20 text-emerald-400',
                paused: 'bg-amber-500/20 text-amber-400',
                completed: 'bg-blue-500/20 text-blue-400',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
    children: React.ReactNode;
    className?: string;
}

export function StatusBadge({ children, variant, className }: StatusBadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant }), className)}>
            {children}
        </span>
    );
}

// Convenience component for common status patterns
interface StatusChipProps {
    status: string;
    className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
    const statusLower = status.toLowerCase();

    let variant: StatusBadgeProps['variant'] = 'default';

    if (['active', 'live', 'running', 'in progress'].includes(statusLower)) {
        variant = 'active';
    } else if (['completed', 'done', 'finished'].includes(statusLower)) {
        variant = 'completed';
    } else if (['paused', 'on hold', 'pending'].includes(statusLower)) {
        variant = 'paused';
    } else if (['draft', 'new'].includes(statusLower)) {
        variant = 'draft';
    } else if (['error', 'failed', 'rejected'].includes(statusLower)) {
        variant = 'error';
    } else if (['warning', 'review'].includes(statusLower)) {
        variant = 'warning';
    }

    return (
        <StatusBadge variant={variant} className={className}>
            {status}
        </StatusBadge>
    );
}

export default StatusBadge;
