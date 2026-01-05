'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency/assets to /agency/assets
 */
export default function AssetsRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/assets');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Assets...</p>
            </div>
        </div>
    );
}
