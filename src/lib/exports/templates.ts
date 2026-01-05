/**
 * Data Export Templates Module
 * Pre-built templates for exporting data in various formats
 */

export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json' | 'pptx';
export type ExportType = 'strategies' | 'analytics' | 'clients' | 'invoices' | 'audit_logs';

export interface ExportTemplate {
    id: string;
    name: string;
    description: string;
    type: ExportType;
    formats: ExportFormat[];
    columns: ExportColumn[];
    filters?: ExportFilter[];
    sorting?: ExportSorting;
    branding?: boolean;
}

export interface ExportColumn {
    key: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'currency' | 'boolean' | 'array';
    format?: string;
    width?: number;
}

export interface ExportFilter {
    field: string;
    label: string;
    type: 'date_range' | 'select' | 'multi_select' | 'search';
    options?: { value: string; label: string }[];
}

export interface ExportSorting {
    field: string;
    direction: 'asc' | 'desc';
}

// Pre-built export templates
export const EXPORT_TEMPLATES: ExportTemplate[] = [
    {
        id: 'strategies-summary',
        name: 'Strategies Summary',
        description: 'Overview of all generated strategies with key metrics',
        type: 'strategies',
        formats: ['csv', 'xlsx', 'pdf'],
        columns: [
            { key: 'title', label: 'Strategy Title', type: 'string', width: 30 },
            { key: 'businessName', label: 'Business', type: 'string', width: 20 },
            { key: 'industry', label: 'Industry', type: 'string', width: 15 },
            { key: 'budget', label: 'Budget', type: 'currency', format: '$#,##0' },
            { key: 'channels', label: 'Channels', type: 'array' },
            { key: 'createdAt', label: 'Created', type: 'date', format: 'MMM d, yyyy' },
            { key: 'exportCount', label: 'Exports', type: 'number' }
        ],
        filters: [
            { field: 'createdAt', label: 'Date Range', type: 'date_range' },
            { field: 'industry', label: 'Industry', type: 'select' }
        ],
        sorting: { field: 'createdAt', direction: 'desc' }
    },
    {
        id: 'strategies-detailed',
        name: 'Strategies Detailed',
        description: 'Full strategy details including objectives and recommendations',
        type: 'strategies',
        formats: ['xlsx', 'pdf', 'pptx'],
        columns: [
            { key: 'title', label: 'Strategy Title', type: 'string', width: 30 },
            { key: 'executiveSummary', label: 'Executive Summary', type: 'string', width: 50 },
            { key: 'targetAudience', label: 'Target Audience', type: 'string', width: 30 },
            { key: 'objectives', label: 'Objectives', type: 'array' },
            { key: 'channels', label: 'Channels', type: 'array' },
            { key: 'budget', label: 'Total Budget', type: 'currency' },
            { key: 'timeline', label: 'Timeline', type: 'string' },
            { key: 'kpis', label: 'KPIs', type: 'array' }
        ],
        branding: true
    },
    {
        id: 'client-performance',
        name: 'Client Performance Report',
        description: 'Monthly performance metrics for all clients',
        type: 'clients',
        formats: ['pdf', 'xlsx'],
        columns: [
            { key: 'name', label: 'Client Name', type: 'string', width: 25 },
            { key: 'strategiesCount', label: 'Strategies', type: 'number' },
            { key: 'exportsCount', label: 'Exports', type: 'number' },
            { key: 'lastActive', label: 'Last Active', type: 'date' },
            { key: 'healthScore', label: 'Health Score', type: 'number', format: '0%' },
            { key: 'status', label: 'Status', type: 'string' },
            { key: 'mrr', label: 'MRR', type: 'currency' }
        ],
        filters: [
            {
                field: 'status', label: 'Status', type: 'select', options: [
                    { value: 'active', label: 'Active' },
                    { value: 'at-risk', label: 'At Risk' },
                    { value: 'churning', label: 'Churning' }
                ]
            }
        ],
        branding: true
    },
    {
        id: 'analytics-overview',
        name: 'Analytics Overview',
        description: 'Usage analytics and platform metrics',
        type: 'analytics',
        formats: ['csv', 'xlsx', 'pdf'],
        columns: [
            { key: 'date', label: 'Date', type: 'date', format: 'yyyy-MM-dd' },
            { key: 'strategiesGenerated', label: 'Strategies', type: 'number' },
            { key: 'exportsCreated', label: 'Exports', type: 'number' },
            { key: 'toolsUsed', label: 'Tools Used', type: 'number' },
            { key: 'activeUsers', label: 'Active Users', type: 'number' },
            { key: 'aiTokensUsed', label: 'AI Tokens', type: 'number', format: '#,##0' },
            { key: 'aiCost', label: 'AI Cost', type: 'currency' }
        ],
        filters: [
            { field: 'date', label: 'Date Range', type: 'date_range' }
        ],
        sorting: { field: 'date', direction: 'desc' }
    },
    {
        id: 'invoices-report',
        name: 'Invoice Report',
        description: 'All invoices with payment status',
        type: 'invoices',
        formats: ['csv', 'xlsx', 'pdf'],
        columns: [
            { key: 'invoiceNumber', label: 'Invoice #', type: 'string' },
            { key: 'clientName', label: 'Client', type: 'string', width: 25 },
            { key: 'issueDate', label: 'Issue Date', type: 'date' },
            { key: 'dueDate', label: 'Due Date', type: 'date' },
            { key: 'amount', label: 'Amount', type: 'currency' },
            { key: 'status', label: 'Status', type: 'string' },
            { key: 'paidAt', label: 'Paid Date', type: 'date' }
        ],
        filters: [
            {
                field: 'status', label: 'Status', type: 'select', options: [
                    { value: 'paid', label: 'Paid' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'overdue', label: 'Overdue' }
                ]
            },
            { field: 'issueDate', label: 'Issue Date', type: 'date_range' }
        ]
    },
    {
        id: 'audit-logs',
        name: 'Audit Log Export',
        description: 'Security and compliance audit trail',
        type: 'audit_logs',
        formats: ['csv', 'json'],
        columns: [
            { key: 'timestamp', label: 'Timestamp', type: 'date', format: 'yyyy-MM-dd HH:mm:ss' },
            { key: 'userId', label: 'User ID', type: 'string' },
            { key: 'userEmail', label: 'User Email', type: 'string' },
            { key: 'action', label: 'Action', type: 'string' },
            { key: 'resource', label: 'Resource', type: 'string' },
            { key: 'resourceId', label: 'Resource ID', type: 'string' },
            { key: 'ipAddress', label: 'IP Address', type: 'string' }
        ],
        filters: [
            { field: 'timestamp', label: 'Date Range', type: 'date_range' },
            { field: 'action', label: 'Action', type: 'multi_select' }
        ],
        sorting: { field: 'timestamp', direction: 'desc' }
    }
];

