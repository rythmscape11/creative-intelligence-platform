'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/settings to /agency/settings
 */
export default function SettingsRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/settings');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Settings...</p>
            </div>
        </div>
    );
}
