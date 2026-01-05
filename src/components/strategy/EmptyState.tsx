import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SparklesIcon } from '@heroicons/react/24/outline';

export function EmptyState() {
    return (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="mx-auto h-12 w-12 text-zinc-900 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                <SparklesIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">You don't have any strategies yet</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                Upgrade to Pro to create unlimited marketing strategies and access advanced features.
            </p>
            <div className="mt-6">
                <Button asChild className="bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 text-white border-0">
                    <Link href="/pricing">
                        Upgrade to Pro
                    </Link>
                </Button>
            </div>
        </div>
    );
}
