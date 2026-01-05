/**
 * Meta (Facebook) Ads Integration Service
 * Uses facebook-nodejs-business-sdk (official Meta SDK)
 * 
 * SETUP REQUIRED:
 * 1. Create a Meta Developer App at https://developers.facebook.com
 * 2. Add "Marketing API" product to your app
 * 3. Get Access Token from Graph API Explorer or via OAuth
 * 4. Install package: npm install facebook-nodejs-business-sdk
 * 5. Set environment variables:
 *    - META_ADS_ACCESS_TOKEN
 *    - META_ADS_APP_ID
 *    - META_ADS_APP_SECRET
 *    - META_ADS_ACCOUNT_ID (format: act_XXXXXXXXX)
 */

interface MetaAdsConfig {
    accessToken: string;
    appId: string;
    appSecret: string;
    accountId: string;
}

interface MetaCampaign {
    id: string;
    name: string;
    status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
    objective: string;
    dailyBudget?: number;
    lifetimeBudget?: number;
    startTime?: string;
    stopTime?: string;
}

interface MetaAdSet {
    id: string;
    name: string;
    campaignId: string;
    status: string;
    dailyBudget?: number;
    targeting?: Record<string, unknown>;
}

interface MetaAdInsights {
    impressions: number;
    clicks: number;
    spend: number;
    ctr: number;
    cpc: number;
    cpm: number;
    conversions: number;
    reach: number;
    frequency: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MetaApiClient = any;

export class MetaAdsService {
    private config: MetaAdsConfig;
    private api: MetaApiClient | null = null;
    private adAccount: MetaApiClient | null = null;
    private initialized = false;

    constructor() {
        this.config = {
            accessToken: process.env.META_ADS_ACCESS_TOKEN || '',
            appId: process.env.META_ADS_APP_ID || '',
            appSecret: process.env.META_ADS_APP_SECRET || '',
            accountId: process.env.META_ADS_ACCOUNT_ID || '',
        };
    }

    /**
     * Check if Meta Ads is configured
     */
    isConfigured(): boolean {
        return !!(
            this.config.accessToken &&
            this.config.accountId
        );
    }

    /**
     * Initialize the Meta Ads API
     */
    async initialize(): Promise<boolean> {
        if (this.initialized) return true;

        if (!this.isConfigured()) {
            console.warn('[MetaAds] Not configured. Set environment variables.');
            return false;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const bizSdk = require('facebook-nodejs-business-sdk');
            const { FacebookAdsApi, AdAccount } = bizSdk;

            // Initialize the API
            this.api = FacebookAdsApi.init(this.config.accessToken);
            this.api.setDebug(false);

            // Get ad account
            this.adAccount = new AdAccount(this.config.accountId);

            this.initialized = true;
            console.log('[MetaAds] Initialized successfully');
            return true;
        } catch (error) {
            console.error('[MetaAds] Failed to initialize. Install: npm install facebook-nodejs-business-sdk');
            console.error(error);
            return false;
        }
    }

    /**
     * List all campaigns
     */
    async listCampaigns(): Promise<MetaCampaign[]> {
        if (!await this.initialize()) {
            return [];
        }

        try {
            const campaigns = await this.adAccount.getCampaigns(
                ['id', 'name', 'status', 'objective', 'daily_budget', 'lifetime_budget', 'start_time', 'stop_time'],
                { limit: 100 }
            );

            return campaigns.map((c: Record<string, unknown>) => ({
                id: String(c.id),
                name: String(c.name),
                status: c.status as MetaCampaign['status'],
                objective: String(c.objective),
                dailyBudget: c.daily_budget ? Number(c.daily_budget) / 100 : undefined,
                lifetimeBudget: c.lifetime_budget ? Number(c.lifetime_budget) / 100 : undefined,
                startTime: c.start_time ? String(c.start_time) : undefined,
                stopTime: c.stop_time ? String(c.stop_time) : undefined,
            }));
        } catch (error) {
            console.error('[MetaAds] Error listing campaigns:', error);
            return [];
        }
    }

