/**
 * Currency utilities for MediaPlanPro
 * Handles currency conversion and formatting
 */

export type Currency = 'USD' | 'INR';

// Exchange rate: 1 USD = 85 INR
export const USD_TO_INR_RATE = 85;

/**
 * Convert USD to INR
 */
export function convertUsdToInr(usd: number): number {
    return Math.round(usd * USD_TO_INR_RATE);
}

/**
 * Format price in the specified currency
 */
export function formatPrice(amount: number, currency: Currency): string {
    if (currency === 'USD') {
        return `$${amount}`;
    } else {
        return `₹${amount.toLocaleString('en-IN')}`;
    }
}

/**
 * Get price in the specified currency
 */
export function getPriceInCurrency(usdPrice: number, currency: Currency): number {
    if (currency === 'USD') {
        return usdPrice;
    } else {
        return convertUsdToInr(usdPrice);
    }
}

/**
 * Detect user's currency based on timezone
 * India timezone → INR, otherwise USD
 */
export function detectCurrency(): Currency {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Check if timezone is in India
        if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) {
            return 'INR';
        }
    } catch (error) {
        console.error('Error detecting timezone:', error);
    }
    return 'USD'; // Default to USD
}

/**
 * Get currency from localStorage or detect it
 */
export function getStoredCurrency(): Currency {
    if (typeof window === 'undefined') return 'USD';

    try {
        const stored = localStorage.getItem('mediaplanpro_currency_preference');
        if (stored === 'USD' || stored === 'INR') {
            return stored;
        }
    } catch (error) {
        console.error('Error reading currency from localStorage:', error);
    }

    // If no stored preference, detect based on timezone
    return detectCurrency();
}

/**
 * Store currency preference in localStorage
 */
export function storeCurrency(currency: Currency): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem('mediaplanpro_currency_preference', currency);
    } catch (error) {
        console.error('Error storing currency in localStorage:', error);
    }
}
