'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Coins,
    Check,
    Sparkles,
    Zap,
    Building,
    Rocket,
    Search,
    Globe,
    Link2,
    Target,
    FileSearch,
    Lightbulb,
    CreditCard,
    Loader2
} from 'lucide-react';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface CreditPack {
    id: string;
    name: string;
    credits: number;
    priceInr: number;
    priceUsd: number;
    description: string;
    popular?: boolean;
}

interface CreditBalance {
    balance: number;
    totalPurchased: number;
    totalUsed: number;
}

const CREDIT_PACKS: CreditPack[] = [
    {
        id: 'starter',
        name: 'Starter',
        credits: 100,
        priceInr: 499,
        priceUsd: 5.99,
        description: 'Perfect for trying out the platform',
    },
    {
        id: 'pro',
        name: 'Pro',
        credits: 500,
        priceInr: 1999,
        priceUsd: 23.99,
        description: 'Best for regular SEO research',
        popular: true,
    },
    {
        id: 'agency',
        name: 'Agency',
        credits: 2000,
        priceInr: 6999,
        priceUsd: 83.99,
        description: 'For agencies and heavy users',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        credits: 10000,
        priceInr: 29999,
        priceUsd: 359.99,
        description: 'Maximum value for enterprises',
    },
];

const FEATURES = [
    { name: 'Keyword Research', credits: 1, icon: Search, desc: 'Volume, CPC, competition per keyword' },
    { name: 'SERP Analysis', credits: 5, icon: FileSearch, desc: 'Full SERP with snippets & PAA' },
    { name: 'Domain Intelligence', credits: 10, icon: Globe, desc: 'Traffic, keywords, competitors' },
    { name: 'Backlink Profile', credits: 15, icon: Link2, desc: 'All backlinks + referring domains' },
    { name: 'On-Page SEO Audit', credits: 20, icon: Target, desc: 'Core Web Vitals + optimizations' },
    { name: 'Content Gap Finder', credits: 20, icon: Lightbulb, desc: 'Find competitor keyword gaps' },
    { name: 'GEO Analysis', credits: 25, icon: Sparkles, desc: 'AI search visibility scoring' },
];

