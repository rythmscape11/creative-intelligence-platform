'use client';

/**
 * Checkout Button Component
 * 
 * Initiates Stripe checkout flow for subscription purchases.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import toast from 'react-hot-toast';

interface CheckoutButtonProps {
  priceId?: string;
  billingCycle?: 'monthly' | 'annual';
  planName: string;
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({
  priceId,
  billingCycle = 'monthly',
  planName,
  className = '',
  children,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const handleCheckout = async () => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      toast.error('Please sign in to subscribe');
      router.push('/auth/signin?callbackUrl=/pricing');
      return;
    }

    if (!isLoaded) {
      return;
    }

    setLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          billingCycle,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={className || `
        w-full px-6 py-3 rounded-lg font-semibold text-white
        bg-amber-600 hover:bg-amber-700
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        ${loading ? 'cursor-wait' : ''}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        children || `Subscribe to ${planName}`
      )}
    </button>
  );
}

