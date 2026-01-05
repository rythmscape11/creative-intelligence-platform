'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/portal to /agency/portal
 */
export default function PortalRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/portal');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Client Portal...</p>
            </div>
        </div>
    );
}
