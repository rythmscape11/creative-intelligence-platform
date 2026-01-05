'use client';

/**
 * Payment Gateway Selector Component
 * 
 * Allows users to choose between Stripe (international) and Razorpay (India).
 * Displays appropriate checkout button based on selection.
 */

import { useState } from 'react';
import { CheckoutButton } from './checkout-button';
import { RazorpayCheckoutButton } from './razorpay-checkout-button';
import { GlobeAltIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface PaymentGatewaySelectorProps {
  billingCycle?: 'monthly' | 'annual';
  planName: string;
  planTier?: 'PRO' | 'AGENCY';
  buttonText: string;
  buttonClassName?: string;
}

export function PaymentGatewaySelector({
  billingCycle = 'monthly',
  planName,
  planTier = 'PRO',
  buttonText,
  buttonClassName = 'btn btn-primary w-full',
}: PaymentGatewaySelectorProps) {
  const [selectedGateway, setSelectedGateway] = useState<'stripe' | 'razorpay'>('stripe');
  const [showSelector, setShowSelector] = useState(false);

  // Auto-detect user location (simplified - you can enhance this with IP geolocation)
  const detectLocation = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta') ? 'razorpay' : 'stripe';
  };

  // Set default gateway based on location on first render
  useState(() => {
    const detected = detectLocation();
    setSelectedGateway(detected);
  });

  const gateways = [
    {
      id: 'stripe' as const,
      name: 'International Payment',
      description: 'Credit/Debit Cards, Apple Pay, Google Pay',
      icon: GlobeAltIcon,
      currency: 'USD',
      price: billingCycle === 'annual' ? '$350/year' : '$35/month',
      recommended: selectedGateway === 'stripe',
    },
    {
      id: 'razorpay' as const,
      name: 'India Payment',
      description: 'UPI, Cards, Net Banking, Wallets',
      icon: MapPinIcon,
      currency: 'INR',
      price: billingCycle === 'annual' ? '₹38,390/year' : '₹3,999/month',
      recommended: selectedGateway === 'razorpay',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Gateway Selection Toggle */}
      <button
        onClick={() => setShowSelector(!showSelector)}
        className="w-full text-sm text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary transition-colors text-center"
      >
        {showSelector ? '▼' : '▶'} Payment Method: {selectedGateway === 'stripe' ? 'International (USD)' : 'India (INR)'}
      </button>

      {/* Gateway Options */}
      {showSelector && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-bg-tertiary rounded-lg border border-gray-200 dark:border-border-primary">
          {gateways.map((gateway) => (
            <button
              key={gateway.id}
              onClick={() => {
                setSelectedGateway(gateway.id);
                setShowSelector(false);
              }}
              className={`
                relative p-4 rounded-lg border-2 transition-all text-left
                ${selectedGateway === gateway.id
                  ? 'border-amber-600 dark:border-amber-500 bg-amber-50/20 dark:bg-amber-500/10'
                  : 'border-gray-200 dark:border-border-primary bg-white dark:bg-bg-secondary hover:border-gray-300 dark:hover:border-border-secondary'
                }
              `}
            >
              {/* Recommended Badge */}
              {gateway.recommended && (
                <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium bg-amber-600 dark:bg-amber-500 text-white rounded">
                  Recommended
                </span>
              )}

              {/* Icon and Name */}
              <div className="flex items-start mb-2">
                <gateway.icon className={`h-5 w-5 mr-2 mt-0.5 ${selectedGateway === gateway.id
                    ? 'text-amber-600 dark:text-amber-500'
                    : 'text-gray-700 dark:text-text-secondary'
                  }`} />
                <div>
                  <h4 className={`font-semibold text-sm ${selectedGateway === gateway.id
                      ? 'text-amber-900 dark:text-amber-400'
                      : 'text-gray-900 dark:text-text-primary'
                    }`}>
                    {gateway.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-text-tertiary mt-0.5">
                    {gateway.description}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-border-primary">
                <p className="text-sm font-medium text-gray-900 dark:text-text-primary">
                  {gateway.price}
                </p>
                <p className="text-xs text-gray-700 dark:text-text-secondary">
                  Billed in {gateway.currency}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Checkout Button */}
      <div className="pt-2">
        {selectedGateway === 'stripe' ? (
          <CheckoutButton
            billingCycle={billingCycle}
            planName={planName}
            className={buttonClassName}
          >
            {buttonText}
          </CheckoutButton>
        ) : (
          <RazorpayCheckoutButton
            billingCycle={billingCycle}
            planName={planName}
            planTier={planTier}
            className={buttonClassName}
            planType="subscription"
          >
            {buttonText}
          </RazorpayCheckoutButton>
        )}
      </div>

      {/* Payment Info */}
      <div className="text-xs text-center text-gray-700 dark:text-text-secondary space-y-1">
        <p>
          {selectedGateway === 'stripe'
            ? '🌍 Secure international payments via Stripe'
            : '🇮🇳 Secure payments via Razorpay (India)'}
        </p>
        <p>
          {selectedGateway === 'stripe'
            ? 'Supports all major credit cards, Apple Pay, Google Pay'
            : 'Supports UPI, Cards, Net Banking, Wallets'}
        </p>
      </div>
    </div>
  );
}

