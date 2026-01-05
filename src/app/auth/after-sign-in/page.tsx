'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function AfterSignInPage() {
    const router = useRouter();
    const { isLoaded, isSignedIn } = useAuth();

    useEffect(() => {
        if (isLoaded) {
            if (isSignedIn) {
                // Redirect to dashboard after successful sign-in
                router.replace('/dashboard');
            } else {
                // If not signed in, redirect to sign-in page
                router.replace('/auth/signin');
            }
        }
    }, [isLoaded, isSignedIn, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
                <p className="text-zinc-400">Completing sign in...</p>
            </div>
        </div>
    );
}
