'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/automations to /agency/automations
 */
export default function AutomationsRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/automations');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Automations...</p>
            </div>
        </div>
    );
}
