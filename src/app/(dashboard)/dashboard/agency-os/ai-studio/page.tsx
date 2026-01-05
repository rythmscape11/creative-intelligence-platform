'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/ai-studio to /agency/ai-studio
 */
export default function AIStudioRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/ai-studio');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to AI Studio...</p>
            </div>
        </div>
    );
}
