'use client';

import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface UsageLimitBannerProps {
  used: number;
  limit: number;
  toolName: string;
  isPro?: boolean;
}

export function UsageLimitBanner({ used, limit, toolName, isPro = false }: UsageLimitBannerProps) {
  if (isPro) return null;
  
  const percentage = (used / limit) * 100;
  const isWarning = percentage >= 80;
  const isLimit = used >= limit;

  if (!isWarning) return null;

  return (
    <div className={`p-4 rounded-lg border-2 ${
      isLimit 
        ? 'bg-red-50/20 border-red-200' 
        : 'bg-yellow-50/20 border-yellow-200'
    }`}>
      <div className="flex items-start gap-3">
        <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
          isLimit ? 'text-red-600' : 'text-yellow-600'
        }`} />
        <div className="flex-1">
          <h4 className={`font-semibold ${
            isLimit ? 'text-red-900' : 'text-yellow-900'
          }`}>
            {isLimit ? 'Daily Limit Reached' : 'Approaching Daily Limit'}
          </h4>
          <p className={`text-sm mt-1 ${
            isLimit ? 'text-red-700' : 'text-yellow-700'
          }`}>
            {isLimit 
              ? `You've used all ${limit} free uses of ${toolName} today.`
              : `You've used ${used} of ${limit} free uses today.`
            }
          </p>
          <Link
            href="/pricing"
            className={`inline-block mt-2 text-sm font-semibold ${
              isLimit ? 'text-red-600' : 'text-yellow-600'
            } hover:underline`}
          >
            Upgrade to Pro for unlimited usage →
          </Link>
        </div>
      </div>
    </div>
  );
}

