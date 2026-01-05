'use client';

import { AlertTriangle, RefreshCw, Home, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
    title?: string;
    description?: string;
    retry?: () => void;
    showHome?: boolean;
    showContact?: boolean;
    error?: Error & { digest?: string };
}

export function ErrorState({
    title = 'Oops! Something went wrong',
    description = "We encountered an unexpected error. Don't worry, our team has been notified.",
    retry,
    showHome = true,
    showContact = true,
    error,
}: ErrorStateProps) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4 animate-fade-in">
            <div className="max-w-md w-full text-center space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center animate-pulse">
                        <AlertTriangle className="w-10 h-10 text-red-500 dark:text-red-400" />
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        {description}
                    </p>
                </div>

                {/* Dev Details */}
                {process.env.NODE_ENV === 'development' && error && (
                    <div className="text-left bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/20 overflow-hidden">
                        <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-gray-500 mt-1">Digest: {error.digest}</p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    {retry && (
                        <Button onClick={retry} size="lg" className="gap-2 shadow-sm">
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </Button>
                    )}

                    {showHome && (
                        <Button variant="outline" size="lg" asChild className="gap-2 shadow-sm bg-white dark:bg-bg-secondary">
                            <Link href="/">
                                <Home className="w-4 h-4" />
                                Go Home
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Support Link */}
                {showContact && (
                    <div className="pt-4">
                        <Link href="/contact" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            <LifeBuoy className="w-4 h-4 mr-2" />
                            Contact Support
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
