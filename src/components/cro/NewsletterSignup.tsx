'use client';

import { useState } from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'inline';
  title?: string;
  description?: string;
  placeholder?: string;
  className?: string;
}

export function NewsletterSignup({
  variant = 'default',
  title = 'Join 50,000+ Marketers',
  description = 'Get weekly marketing tips, tool updates, and exclusive resources delivered to your inbox.',
  placeholder = 'Enter your email',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'newsletter',
          page: window.location.pathname,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setIsSuccess(true);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-gray-100 dark:bg-bg-secondary border border-gray-200 dark:border-border-primary rounded-lg p-4 ${className}`}>
        {isSuccess ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Thanks for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-[#F59E0B]" />
              <h4 className="font-semibold text-gray-900 dark:text-text-primary">Newsletter</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-text-secondary">
              Weekly marketing tips & updates
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                required
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
              >
                {isSubmitting ? '...' : 'Join'}
              </Button>
            </div>
            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}
          </form>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={className}>
        {isSuccess ? (
          <div className="flex items-center gap-2 text-green-400 py-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Thanks for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              required
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        )}
        {error && (
          <p className="text-xs text-red-400 mt-2">{error}</p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border-primary rounded-lg p-6 ${className}`}>
      {isSuccess ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-green-400" />
          </div>
          <h4 className="text-lg font-bold text-text-primary mb-1">
            You're subscribed! 🎉
          </h4>
          <p className="text-sm text-text-secondary">
            Check your email for a welcome message.
          </p>
        </div>
      ) : (
        <>
          {/* Icon */}
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-text-primary mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-text-secondary mb-4">
            {description}
          </p>

          {/* Benefits */}
          <ul className="space-y-2 mb-6 text-sm text-text-secondary">
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Weekly marketing insights
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              New tool announcements
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Exclusive tips & resources
            </li>
          </ul>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              required
            />
            
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe Free'}
            </Button>

            <p className="text-xs text-text-tertiary text-center">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        </>
      )}
    </div>
  );
}

