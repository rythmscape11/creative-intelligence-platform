'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/workload to /agency/workload
 */
export default function WorkloadRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/workload');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Workload...</p>
            </div>
        </div>
    );
}
