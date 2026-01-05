'use client';

/**
 * Checkout Page
 * 
 * Allows users to select a product/plan and complete payment via Razorpay.
 */

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
    PRODUCTS,
    ProductType,
    FULL_STACK_BUNDLE,
    getProductPlans,
    formatPrice,
    PlanTier,
} from '@/config/product-plans';
import {
    Building2,
    TrendingUp,
    Search,
    Lightbulb,
    Check,
    ArrowLeft,
    Sparkles,
    Loader2,
    CreditCard,
    Shield,
} from 'lucide-react';

const productIcons = {
    AGENCY_OS: Building2,
    OPTIMISER: TrendingUp,
    ANALYSER: Search,
    STRATEGISER: Lightbulb,
};

const productColors = {
    AGENCY_OS: 'indigo',
    OPTIMISER: 'emerald',
    ANALYSER: 'amber',
    STRATEGISER: 'violet',
};

type Currency = 'usd' | 'inr';
type Interval = 'monthly' | 'yearly';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isLoaded, isSignedIn, user } = useUser();

    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [selectedTier, setSelectedTier] = useState<PlanTier>('PRO');
    const [currency, setCurrency] = useState<Currency>('usd');
    const [interval, setInterval] = useState<Interval>('monthly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isBundle = searchParams.get('bundle') === 'true';

    useEffect(() => {
        // Get product from URL params
        const productParam = searchParams.get('product');
        const tierParam = searchParams.get('tier');
        const currencyParam = searchParams.get('currency');
        const intervalParam = searchParams.get('interval');

        if (productParam && productParam in PRODUCTS) {
            setSelectedProduct(productParam as ProductType);
        } else if (!isBundle) {
            setSelectedProduct('AGENCY_OS');
        }

        if (tierParam && ['STARTER', 'PRO', 'AGENCY'].includes(tierParam)) {
            setSelectedTier(tierParam as PlanTier);
        }

        if (currencyParam === 'inr') {
            setCurrency('inr');
        }

        if (intervalParam === 'yearly') {
            setInterval('yearly');
        }
    }, [searchParams, isBundle]);

    // Redirect to sign-in if not authenticated
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push(`/sign-in?redirect_url=${encodeURIComponent('/checkout' + window.location.search)}`);
        }
    }, [isLoaded, isSignedIn, router]);

    const handleCheckout = async () => {
        if (!isSignedIn) {
            router.push('/sign-in?redirect_url=' + encodeURIComponent('/checkout'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product: isBundle ? 'BUNDLE' : selectedProduct,
                    tier: selectedTier,
                    currency,
                    interval,
                    email: user?.primaryEmailAddress?.emailAddress,
                }),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
                setLoading(false);
                return;
            }

            // If using Razorpay, open their checkout
            if (data.razorpayOrderId) {
                const options = {
                    key: data.razorpayKey,
                    amount: data.amount,
                    currency: data.currency,
                    name: 'Aureon One',
                    description: data.description,
                    order_id: data.razorpayOrderId,
                    prefill: {
                        email: user?.primaryEmailAddress?.emailAddress,
                        name: user?.fullName,
                    },
                    handler: function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
                        // Redirect to success page
                        router.push(`/checkout/success?session_id=${response.razorpay_order_id}`);
                    },
                };

                // @ts-expect-error - Razorpay types not available
                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else if (data.url) {
                // Redirect to external checkout (Stripe, etc.)
                window.location.href = data.url;
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError('Failed to initiate checkout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getPrice = () => {
        if (isBundle) {
            return FULL_STACK_BUNDLE.price[selectedTier.toLowerCase() as 'starter' | 'pro' | 'agency'][currency][interval];
        }
        if (selectedProduct) {
            const plans = getProductPlans(selectedProduct);
            const plan = plans.find(p => p.tier === selectedTier);
            return plan?.price[currency][interval] || 0;
        }
        return 0;
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/pricing"
                    className="inline-flex items-center text-slate-400 hover:text-white mb-8"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Pricing
                </Link>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Product Selection */}
                    <div className="bg-slate-800/50 rounded-2xl p-8 ring-1 ring-slate-700">
                        <h1 className="text-2xl font-bold text-white mb-6">
                            {isBundle ? 'Full Stack Bundle' : 'Choose Your Plan'}
                        </h1>

                        {!isBundle && (
                            <>
                                {/* Product Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-300 mb-3">
                                        Select Product
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {(Object.keys(PRODUCTS) as ProductType[]).map((key) => {
                                            const product = PRODUCTS[key];
                                            const Icon = productIcons[key];
                                            const isSelected = selectedProduct === key;

                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => setSelectedProduct(key)}
                                                    className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-all ${isSelected
                                                            ? `bg-${productColors[key]}-600/20 ring-1 ring-${productColors[key]}-500 text-white`
                                                            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                                                        }`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    {product.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Tier Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-300 mb-3">
                                        Select Tier
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(['STARTER', 'PRO', 'AGENCY'] as PlanTier[]).map((tier) => (
                                            <button
                                                key={tier}
                                                onClick={() => setSelectedTier(tier)}
                                                className={`p-3 rounded-lg text-sm font-medium transition-all ${selectedTier === tier
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                                                    }`}
                                            >
                                                {tier.charAt(0) + tier.slice(1).toLowerCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {isBundle && (
                            <div className="mb-6">
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-600/10 via-emerald-600/10 to-violet-600/10 rounded-lg ring-1 ring-white/10">
                                    <Sparkles className="h-6 w-6 text-white" />
                                    <div>
                                        <p className="text-white font-medium">All 4 Products Included</p>
                                        <p className="text-slate-400 text-sm">Agency OS, Optimiser, Analyser, Strategiser</p>
                                    </div>
                                </div>

                                {/* Bundle Tier Selection */}
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-slate-300 mb-3">
                                        Select Bundle Tier
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(['STARTER', 'PRO', 'AGENCY'] as PlanTier[]).map((tier) => (
                                            <button
                                                key={tier}
                                                onClick={() => setSelectedTier(tier)}
                                                className={`p-3 rounded-lg text-sm font-medium transition-all ${selectedTier === tier
                                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
                                                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                                                    }`}
                                            >
                                                {tier.charAt(0) + tier.slice(1).toLowerCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Billing Options */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Currency
                                </label>
                                <div className="flex bg-slate-700 rounded-lg p-1">
                                    <button
                                        onClick={() => setCurrency('usd')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${currency === 'usd' ? 'bg-slate-600 text-white' : 'text-slate-400'
                                            }`}
                                    >
                                        USD ($)
                                    </button>
                                    <button
                                        onClick={() => setCurrency('inr')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${currency === 'inr' ? 'bg-slate-600 text-white' : 'text-slate-400'
                                            }`}
                                    >
                                        INR (₹)
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Billing
                                </label>
                                <div className="flex bg-slate-700 rounded-lg p-1">
                                    <button
                                        onClick={() => setInterval('monthly')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${interval === 'monthly' ? 'bg-slate-600 text-white' : 'text-slate-400'
                                            }`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setInterval('yearly')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${interval === 'yearly' ? 'bg-slate-600 text-white' : 'text-slate-400'
                                            }`}
                                    >
                                        Yearly
                                    </button>
                                </div>
                            </div>
                        </div>

                        {interval === 'yearly' && (
                            <p className="text-sm text-emerald-400 mb-4">
                                ✓ Save 17% with annual billing
                            </p>
                        )}
                    </div>

                    {/* Right: Order Summary */}
                    <div className="bg-slate-800/50 rounded-2xl p-8 ring-1 ring-slate-700">
                        <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                        {/* Line Items */}
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-slate-300">
                                    {isBundle
                                        ? `Full Stack Bundle (${selectedTier.charAt(0) + selectedTier.slice(1).toLowerCase()})`
                                        : selectedProduct
                                            ? `${PRODUCTS[selectedProduct].name} (${selectedTier.charAt(0) + selectedTier.slice(1).toLowerCase()})`
                                            : 'No product selected'}
                                </span>
                                <span className="text-white font-medium">
                                    {formatPrice(getPrice(), currency)}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">
                                    Billing: {interval === 'monthly' ? 'Monthly' : 'Yearly'}
                                </span>
                                <span className="text-slate-400">
                                    {interval === 'monthly' ? '/month' : '/year'}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-slate-700 pt-4 mb-6">
                            <div className="flex justify-between text-lg">
                                <span className="text-white font-semibold">Total</span>
                                <span className="text-white font-bold">
                                    {formatPrice(getPrice(), currency)}
                                    <span className="text-sm font-normal text-slate-400">
                                        /{interval === 'monthly' ? 'mo' : 'yr'}
                                    </span>
                                </span>
                            </div>
                        </div>

                        {/* 14-day trial notice */}
                        <div className="bg-indigo-600/10 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Check className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-white font-medium">14-Day Free Trial</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        You won't be charged today. Your trial starts immediately.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4 mb-6">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            disabled={loading || (!isBundle && !selectedProduct)}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="h-5 w-5" />
                                    Start Free Trial
                                </>
                            )}
                        </button>

                        {/* Trust Badges */}
                        <div className="mt-6 flex items-center justify-center gap-4 text-slate-400">
                            <div className="flex items-center gap-1 text-xs">
                                <Shield className="h-4 w-4" />
                                Secure Checkout
                            </div>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs">Powered by Razorpay</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-slate-900">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}
