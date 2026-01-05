/**
 * Client Performance Dashboard Data Provider
 * Aggregates metrics for agency client overview
 */

import { prisma } from '@/lib/prisma';

export interface ClientPerformanceMetrics {
    clientId: string;
    clientName: string;
    period: 'week' | 'month' | 'quarter' | 'year';

    // Strategy metrics
    strategies: {
        total: number;
        created: number;
        exported: number;
        completionRate: number;
    };

    // Engagement metrics
    engagement: {
        logins: number;
        activeHours: number;
        lastActive: Date | null;
        toolsUsed: number;
    };

    // Revenue metrics
    revenue: {
        invoiced: number;
        collected: number;
        outstanding: number;
        mrr: number;
    };

    // Health indicators
    health: {
        score: number; // 0-100
        status: 'healthy' | 'at-risk' | 'churning';
        riskFactors: string[];
        recommendations: string[];
    };
}

export interface AgencyDashboardData {
    summary: {
        totalClients: number;
        activeClients: number;
        totalStrategies: number;
        totalRevenue: number;
        mrr: number;
        churnRate: number;
    };
    clients: ClientPerformanceMetrics[];
    trends: {
        clientGrowth: Array<{ date: string; count: number }>;
        revenueGrowth: Array<{ date: string; amount: number }>;
        strategyUsage: Array<{ date: string; count: number }>;
    };
    alerts: Array<{
        type: 'warning' | 'danger' | 'info';
        message: string;
        clientId?: string;
        action?: string;
    }>;
}

/**
 * Calculate client health score
 */
export function calculateClientHealth(metrics: Partial<ClientPerformanceMetrics>): {
    score: number;
    status: 'healthy' | 'at-risk' | 'churning';
    riskFactors: string[];
    recommendations: string[];
} {
    let score = 100;
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    // Check login activity
    if (metrics.engagement?.logins === 0) {
        score -= 30;
        riskFactors.push('No logins in period');
        recommendations.push('Send re-engagement email');
    } else if (metrics.engagement?.logins && metrics.engagement.logins < 3) {
        score -= 15;
        riskFactors.push('Low login frequency');
    }

    // Check strategy creation
    if (metrics.strategies?.created === 0) {
        score -= 20;
        riskFactors.push('No strategies created');
        recommendations.push('Schedule a strategy review call');
    }

    // Check outstanding payments
    if (metrics.revenue?.outstanding && metrics.revenue.outstanding > 0) {
        const outstandingRatio = metrics.revenue.outstanding / (metrics.revenue.invoiced || 1);
        if (outstandingRatio > 0.5) {
            score -= 25;
            riskFactors.push('High outstanding balance');
            recommendations.push('Send payment reminder');
        } else if (outstandingRatio > 0.2) {
            score -= 10;
        }
    }

    // Check last active date
    if (metrics.engagement?.lastActive) {
        const daysSinceActive = Math.floor(
            (Date.now() - new Date(metrics.engagement.lastActive).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceActive > 30) {
            score -= 25;
            riskFactors.push(`Inactive for ${daysSinceActive} days`);
            recommendations.push('Reach out for a check-in call');
        } else if (daysSinceActive > 14) {
            score -= 10;
        }
    }

    // Determine status
    let status: 'healthy' | 'at-risk' | 'churning';
    if (score >= 70) {
        status = 'healthy';
    } else if (score >= 40) {
        status = 'at-risk';
    } else {
        status = 'churning';
        recommendations.push('Immediate intervention required');
    }

    return {
        score: Math.max(0, Math.min(100, score)),
        status,
        riskFactors,
        recommendations
    };
}

/**
 * Generate performance alerts
 */
export function generateAlerts(clients: ClientPerformanceMetrics[]): AgencyDashboardData['alerts'] {
    const alerts: AgencyDashboardData['alerts'] = [];

    for (const client of clients) {
        if (client.health.status === 'churning') {
            alerts.push({
                type: 'danger',
                message: `${client.clientName} is at high risk of churning`,
                clientId: client.clientId,
                action: 'Schedule urgent call'
            });
        } else if (client.health.status === 'at-risk') {
            alerts.push({
                type: 'warning',
                message: `${client.clientName} shows signs of disengagement`,
                clientId: client.clientId,
                action: 'Send check-in email'
            });
        }

        // Payment alerts
        if (client.revenue.outstanding > 0) {
            const daysOutstanding = 30; // Would calculate from actual invoice dates
            if (daysOutstanding > 30) {
                alerts.push({
                    type: 'warning',
                    message: `${client.clientName} has overdue invoices`,
                    clientId: client.clientId,
                    action: 'Send payment reminder'
                });
            }
        }
    }

    return alerts.slice(0, 10); // Limit to 10 alerts
}

/**
 * Get agency dashboard data
 */
export async function getAgencyDashboard(agencyId: string): Promise<AgencyDashboardData> {
    // This would query actual data from the database
    // Returning structure for now
    const clients = await prisma.clientWorkspace.findMany({
        where: { agencyId },
        include: {
            _count: {
                select: { strategies: true }
            }
        }
    });

    // Build mock metrics for each client
    const clientMetrics: ClientPerformanceMetrics[] = clients.map(client => {
        const health = calculateClientHealth({
            engagement: { logins: 5, activeHours: 10, lastActive: new Date(), toolsUsed: 3 },
            strategies: { total: client._count?.strategies || 0, created: 0, exported: 0, completionRate: 0 },
            revenue: { invoiced: 0, collected: 0, outstanding: 0, mrr: 0 }
        });

        return {
            clientId: client.id,
            clientName: client.name,
            period: 'month' as const,
            strategies: {
                total: client._count?.strategies || 0,
                created: 0,
                exported: 0,
                completionRate: 0
            },
            engagement: {
                logins: 0,
                activeHours: 0,
                lastActive: null,
                toolsUsed: 0
            },
            revenue: {
                invoiced: 0,
                collected: 0,
                outstanding: 0,
                mrr: 0
            },
            health
        };
    });

    return {
        summary: {
            totalClients: clients.length,
            activeClients: clients.filter(c => c.isActive).length,
            totalStrategies: clients.reduce((sum, c) => sum + (c._count?.strategies || 0), 0),
            totalRevenue: 0,
            mrr: 0,
            churnRate: 0
        },
        clients: clientMetrics,
        trends: {
            clientGrowth: [],
            revenueGrowth: [],
            strategyUsage: []
        },
        alerts: generateAlerts(clientMetrics)
    };
}

export default {
    calculateClientHealth,
    generateAlerts,
    getAgencyDashboard
};
