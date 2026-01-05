import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BuyNowButton } from '@/components/frameworks/BuyNowButton';
import { Check, ShieldCheck, Target, Users, XCircle, Award, Zap, Clock, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

// Fetch product from database
async function getProduct(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug, status: 'published' },
        include: {
            _count: { select: { purchases: true } }
        }
    });
    return product;
}

// Generate dynamic metadata for SEO & Ads
export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return { title: 'Product Not Found' };
    }

    const priceFormatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: product.currency,
        minimumFractionDigits: 0,
    }).format(product.price / 100);

    return {
        title: product.seoTitle || `${product.name} | AureonOne`,
        description: product.seoDescription || `${product.description} Get instant access for ${priceFormatted}.`,
        openGraph: {
            title: product.name,
            description: product.description,
            type: 'website',
            siteName: 'AureonOne',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
        },
    };
}

export default async function ProductPage({ params }: { params: any }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return notFound();
    }

    const priceFormatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: product.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(product.price / 100);

    // Parse content fields
    const deliverables = product.deliverables?.split('\n').filter(Boolean) || [];
    const idealForItems = product.idealFor?.split('\n').filter(Boolean) || [];
    const notIdealForItems = product.notIdealFor?.split('\n').filter(Boolean) || [];
    const purchaseCount = product._count?.purchases || 0;

    return (
        <div className="bg-white dark:bg-gray-950">
            {/* ============================================ */}
            {/* SECTION 1: HERO - Above the Fold (Critical) */}
            {/* ============================================ */}
            <section className="relative overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/30" />

                <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-20 lg:px-8">
                    {/* Breadcrumb - minimal for ad landing */}
                    <div className="mb-6">
                        <Link href="/frameworks" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors">
                            ← All Frameworks
                        </Link>
                    </div>

                    <div className="lg:grid lg:grid-cols-5 lg:gap-x-12 items-start">
                        {/* Left Column - Copy (3 cols) */}
                        <div className="lg:col-span-3">
                            {/* Social Proof Badge */}
                            {purchaseCount > 0 && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full mb-6">
                                    <Users className="w-4 h-4" />
                                    {purchaseCount}+ professionals already using this
                                </div>
                            )}

                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl leading-tight">
                                {product.name}
                            </h1>

                            <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300">
                                {product.description}
                            </p>

                            {product.outcomes && (
                                <p className="mt-4 text-lg text-indigo-600 dark:text-indigo-400 font-semibold">
                                    → {product.outcomes}
                                </p>
                            )}

                            {/* Trust Signals Row */}
                            <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Download className="w-4 h-4 text-green-500" />
                                    Instant Download
                                </div>
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 text-blue-500" />
                                    Lifetime Updates
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-purple-500" />
                                    30-Day Guarantee
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Checkout Card (2 cols) */}
                        <div className="mt-10 lg:mt-0 lg:col-span-2">
                            <div className="sticky top-8 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900 p-8 shadow-xl shadow-indigo-500/10">
                                {/* Price */}
                                <div className="text-center mb-6">
                                    <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">{priceFormatted}</span>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">One-time payment • No subscription</p>
                                </div>

                                {/* Primary CTA */}
                                <BuyNowButton
                                    productId={product.slug}
                                    price={product.price}
                                    currency={product.currency}
                                    className="w-full text-lg py-4 font-semibold"
                                    buttonText="Get Instant Access"
                                />

                                {/* Trust Badges */}
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        Secure payment via Razorpay
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                        Delivered to your email instantly
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <RefreshCw className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        Free updates for life
                                    </div>
                                </div>

                                {/* Guarantee */}
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        <strong className="text-gray-700 dark:text-gray-300">100% Money-Back Guarantee</strong>
                                        <br />Not satisfied? Full refund within 30 days.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* SECTION 2: THE PROBLEM (Agitation) */}
            {/* ============================================ */}
            {product.problemStatement && (
                <section className="py-16 sm:py-24 border-y border-gray-200 dark:border-gray-800">
                    <div className="mx-auto max-w-3xl px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <Target className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">The Problem</h2>
                        </div>
                        <div className="space-y-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                            {product.problemStatement.split('\n').filter(Boolean).map((para, idx) => (
                                <p key={idx}>{para}</p>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================ */}
            {/* SECTION 3: THE SOLUTION (Framework Intro) */}
            {/* ============================================ */}
            {product.longDescription && (
                <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950">
                    <div className="mx-auto max-w-3xl px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">The Solution</h2>
                        <div className="space-y-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                            {product.longDescription.split('\n').filter(Boolean).map((para, idx) => (
                                <p key={idx}>{para}</p>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================ */}
            {/* SECTION 4: WHAT YOU GET (Deliverables) */}
            {/* ============================================ */}
            {deliverables.length > 0 && (
                <section className="py-16 sm:py-24 border-y border-gray-200 dark:border-gray-800">
                    <div className="mx-auto max-w-3xl px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-10">What You Get</h2>
                        <div className="space-y-4">
                            {deliverables.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex-shrink-0">
                                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-lg text-gray-700 dark:text-gray-200 pt-1">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================ */}
            {/* SECTION 5 & 6: WHO SHOULD / SHOULD NOT BUY */}
            {/* ============================================ */}
            {(idealForItems.length > 0 || notIdealForItems.length > 0) && (
                <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
                    <div className="mx-auto max-w-5xl px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                            {idealForItems.length > 0 && (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-green-200 dark:border-green-900/50">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">This is for you if...</h2>
                                    </div>
                                    <ul className="space-y-3">
                                        {idealForItems.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {notIdealForItems.length > 0 && (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-red-200 dark:border-red-900/50">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                            <XCircle className="w-5 h-5 text-red-500" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">This is NOT for you if...</h2>
                                    </div>
                                    <ul className="space-y-3">
                                        {notIdealForItems.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================ */}
            {/* SECTION 7: HOW TO USE IT */}
            {/* ============================================ */}
            {product.howToUse && (
                <section className="py-16 sm:py-24 border-y border-gray-200 dark:border-gray-800">
                    <div className="mx-auto max-w-3xl px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-10">How It Works</h2>
                        <div className="space-y-6">
                            {product.howToUse.split('\n').filter(Boolean).map((step, idx) => (
                                <div key={idx} className="flex items-start gap-5">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-lg flex-shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-lg text-gray-700 dark:text-gray-200">{step}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================ */}
            {/* SECTION 8: CREDIBILITY / AUTHORITY */}
            {/* ============================================ */}
            {product.credibilityText && (
                <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900/50">
                    <div className="mx-auto max-w-3xl px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Why Trust This</h2>
                        </div>
                        <div className="space-y-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                            {product.credibilityText.split('\n').filter(Boolean).map((para, idx) => (
                                <p key={idx}>{para}</p>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================ */}
            {/* SECTION 9: FINAL CTA (Conversion Block) */}
            {/* ============================================ */}
            <section className="py-20 sm:py-28 bg-gradient-to-br from-indigo-600 to-purple-700">
                <div className="mx-auto max-w-2xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                        Ready to get started?
                    </h2>
                    <p className="mt-4 text-lg text-indigo-100">
                        Join professionals who are already using this framework.
                    </p>

                    <div className="mt-8 flex flex-col items-center gap-4">
                        <BuyNowButton
                            productId={product.slug}
                            price={product.price}
                            currency={product.currency}
                            className="text-lg py-4 px-12 bg-white text-indigo-600 hover:bg-gray-100"
                            buttonText={`Get Access for ${priceFormatted}`}
                        />
                        <p className="text-sm text-indigo-200">
                            Instant delivery • Lifetime updates • 30-day guarantee
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
