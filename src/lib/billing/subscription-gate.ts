/**
 * Minimum Contract Value (MCV) Enforcement Logic.
 * Ensures that high-value plans maintain profitability thresholds.
 */

export interface SubscriptionRequest {
    planId: string;
    billingCycle: 'MONTHLY' | 'ANNUAL';
    userCount: number;
}

export interface GateResult {
    allowed: boolean;
    reason?: string;
}

const MIN_USERS_FOR_ANNUAL = 3;

/**
 * Checks if a subscription request meets the Minimum Contract Value (MCV).
 * Rule: Annual plans require a minimum of 3 users.
 */
export function checkSubscriptionGate(request: SubscriptionRequest): GateResult {
    if (request.billingCycle === 'ANNUAL') {
        if (request.userCount < MIN_USERS_FOR_ANNUAL) {
            return {
                allowed: false,
                reason: `Annual billing requires a minimum of ${MIN_USERS_FOR_ANNUAL} users. Please increase user count or switch to monthly billing.`,
            };
        }
    }

    // Future logic: Check for enterprise features, etc.

    return { allowed: true };
}
