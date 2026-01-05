'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/time-tracker to /agency/time-tracker
 */
export default function TimeTrackerRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/time-tracker');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Time Tracker...</p>
            </div>
        </div>
    );
}
