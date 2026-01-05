'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency, getStoredCurrency, storeCurrency, formatPrice as formatPriceUtil, getPriceInCurrency } from '@/lib/currency';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (usdAmount: number) => string;
    getPrice: (usdAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>('USD');
    const [mounted, setMounted] = useState(false);

    // Initialize currency on mount
    useEffect(() => {
        setMounted(true);
        const storedCurrency = getStoredCurrency();
        setCurrencyState(storedCurrency);
    }, []);

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        storeCurrency(newCurrency);
    };

    const formatPrice = (usdAmount: number): string => {
        const price = getPriceInCurrency(usdAmount, currency);
        return formatPriceUtil(price, currency);
    };

    const getPrice = (usdAmount: number): number => {
        return getPriceInCurrency(usdAmount, currency);
    };

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, getPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
