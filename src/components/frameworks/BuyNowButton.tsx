'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, X } from 'lucide-react';
import Script from 'next/script';

interface BuyNowButtonProps {
    productId: string;
    price: number;
    currency: string;
    className?: string;
    buttonText?: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export function BuyNowButton({
    productId,
    price,
    currency,
    className = "",
    buttonText = "Buy Now"
}: BuyNowButtonProps) {
    const [loading, setLoading] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const router = useRouter();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleBuyClick = () => {
        setShowEmailModal(true);
        setEmail('');
        setEmailError('');
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        setShowEmailModal(false);
        await processPurchase(email);
    };

    const processPurchase = async (customerEmail: string) => {
        try {
            setLoading(true);

            // 1. Create Order
            const res = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, email: customerEmail }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create order');
            }

            const orderData = await res.json();

            // 2. Initialize Razorpay Checkout
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'AureonOne',
                description: orderData.productName,
                order_id: orderData.orderId,
                prefill: {
                    email: customerEmail,
                },
                theme: {
                    color: '#6366f1'
                },
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        if (verifyRes.ok) {
                            router.push('/thank-you');
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Payment verification error. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            setLoading(false);

        } catch (error: any) {
            console.error('Purchase failed:', error);
            alert('Purchase failed: ' + error.message);
            setLoading(false);
        }
    };

    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />

            <button
                onClick={handleBuyClick}
                disabled={loading}
                className={`inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    buttonText
                )}
            </button>

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6">
                        <button
                            onClick={() => setShowEmailModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Enter your email
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            We'll send your download links to this email after purchase.
                        </p>

                        <form onSubmit={handleEmailSubmit}>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError('');
                                    }}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    autoFocus
                                />
                                {emailError && (
                                    <p className="mt-2 text-sm text-red-500">{emailError}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
                            >
                                Continue to Payment
                            </button>
                        </form>

                        <p className="mt-4 text-xs text-center text-gray-400">
                            Your email is only used for order delivery. No spam.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
