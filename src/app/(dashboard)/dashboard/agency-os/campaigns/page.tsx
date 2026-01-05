'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/campaigns to /agency/campaigns
 */
export default function CampaignsRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/campaigns');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Campaigns...</p>
            </div>
        </div>
    );
}
