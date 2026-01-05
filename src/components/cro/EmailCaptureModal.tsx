'use client';

import { useState } from 'react';
import { X, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string; // 'post-tool-use', 'exit-intent', 'newsletter', etc.
  toolId?: string;
  title?: string;
  description?: string;
  incentive?: string;
}

export function EmailCaptureModal({
  isOpen,
  onClose,
  source,
  toolId,
  title = 'Get Your Results + Weekly Marketing Tips',
  description = 'Enter your email to receive your results and join 50,000+ marketers getting weekly insights.',
  incentive = '🎁 Plus: Get our free Marketing Toolkit (worth $99)',
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
          name,
          source,
          toolId,
          page: window.location.pathname,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setIsSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setEmail('');
        setName('');
      }, 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gray-50 dark:bg-bg-secondary border border-gray-200 dark:border-border-primary rounded-lg shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-text-tertiary hover:text-gray-900 dark:text-text-primary transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary mb-2">
                You're all set! 🎉
              </h3>
              <p className="text-gray-600 dark:text-text-secondary">
                Check your email for your results and free toolkit.
              </p>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-2">
                {title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-text-secondary mb-4">
                {description}
              </p>

              {/* Incentive */}
              {incentive && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-6">
                  <p className="text-sm text-primary font-medium">
                    {incentive}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-600 dark:text-text-secondary">
                    Name (optional)
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-600 dark:text-text-secondary">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="mt-1"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Subscribing...' : 'Get Free Access'}
                </Button>

                <p className="text-xs text-gray-500 dark:text-text-tertiary text-center">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>

              {/* Skip option */}
              <button
                onClick={onClose}
                className="w-full mt-4 text-sm text-gray-500 dark:text-text-tertiary hover:text-gray-600 dark:text-text-secondary transition-colors"
              >
                No thanks, I'll skip this
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

