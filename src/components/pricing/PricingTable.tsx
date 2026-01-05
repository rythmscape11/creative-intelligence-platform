'use client';

import { useState } from 'react';
import { Check, X, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRICING_PLANS, YEARLY_DISCOUNT_PERCENTAGE } from '@/config/pricing';
import { useCurrency } from '@/contexts/currency-context';
import { CurrencyToggle } from '@/components/ui/currency-toggle';
import Link from 'next/link';

export function PricingTable() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { formatPrice } = useCurrency();

  return (
    <div>
      {/* Currency and Billing Toggle */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
        <CurrencyToggle />
        <div className="inline-flex items-center gap-4 bg-bg-secondary border border-border-primary rounded-lg p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${billingCycle === 'monthly'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${billingCycle === 'yearly'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            Yearly
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
              Save {YEARLY_DISCOUNT_PERCENTAGE}%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_PLANS.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
          const displayPrice = billingCycle === 'yearly' && price > 0 ? Math.round(price / 12) : price;

          return (
            <div
              key={plan.id}
              className={`relative bg-bg-secondary border rounded-xl p-6 flex flex-col ${plan.popular
                ? 'border-primary shadow-lg shadow-primary/20 scale-105'
                : 'border-border-primary'
                }`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  {price === 0 ? (
                    <span className="text-4xl font-bold text-text-primary">Free</span>
                  ) : plan.id === 'ENTERPRISE' ? (
                    <span className="text-4xl font-bold text-text-primary">Custom</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-text-primary">{formatPrice(displayPrice)}</span>
                      <span className="text-text-tertiary">/month</span>
                    </>
                  )}
                </div>

                {billingCycle === 'yearly' && price > 0 && plan.id !== 'ENTERPRISE' && (
                  <p className="text-xs text-text-tertiary mt-1">
                    Billed {formatPrice(price)}/year
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-text-tertiary flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-text-secondary' : 'text-text-tertiary'}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {plan.id === 'FREE' ? (
                <Link href="/tools">
                  <Button variant="outline" className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              ) : plan.id === 'ENTERPRISE' ? (
                <Link href="/contact">
                  <Button variant="outline" className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              ) : (
                <Link href={`/auth/signin?plan=${plan.id.toLowerCase()}&billing=${billingCycle}`}>
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-text-tertiary">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>30-day money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}

