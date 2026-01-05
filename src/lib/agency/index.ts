/**
 * Agency OS Export Barrel
 * Central export for all agency services
 */

// Phase 1: Core Modules
export { CampaignService } from './campaign-service';
export { ContentService } from './content-service';
export { AssetService } from './asset-service';
export { ReportingService } from './reporting-service';

// Phase 2: Automation
export { AutomationEngine, AUTOMATION_TEMPLATES } from './automation-engine';
export type { AutomationRule, AutomationTrigger, AutomationAction, AutomationCondition } from './automation-engine';

// Phase 3: Multi-Tenant
export { TenantService } from './tenant-service';
export type { TenantContext } from './tenant-service';

// Constants
export const AGENCY_OS_VERSION = '1.0.0';

export const PLATFORMS = [
    'FACEBOOK',
    'INSTAGRAM',
    'LINKEDIN',
    'TWITTER',
    'YOUTUBE',
    'TIKTOK',
    'PINTEREST',
] as const;

export const POST_TYPES = [
    'IMAGE',
    'VIDEO',
    'CAROUSEL',
    'STORY',
    'REEL',
    'TEXT',
] as const;

export const ASSET_TYPES = [
    'IMAGE',
    'VIDEO',
    'DOCUMENT',
    'AUDIO',
    'OTHER',
] as const;

export const CAMPAIGN_OBJECTIVES = [
    'AWARENESS',
    'LEADS',
    'SALES',
    'ENGAGEMENT',
    'RETENTION',
    'TRAFFIC',
    'APP_INSTALLS',
] as const;

export const CAMPAIGN_STATUSES = [
    'DRAFT',
    'ACTIVE',
    'PAUSED',
    'COMPLETED',
    'ARCHIVED',
] as const;
