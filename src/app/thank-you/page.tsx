
'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');

  return (
    <div className="bg-white dark:bg-gray-950 min-h-[80vh] flex items-center justify-center">
      <div className="mx-auto max-w-2xl px-6 py-24 sm:py-32 lg:px-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-8">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Order Confirmed!
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Thank you for your purchase. We have sent an email with your download links and invoice.
        </p>

        {key && (
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Order Reference: <span className="font-mono text-gray-900 dark:text-white font-medium">{key.substring(0, 8)}...</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Please check your spam folder if you don&apos;t see the email within 5 minutes.
            </p>
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/frameworks"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Browse More Frameworks
          </Link>
          <Link href="/" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
            Back to Home <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
