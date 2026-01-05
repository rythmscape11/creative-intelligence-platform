'use client';

/**
 * Razorpay Checkout Button Component
 * 
 * Handles Razorpay payment checkout for Indian customers.
 * Supports both subscription and one-time payments.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { trackBeginCheckout } from '@/lib/tracking-enhanced';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutButtonProps {
  billingCycle?: 'monthly' | 'annual' | 'yearly';
  planName: string;
  planTier?: 'PRO' | 'AGENCY';
  className?: string;
  children: React.ReactNode;
  planType?: 'subscription' | 'order';
  amount?: number; // Added amount prop for tracking
}

export function RazorpayCheckoutButton({
  billingCycle = 'monthly',
  planName,
  planTier = 'PRO',
  className = '',
  children,
  planType = 'subscription',
  amount = 0,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const handleCheckout = async () => {
    // Check authentication
    if (status === 'unauthenticated') {
      toast.error('Please sign in to subscribe');
      router.push('/auth/signin?callbackUrl=/pricing');
      return;
    }

    // Track begin checkout
    trackBeginCheckout(amount, 'USD', [
      {
        item_id: `${planTier}-${billingCycle}`,
        item_name: `${planName} (${billingCycle})`,
        price: amount,
        quantity: 1,
        item_category: 'Subscription',
        item_variant: billingCycle,
      },
    ]);

    setLoading(true);

    try {
      // Normalize billing cycle (convert 'annual' to 'yearly' for Razorpay)
      const normalizedBillingCycle = billingCycle === 'annual' ? 'yearly' : billingCycle;

      // Create Razorpay order/subscription
      const response = await fetch('/api/checkout/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billingCycle: normalizedBillingCycle,
          planTier,
          planType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout');
      }

      const data = await response.json();

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      // Configure Razorpay checkout options
      const options = {
        ...data.checkoutOptions,
        handler: async function (response: any) {
          // Payment successful
          console.log('Payment successful:', response);

          // Verify payment on server
          try {
            const verifyResponse = await fetch(
              `/api/checkout/razorpay?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id || ''}&subscription_id=${response.razorpay_subscription_id || ''}`,
              { method: 'GET' }
            );

            if (verifyResponse.ok) {
              toast.success('Payment successful! Redirecting...');
              router.push('/checkout/success?gateway=razorpay');
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
        theme: {
          color: '#667eea', // Brand color
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initiate checkout');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || !isLoaded}
      className={className}
    >
      {loading ? (
        <>
          <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin inline" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}

