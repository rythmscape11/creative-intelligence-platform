'use client';

export function AgencyCardSkeleton() {
    return (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
                <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-700 rounded" />
            </div>
            <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
            <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-800 rounded" />
        </div>
    );
}

export function AgencyListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <AgencyCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function AgencyTableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-900 rounded-lg animate-pulse" />
            ))}
        </div>
    );
}
