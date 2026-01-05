/**
 * Monetization Events Logger
 * 
 * Lightweight logging for conversion signals.
 * Logs locally in dev, sends to API in production.
 */

type MonetizationEventType =
    | 'upgrade_click'
    | 'paywall_hit'
    | 'trial_expire'
    | 'limit_reached'
    | 'nudge_shown'
    | 'nudge_clicked'
    | 'email_captured'
    | 'checkout_started'
    | 'checkout_completed';

interface MonetizationEvent {
    type: MonetizationEventType;
    userId?: string;
    feature?: string;
    currentPlan?: string;
    targetPlan?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Log a monetization event
 */
export async function logMonetizationEvent(event: MonetizationEvent): Promise<void> {
    const timestamp = new Date().toISOString();
    const enrichedEvent = {
        ...event,
        timestamp,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    };

    // Always log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log('[Monetization Event]', enrichedEvent);
    }

    // In production, send to API
    if (process.env.NODE_ENV === 'production') {
        try {
            await fetch('/api/admin/monetization-events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrichedEvent),
            });
        } catch (error) {
            // Silent fail - don't break user flow
            console.warn('Failed to log monetization event:', error);
        }
    }
}

/**
 * Log an upgrade button click
 */
export function logUpgradeClick(
    currentPlan: string,
    targetPlan: string,
    feature?: string
): void {
    logMonetizationEvent({
        type: 'upgrade_click',
        currentPlan,
        targetPlan,
        feature,
    });
}

/**
 * Log when a user hits a paywall
 */
export function logPaywallHit(
    feature: string,
    currentPlan: string,
    requiredPlan: string
): void {
    logMonetizationEvent({
        type: 'paywall_hit',
        feature,
        currentPlan,
        targetPlan: requiredPlan,
    });
}

/**
 * Log when a user reaches their limit
 */
export function logLimitReached(
    feature: string,
    currentPlan: string,
    currentUsage: number,
    limit: number
): void {
    logMonetizationEvent({
        type: 'limit_reached',
        feature,
        currentPlan,
        metadata: { currentUsage, limit },
    });
}

/**
 * Log when a nudge is shown
 */
export function logNudgeShown(nudgeId: string, trigger: string): void {
    logMonetizationEvent({
        type: 'nudge_shown',
        metadata: { nudgeId, trigger },
    });
}

/**
 * Log when a nudge is clicked
 */
export function logNudgeClicked(nudgeId: string, targetPlan: string): void {
    logMonetizationEvent({
        type: 'nudge_clicked',
        targetPlan,
        metadata: { nudgeId },
    });
}

/**
 * Log when an email is captured
 */
export function logEmailCaptured(source: string, toolId?: string): void {
    logMonetizationEvent({
        type: 'email_captured',
        metadata: { source, toolId },
    });
}
