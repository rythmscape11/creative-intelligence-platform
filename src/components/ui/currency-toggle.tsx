'use client';

import { useCurrency } from '@/contexts/currency-context';
import { Currency } from '@/lib/currency';

export function CurrencyToggle() {
    const { currency, setCurrency } = useCurrency();

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-text-secondary">Currency:</span>
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-border-primary bg-white dark:bg-bg-secondary p-1">
                <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${currency === 'USD'
                            ? 'bg-blue-500 dark:bg-[#F59E0B] text-white shadow-sm'
                            : 'text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary'
                        }`}
                >
                    USD
                </button>
                <button
                    onClick={() => setCurrency('INR')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${currency === 'INR'
                            ? 'bg-blue-500 dark:bg-[#F59E0B] text-white shadow-sm'
                            : 'text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary'
                        }`}
                >
                    INR
                </button>
            </div>
        </div>
    );
}
