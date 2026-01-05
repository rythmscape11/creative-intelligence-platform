'use client';

import { Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface UpgradePromptProps {
  toolName: string;
  show: boolean;
}

export function UpgradePrompt({ toolName, show }: UpgradePromptProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border-2 border-zinc-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 mb-4">
            <LockClosedIcon className="h-6 w-6 text-zinc-900" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Upgrade to Pro
          </h3>
        </div>

        <p className="text-gray-600 mb-6">
          You've reached your daily limit for {toolName}. Upgrade to Pro for unlimited access to all 70+ marketing tools.
        </p>

        <div className="space-y-3">
          <Link href="/pricing">
            <Button className="w-full gap-2">
              <Zap className="w-4 h-4" />
              Upgrade to Pro - ₹2,999/month
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Maybe Later
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-700 text-center">
            Pro includes unlimited usage of all tools, priority support, and early access to new features.
          </p>
        </div>
      </div>
    </div>
  );
}

