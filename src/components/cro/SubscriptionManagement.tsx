'use client';

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Check, Crown, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRICING_PLANS, PLAN_LIMITS, PricingPlan } from '@/config/pricing';

interface Subscription {
  plan: 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export function SubscriptionManagement() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (isLoaded && isSignedIn) {
        await Promise.all([fetchSubscription(), fetchPlans()]);
      }
      setLoading(false);
    };
    init();
  }, [isLoaded, isSignedIn]);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/pricing');
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
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

  const handleUpgrade = async (planId: string) => {
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          billingCycle: 'monthly',
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You\'ll lose access to premium features at the end of your billing period.')) {
      return;
    }

    setCanceling(true);
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      if (response.ok) {
        await fetchSubscription();
        alert('Subscription canceled. You\'ll retain access until the end of your billing period.');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setCanceling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/reactivate', {
        method: 'POST',
      });

      if (response.ok) {
        await fetchSubscription();
        alert('Subscription reactivated successfully!');
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      alert('Failed to reactivate subscription. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-secondary"></div>
      </div>
    );
  }

  const currentPlan = subscription?.plan || 'FREE';
  const currentPlanDetails = plans.find(p => p.id === currentPlan) || PRICING_PLANS.find(p => p.id === currentPlan);
  const limits = PLAN_LIMITS[currentPlan];

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'PRO': return <Crown className="h-5 w-5" />;
      case 'TEAM': return <Users className="h-5 w-5" />;
      case 'ENTERPRISE': return <Building2 className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getPlanIcon(currentPlan)}
              <h2 className="text-2xl font-bold text-text-primary">
                {currentPlanDetails?.name || 'Free'} Plan
              </h2>
            </div>

            <p className="text-text-secondary mb-4">
              {subscription?.status === 'active' && subscription.currentPeriodEnd && (
                <>Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</>
              )}
              {subscription?.cancelAtPeriodEnd && (
                <span className="text-yellow-400"> (Cancels at period end)</span>
              )}
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Check className="h-4 w-4 text-green-400" />
                <span>
                  {limits.savedResults === -1 ? 'Unlimited' : limits.savedResults} saved results
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Check className="h-4 w-4 text-green-400" />
                <span>
                  {limits.pdfExports === -1 ? 'Unlimited' : limits.pdfExports} PDF exports per month
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Check className="h-4 w-4 text-green-400" />
                <span>
                  {limits.aiRecommendations === -1 ? 'Unlimited' : limits.aiRecommendations} AI recommendations
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {currentPlan === 'FREE' && (
              <Button onClick={() => handleUpgrade('PRO')}>
                Upgrade to Pro
              </Button>
            )}

            {currentPlan === 'PRO' && !subscription?.cancelAtPeriodEnd && (
              <>
                <Button onClick={() => handleUpgrade('TEAM')}>
                  Upgrade to Team
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelSubscription}
                  disabled={canceling}
                >
                  {canceling ? 'Canceling...' : 'Cancel Subscription'}
                </Button>
              </>
            )}

            {subscription?.cancelAtPeriodEnd && (
              <Button onClick={handleReactivateSubscription}>
                Reactivate Subscription
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      {currentPlan !== 'ENTERPRISE' && (
        <div>
          <h3 className="text-xl font-bold text-text-primary mb-4">
            Upgrade Your Plan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.filter(plan =>
              plan.id !== 'FREE' &&
              plan.id !== currentPlan &&
              (currentPlan === 'FREE' || (currentPlan === 'PRO' && plan.id !== 'PRO'))
            ).map((plan) => (
              <div
                key={plan.id}
                className="bg-bg-secondary border border-border-primary rounded-lg p-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  {getPlanIcon(plan.id)}
                  <h4 className="text-lg font-bold text-text-primary">
                    {plan.name}
                  </h4>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-text-primary">
                    ${plan.price.monthly}
                  </span>
                  <span className="text-text-tertiary">/month</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{feature.name}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => plan.id === 'ENTERPRISE' ? router.push('/contact') : handleUpgrade(plan.id)}
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.id === 'ENTERPRISE' ? 'Contact Sales' : 'Upgrade Now'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

