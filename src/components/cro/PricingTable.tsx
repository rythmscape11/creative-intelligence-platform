'use client';

import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Check, X, Sparkles, Building2, Zap, Users, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRICING_PLANS as DEFAULT_PLANS, VALUE_PROPS, PricingPlan } from '@/config/pricing';
import { PaymentGatewaySelector } from '@/components/payment/payment-gateway-selector';
import { useCurrency } from '@/contexts/currency-context';
import { CurrencyToggle } from '@/components/ui/currency-toggle';
import { Currency, formatPrice as formatPriceUtil } from '@/lib/currency';

interface PricingTableProps {
  plans?: PricingPlan[];
}

export function PricingTable({ plans = DEFAULT_PLANS }: PricingTableProps) {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { formatPrice, currency } = useCurrency();

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'FREE') {
      router.push('/auth/signup');
      return;
    }

    if (planId === 'ENTERPRISE') {
      router.push('/contact');
      return;
    }

    if (planId === 'AGENCY') {
      // Agency tier - Book a demo
      router.push('/demo?plan=agency');
      return;
    }

    if (!isSignedIn) {
      router.push(`/auth/signup?plan=${planId.toLowerCase()}`);
      return;
    }
  };

  // Plan icons
  const planIcons = {
    FREE: <Zap className="w-5 h-5" />,
    PRO: <Sparkles className="w-5 h-5" />,
    AGENCY: <Building2 className="w-5 h-5" />,
    ENTERPRISE: <Users className="w-5 h-5" />,
  };

  return (
    <div className="space-y-10">
      {/* Currency and Billing Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <CurrencyToggle />
        <div className="flex items-center gap-4">
          <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-text-primary font-medium' : 'text-gray-500 dark:text-text-tertiary'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 bg-gray-200 dark:bg-bg-tertiary"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-cyan-500 transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
          <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-text-primary font-medium' : 'text-gray-500 dark:text-text-tertiary'}`}>
            Yearly
            <span className="ml-2 inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
              Save 17%
            </span>
          </span>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-gray-600 dark:text-text-secondary">
          From solo freelancers to enterprise agencies — choose the plan that scales with your ambition.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
          const priceInr = plan.priceInr ? (billingCycle === 'monthly' ? plan.priceInr.monthly : plan.priceInr.yearly) : null;

          const shouldUseInr = currency === 'INR' && priceInr !== null;
          const displayPriceValue = shouldUseInr ? priceInr : price;
          const displayPrice = billingCycle === 'yearly' && displayPriceValue > 0 ? Math.round(displayPriceValue / 12) : displayPriceValue;

          const formatDisplayPrice = (amount: number) => {
            if (shouldUseInr) {
              return formatPriceUtil(amount, 'INR');
            }
            return formatPrice(amount);
          };

          const isAgency = plan.id === 'AGENCY';
          const isEnterprise = plan.id === 'ENTERPRISE';
          const isPro = plan.id === 'PRO';

          return (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-bg-secondary rounded-xl border p-6 flex flex-col transition-all duration-300 hover:shadow-xl ${isPro
                ? 'border-cyan-500 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-500/20'
                : isAgency
                  ? 'border-purple-500/50 shadow-lg shadow-purple-500/10'
                  : 'border-gray-200 dark:border-border-primary hover:border-gray-300'
                }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${isPro ? 'bg-cyan-500 text-white' : 'bg-purple-500 text-white'
                    }`}>
                    {planIcons[plan.id as keyof typeof planIcons]}
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6 pt-2">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${isPro ? 'bg-cyan-500/10 text-cyan-500'
                  : isAgency ? 'bg-purple-500/10 text-purple-500'
                    : 'bg-gray-100 dark:bg-bg-tertiary text-gray-600 dark:text-text-secondary'
                  }`}>
                  {planIcons[plan.id as keyof typeof planIcons]}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-text-tertiary mt-1">
                  {plan.tagline}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-text-primary">
                    {price === 0 ? 'Free' : isEnterprise ? 'Custom' : formatDisplayPrice(displayPrice)}
                  </span>
                  {price > 0 && !isEnterprise && (
                    <span className="text-gray-500 dark:text-text-tertiary text-sm">
                      /mo
                    </span>
                  )}
                </div>
                {billingCycle === 'yearly' && price > 0 && !isEnterprise && (
                  <p className="text-xs text-gray-500 dark:text-text-tertiary mt-1">
                    {formatDisplayPrice(shouldUseInr ? priceInr! : price)} billed annually
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-text-tertiary mt-2">
                  {plan.targetAudience}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-text-secondary text-center mb-6">
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${feature.highlight ? 'text-cyan-500' : 'text-green-500'
                        }`} />
                    ) : (
                      <X className="h-5 w-5 flex-shrink-0 mt-0.5 text-gray-300 dark:text-gray-600" />
                    )}
                    <span className={`text-sm ${feature.included
                      ? feature.highlight
                        ? 'text-gray-900 dark:text-text-primary font-medium'
                        : 'text-gray-600 dark:text-text-secondary'
                      : 'text-gray-400 dark:text-text-tertiary line-through'
                      }`}>
                      {feature.name}
                      {feature.limit && (
                        <span className="text-gray-500 dark:text-text-tertiary ml-1 text-xs">
                          ({feature.limit})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-auto space-y-2">
                {plan.id === 'FREE' ? (
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    variant="outline"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                ) : plan.id === 'ENTERPRISE' ? (
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    variant="outline"
                    className="w-full group"
                  >
                    <PhoneCall className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                    {plan.cta}
                  </Button>
                ) : plan.id === 'AGENCY' ? (
                  <>
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      {plan.cta}
                    </Button>
                    {plan.ctaSecondary && (
                      <p className="text-xs text-center text-gray-500 dark:text-text-tertiary">
                        {plan.ctaSecondary}
                      </p>
                    )}
                  </>
                ) : !isSignedIn ? (
                  <>
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      {plan.cta}
                    </Button>
                    {plan.ctaSecondary && (
                      <p className="text-xs text-center text-gray-500 dark:text-text-tertiary">
                        {plan.ctaSecondary}
                      </p>
                    )}
                  </>
                ) : (
                  <PaymentGatewaySelector
                    billingCycle={billingCycle === 'yearly' ? 'annual' : 'monthly'}
                    planName={plan.name}
                    planTier={plan.id as 'PRO' | 'AGENCY'}
                    buttonText="Upgrade Now"
                    buttonClassName={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${isPro
                      ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Agency Highlight Section */}
      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
        <div className="max-w-3xl mx-auto text-center">
          <Building2 className="w-12 h-12 mx-auto text-purple-500 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-2">
            Built for Agencies
          </h3>
          <p className="text-gray-600 dark:text-text-secondary mb-6">
            White-label everything. Deliver unlimited client strategies under your brand.
            Your clients will never know we exist.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-text-secondary">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-purple-500" />
              Custom branding
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-purple-500" />
              10 team seats
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-purple-500" />
              API access
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-purple-500" />
              Client workspaces
            </div>
          </div>
          <Button
            onClick={() => router.push('/demo?plan=agency')}
            className="mt-6 bg-purple-500 hover:bg-purple-600 text-white px-8 py-3"
          >
            <PhoneCall className="w-4 h-4 mr-2" />
            Book an Agency Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
