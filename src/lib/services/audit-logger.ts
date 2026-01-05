/**
 * Audit Logger Service
 * 
 * Provides comprehensive audit logging for admin actions and sensitive operations.
 * Logs are stored in the UserActivity table for compliance and security monitoring.
 */

import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export type AuditAction =
  // User Management
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'USER_ROLE_CHANGED'
  | 'USER_ACTIVATED'
  | 'USER_DEACTIVATED'
  | 'USER_PASSWORD_RESET'
  // Content Management
  | 'BLOG_POST_CREATED'
  | 'BLOG_POST_UPDATED'
  | 'BLOG_POST_DELETED'
  | 'BLOG_POST_PUBLISHED'
  | 'BLOG_POST_UNPUBLISHED'
  | 'CATEGORY_CREATED'
  | 'CATEGORY_UPDATED'
  | 'CATEGORY_DELETED'
  | 'TAG_CREATED'
  | 'TAG_UPDATED'
  | 'TAG_DELETED'
  // Strategy Management
  | 'STRATEGY_CREATED'
  | 'STRATEGY_UPDATED'
  | 'STRATEGY_DELETED'
  | 'STRATEGY_EXPORTED'
  | 'STRATEGY_BULK_EXPORT'
  // System Settings
  | 'SETTING_UPDATED'
  | 'FEATURE_FLAG_TOGGLED'
  | 'EMAIL_TEMPLATE_UPDATED'
  | 'SYSTEM_CONFIG_CHANGED'
  // Authentication & Security
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'PASSWORD_CHANGED'
  | 'TWO_FACTOR_ENABLED'
  | 'TWO_FACTOR_DISABLED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'
  // Admin Actions
  | 'ADMIN_ACCESS'
  | 'ADMIN_EXPORT_DATA'
  | 'ADMIN_BULK_ACTION'
  | 'ADMIN_SYSTEM_MAINTENANCE';

export type EntityType =
  | 'USER'
  | 'BLOG_POST'
  | 'CATEGORY'
  | 'TAG'
  | 'STRATEGY'
  | 'SETTING'
  | 'FEATURE_FLAG'
  | 'EMAIL_TEMPLATE'
  | 'SYSTEM';

export interface AuditLogEntry {
  userId: string;
  action: AuditAction;
  entityType?: EntityType;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Get client IP address from request headers
 */
async function getClientIp(): Promise<string | undefined> {
  const headersList = await headers();
  return (
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    undefined
  );
}

/**
 * Get user agent from request headers
 */
async function getUserAgent(): Promise<string | undefined> {
  const headersList = await headers();
  return headersList.get('user-agent') || undefined;
}

/**
 * Log an audit event
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    const ipAddress = entry.ipAddress || await getClientIp();
    const userAgent = entry.userAgent || await getUserAgent();

    await prisma.userActivity.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        entityType: entry.entityType || null,
        entityId: entry.entityId || null,
        details: entry.details ? JSON.stringify(entry.details) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Don't throw errors from audit logging to avoid breaking the main flow
    console.error('Failed to log audit event:', error);
  }
}

/**
 * Log user management action
 */
export async function logUserAction(
  userId: string,
  action: AuditAction,
  targetUserId: string,
  details?: Record<string, any>
): Promise<void> {
  await logAudit({
    userId,
    action,
    entityType: 'USER',
    entityId: targetUserId,
    details,
  });
}

/**
 * Log content management action
 */
export async function logContentAction(
  userId: string,
  action: AuditAction,
  entityType: EntityType,
  entityId: string,
  details?: Record<string, any>
): Promise<void> {
  await logAudit({
    userId,
    action,
    entityType,
    entityId,
    details,
  });
}

/**
 * Log strategy action
 */
export async function logStrategyAction(
  userId: string,
  action: AuditAction,
  strategyId: string,
  details?: Record<string, any>
): Promise<void> {
  await logAudit({
    userId,
    action,
    entityType: 'STRATEGY',
    entityId: strategyId,
    details,
  });
}

/**
 * Log system settings action
 */
export async function logSystemAction(
  userId: string,
  action: AuditAction,
  details?: Record<string, any>
): Promise<void> {
  await logAudit({
    userId,
    action,
    entityType: 'SYSTEM',
    details,
  });
}

/**
 * Log security event
 */
export async function logSecurityEvent(
  userId: string,
  action: AuditAction,
  details?: Record<string, any>
): Promise<void> {
  await logAudit({
    userId,
    action,
    details: {
      ...details,
      severity: 'high',
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log unauthorized access attempt
 */
export async function logUnauthorizedAccess(
  userId: string,
  resource: string,
  requiredRole?: string
): Promise<void> {
  await logSecurityEvent(userId, 'UNAUTHORIZED_ACCESS_ATTEMPT', {
    resource,
    requiredRole,
  });
}

/**
 * Get audit logs for a specific user
 */
export async function getUserAuditLogs(
  userId: string,
  limit: number = 100
): Promise<any[]> {
  return prisma.userActivity.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
}

/**
 * Get audit logs for a specific entity
 */
export async function getEntityAuditLogs(
  entityType: EntityType,
  entityId: string,
  limit: number = 100
): Promise<any[]> {
  const activities = await prisma.userActivity.findMany({
    where: {
      entityType,
      entityId,
    },
    orderBy: { timestamp: 'desc' },
    take: limit,
  });

  // Get user details
  const userIds = Array.from(new Set(activities.map(a => a.userId)));
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });

  // Map users to activities
  return activities.map(activity => ({
    ...activity,
    user: users.find(u => u.id === activity.userId) || {
      id: activity.userId,
      name: 'Unknown User',
      email: 'unknown@example.com',
    },
  }));
}

/**
 * Get recent audit logs
 */
export async function getRecentAuditLogs(
  limit: number = 100,
  filters?: {
    action?: AuditAction;
    entityType?: EntityType;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<any[]> {
  const where: any = {};

  if (filters?.action) {
    where.action = filters.action;
  }

  if (filters?.entityType) {
    where.entityType = filters.entityType;
  }

  if (filters?.userId) {
    where.userId = filters.userId;
  }

  if (filters?.startDate || filters?.endDate) {
    where.timestamp = {};
    if (filters.startDate) {
      where.timestamp.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.timestamp.lte = filters.endDate;
    }
  }

  const activities = await prisma.userActivity.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: limit,
  });

  // Get user details
  const userIds = Array.from(new Set(activities.map(a => a.userId)));
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });

  // Map users to activities
  return activities.map(activity => ({
    ...activity,
    user: users.find(u => u.id === activity.userId) || {
      id: activity.userId,
      name: 'Unknown User',
      email: 'unknown@example.com',
    },
  }));
}

