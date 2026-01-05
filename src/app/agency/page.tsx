import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

/**
 * Agency OS - Main Entry Point
 * 
 * Redirects to the embedded Agency OS dashboard within the Aureon One platform.
 * No more external redirects - the dashboard is now built-in!
 */
export default async function AgencyPage() {
    const { userId } = await auth();

    if (!userId) {
        // Not logged in - redirect to sign in
        redirect('/auth/signin?redirect_url=/dashboard/agency-os');
    }

    // Redirect to embedded Agency OS dashboard
    redirect('/dashboard/agency-os');
}

export const metadata = {
    title: 'Agency OS | Aureon One',
    description: 'Stable operations platform for modern marketing agencies',
};
