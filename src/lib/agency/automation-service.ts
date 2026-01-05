/**
 * Automation Engine Service
 * Handles workflow automation rules and triggers
 * 
 * Trigger Types:
 * - Task status change
 * - Due date approaching
 * - Task assigned
 * - Project status change
 * - Time-based (cron)
 * 
 * Action Types:
 * - Send notification
 * - Create task
 * - Update field
 * - Assign user
 * - Send webhook
 * - Send email
 */

import { prisma } from '@/lib/prisma';

export type TriggerType =
    | 'task_status_changed'
    | 'task_assigned'
    | 'task_due_soon'
    | 'task_overdue'
    | 'project_status_changed'
    | 'campaign_launched'
    | 'time_based';

export type ActionType =
    | 'send_notification'
    | 'create_task'
    | 'update_field'
    | 'assign_user'
    | 'send_webhook'
    | 'send_email'
    | 'move_to_status';

export interface AutomationCondition {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: string | number | boolean;
}

export interface AutomationAction {
    type: ActionType;
    config: Record<string, unknown>;
}

export interface AutomationRule {
    id: string;
    name: string;
    description?: string;
    trigger: TriggerType;
    triggerConfig?: Record<string, unknown>;
    conditions?: AutomationCondition[];
    actions: AutomationAction[];
    enabled: boolean;
    projectId?: string;
    createdBy: string;
    createdAt: Date;
    lastTriggered?: Date;
    triggerCount: number;
}

// Pre-built automation templates
export const AUTOMATION_TEMPLATES: Partial<AutomationRule>[] = [
    {
        name: 'Notify on Task Assignment',
        description: 'Send notification when a task is assigned to someone',
        trigger: 'task_assigned',
        actions: [
            {
                type: 'send_notification',
                config: {
                    title: 'New Task Assigned',
                    message: 'You have been assigned a new task: {{task.title}}',
                    recipientType: 'assignee',
                },
            },
        ],
    },
    {
        name: 'Due Date Reminder',
        description: 'Notify assignee when task is due in 24 hours',
        trigger: 'task_due_soon',
        triggerConfig: { hoursBeforeDue: 24 },
        actions: [
            {
                type: 'send_notification',
                config: {
                    title: 'Task Due Soon',
                    message: '{{task.title}} is due in 24 hours',
                    recipientType: 'assignee',
                },
            },
        ],
    },
    {
        name: 'Move to Review on Complete',
        description: 'When subtasks are done, move parent to Review',
        trigger: 'task_status_changed',
        triggerConfig: { fromStatus: 'IN_PROGRESS', toStatus: 'DONE' },
        conditions: [{ field: 'hasSubtasks', operator: 'equals', value: true }],
        actions: [
            {
                type: 'move_to_status',
                config: { targetStatus: 'REVIEW', targetType: 'parent' },
            },
        ],
    },
    {
        name: 'Create Follow-up Task',
        description: 'Create follow-up task when campaign is completed',
        trigger: 'campaign_launched',
        actions: [
            {
                type: 'create_task',
                config: {
                    title: 'Review {{campaign.name}} Performance',
                    dueOffset: 7, // 7 days after trigger
                    priority: 'HIGH',
                },
            },
        ],
    },
    {
        name: 'Slack Notification',
        description: 'Send Slack message when project status changes',
        trigger: 'project_status_changed',
        actions: [
            {
                type: 'send_webhook',
                config: {
                    url: '{{slack_webhook_url}}',
                    payload: {
                        text: 'Project {{project.name}} moved to {{project.status}}',
                    },
                },
            },
        ],
    },
];

export class AutomationService {
    /**
     * Create a new automation rule
     */
    static async createRule(
        data: Omit<AutomationRule, 'id' | 'createdAt' | 'triggerCount'>,
        projectId?: string
    ) {
        // Store in database (using campaign's automationRules field or create new table)
        // For now, we'll use a JSON approach
        const rule = {
            ...data,
            id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            triggerCount: 0,
        };

        // Store in a settings/config table or as JSON in project
        console.log('[Automation] Created rule:', rule.name);
        return rule;
    }

