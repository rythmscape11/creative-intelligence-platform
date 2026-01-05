/**
 * Role-Based Access Control (RBAC) System
 * Enterprise-grade permission management
 */

export type Role = 'OWNER' | 'ADMIN' | 'EDITOR' | 'STRATEGIST' | 'ANALYST' | 'VIEWER';

export interface Permission {
    id: string;
    name: string;
    description: string;
    category: 'strategy' | 'team' | 'billing' | 'integrations' | 'agency' | 'admin';
}

export interface RoleConfig {
    role: Role;
    name: string;
    description: string;
    color: string;
    permissions: string[];
    canBeAssigned: boolean; // Can other users assign this role?
}

// All available permissions
export const PERMISSIONS: Record<string, Permission> = {
    // Strategy permissions
    'strategy:create': { id: 'strategy:create', name: 'Create Strategies', description: 'Generate new marketing strategies', category: 'strategy' },
    'strategy:read': { id: 'strategy:read', name: 'View Strategies', description: 'View strategy details', category: 'strategy' },
    'strategy:update': { id: 'strategy:update', name: 'Edit Strategies', description: 'Modify existing strategies', category: 'strategy' },
    'strategy:delete': { id: 'strategy:delete', name: 'Delete Strategies', description: 'Remove strategies', category: 'strategy' },
    'strategy:export': { id: 'strategy:export', name: 'Export Strategies', description: 'Export to PDF/DOCX/PPTX', category: 'strategy' },

    // Team permissions
    'team:view': { id: 'team:view', name: 'View Team', description: 'See team members', category: 'team' },
    'team:invite': { id: 'team:invite', name: 'Invite Members', description: 'Invite new team members', category: 'team' },
    'team:manage': { id: 'team:manage', name: 'Manage Team', description: 'Edit roles and remove members', category: 'team' },

    // Billing permissions
    'billing:view': { id: 'billing:view', name: 'View Billing', description: 'See invoices and subscription', category: 'billing' },
    'billing:manage': { id: 'billing:manage', name: 'Manage Billing', description: 'Update payment methods', category: 'billing' },

    // Integration permissions
    'integrations:view': { id: 'integrations:view', name: 'View Integrations', description: 'See connected services', category: 'integrations' },
    'integrations:manage': { id: 'integrations:manage', name: 'Manage Integrations', description: 'Connect/disconnect services', category: 'integrations' },

    // Agency permissions
    'agency:branding': { id: 'agency:branding', name: 'Agency Branding', description: 'Manage agency branding', category: 'agency' },
    'agency:clients': { id: 'agency:clients', name: 'Client Management', description: 'Manage client workspaces', category: 'agency' },
    'agency:reports': { id: 'agency:reports', name: 'White-label Reports', description: 'Generate branded reports', category: 'agency' },

    // Admin permissions
    'admin:users': { id: 'admin:users', name: 'User Administration', description: 'Platform-level user management', category: 'admin' },
    'admin:settings': { id: 'admin:settings', name: 'System Settings', description: 'Configure system settings', category: 'admin' },
    'admin:audit': { id: 'admin:audit', name: 'View Audit Logs', description: 'Access security audit logs', category: 'admin' },
    'admin:analytics': { id: 'admin:analytics', name: 'Platform Analytics', description: 'View platform-wide analytics', category: 'admin' },
};

// Role configurations with permissions
export const ROLE_CONFIGS: RoleConfig[] = [
    {
        role: 'OWNER',
        name: 'Owner',
        description: 'Full access to everything. Cannot be removed.',
        color: 'bg-purple-500',
        canBeAssigned: false,
        permissions: Object.keys(PERMISSIONS), // All permissions
    },
    {
        role: 'ADMIN',
        name: 'Admin',
        description: 'Full access except ownership transfer.',
        color: 'bg-red-500',
        canBeAssigned: true,
        permissions: [
            'strategy:create', 'strategy:read', 'strategy:update', 'strategy:delete', 'strategy:export',
            'team:view', 'team:invite', 'team:manage',
            'billing:view', 'billing:manage',
            'integrations:view', 'integrations:manage',
            'agency:branding', 'agency:clients', 'agency:reports',
            'admin:audit',
        ],
    },
    {
        role: 'EDITOR',
        name: 'Editor',
        description: 'Can create and edit strategies and content.',
        color: 'bg-blue-500',
        canBeAssigned: true,
        permissions: [
            'strategy:create', 'strategy:read', 'strategy:update', 'strategy:export',
            'team:view',
            'integrations:view',
            'agency:reports',
        ],
    },
    {
        role: 'STRATEGIST',
        name: 'Strategist',
        description: 'Focused on strategy creation and analysis.',
        color: 'bg-green-500',
        canBeAssigned: true,
        permissions: [
            'strategy:create', 'strategy:read', 'strategy:export',
            'team:view',
        ],
    },
    {
        role: 'ANALYST',
        name: 'Analyst',
        description: 'View-only with export capabilities.',
        color: 'bg-amber-500',
        canBeAssigned: true,
        permissions: [
            'strategy:read', 'strategy:export',
            'team:view',
            'billing:view',
        ],
    },
    {
        role: 'VIEWER',
        name: 'Viewer',
        description: 'Read-only access to strategies.',
        color: 'bg-gray-500',
        canBeAssigned: true,
        permissions: [
            'strategy:read',
            'team:view',
        ],
    },
];

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permissionId: string): boolean {
    const config = ROLE_CONFIGS.find(r => r.role === role);
    if (!config) return false;
    return config.permissions.includes(permissionId);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
    const config = ROLE_CONFIGS.find(r => r.role === role);
    if (!config) return [];
    return config.permissions.map(id => PERMISSIONS[id]).filter(Boolean);
}

/**
 * Get role configuration
 */
export function getRoleConfig(role: Role): RoleConfig | undefined {
    return ROLE_CONFIGS.find(r => r.role === role);
}

/**
 * Get roles that can be assigned by a given role
 */
export function getAssignableRoles(assignerRole: Role): RoleConfig[] {
    const assignerConfig = getRoleConfig(assignerRole);
    if (!assignerConfig) return [];

    // Check if assigner has team:manage permission
    if (!hasPermission(assignerRole, 'team:manage')) return [];

    // Can assign any role below their level (except OWNER)
    const assignerIndex = ROLE_CONFIGS.findIndex(r => r.role === assignerRole);
    return ROLE_CONFIGS.filter((r, index) => index > assignerIndex && r.canBeAssigned);
}

/**
 * Permission check middleware helper
 */
export function requirePermission(role: Role, ...requiredPermissions: string[]): boolean {
    return requiredPermissions.every(p => hasPermission(role, p));
}

export default {
    PERMISSIONS,
    ROLE_CONFIGS,
    hasPermission,
    getRolePermissions,
    getRoleConfig,
    getAssignableRoles,
    requirePermission,
};
