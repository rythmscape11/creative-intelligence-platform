/**
 * Tool Access Control Configuration
 * 
 * Controls which tools are available to which users based on:
 * 1. Admin status (full access)
 * 2. Subscription plan (FREE, PRO, AGENCY, ENTERPRISE)
 */

export type PlanTier = 'FREE' | 'PRO' | 'AGENCY' | 'ENTERPRISE';

export interface ToolAccessConfig {
    id: string;
    name: string;
    description: string;
    route: string;
    minPlan: PlanTier;
    adminOnly?: boolean;
}

// Admin emails with full access to all tools
export const ADMIN_EMAILS = [
    'mukherjeeanustup@gmail.com',
    process.env.ADMIN_EMAIL,
].filter(Boolean) as string[];

// Tool configurations with access levels
export const TOOL_CONFIGS: ToolAccessConfig[] = [
    // Strategy Tools - Core Product
    {
        id: 'strategy-builder',
        name: 'AI Strategy Builder',
        description: 'Generate comprehensive marketing strategies with AI',
        route: '/dashboard',
        minPlan: 'FREE',
    },
    {
        id: 'enhanced-strategy',
        name: 'Enhanced Strategy Builder',
        description: 'Director-level marketing strategies',
        route: '/strategy',
        minPlan: 'PRO',
    },

    // Lead Tools - Admin Only (Internal Use)
    {
        id: 'lead-chaser',
        name: 'Lead Chaser',
        description: 'Automated email sequences for lead nurturing',
        route: '/dashboard/lead-chaser',
        minPlan: 'ENTERPRISE',
        adminOnly: true,
    },

    // Content Tools - Admin Only
    {
        id: 'blog-automation',
        name: 'Auto Blog Generator',
        description: 'AI-powered blog content generation and scheduling',
        route: '/dashboard/blog-automation',
        minPlan: 'ENTERPRISE',
        adminOnly: true,
    },

    // Analysis Tools
    {
        id: 'competitor-analysis',
        name: 'Competitor Analysis',
        description: 'Deep competitor intelligence and market analysis',
        route: '/growth-suite/competitors',
        minPlan: 'PRO',
    },

    // White-Label - Agency Only
    {
        id: 'agency-branding',
        name: 'Agency Branding',
        description: 'White-label reports with custom branding',
        route: '/dashboard/agency-branding',
        minPlan: 'AGENCY',
    },
    {
        id: 'client-workspaces',
        name: 'Client Workspaces',
        description: 'Separate workspaces for each client',
        route: '/dashboard/client-workspaces',
        minPlan: 'AGENCY',
    },

    // Admin Tools
    {
        id: 'mlops',
        name: 'MLOps Dashboard',
        description: 'AI model monitoring and cost management',
        route: '/dashboard/mlops',
        minPlan: 'ENTERPRISE',
        adminOnly: true,
    },
    {
        id: 'admin-leads',
        name: 'Lead Management',
        description: 'View and manage captured leads',
        route: '/dashboard/admin/leads',
        minPlan: 'AGENCY',
        adminOnly: true,
    },
    {
        id: 'strategy-metrics',
        name: 'Strategy Metrics',
        description: 'View strategy generation analytics',
        route: '/dashboard/admin/strategy-metrics',
        minPlan: 'AGENCY',
        adminOnly: true,
    },
];

/**
 * Plan hierarchy for comparison
 */
const PLAN_HIERARCHY: Record<PlanTier, number> = {
    FREE: 0,
    PRO: 1,
    AGENCY: 2,
    ENTERPRISE: 3,
};

/**
 * Check if a user has access to a specific tool
 */
export function hasToolAccess(
    userEmail: string | null | undefined,
    userPlan: PlanTier,
    toolId: string
): boolean {
    // Admin bypass - full access to everything
    if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
        return true;
    }

    const tool = TOOL_CONFIGS.find(t => t.id === toolId);
    if (!tool) return false;

    // Admin-only tools require admin status
    if (tool.adminOnly && (!userEmail || !ADMIN_EMAILS.includes(userEmail.toLowerCase()))) {
        return false;
    }

    // Check plan level
    return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[tool.minPlan];
}

/**
 * Get all tools accessible by a user
 */
export function getAccessibleTools(
    userEmail: string | null | undefined,
    userPlan: PlanTier
): ToolAccessConfig[] {
    const isAdmin = userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase());

    return TOOL_CONFIGS.filter(tool => {
        // Admins get everything
        if (isAdmin) return true;

        // Non-admins don't see admin-only tools
        if (tool.adminOnly) return false;

        // Check plan level
        return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[tool.minPlan];
    });
}

/**
 * Check if user is an admin
 */
export function isAdmin(userEmail: string | null | undefined): boolean {
    return userEmail ? ADMIN_EMAILS.includes(userEmail.toLowerCase()) : false;
}

/**
 * Get the required plan message for a tool
 */
export function getUpgradeMessage(toolId: string): string {
    const tool = TOOL_CONFIGS.find(t => t.id === toolId);
    if (!tool) return 'Tool not found';

    switch (tool.minPlan) {
        case 'PRO':
            return 'Upgrade to Pro ($49/mo) to unlock this feature';
        case 'AGENCY':
            return 'Upgrade to Agency ($299/mo) to unlock this feature';
        case 'ENTERPRISE':
            return 'Contact sales for Enterprise access';
        default:
            return 'This feature is available on your current plan';
    }
}
