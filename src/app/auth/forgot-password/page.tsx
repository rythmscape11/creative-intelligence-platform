'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { toast } from '../../../components/ui/toaster';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          type: 'success',
          title: 'Email Sent',
          description: data.message,
        });
      } else if (response.status === 429) {
        toast({
          type: 'error',
          title: 'Too Many Attempts',
          description: data.message,
        });
      } else {
        toast({
          type: 'error',
          title: 'Error',
          description: data.message || 'Failed to send reset email',
        });
      }
    } catch (error) {
      console.error('Forgot password request failed:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="rounded-lg border border-border-primary bg-bg-tertiary p-8 shadow-xl transition-all duration-300 ease-out hover:border-border-hover animate-fade-in-up text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-accent-success/10 mb-4">
              <Mail className="h-6 w-6 text-accent-success" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">
              Check Your Email
            </h2>
            <p className="text-sm mb-6 text-text-secondary">
              If an account exists with <strong className="text-text-primary">{email}</strong>, you will receive a password reset link shortly.
            </p>
            <p className="text-xs mb-6 text-text-tertiary">
              Didn't receive an email? Check your spam folder or try again.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/auth/signin')}
                variant="default"
                className="w-full h-12 text-base"
              >
                Back to Sign In
              </Button>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full text-sm font-medium text-[#F59E0B] hover:text-[#F59E0B]/80 transition-colors underline-offset-4 hover:underline"
              >
                Try a different email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Back to Home Link */}
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#F59E0B] hover:text-[#D97706] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="rounded-lg border border-border-primary bg-bg-tertiary p-8 shadow-xl transition-all duration-300 ease-out hover:border-border-hover animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3 text-text-primary">
              Reset Your Password
            </h2>
            <p className="text-sm text-text-secondary">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-text-primary"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-12 w-full rounded-md border border-border-primary bg-bg-tertiary px-4 py-3 text-base text-text-primary transition-all duration-300 ease-out placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary focus-visible:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className="w-full h-12 text-base"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center text-sm font-medium text-[#F59E0B] hover:text-[#F59E0B]/80 transition-colors underline-offset-4 hover:underline"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
