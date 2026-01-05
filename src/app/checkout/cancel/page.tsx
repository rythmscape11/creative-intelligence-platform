'use client';

/**
 * Checkout Cancel Page
 * 
 * Displayed when user cancels the checkout process.
 */

import Link from 'next/link';
import { XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Cancel Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <XCircleIcon className="h-12 w-12 text-gray-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Checkout Canceled
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8">
            Your subscription checkout was canceled. No charges have been made to your account.
          </p>

          {/* Info Box */}
          <div className="bg-amber-50/20 border border-amber-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-amber-900 mb-3">
              Need help deciding?
            </h2>
            <ul className="space-y-2 text-amber-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Compare our plans to find the best fit for your needs</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Try our free plan to explore the platform</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Contact our support team if you have questions</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors"
            >
              <ArrowLeftIcon className="mr-2 h-5 w-5" />
              Back to Pricing
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              You can upgrade to a paid plan anytime from your dashboard or the pricing page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

