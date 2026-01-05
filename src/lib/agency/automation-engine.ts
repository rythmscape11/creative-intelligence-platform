/**
 * Automation Engine
 * Handles workflow automation rules for campaigns and content
 */

export interface AutomationRule {
    id: string;
    name: string;
    trigger: AutomationTrigger;
    conditions: AutomationCondition[];
    actions: AutomationAction[];
    isActive: boolean;
    createdAt: Date;
}

export interface AutomationTrigger {
    type: 'POST_SCHEDULED' | 'APPROVAL_PENDING' | 'DEADLINE_APPROACHING' | 'STATUS_CHANGED' | 'BUDGET_THRESHOLD';
    config: Record<string, unknown>;
}

export interface AutomationCondition {
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
    value: unknown;
}

export interface AutomationAction {
    type: 'SEND_NOTIFICATION' | 'CHANGE_STATUS' | 'ASSIGN_USER' | 'ADD_TAG' | 'ESCALATE' | 'SEND_EMAIL';
    config: Record<string, unknown>;
}

// Pre-defined automation templates
export const AUTOMATION_TEMPLATES: Partial<AutomationRule>[] = [
    {
        name: 'Pending Approval Reminder',
        trigger: { type: 'APPROVAL_PENDING', config: { hoursBeforeDeadline: 24 } },
        conditions: [],
        actions: [
            { type: 'SEND_NOTIFICATION', config: { to: 'client', message: 'Content pending your approval' } },
            { type: 'SEND_EMAIL', config: { template: 'approval_reminder' } },
        ],
    },
    {
        name: 'Auto-Escalate Blocked Content',
        trigger: { type: 'APPROVAL_PENDING', config: { hoursOverdue: 48 } },
        conditions: [],
        actions: [
            { type: 'ADD_TAG', config: { tag: 'Blocked: Client' } },
            { type: 'ESCALATE', config: { to: 'account_manager' } },
        ],
    },
    {
        name: 'Campaign Budget Alert',
        trigger: { type: 'BUDGET_THRESHOLD', config: { percentSpent: 80 } },
        conditions: [],
        actions: [
            { type: 'SEND_NOTIFICATION', config: { to: 'project_owner', message: '80% of campaign budget spent' } },
        ],
    },
    {
        name: 'Deadline Warning',
        trigger: { type: 'DEADLINE_APPROACHING', config: { daysBefore: 3 } },
        conditions: [],
        actions: [
            { type: 'SEND_NOTIFICATION', config: { to: 'team', message: 'Project deadline in 3 days' } },
        ],
    },
];

export class AutomationEngine {
    /**
     * Evaluate if a rule should trigger
     */
    static evaluateConditions(conditions: AutomationCondition[], context: Record<string, unknown>): boolean {
        return conditions.every(condition => {
            const fieldValue = context[condition.field];

            switch (condition.operator) {
                case 'equals':
                    return fieldValue === condition.value;
                case 'not_equals':
                    return fieldValue !== condition.value;
                case 'greater_than':
                    return (fieldValue as number) > (condition.value as number);
                case 'less_than':
                    return (fieldValue as number) < (condition.value as number);
                case 'contains':
                    return String(fieldValue).includes(String(condition.value));
                default:
                    return false;
            }
        });
    }

    /**
     * Execute automation actions
     */
    static async executeActions(actions: AutomationAction[], context: Record<string, unknown>): Promise<void> {
        for (const action of actions) {
            switch (action.type) {
                case 'SEND_NOTIFICATION':
                    console.log('[Automation] Send notification:', action.config);
                    // TODO: Integrate with notification service
                    break;
                case 'SEND_EMAIL':
                    console.log('[Automation] Send email:', action.config);
                    // TODO: Integrate with email service
                    break;
                case 'CHANGE_STATUS':
                    console.log('[Automation] Change status:', action.config);
                    // TODO: Update entity status
                    break;
                case 'ADD_TAG':
                    console.log('[Automation] Add tag:', action.config);
                    // TODO: Add tag to entity
                    break;
                case 'ESCALATE':
                    console.log('[Automation] Escalate:', action.config);
                    // TODO: Escalate to specified user
                    break;
                case 'ASSIGN_USER':
                    console.log('[Automation] Assign user:', action.config);
                    // TODO: Assign user to entity
                    break;
            }
        }
    }

    /**
     * Process a rule against context
     */
    static async processRule(rule: AutomationRule, context: Record<string, unknown>): Promise<boolean> {
        if (!rule.isActive) return false;

        if (this.evaluateConditions(rule.conditions, context)) {
            await this.executeActions(rule.actions, context);
            return true;
        }

        return false;
    }

    /**
     * Get available templates
     */
    static getTemplates(): Partial<AutomationRule>[] {
        return AUTOMATION_TEMPLATES;
    }
}

export default AutomationEngine;
