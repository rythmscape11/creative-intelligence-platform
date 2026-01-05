'use client';

import { useSearchParams } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { Suspense } from 'react';

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const message = searchParams.get('message') || 'You do not have permission to access this page';

  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              fontFamily: 'var(--font-family-display)',
              color: 'var(--color-neutral-charcoal)',
            }}
          >
            Access Denied
          </h1>
          <p
            className="text-lg mb-6"
            style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.7 }}
          >
            {message}
          </p>
          {user && (
            <div className="mb-6 p-4 bg-amber-50 rounded-lg">
              <p className="text-sm" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.8 }}>
                You are currently signed in as:
              </p>
              <p className="text-sm font-medium mt-1" style={{ color: 'var(--color-primary-yellow)' }}>
                {user.primaryEmailAddress?.emailAddress}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.6 }}>
                Role: {user.publicMetadata?.role as string}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
          {!isSignedIn && (
            <Link href="/auth/signin" className="btn btn-secondary">
              Sign In
            </Link>
          )}
        </div>
        <div className="mt-8">
          <p className="text-sm" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.6 }}>
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
          <p style={{ color: 'var(--color-neutral-charcoal)' }}>Loading...</p>
        </div>
      </div>
    }>
      <UnauthorizedContent />
    </Suspense>
  );
}

