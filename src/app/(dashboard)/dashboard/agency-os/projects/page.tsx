'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/agency-os/projects to /agency/projects
 */
export default function ProjectsRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/agency/projects');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Projects...</p>
            </div>
        </div>
    );
}
