'use client';

import Link from 'next/link';
import { UserPlusIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface GuestUserBannerProps {
  isAuthenticated?: boolean;
}

export function GuestUserBanner({ isAuthenticated = false }: GuestUserBannerProps) {
  // Don't show banner if user is authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-zinc-50 border-b border-zinc-200 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">👋</span>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Welcome to MediaPlanPro!</h3>
            <p className="text-sm text-zinc-600">You're viewing a demo account. Feel free to explore!</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/signup" className="text-sm font-medium text-zinc-900 hover:text-zinc-700">
            Create Account
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}

