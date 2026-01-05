'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/content-calendar to /agency/content-calendar
 */
export default function ContentCalendarRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/content-calendar');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Content Calendar...</p>
            </div>
        </div>
    );
}
