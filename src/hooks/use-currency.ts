import { useCurrency } from '@/contexts/currency-context';

export function useCurrencyHook() {
    return useCurrency();
}
