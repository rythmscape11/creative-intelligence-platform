'use client';

import { useState } from 'react';
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface NewsletterSignupProps {
  variant?: 'inline' | 'sidebar' | 'footer';
  title?: string;
  description?: string;
}

export function NewsletterSignup({
  variant = 'inline',
  title = 'Subscribe to Our Newsletter',
  description = 'Get the latest marketing insights and strategies delivered to your inbox weekly.',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual newsletter signup API
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0">
            <EnvelopeIcon className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        {isSuccess ? (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">Successfully subscribed!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              disabled={isSubmitting}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
        <p className="text-xs text-gray-700 mt-3">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        {isSuccess ? (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">Successfully subscribed!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <p className="text-xs text-gray-700 mt-2">
          Join 10,000+ marketers getting weekly insights. No spam, unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-8 text-white border border-[#2A2A2A] shadow-2xl">
      <div className="max-w-3xl mx-auto text-center">
        <EnvelopeIcon className="h-12 w-12 mx-auto mb-4 text-[#F59E0B]" />
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300 mb-6">{description}</p>

        {isSuccess ? (
          <div className="flex items-center justify-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg max-w-md mx-auto">
            <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-green-400" />
            <p className="font-medium text-green-300">Successfully subscribed! Check your inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-[#2A2A2A] text-white border border-[#3A3A3A] placeholder-gray-500 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] focus:outline-none"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold whitespace-nowrap"
                style={{ color: '#000000' }}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {error && <p className="text-sm text-red-400 mt-2 text-left">{error}</p>}
            <p className="text-sm text-gray-400 mt-3">
              Join 10,000+ marketers. No spam, unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

