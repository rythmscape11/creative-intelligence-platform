'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/admin/billing to /dashboard/billing
 * Billing lives under /dashboard/billing, not /dashboard/admin/billing
 */
export default function AdminBillingRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/billing');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-secondary">Redirecting to Billing...</p>
            </div>
        </div>
    );
}
