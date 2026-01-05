/**
 * Google Ads Integration Service
 * Uses google-ads-api npm package with GCP OAuth2 credentials
 * 
 * SETUP REQUIRED:
 * 1. Enable Google Ads API in GCP Console
 * 2. Create OAuth2 credentials (Client ID, Client Secret)
 * 3. Get Developer Token from Google Ads Manager Account (Tools > API Center)
 * 4. Install package: npm install google-ads-api
 * 5. Set environment variables:
 *    - GOOGLE_ADS_CLIENT_ID
 *    - GOOGLE_ADS_CLIENT_SECRET
 *    - GOOGLE_ADS_DEVELOPER_TOKEN
 *    - GOOGLE_ADS_REFRESH_TOKEN (obtained via OAuth2 flow)
 *    - GOOGLE_ADS_CUSTOMER_ID
 */

interface GoogleAdsConfig {
    client_id: string;
    client_secret: string;
    developer_token: string;
    refresh_token: string;
    customer_id?: string;
}

interface GoogleAdsCampaign {
    id: string;
    name: string;
    status: 'ENABLED' | 'PAUSED' | 'REMOVED';
    budget: number;
    budgetType: string;
    advertisingChannel: string;
    startDate?: string;
    endDate?: string;
}

interface GoogleAdsMetrics {
    impressions: number;
    clicks: number;
    conversions: number;
    cost: number;
    ctr: number;
    cpc: number;
    conversionRate: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GoogleAdsClient = any;

export class GoogleAdsService {
    private config: GoogleAdsConfig;
    private client: GoogleAdsClient | null = null;
    private initialized = false;

    constructor() {
        this.config = {
            client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
            client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
            developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
            refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN || '',
            customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID || '',
        };
    }

    /**
     * Check if Google Ads is configured
     */
    isConfigured(): boolean {
        return !!(
            this.config.client_id &&
            this.config.client_secret &&
            this.config.developer_token &&
            this.config.refresh_token
        );
    }

    /**
     * Initialize the Google Ads client
     * Requires google-ads-api package to be installed: npm install google-ads-api
     */
    async initialize(): Promise<boolean> {
        if (this.initialized) return !!this.client;

        if (!this.isConfigured()) {
            console.warn('[GoogleAds] Not configured. Set environment variables.');
            return false;
        }

        try {
            // Dynamic require - will fail at runtime if package not installed
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { GoogleAdsApi } = require('google-ads-api');

            const googleAdsClient = new GoogleAdsApi({
                client_id: this.config.client_id,
                client_secret: this.config.client_secret,
                developer_token: this.config.developer_token,
            });

            this.client = googleAdsClient.Customer({
                customer_id: this.config.customer_id || '',
                refresh_token: this.config.refresh_token,
            });

            this.initialized = true;
            return true;
        } catch (error) {
            console.error('[GoogleAds] Failed to initialize. Install: npm install google-ads-api');
            console.error(error);
            return false;
        }
    }

    /**
     * List all campaigns
     */
    async listCampaigns(): Promise<GoogleAdsCampaign[]> {
        if (!this.client && !(await this.initialize())) {
            return [];
        }

        try {
            const campaigns = await this.client.query(`
                SELECT
                    campaign.id,
                    campaign.name,
                    campaign.status,
                    campaign.advertising_channel_type,
                    campaign.start_date,
                    campaign.end_date,
                    campaign_budget.amount_micros,
                    campaign_budget.type
                FROM campaign
                WHERE campaign.status != 'REMOVED'
                ORDER BY campaign.name
            `);

            return campaigns.map((row: { campaign: Record<string, unknown>; campaign_budget: Record<string, unknown> }) => ({
                id: String(row.campaign.id),
                name: String(row.campaign.name),
                status: row.campaign.status as 'ENABLED' | 'PAUSED' | 'REMOVED',
                budget: Number(row.campaign_budget.amount_micros) / 1_000_000,
                budgetType: String(row.campaign_budget.type),
                advertisingChannel: String(row.campaign.advertising_channel_type),
                startDate: row.campaign.start_date ? String(row.campaign.start_date) : undefined,
                endDate: row.campaign.end_date ? String(row.campaign.end_date) : undefined,
            }));
        } catch (error) {
            console.error('[GoogleAds] Error listing campaigns:', error);
            return [];
        }
    }