    /**
     * Get campaign insights (metrics)
     */
    async getCampaignInsights(campaignId: string, dateRange?: { since: string; until: string }): Promise<MetaAdInsights> {
        const emptyInsights: MetaAdInsights = {
            impressions: 0,
            clicks: 0,
            spend: 0,
            ctr: 0,
            cpc: 0,
            cpm: 0,
            conversions: 0,
            reach: 0,
            frequency: 0,
        };

        if (!await this.initialize()) {
            return emptyInsights;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { Campaign } = require('facebook-nodejs-business-sdk');
            const campaign = new Campaign(campaignId);

            const params: Record<string, unknown> = {
                fields: ['impressions', 'clicks', 'spend', 'ctr', 'cpc', 'cpm', 'reach', 'frequency', 'actions'],
            };

            if (dateRange) {
                params.time_range = { since: dateRange.since, until: dateRange.until };
            }

            const insights = await campaign.getInsights(
                params.fields,
                { time_range: params.time_range }
            );

            if (!insights || insights.length === 0) return emptyInsights;

            const data = insights[0];
            const conversions = (data.actions || []).find((a: { action_type: string }) =>
                a.action_type === 'purchase' || a.action_type === 'lead'
            );

            return {
                impressions: Number(data.impressions) || 0,
                clicks: Number(data.clicks) || 0,
                spend: Number(data.spend) || 0,
                ctr: Number(data.ctr) || 0,
                cpc: Number(data.cpc) || 0,
                cpm: Number(data.cpm) || 0,
                conversions: conversions ? Number(conversions.value) : 0,
                reach: Number(data.reach) || 0,
                frequency: Number(data.frequency) || 0,
            };
        } catch (error) {
            console.error('[MetaAds] Error getting insights:', error);
            return emptyInsights;
        }
    }

    /**
     * Pause a campaign
     */
    async pauseCampaign(campaignId: string): Promise<boolean> {
        if (!await this.initialize()) {
            return false;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { Campaign } = require('facebook-nodejs-business-sdk');
            const campaign = new Campaign(campaignId);

            await campaign.update({
                status: 'PAUSED',
            });
            return true;
        } catch (error) {
            console.error('[MetaAds] Error pausing campaign:', error);
            return false;
        }
    }

    /**
     * Activate a campaign
     */
    async activateCampaign(campaignId: string): Promise<boolean> {
        if (!await this.initialize()) {
            return false;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { Campaign } = require('facebook-nodejs-business-sdk');
            const campaign = new Campaign(campaignId);

            await campaign.update({
                status: 'ACTIVE',
            });
            return true;
        } catch (error) {
            console.error('[MetaAds] Error activating campaign:', error);
            return false;
        }
    }

    /**
     * Update campaign budget
     */
    async updateBudget(campaignId: string, dailyBudget: number): Promise<boolean> {
        if (!await this.initialize()) {
            return false;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { Campaign } = require('facebook-nodejs-business-sdk');
            const campaign = new Campaign(campaignId);

            await campaign.update({
                daily_budget: Math.round(dailyBudget * 100), // Convert to cents
            });
            return true;
        } catch (error) {
            console.error('[MetaAds] Error updating budget:', error);
            return false;
        }
    }

    /**
     * Get account summary
     */
    async getAccountSummary(): Promise<{ totalCampaigns: number; activeCampaigns: number; totalSpend: number }> {
        const emptyResult = { totalCampaigns: 0, activeCampaigns: 0, totalSpend: 0 };

        if (!await this.initialize()) {
            return emptyResult;
        }

        try {
            const campaigns = await this.listCampaigns();
            const totalCampaigns = campaigns.length;
            const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;

            // Get account insights for spend
            const insights = await this.adAccount.getInsights(
                ['spend'],
                { time_range: { since: getDateDaysAgo(30), until: getToday() } }
            );

            const totalSpend = insights && insights.length > 0 ? Number(insights[0].spend) : 0;

            return { totalCampaigns, activeCampaigns, totalSpend };
        } catch (error) {
            console.error('[MetaAds] Error getting account summary:', error);
            return emptyResult;
        }
    }

    /**
     * List ad sets for a campaign
     */
    async listAdSets(campaignId: string): Promise<MetaAdSet[]> {
        if (!await this.initialize()) {
            return [];
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { Campaign } = require('facebook-nodejs-business-sdk');
            const campaign = new Campaign(campaignId);

            const adsets = await campaign.getAdSets(
                ['id', 'name', 'campaign_id', 'status', 'daily_budget', 'targeting'],
                { limit: 100 }
            );

            return adsets.map((a: Record<string, unknown>) => ({
                id: String(a.id),
                name: String(a.name),
                campaignId: String(a.campaign_id),
                status: String(a.status),
                dailyBudget: a.daily_budget ? Number(a.daily_budget) / 100 : undefined,
                targeting: a.targeting as Record<string, unknown>,
            }));
        } catch (error) {
            console.error('[MetaAds] Error listing ad sets:', error);
            return [];
        }
    }
}

// Helper functions
function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

function getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}

// Singleton instance
let metaAdsInstance: MetaAdsService | null = null;

export function getMetaAdsService(): MetaAdsService {
    if (!metaAdsInstance) {
        metaAdsInstance = new MetaAdsService();
    }
    return metaAdsInstance;
}

export default MetaAdsService;
