'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency to /agency
 * The Agency dashboard lives under /agency, not /dashboard/agency
 */
export default function AgencyRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Agency dashboard...</p>
            </div>
        </div>
    );
}
