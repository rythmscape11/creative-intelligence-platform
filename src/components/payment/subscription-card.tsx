'use client';

/**
 * Subscription Card Component
 * 
 * Displays current subscription details and management options.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  CreditCardIcon, 
  CalendarIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface SubscriptionCardProps {
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
    stripeCustomerId: string | null;
    razorpayCustomerId?: string | null;
    paymentGateway?: string | null;
  };
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const planDetails = {
    FREE: { name: 'Free', price: '₹0', color: 'gray' },
    PROFESSIONAL: { name: 'Professional', price: '₹2,999', color: 'blue' },
    ENTERPRISE: { name: 'Enterprise', price: 'Custom', color: 'purple' },
  };

  const statusColors = {
    ACTIVE: 'green',
    CANCELED: 'red',
    PAST_DUE: 'yellow',
    TRIALING: 'blue',
    INCOMPLETE: 'gray',
  };

  const plan = planDetails[subscription.plan as keyof typeof planDetails] || planDetails.FREE;
  const statusColor = statusColors[subscription.status as keyof typeof statusColors] || 'gray';

  const handleManageSubscription = async (action: 'portal' | 'cancel' | 'resume') => {
    setLoading(true);

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to manage subscription');
      }

      const data = await response.json();

      if (action === 'portal' && data.url) {
        window.location.href = data.url;
      } else {
        toast.success(
          action === 'cancel' 
            ? 'Subscription will be canceled at period end' 
            : 'Subscription reactivated successfully'
        );
        router.refresh();
      }
    } catch (error) {
      console.error('Manage subscription error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to manage subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {plan.name} Plan
          </h2>
          <p className="text-3xl font-bold text-amber-600">
            {plan.price}
            {subscription.plan !== 'FREE' && subscription.plan !== 'ENTERPRISE' && (
              <span className="text-sm font-normal text-gray-700">/month</span>
            )}
          </p>
        </div>
        
        {/* Status Badge */}
        <span className={`
          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
          ${statusColor === 'green' ? 'bg-green-100/30 text-green-800' : ''}
          ${statusColor === 'red' ? 'bg-red-100/30 text-red-800' : ''}
          ${statusColor === 'yellow' ? 'bg-yellow-100/30 text-yellow-800' : ''}
          ${statusColor === 'blue' ? 'bg-amber-100/30 text-amber-800' : ''}
          ${statusColor === 'gray' ? 'bg-gray-100 text-gray-800' : ''}
        `}>
          {subscription.status === 'ACTIVE' && <CheckCircleIcon className="h-4 w-4 mr-1" />}
          {subscription.status === 'CANCELED' && <XCircleIcon className="h-4 w-4 mr-1" />}
          {subscription.status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        {subscription.currentPeriodEnd && (
          <div className="flex items-center text-gray-700">
            <CalendarIcon className="h-5 w-5 mr-3 text-gray-700" />
            <div>
              <p className="text-sm text-gray-700">
                {subscription.cancelAtPeriodEnd ? 'Access until' : 'Renews on'}
              </p>
              <p className="font-medium">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}

        {(subscription.stripeCustomerId || subscription.razorpayCustomerId) && (
          <div className="flex items-center text-gray-700">
            <CreditCardIcon className="h-5 w-5 mr-3 text-gray-700" />
            <div>
              <p className="text-sm text-gray-700">Payment method</p>
              <p className="font-medium">
                {subscription.paymentGateway === 'razorpay' || subscription.razorpayCustomerId
                  ? 'Managed via Razorpay (India)'
                  : 'Managed via Stripe (International)'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Cancellation Notice */}
      {subscription.cancelAtPeriodEnd && (
        <div className="bg-yellow-50/20 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <XCircleIcon className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Subscription Canceled
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Your subscription will end on{' '}
                {subscription.currentPeriodEnd && 
                  new Date(subscription.currentPeriodEnd).toLocaleDateString()
                }. You can reactivate it anytime before then.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {subscription.plan !== 'FREE' && subscription.stripeCustomerId && (
          <>
            <button
              onClick={() => handleManageSubscription('portal')}
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Manage Billing
            </button>

            {subscription.cancelAtPeriodEnd ? (
              <button
                onClick={() => handleManageSubscription('resume')}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                )}
                Reactivate
              </button>
            ) : (
              <button
                onClick={() => handleManageSubscription('cancel')}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircleIcon className="h-4 w-4 mr-2" />
                )}
                Cancel Subscription
              </button>
            )}
          </>
        )}

        {subscription.plan === 'FREE' && (
          <a
            href="/pricing"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors"
          >
            Upgrade to Professional
          </a>
        )}
      </div>
    </div>
  );
}

