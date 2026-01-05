'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/analytics to /agency/analytics
 */
export default function AnalyticsRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/analytics');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Analytics...</p>
            </div>
        </div>
    );
}
