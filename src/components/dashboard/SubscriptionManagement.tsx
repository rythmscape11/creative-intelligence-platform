'use client';

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, CreditCard, Calendar, AlertCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRICING_PLANS, PLAN_LIMITS, PricingPlan } from '@/config/pricing';
import Link from 'next/link';

interface Subscription {
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
}

export function SubscriptionManagement() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchSubscription(), fetchPlans()]);
      setLoading(false);
    };
    init();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/pricing');
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      // Fallback to default plans if API fails
      setPlans(PRICING_PLANS);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  const handleUpgrade = (planId: string) => {
    // Redirect to pricing page with plan parameter
    router.push(`/pricing?plan=${planId.toLowerCase()}`);
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      if (response.ok) {
        fetchSubscription();
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/reactivate', {
        method: 'POST',
      });

      if (response.ok) {
        fetchSubscription();
      }
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentPlan = subscription?.plan || 'FREE';
  const planDetails = plans.find(p => p.id === currentPlan) || PRICING_PLANS.find(p => p.id === currentPlan);
  // Handle legacy TEAM plan mapping to AGENCY
  const limits = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.FREE;

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border-primary rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-text-primary">
                {planDetails?.name || 'Free'} Plan
              </h2>
              {currentPlan !== 'FREE' && (
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                  {subscription?.status}
                </span>
              )}
            </div>
            <p className="text-text-secondary">
              {planDetails?.description || 'All tools, unlimited usage'}
            </p>
          </div>

          {currentPlan !== 'FREE' && (
            <div className="text-right">
              <div className="text-3xl font-bold text-text-primary">
                ${planDetails?.price.monthly || 0}
              </div>
              <div className="text-sm text-text-tertiary">per month</div>
            </div>
          )}
        </div>

        {/* Subscription Details */}
        {subscription && currentPlan !== 'FREE' && (
          <div className="space-y-3 mb-6">
            {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>
                  Trial ends on {new Date(subscription.trialEnd).toLocaleDateString()}
                </span>
              </div>
            )}

            {subscription.currentPeriodEnd && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4" />
                <span>
                  {subscription.cancelAtPeriodEnd ? 'Access until' : 'Renews on'}{' '}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
            )}

            {subscription.cancelAtPeriodEnd && (
              <div className="flex items-center gap-2 text-sm text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span>Your subscription will be canceled at the end of the billing period</span>
              </div>
            )}
          </div>
        )}

        {/* Features */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {planDetails?.features.filter(f => f.included).map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-text-secondary">{feature.name}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {currentPlan === 'FREE' ? (
            <Link href="/pricing">
              <Button>
                Upgrade to Pro
              </Button>
            </Link>
          ) : subscription?.cancelAtPeriodEnd ? (
            <Button onClick={handleReactivateSubscription}>
              Reactivate Subscription
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancelSubscription}>
                Cancel Subscription
              </Button>
              <Link href="/pricing">
                <Button variant="outline">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Billing
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Upgrade Options (if on Free or Pro plan) */}
      {(currentPlan === 'FREE' || currentPlan === 'PRO') && (
        <div>
          <h3 className="text-xl font-bold text-text-primary mb-4">
            {currentPlan === 'FREE' ? 'Upgrade Your Plan' : 'Upgrade to Agency'}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {plans.filter(p => {
              // Show relevant upgrade options
              if (currentPlan === 'FREE') return p.id === 'PRO' || p.id === 'AGENCY';
              if (currentPlan === 'PRO') return p.id === 'AGENCY';
              return false;
            }).map((plan) => (
              <div
                key={plan.id}
                className={`bg-bg-secondary border rounded-xl p-6 ${plan.id === 'AGENCY' ? 'border-purple-500' : plan.popular ? 'border-cyan-500' : 'border-border-primary'
                  }`}
              >
                {plan.badge && (
                  <div className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full mb-4 ${plan.id === 'AGENCY' ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                    {plan.id === 'AGENCY' ? <Building2 className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    {plan.badge}
                  </div>
                )}

                <h4 className="text-xl font-bold text-text-primary mb-2">
                  {plan.name}
                </h4>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-text-primary">
                    ${plan.price.monthly}
                  </span>
                  <span className="text-text-tertiary">/month</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.filter(f => f.included).slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${feature.highlight ? 'text-cyan-400' : 'text-green-400'
                        }`} />
                      <span>{feature.name}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.id === 'AGENCY' ? 'bg-purple-500 hover:bg-purple-600' : ''
                    }`}
                  variant={plan.id === 'AGENCY' ? 'default' : plan.popular ? 'default' : 'outline'}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
