'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { toast } from '../../../components/ui/toaster';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      toast({
        type: 'error',
        title: 'Invalid Link',
        description: 'This password reset link is invalid or has expired.',
      });
      router.push('/auth/forgot-password');
    }
  }, [token, email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        type: 'error',
        title: 'Passwords Don\'t Match',
        description: 'Please make sure both passwords match.',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        type: 'error',
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast({
          type: 'success',
          title: 'Password Reset Successful',
          description: data.message,
        });
      } else {
        toast({
          type: 'error',
          title: 'Reset Failed',
          description: data.message || 'Failed to reset password',
        });
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="rounded-lg border border-border-primary bg-bg-tertiary p-8 shadow-xl transition-all duration-300 ease-out hover:border-border-hover animate-fade-in-up text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-accent-success/10 mb-4">
              <CheckCircle className="h-6 w-6 text-accent-success" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">
              Password Reset Successful!
            </h2>
            <p className="text-sm mb-6 text-text-secondary">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Button
              onClick={() => router.push('/auth/signin')}
              variant="default"
              className="w-full h-12 text-base"
            >
              Go to Sign In
            </Button>
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
              Create New Password
            </h2>
            <p className="text-sm text-text-secondary">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-text-primary"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-12 w-full rounded-md border border-border-primary bg-bg-tertiary px-4 py-3 pr-12 text-base text-text-primary transition-all duration-300 ease-out placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary focus-visible:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="At least 6 characters"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-12 px-3 flex items-center text-text-secondary hover:text-text-primary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-text-tertiary">
                Must be at least 6 characters long
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2 text-text-primary"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex h-12 w-full rounded-md border border-border-primary bg-bg-tertiary px-4 py-3 pr-12 text-base text-text-primary transition-all duration-300 ease-out placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary focus-visible:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 h-12 px-3 flex items-center text-text-secondary hover:text-text-primary transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className="w-full h-12 text-base"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-[#F59E0B] hover:text-[#F59E0B]/80 transition-colors underline-offset-4 hover:underline"
                >
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
