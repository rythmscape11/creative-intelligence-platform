'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/integrations to /agency/integrations
 */
export default function IntegrationsRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/integrations');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Integrations...</p>
            </div>
        </div>
    );
}
