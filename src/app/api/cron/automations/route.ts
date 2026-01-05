/**
 * Automation Cron Endpoint
 * Triggered by Vercel Cron or external scheduler to run automation rules
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Vercel cron configuration
export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * GET /api/cron/automations
 * Execute all enabled automation rules
 * Triggered by Vercel Cron every 5 minutes
 */
export async function GET(req: NextRequest) {
    try {
        // Verify cron secret for security
        const authHeader = req.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all enabled automation rules
        const rules = await prisma.automationRule.findMany({
            where: { enabled: true },
        });

        const results = [];

        for (const rule of rules) {
            try {
                // Parse rule configuration
                const triggerConfig = typeof rule.triggerConfig === 'string'
                    ? JSON.parse(rule.triggerConfig)
                    : rule.triggerConfig;
                const conditions = typeof rule.conditions === 'string'
                    ? JSON.parse(rule.conditions)
                    : rule.conditions;
                const actions = typeof rule.actions === 'string'
                    ? JSON.parse(rule.actions)
                    : rule.actions;

                // Check if rule should run based on trigger type
                let shouldRun = false;

                switch (rule.trigger) {
                    case 'schedule':
                        // Check cron expression
                        shouldRun = shouldRunCron(triggerConfig?.cron);
                        break;
                    case 'time_based':
                        // Check time conditions
                        shouldRun = checkTimeCondition(triggerConfig);
                        break;
                    case 'webhook':
                    case 'manual':
                        // Skip - these are triggered externally
                        shouldRun = false;
                        break;
                    default:
                        shouldRun = false;
                }

                if (shouldRun) {
                    // Execute actions
                    for (const action of actions || []) {
                        await executeAction(action, rule);
                    }

                    // Update trigger count
                    await prisma.automationRule.update({
                        where: { id: rule.id },
                        data: {
                            triggerCount: { increment: 1 },
                            lastTriggered: new Date(),
                        },
                    });

                    results.push({ ruleId: rule.id, name: rule.name, status: 'executed' });
                } else {
                    results.push({ ruleId: rule.id, name: rule.name, status: 'skipped' });
                }
            } catch (error) {
                console.error(`[Cron] Rule ${rule.id} error:`, error);
                results.push({ ruleId: rule.id, name: rule.name, status: 'error', error: String(error) });
            }
        }

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            rulesProcessed: rules.length,
            results,
        });
    } catch (error) {
        console.error('[Automation Cron] Error:', error);
        return NextResponse.json({ error: 'Cron execution failed' }, { status: 500 });
    }
}

// Helper: Check if cron should run (simplified - every 5 mins)
function shouldRunCron(cronExpression?: string): boolean {
    if (!cronExpression) return false;
    // Simplified: run if minutes divisible by 5
    const now = new Date();
    return now.getMinutes() % 5 === 0;
}

// Helper: Check time-based conditions
function checkTimeCondition(config: any): boolean {
    if (!config) return false;
    const now = new Date();
    const hour = now.getHours();

    if (config.runAt && parseInt(config.runAt.split(':')[0]) === hour) {
        return true;
    }
    return false;
}

// Helper: Execute automation action
async function executeAction(action: any, rule: any): Promise<void> {
    switch (action.type) {
        case 'send_notification':
            console.log(`[Action] Send notification: ${action.message}`);
            // In production: integrate with notification service
            break;
        case 'create_task':
            console.log(`[Action] Create task: ${action.title}`);
            // In production: create task in DB
            break;
        case 'send_slack':
            console.log(`[Action] Send Slack message to ${action.channel}`);
            // In production: call Slack API
            break;
        case 'send_email':
            console.log(`[Action] Send email to ${action.to}`);
            // In production: call email service
            break;
        default:
            console.log(`[Action] Unknown action type: ${action.type}`);
    }
}