    /**
     * Execute automation when trigger fires
     */
    static async executeTrigger(
        triggerType: TriggerType,
        context: Record<string, unknown>,
        rules: AutomationRule[]
    ) {
        const applicableRules = rules.filter(
            (r) => r.enabled && r.trigger === triggerType
        );

        const results = [];

        for (const rule of applicableRules) {
            // Check conditions
            if (!this.evaluateConditions(rule.conditions || [], context)) {
                continue;
            }

            // Execute actions
            for (const action of rule.actions) {
                try {
                    await this.executeAction(action, context);
                    results.push({ ruleId: rule.id, success: true });
                } catch (error) {
                    console.error(`[Automation] Action failed:`, error);
                    results.push({ ruleId: rule.id, success: false, error });
                }
            }
        }

        return results;
    }

    /**
     * Evaluate conditions
     */
    static evaluateConditions(
        conditions: AutomationCondition[],
        context: Record<string, unknown>
    ): boolean {
        for (const condition of conditions) {
            const value = this.getNestedValue(context, condition.field);

            switch (condition.operator) {
                case 'equals':
                    if (value !== condition.value) return false;
                    break;
                case 'not_equals':
                    if (value === condition.value) return false;
                    break;
                case 'contains':
                    if (!String(value).includes(String(condition.value))) return false;
                    break;
                case 'greater_than':
                    if (Number(value) <= Number(condition.value)) return false;
                    break;
                case 'less_than':
                    if (Number(value) >= Number(condition.value)) return false;
                    break;
            }
        }
        return true;
    }

    /**
     * Execute a single action
     */
    static async executeAction(
        action: AutomationAction,
        context: Record<string, unknown>
    ) {
        const config = this.interpolateConfig(action.config, context);

        switch (action.type) {
            case 'send_notification':
                return this.actionSendNotification(config);
            case 'create_task':
                return this.actionCreateTask(config, context);
            case 'update_field':
                return this.actionUpdateField(config, context);
            case 'send_webhook':
                return this.actionSendWebhook(config);
            case 'send_email':
                return this.actionSendEmail(config);
            case 'move_to_status':
                return this.actionMoveToStatus(config, context);
            case 'assign_user':
                return this.actionAssignUser(config, context);
            default:
                console.warn(`[Automation] Unknown action type: ${action.type}`);
        }
    }

    // Action implementations
    private static async actionSendNotification(config: Record<string, unknown>) {
        console.log('[Automation] Send notification:', config);
        // Integration with NotificationService
    }

    private static async actionCreateTask(
        config: Record<string, unknown>,
        context: Record<string, unknown>
    ) {
        console.log('[Automation] Create task:', config);
        // Use TaskService to create task
    }

    private static async actionUpdateField(
        config: Record<string, unknown>,
        context: Record<string, unknown>
    ) {
        console.log('[Automation] Update field:', config);
    }

    private static async actionSendWebhook(config: Record<string, unknown>) {
        const { url, payload } = config as { url: string; payload: unknown };
        try {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error('[Automation] Webhook failed:', error);
        }
    }

    private static async actionSendEmail(config: Record<string, unknown>) {
        console.log('[Automation] Send email:', config);
        // Integration with email service
    }

    private static async actionMoveToStatus(
        config: Record<string, unknown>,
        context: Record<string, unknown>
    ) {
        console.log('[Automation] Move to status:', config);
    }

    private static async actionAssignUser(
        config: Record<string, unknown>,
        context: Record<string, unknown>
    ) {
        console.log('[Automation] Assign user:', config);
    }

    // Utility functions
    private static getNestedValue(obj: Record<string, unknown>, path: string): unknown {
        return path.split('.').reduce((curr: unknown, key) => {
            return curr && typeof curr === 'object' ? (curr as Record<string, unknown>)[key] : undefined;
        }, obj);
    }

    private static interpolateConfig(
        config: Record<string, unknown>,
        context: Record<string, unknown>
    ): Record<string, unknown> {
        const result: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(config)) {
            if (typeof value === 'string') {
                result[key] = value.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
                    return String(this.getNestedValue(context, path) || '');
                });
            } else if (typeof value === 'object' && value !== null) {
                result[key] = this.interpolateConfig(
                    value as Record<string, unknown>,
                    context
                );
            } else {
                result[key] = value;
            }
        }

        return result;
    }
}

export default AutomationService;
