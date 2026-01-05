import { checkSubscriptionGate, SubscriptionRequest } from './subscription-gate';

describe('Subscription Gate Logic', () => {
    it('should allow monthly plans with 1 user', () => {
        const request: SubscriptionRequest = {
            planId: 'pro_plan',
            billingCycle: 'MONTHLY',
            userCount: 1,
        };
        const result = checkSubscriptionGate(request);
        expect(result.allowed).toBe(true);
    });

    it('should reject annual plans with less than 3 users', () => {
        const request: SubscriptionRequest = {
            planId: 'pro_plan',
            billingCycle: 'ANNUAL',
            userCount: 2,
        };
        const result = checkSubscriptionGate(request);
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain('minimum of 3 users');
    });

    it('should allow annual plans with 3 or more users', () => {
        const request: SubscriptionRequest = {
            planId: 'pro_plan',
            billingCycle: 'ANNUAL',
            userCount: 3,
        };
        const result = checkSubscriptionGate(request);
        expect(result.allowed).toBe(true);
    });
});
