'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/ads to /agency/ads
 */
export default function AdsRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/ads');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Ads Manager...</p>
            </div>
        </div>
    );
}