/**
 * Get template by ID
 */
export function getTemplate(templateId: string): ExportTemplate | undefined {
    return EXPORT_TEMPLATES.find(t => t.id === templateId);
}

/**
 * Get templates by type
 */
export function getTemplatesByType(type: ExportType): ExportTemplate[] {
    return EXPORT_TEMPLATES.filter(t => t.type === type);
}

/**
 * Format value for export based on column type
 */
export function formatExportValue(value: any, column: ExportColumn): string {
    if (value === null || value === undefined) return '';

    switch (column.type) {
        case 'date':
            return new Date(value).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        case 'currency':
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        case 'boolean':
            return value ? 'Yes' : 'No';
        case 'array':
            return Array.isArray(value) ? value.join(', ') : String(value);
        case 'number':
            return new Intl.NumberFormat('en-US').format(value);
        default:
            return String(value);
    }
}

/**
 * Generate CSV from data and template
 */
export function generateCSV(data: Record<string, any>[], template: ExportTemplate): string {
    const headers = template.columns.map(c => c.label).join(',');
    const rows = data.map(row =>
        template.columns.map(col => {
            const value = formatExportValue(row[col.key], col);
            // Escape commas and quotes
            return value.includes(',') || value.includes('"')
                ? `"${value.replace(/"/g, '""')}"`
                : value;
        }).join(',')
    );

    return [headers, ...rows].join('\n');
}

/**
 * Generate JSON export
 */
export function generateJSON(data: Record<string, any>[], template: ExportTemplate): string {
    const formatted = data.map(row => {
        const obj: Record<string, any> = {};
        template.columns.forEach(col => {
            obj[col.key] = row[col.key];
        });
        return obj;
    });

    return JSON.stringify({
        template: template.name,
        exportedAt: new Date().toISOString(),
        count: data.length,
        data: formatted
    }, null, 2);
}

export default {
    EXPORT_TEMPLATES,
    getTemplate,
    getTemplatesByType,
    formatExportValue,
    generateCSV,
    generateJSON
};
