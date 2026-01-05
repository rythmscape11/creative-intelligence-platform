'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/gantt to /agency/gantt
 */
export default function GanttRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/gantt');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Gantt Chart...</p>
            </div>
        </div>
    );
}
