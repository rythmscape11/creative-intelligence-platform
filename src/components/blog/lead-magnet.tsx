'use client';

import { useState } from 'react';
import { DocumentArrowDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface LeadMagnetProps {
  title?: string;
  description?: string;
  resourceTitle?: string;
  variant?: 'default' | 'compact';
}

export function LeadMagnet({
  title = 'Free Marketing Strategy Template',
  description = 'Download our proven marketing strategy template used by 1000+ businesses',
  resourceTitle = 'Marketing Strategy Template 2024',
  variant = 'default',
}: LeadMagnetProps) {
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
      // TODO: Implement actual lead magnet API
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

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl p-6 border border-[#F59E0B] shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 bg-[#F59E0B] rounded-lg">
            <DocumentArrowDownIcon className="h-6 w-6 text-[#0A0A0A]" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
            <p className="text-sm text-gray-300 mb-4">{description}</p>
            
            {isSuccess ? (
              <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-300">Check your email for the download link!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-[#2A2A2A] text-white border border-[#3A3A3A] placeholder-gray-500 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] focus:outline-none text-sm"
                  disabled={isSubmitting}
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-sm"
                  style={{ color: '#000000' }}
                >
                  {isSubmitting ? 'Sending...' : 'Download Free Template'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] via-[#0F0F0F] to-[#1A1A1A] rounded-2xl p-8 border-2 border-[#F59E0B] shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#F59E0B] opacity-10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl shadow-xl">
            <DocumentArrowDownIcon className="h-12 w-12 text-[#0A0A0A]" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {title}
          </h3>
          <p className="text-lg text-gray-300 mb-2">
            {description}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] rounded-lg border border-[#3A3A3A]">
            <span className="text-sm font-semibold text-[#F59E0B]">📄 {resourceTitle}</span>
          </div>
        </div>

        {isSuccess ? (
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-300">Success!</p>
                <p className="text-sm text-green-400">Check your email for the download link.</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
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
                className="px-6 py-3 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-105"
                style={{ color: '#000000' }}
              >
                {isSubmitting ? 'Sending...' : 'Get Free Template'}
              </button>
            </div>
            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
            <p className="text-xs text-gray-400 mt-3 text-center">
              🔒 We respect your privacy. Unsubscribe anytime.
            </p>
          </form>
        )}

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#F59E0B]">1000+</p>
            <p className="text-xs text-gray-400">Downloads</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#F59E0B]">4.9★</p>
            <p className="text-xs text-gray-400">Rating</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#F59E0B]">Free</p>
            <p className="text-xs text-gray-400">Forever</p>
          </div>
        </div>
      </div>
    </div>
  );
}

