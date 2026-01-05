/**
 * Upgrade Nudges Configuration
 * 
 * Controls contextual upgrade prompts throughout the app.
 * All nudges are non-intrusive and session-limited.
 */

export interface NudgeMessage {
    id: string;
    trigger: string;
    message: string;
    cta: string;
    targetPlan: 'PRO' | 'AGENCY' | 'ENTERPRISE';
}

export const NUDGE_CONFIG = {
    /** Master switch for nudges */
    enabled: process.env.NEXT_PUBLIC_ENABLE_NUDGES !== 'false',

    /** Maximum nudges per session */
    maxPerSession: 1,

    /** Cooldown between nudges (minutes) */
    cooldownMinutes: 30,

    /** Don't show nudges to paying users */
    excludePaidUsers: true,
};

/**
 * Contextual nudge messages
 */
export const NUDGE_MESSAGES: NudgeMessage[] = [
    {
        id: 'white_label',
        trigger: 'export_pdf',
        message: 'Remove watermarks and add your branding',
        cta: 'Upgrade to Pro',
        targetPlan: 'PRO',
    },
    {
        id: 'unlimited_strategies',
        trigger: 'strategy_limit',
        message: "You've used 5/5 strategies this month",
        cta: 'Go Unlimited',
        targetPlan: 'PRO',
    },
    {
        id: 'team_seats',
        trigger: 'invite_team',
        message: 'Collaborate with your team on Agency plan',
        cta: 'Upgrade to Agency',
        targetPlan: 'AGENCY',
    },
    {
        id: 'api_access',
        trigger: 'api_request',
        message: 'Automate with API access on Agency plan',
        cta: 'Unlock API',
        targetPlan: 'AGENCY',
    },
    {
        id: 'client_portal',
        trigger: 'share_client',
        message: 'White-label client portals on Agency plan',
        cta: 'Upgrade to Agency',
        targetPlan: 'AGENCY',
    },
    {
        id: 'advanced_export',
        trigger: 'export_pptx',
        message: 'Export to PPTX/DOCX on Pro plan',
        cta: 'Upgrade to Pro',
        targetPlan: 'PRO',
    },
];

/**
 * Get nudge message by trigger
 */
export function getNudgeByTrigger(trigger: string): NudgeMessage | undefined {
    if (!NUDGE_CONFIG.enabled) return undefined;
    return NUDGE_MESSAGES.find(n => n.trigger === trigger);
}

/**
 * Get all nudges for a target plan
 */
export function getNudgesForPlan(plan: 'PRO' | 'AGENCY' | 'ENTERPRISE'): NudgeMessage[] {
    return NUDGE_MESSAGES.filter(n => n.targetPlan === plan);
}
