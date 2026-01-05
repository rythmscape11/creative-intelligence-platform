'use client';

import { useState, useEffect } from 'react';
import { X, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ExitIntentPopupProps {
  enabled?: boolean;
  title?: string;
  description?: string;
  resourceTitle?: string;
  resourceDescription?: string;
}

export function ExitIntentPopup({
  enabled = true,
  title = 'Wait! Before you go...',
  description = 'Get our free Marketing Toolkit',
  resourceTitle = '🎁 Free Marketing Toolkit',
  resourceDescription = '50+ templates, checklists, and guides to boost your marketing (worth $99)',
}: ExitIntentPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (!enabled || hasShown) return;

    // Check if user has already seen this popup (localStorage)
    const hasSeenPopup = localStorage.getItem('exitIntentShown');
    if (hasSeenPopup) {
      setHasShown(true);
      return;
    }

    let mouseY = 0;
    let isExiting = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseY = e.clientY;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the page
      if (e.clientY <= 0 && mouseY <= 50 && !isExiting) {
        isExiting = true;
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'exit-intent',
          page: window.location.pathname,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setIsSuccess(true);
      
      // Close popup after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      console.error('Exit intent submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-gray-200 dark:border-border-primary rounded-xl shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-text-tertiary hover:text-gray-900 dark:text-text-primary transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-2">
                Check your email! 📧
              </h3>
              <p className="text-gray-600 dark:text-text-secondary">
                Your free Marketing Toolkit is on its way.
              </p>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Download className="w-8 h-8 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-2 text-center">
                {title}
              </h3>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-text-secondary mb-6 text-center">
                {description}
              </p>

              {/* Resource highlight */}
              <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-lg p-6 mb-6">
                <h4 className="text-xl font-bold text-gray-900 dark:text-text-primary mb-2">
                  {resourceTitle}
                </h4>
                <p className="text-gray-600 dark:text-text-secondary mb-4">
                  {resourceDescription}
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-text-secondary">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    50+ Ready-to-use templates
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Marketing checklists & frameworks
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Expert guides & case studies
                  </li>
                </ul>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="px-8"
                  >
                    {isSubmitting ? 'Sending...' : 'Get Free Access'}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 dark:text-text-tertiary text-center">
                  100% free. No credit card required. Unsubscribe anytime.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

