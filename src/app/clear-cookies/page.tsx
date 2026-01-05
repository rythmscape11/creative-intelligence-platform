'use client';

import { useEffect, useState } from 'react';
import { useClerk } from '@clerk/nextjs';

export default function ClearCookiesPage() {
    const { signOut } = useClerk();
    const [status, setStatus] = useState<string>('Ready to clear cookies...');
    const [cookies, setCookies] = useState<string[]>([]);

    useEffect(() => {
        // Show current cookies
        const currentCookies = document.cookie.split(';').map(c => c.trim());
        setCookies(currentCookies);
    }, []);

    const clearAllCookies = async () => {
        setStatus('Clearing cookies...');

        // 1. Sign out from Clerk
        try {
            await signOut();
            setStatus('Sign out complete...');
        } catch (error) {
            setStatus('Sign out failed, continuing...');
        }

        // 2. Clear all cookies with multiple domain/path combinations
        const cookieNames = [
            '__Secure-next-auth.session-token',
            'next-auth.session-token',
            '__Host-next-auth.csrf-token',
            '__Secure-next-auth.callback-url',
            'next-auth.callback-url',
            'csrf-secret',
        ];

        const domains = [
            '',
            window.location.hostname,
            '.mediaplanpro.com',
            'www.mediaplanpro.com',
            '.www.mediaplanpro.com',
        ];

        const paths = ['/', '/auth', '/api/auth', '/api'];

        let cleared = 0;
        cookieNames.forEach(name => {
            domains.forEach(domain => {
                paths.forEach(path => {
                    // Try with secure flag
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; secure; samesite=lax`;
                    // Try without secure flag
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; samesite=lax`;
                    // Try without samesite
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}`;
                    cleared++;
                });
            });
        });

        setStatus(`Attempted to clear ${cleared} cookie variations. Reloading page...`);

        // 3. Reload after a short delay
        setTimeout(() => {
            window.location.href = '/auth/signin';
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-2xl w-full bg-card rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Clear Authentication Cookies
                </h1>

                <div className="mb-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        This page will help clear all authentication cookies from your browser.
                    </p>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Note:</strong> HttpOnly cookies cannot be cleared by JavaScript.
                            After clicking the button below, you should also manually clear your browser cookies:
                        </p>
                        <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                            <li>Press <kbd className="px-2 py-1 bg-yellow-100 dark:bg-yellow-800 rounded">Ctrl+Shift+Delete</kbd> (or <kbd className="px-2 py-1 bg-yellow-100 dark:bg-yellow-800 rounded">Cmd+Shift+Delete</kbd> on Mac)</li>
                            <li>Select "All time"</li>
                            <li>Check "Cookies and other site data"</li>
                            <li>Click "Clear data"</li>
                        </ul>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Current Cookies:</h3>
                        <div className="text-xs font-mono text-blue-800 dark:text-blue-300 max-h-40 overflow-y-auto">
                            {cookies.length > 0 ? (
                                <ul className="space-y-1">
                                    {cookies.map((cookie, i) => (
                                        <li key={i} className="break-all">{cookie || '(empty)'}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No cookies found</p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={clearAllCookies}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                        Clear All Cookies & Sign Out
                    </button>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                        {status}
                    </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Alternative: Use DevTools</h3>
                    <ol className="list-decimal list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>Press F12 to open DevTools</li>
                        <li>Go to the "Application" tab</li>
                        <li>Under "Storage", click "Clear site data"</li>
                        <li>Confirm and reload the page</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
