'use client';

import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface SignOutButtonProps {
    variant?: 'default' | 'minimal' | 'danger';
    className?: string;
    showIcon?: boolean;
    children?: React.ReactNode;
}

/**
 * Enhanced Sign Out Button with complete session destruction
 * - Calls server-side endpoint to clear cookies
 * - Signs out via Clerk
 * - Clears local/session storage
 * - Forces hard redirect to home
 */
export function SignOutButton({
    variant = 'default',
    className = '',
    showIcon = true,
    children
}: SignOutButtonProps) {
    const { signOut } = useClerk();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignOut = async () => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            // Step 1: Server-side session destroy
            await fetch('/api/auth/sign-out', {
                method: 'POST',
                credentials: 'include'
            });

            // Step 2: Clerk client-side sign out
            await signOut();

            // Step 3: Clear all client-side storage
            try {
                localStorage.clear();
                sessionStorage.clear();

                // Clear any cached data
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.map(name => caches.delete(name)));
                }
            } catch {
                // Storage access might be restricted, continue
            }

            // Step 4: Force hard redirect (bypass Next.js router cache)
            window.location.href = '/';

        } catch (error) {
            console.error('Sign out error:', error);
            // Even on error, force redirect
            window.location.href = '/';
        }
    };

    const variantStyles = {
        default: 'px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors',
        minimal: 'text-text-secondary hover:text-text-primary transition-colors',
        danger: 'px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors'
    };

    return (
        <button
            onClick={handleSignOut}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 ${variantStyles[variant]} ${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isLoading ? (
                <>
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing out...
                </>
            ) : (
                <>
                    {showIcon && <ArrowRightOnRectangleIcon className="h-5 w-5" />}
                    {children || 'Sign Out'}
                </>
            )}
        </button>
    );
}

export default SignOutButton;
