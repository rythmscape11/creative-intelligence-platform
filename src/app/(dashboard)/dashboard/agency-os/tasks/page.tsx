'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/tasks to /agency/tasks
 */
export default function TasksRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/tasks');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Tasks...</p>
            </div>
        </div>
    );
}