    /**
     * Get campaign performance metrics
     */
    async getCampaignMetrics(campaignId: string, dateRange: { start: string; end: string }): Promise<GoogleAdsMetrics> {
        const emptyMetrics: GoogleAdsMetrics = {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            cost: 0,
            ctr: 0,
            cpc: 0,
            conversionRate: 0,
        };

        if (!this.client && !(await this.initialize())) {
            return emptyMetrics;
        }

        try {
            const result = await this.client.query(`
                SELECT
                    metrics.impressions,
                    metrics.clicks,
                    metrics.conversions,
                    metrics.cost_micros,
                    metrics.ctr,
                    metrics.average_cpc
                FROM campaign
                WHERE campaign.id = ${campaignId}
                    AND segments.date BETWEEN '${dateRange.start}' AND '${dateRange.end}'
            `);

            if (result.length === 0) return emptyMetrics;

            const metrics = result[0].metrics;
            return {
                impressions: Number(metrics.impressions) || 0,
                clicks: Number(metrics.clicks) || 0,
                conversions: Number(metrics.conversions) || 0,
                cost: Number(metrics.cost_micros) / 1_000_000 || 0,
                ctr: Number(metrics.ctr) || 0,
                cpc: Number(metrics.average_cpc) / 1_000_000 || 0,
                conversionRate: Number(metrics.clicks) > 0
                    ? (Number(metrics.conversions) / Number(metrics.clicks)) * 100
                    : 0,
            };
        } catch (error) {
            console.error('[GoogleAds] Error getting metrics:', error);
            return emptyMetrics;
        }
    }

    /**
     * Pause a campaign
     */
    async pauseCampaign(campaignId: string): Promise<boolean> {
        if (!this.client && !(await this.initialize())) {
            return false;
        }

        try {
            await this.client.campaigns.update({
                resource_name: `customers/${this.config.customer_id}/campaigns/${campaignId}`,
                status: 'PAUSED',
            });
            return true;
        } catch (error) {
            console.error('[GoogleAds] Error pausing campaign:', error);
            return false;
        }
    }

    /**
     * Enable a campaign
     */
    async enableCampaign(campaignId: string): Promise<boolean> {
        if (!this.client && !(await this.initialize())) {
            return false;
        }

        try {
            await this.client.campaigns.update({
                resource_name: `customers/${this.config.customer_id}/campaigns/${campaignId}`,
                status: 'ENABLED',
            });
            return true;
        } catch (error) {
            console.error('[GoogleAds] Error enabling campaign:', error);
            return false;
        }
    }

    /**
     * Update campaign budget
     */
    async updateBudget(campaignId: string, newBudgetAmount: number): Promise<boolean> {
        if (!this.client && !(await this.initialize())) {
            return false;
        }

        try {
            await this.client.campaignBudgets.update({
                resource_name: `customers/${this.config.customer_id}/campaignBudgets/${campaignId}`,
                amount_micros: newBudgetAmount * 1_000_000,
            });
            return true;
        } catch (error) {
            console.error('[GoogleAds] Error updating budget:', error);
            return false;
        }
    }

    /**
     * Get account summary
     */
    async getAccountSummary(): Promise<{ totalCampaigns: number; activeCampaigns: number; totalSpend: number }> {
        const emptyResult = { totalCampaigns: 0, activeCampaigns: 0, totalSpend: 0 };

        if (!this.client && !(await this.initialize())) {
            return emptyResult;
        }

        try {
            const result = await this.client.query(`
                SELECT
                    campaign.id,
                    campaign.status,
                    metrics.cost_micros
                FROM campaign
                WHERE campaign.status != 'REMOVED'
            `);

            const totalCampaigns = result.length;
            const activeCampaigns = result.filter((r: { campaign: { status: string } }) => r.campaign.status === 'ENABLED').length;
            const totalSpend = result.reduce((sum: number, r: { metrics: { cost_micros: unknown } }) =>
                sum + (Number(r.metrics.cost_micros) / 1_000_000 || 0), 0);

            return { totalCampaigns, activeCampaigns, totalSpend };
        } catch (error) {
            console.error('[GoogleAds] Error getting account summary:', error);
            return emptyResult;
        }
    }
}

// Singleton instance
let googleAdsInstance: GoogleAdsService | null = null;

export function getGoogleAdsService(): GoogleAdsService {
    if (!googleAdsInstance) {
        googleAdsInstance = new GoogleAdsService();
    }
    return googleAdsInstance;
}

export default GoogleAdsService;