export default function PricingPage() {
    const [credits, setCredits] = useState<CreditBalance | null>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    useEffect(() => {
        fetchCredits();
        loadRazorpay();
    }, []);

    function loadRazorpay() {
        if (typeof window !== 'undefined' && !window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => setRazorpayLoaded(true);
            document.body.appendChild(script);
        } else {
            setRazorpayLoaded(true);
        }
    }

    async function fetchCredits() {
        try {
            const res = await fetch('/api/analyser/credits');
            const data = await res.json();
            if (data.success) {
                setCredits(data.credits);
            }
        } catch (error) {
            console.error('Failed to fetch credits:', error);
        } finally {
            setLoading(false);
        }
    }

    async function purchasePack(pack: CreditPack) {
        if (!razorpayLoaded) {
            alert('Payment system loading. Please try again.');
            return;
        }

        setPurchasing(pack.id);

        try {
            const res = await fetch('/api/analyser/credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packId: pack.id }),
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.error || 'Failed to create order');
                setPurchasing(null);
                return;
            }

            // Open Razorpay checkout
            const options = {
                key: data.razorpayKeyId,
                amount: data.amount,
                currency: data.currency,
                name: 'Aureon One',
                description: `${pack.credits} Analyser Credits`,
                order_id: data.orderId,
                prefill: data.prefill || {},
                handler: async function (response: any) {
                    // Verify payment and add credits immediately
                    try {
                        const verifyRes = await fetch('/api/analyser/credits/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                packId: pack.id,
                                credits: pack.credits,
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            alert(`✅ Payment successful! ${verifyData.creditsAdded} credits added. New balance: ${verifyData.newBalance}`);
                        } else {
                            alert(`Payment received! Credits will be added shortly. If not updated in 5 minutes, please contact support.`);
                        }
                    } catch (verifyError) {
                        console.error('Verification error:', verifyError);
                        alert('Payment received! Credits will be added shortly via webhook.');
                    }

                    fetchCredits();
                    setPurchasing(null);
                },
                modal: {
                    ondismiss: function () {
                        setPurchasing(null);
                    }
                },
                theme: {
                    color: '#6366f1',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Purchase error:', error);
            alert('Failed to initiate purchase. Please try again.');
            setPurchasing(null);
        }
    }

    function getPackIcon(packId: string) {
        switch (packId) {
            case 'starter': return <Zap className="h-6 w-6 text-blue-500" />;
            case 'pro': return <Sparkles className="h-6 w-6 text-purple-500" />;
            case 'agency': return <Building className="h-6 w-6 text-orange-500" />;
            case 'enterprise': return <Rocket className="h-6 w-6 text-red-500" />;
            default: return <Coins className="h-6 w-6" />;
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        Analyser Credits
                    </span>
                </h1>
                <p className="text-xl text-muted-foreground">
                    Pay-as-you-go SEO intelligence. No subscriptions required.
                </p>
            </div>

            {/* Current Balance */}
            <Card className="mb-12 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/20">
                <CardContent className="py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Your Current Balance</p>
                            <p className="text-6xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                {loading ? '...' : credits?.balance || 0}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                {credits ? `${credits.totalPurchased} purchased • ${credits.totalUsed} used` : 'Sign in to view balance'}
                            </p>
                        </div>
                        <div className="text-right">
                            <Coins className="h-20 w-20 text-yellow-500/30" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {CREDIT_PACKS.map((pack) => (
                    <Card
                        key={pack.id}
                        className={`relative overflow-hidden transition-all hover:shadow-lg ${pack.popular ? 'border-purple-500 ring-2 ring-purple-500/20' : ''
                            }`}
                    >
                        {pack.popular && (
                            <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-medium">
                                MOST POPULAR
                            </div>
                        )}
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                {getPackIcon(pack.id)}
                                <CardTitle>{pack.name}</CardTitle>
                            </div>
                            <CardDescription>{pack.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">₹{pack.priceInr}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">${pack.priceUsd} USD</p>
                            </div>

                            <div className="mb-6 p-3 bg-muted/50 rounded-lg text-center">
                                <span className="text-3xl font-bold text-indigo-500">{pack.credits}</span>
                                <span className="text-muted-foreground ml-2">credits</span>
                                <p className="text-xs text-muted-foreground mt-1">
                                    ₹{(pack.priceInr / pack.credits).toFixed(2)}/credit
                                </p>
                            </div>

                            <Button
                                className="w-full"
                                size="lg"
                                variant={pack.popular ? 'default' : 'outline'}
                                onClick={() => purchasePack(pack)}
                                disabled={purchasing === pack.id}
                            >
                                {purchasing === pack.id ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Buy Now
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Feature Pricing */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Credit Costs per Feature
                    </CardTitle>
                    <CardDescription>
                        Each feature deducts credits from your balance when used
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {FEATURES.map((feature, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <feature.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{feature.name}</p>
                                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                                </div>
                                <Badge variant="secondary" className="text-lg px-3">
                                    {feature.credits}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
                <CardHeader>
                    <CardTitle>What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                        {[
                            'Real-time data from DataForSEO',
                            'AI-powered GEO analysis with OpenAI',
                            'Unlimited project tracking',
                            'Export data to CSV',
                            'No monthly fees',
                            'Credits never expire',
                            'Secure Razorpay payments',
                            'Email support',
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center mt-12">
                <p className="text-muted-foreground mb-4">
                    New users get <span className="font-bold text-green-500">25 free credits</span> to try the platform
                </p>
                <Button size="lg" asChild>
                    <Link href="/analyser">
                        Start Using Analyser
                    </Link>
                </Button>
            </div>
        </div>
    );
}
