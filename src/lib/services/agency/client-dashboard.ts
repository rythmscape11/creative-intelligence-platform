/**
 * Client Performance Dashboard Data Provider
 * Aggregates metrics for agency client overview
 */

import { prisma } from '@/lib/prisma';
import {
    AgencyDashboardDataDTO,
    ClientPerformanceMetricsDTO,
    // ClientPerformanceMetricsSchema, // Use schema for validation if needed
    // AgencyDashboardDataSchema 
} from '@/dtos/agency.dto';

// Re-export for backward compatibility if needed, or update consumers
export type ClientPerformanceMetrics = ClientPerformanceMetricsDTO;
export type AgencyDashboardData = AgencyDashboardDataDTO;

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
export function generateAlerts(clients: ClientPerformanceMetricsDTO[]): AgencyDashboardDataDTO['alerts'] {
    const alerts: AgencyDashboardDataDTO['alerts'] = [];

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
export async function getAgencyDashboard(agencyId: string): Promise<AgencyDashboardDataDTO> {
    // This would query actual data from the database
    // Returning structure for now
    // Query actual data from the database
    // Using AgencyClient model instead of non-existent ClientWorkspace
    const clients = await prisma.agencyClient.findMany({
        where: { agencyId: agencyId || undefined }, // Handle optional agencyId
        include: {
            projects: {
                select: { id: true }
            }
        }
    });

    // Build mock metrics for each client (since we don't have real metrics tables yet)
    const clientMetrics: ClientPerformanceMetricsDTO[] = clients.map(client => {
        const health = calculateClientHealth({
            engagement: { logins: 5, activeHours: 10, lastActive: new Date(), toolsUsed: 3 },
            strategies: { total: client.projects.length || 0, created: 0, exported: 0, completionRate: 0 },
            revenue: { invoiced: 0, collected: 0, outstanding: 0, mrr: 0 }
        });

        return {
            clientId: client.id,
            clientName: client.name,
            period: 'month' as const,
            strategies: {
                total: client.projects.length || 0,
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
            activeClients: clients.filter(c => c.status === 'ACTIVE').length,
            totalStrategies: clients.reduce((sum, c) => sum + (c.projects.length || 0), 0),
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
