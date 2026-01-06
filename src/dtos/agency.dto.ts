import { z } from "zod";

// --- Sub-Schemas for Metrics ---

const StrategyMetricsSchema = z.object({
    total: z.number().int().min(0),
    created: z.number().int().min(0),
    exported: z.number().int().min(0),
    completionRate: z.number().min(0).max(100),
});

const EngagementMetricsSchema = z.object({
    logins: z.number().int().min(0),
    activeHours: z.number().min(0),
    lastActive: z.coerce.date().nullable(),
    toolsUsed: z.number().int().min(0),
});

const RevenueMetricsSchema = z.object({
    invoiced: z.number().min(0),
    collected: z.number().min(0),
    outstanding: z.number().min(0),
    mrr: z.number().min(0),
});

const HealthMetricsSchema = z.object({
    score: z.number().min(0).max(100),
    status: z.enum(['healthy', 'at-risk', 'churning']),
    riskFactors: z.array(z.string()),
    recommendations: z.array(z.string()),
});

// --- Main Schemas ---

export const ClientPerformanceMetricsSchema = z.object({
    clientId: z.string().uuid().or(z.string()), // Allow non-UUID strings if legacy IDs exist
    clientName: z.string(),
    period: z.enum(['week', 'month', 'quarter', 'year']),
    strategies: StrategyMetricsSchema,
    engagement: EngagementMetricsSchema,
    revenue: RevenueMetricsSchema,
    health: HealthMetricsSchema,
});

export type ClientPerformanceMetricsDTO = z.infer<typeof ClientPerformanceMetricsSchema>;

export const AgencyDashboardDataSchema = z.object({
    summary: z.object({
        totalClients: z.number().int().min(0),
        activeClients: z.number().int().min(0),
        totalStrategies: z.number().int().min(0),
        totalRevenue: z.number().min(0),
        mrr: z.number().min(0),
        churnRate: z.number().min(0).max(100),
    }),
    clients: z.array(ClientPerformanceMetricsSchema),
    trends: z.object({
        clientGrowth: z.array(z.object({ date: z.string(), count: z.number() })),
        revenueGrowth: z.array(z.object({ date: z.string(), amount: z.number() })),
        strategyUsage: z.array(z.object({ date: z.string(), count: z.number() })),
    }),
    alerts: z.array(z.object({
        type: z.enum(['warning', 'danger', 'info']),
        message: z.string(),
        clientId: z.string().optional(),
        action: z.string().optional(),
    })),
});

export type AgencyDashboardDataDTO = z.infer<typeof AgencyDashboardDataSchema>;
